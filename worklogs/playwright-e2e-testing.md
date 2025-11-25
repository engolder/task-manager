# Playwright E2E Testing 구축

## 작업 개요
TodoList 앱에 E2E 테스팅 환경 구축 및 실행 흐름 개선

## 핵심 결정사항

### 1. Playwright webServer 제거
**이유**:
- Playwright가 프론트엔드만 자동 시작하고 백엔드는 수동으로 관리해야 하는 불일치
- 로컬과 CI 환경에서 동작 방식이 달라 혼란
- Playwright는 테스트만 담당하고, 서버 시작은 외부에서 명시적으로 관리

**결과**: `playwright.config.ts`에서 `webServer` 설정 완전 제거

### 2. 서비스 대기 로직을 별도 스크립트로 분리
**이유**:
- Makefile에 직접 작성하면 너무 복잡함
- sh 스크립트로 분리하면 재사용 가능하고 독립적으로 테스트 가능

**구현**: `scripts/wait-for-services.sh` 생성
- lsof로 포트 8080과 프론트엔드 포트 체크
- 10초 타임아웃 (즉시 실패하지 않고 재시도)
- 타임아웃 시 명확한 에러 메시지

**타임아웃 10초 선택 이유**: 로컬 환경에서 충분하면서도 너무 길지 않아 빠른 피드백 가능

### 3. STAGE 변수로 로컬/프로덕션 포트 분리
**이유**:
- 로컬 개발: vite dev (포트 5173)
- 프로덕션 빌드: vite preview (포트 4173)
- 포트가 다르니 스크립트가 달라지는 부분이 불편
- 사용자가 더 자주 쓰는 로컬 환경을 기본값으로

**구현**:
```bash
# Makefile
STAGE ?= local  # 기본값은 local (포트 5173)

# wait-for-services.sh
STAGE=${STAGE:-local}
if [ "$STAGE" = "local" ]; then
  FRONTEND_PORT=5173
else
  FRONTEND_PORT=4173
fi
```

**기본값 local 선택 이유**: 로컬에서 직접 칠 일이 많아서 편의성 우선

**Playwright baseURL도 STAGE에 맞춤**:
- `playwright.config.ts`에서 하드코딩된 baseURL 제거
- Makefile의 `test-e2e`에서 STAGE에 따라 `PLAYWRIGHT_BASE_URL` 환경변수 설정

```makefile
test-e2e:
	@STAGE=$(STAGE) ./scripts/wait-for-services.sh
	@if [ "$(STAGE)" = "local" ]; then \
		cd frontend && PLAYWRIGHT_BASE_URL=http://localhost:5173 yarn test:e2e; \
	else \
		cd frontend && PLAYWRIGHT_BASE_URL=http://localhost:4173 yarn test:e2e; \
	fi
```

**참고**: 환경변수는 `cd frontend &&` 뒤에 위치해야 yarn에 전달됨

**기본값 없앤 이유**: 환경변수로 항상 명시적으로 설정하면 되므로 불필요

**백엔드 CORS 포트**:
- Preview 모드 지원을 위해 `4173`, `4174` 포트도 허용 (기존: `5173`, `5174`만 허용)
- Vite preview는 포트가 사용 중이면 자동으로 다음 포트 사용

### 4. CI는 build + run 방식으로 변경
**이유**:
- `go run`은 매번 의존성 다운로드 (캐싱 안 됨)
- `go build`로 바이너리 생성하면 더 빠르고 안정적
- CI에서는 프로덕션 빌드 검증이 목적이므로 적합

**변경사항**:
```yaml
# 변경 전: go run으로 실행
- name: Start backend
  run: go run cmd/task-service/main.go &

# 변경 후: 빌드 후 바이너리 실행
- name: Build backend
  run: make build-backend

- name: Build frontend
  run: cd frontend && yarn install --frozen-lockfile && yarn build

- name: Run application and E2E tests
  run: |
    make preview &
    make test-e2e STAGE=production
```

### 5. 로그 라벨링으로 출력 구분
**이유**:
- `make dev`로 백엔드/프론트엔드 동시 실행 시 로그가 섞임
- 어느 서비스의 로그인지 구분 필요

**구현**: `sed -u`로 unbuffered 라벨 추가
```makefile
dev:
	@$(MAKE) dev-backend 2>&1 | sed -u 's/^/backend: /' &
	@$(MAKE) dev-frontend 2>&1 | sed -u 's/^/frontend: /' &
	@wait
```

**sed -u 사용 이유**: 기본 sed는 버퍼링으로 로그가 지연됨. `-u`로 즉시 출력

### 6. SQLite 디렉토리 자동 생성
**이유**:
- CI에서 Git 체크아웃 시 `.gitignore`된 `backend/data/` 디렉토리가 생성되지 않음
- SQLite는 부모 디렉토리가 없으면 DB 파일을 생성할 수 없음
- 에러: `Failed to initialize database: unable to open database file: no such file or directory`

**문제 재현**:
```bash
rm -rf backend/data/
make dev-backend
# 에러 발생 확인
```

**해결 방법**:
- `os.MkdirAll()`로 DB 디렉토리를 자동 생성
- in-memory DB는 제외
- Go 커뮤니티 표준 패턴 (Ben Johnson의 WTF 프로젝트 등)

**구현**:
```go
if dbPath != ":memory:" {
    if err := os.MkdirAll(filepath.Dir(dbPath), 0755); err != nil {
        return nil, fmt.Errorf("failed to create database directory: %w", err)
    }
}
```

**왜 이 방법이 표준인가**:
- GORM/SQLite 드라이버에 자동 생성 기능 없음
- Go 설계 철학: 보안상 이유로 `sql.Open()`이 자동으로 디렉토리를 생성하지 않음
- 각 애플리케이션이 권한 모델에 맞게 직접 관리

## 최종 구조
```
scripts/wait-for-services.sh  # STAGE 기반 포트 체크 (10초 타임아웃)
Makefile                       # STAGE 변수 + test-e2e 타겟
backend/Makefile              # build/run 타겟 추가
playwright.config.ts           # webServer 제거
.github/workflows/e2e-tests.yml  # build → run → test (STAGE=production)
```

## 사용법
```bash
# 로컬 개발 (기본값)
make dev          # 터미널 1
make test-e2e     # 터미널 2 (자동으로 5173 체크)

# 프로덕션 빌드 테스트
make build && make preview           # 터미널 1
make test-e2e STAGE=production       # 터미널 2 (4173 체크)

# CI
# make build → make preview → make test-e2e STAGE=production
```

## 테스트 작성 팁

### Radix UI Checkbox
```typescript
// ✅ Radix UI는 data-state 속성 사용
const checkbox = taskItem.locator('button[role="checkbox"]');
await expect(checkbox).toHaveAttribute('data-state', 'checked');
```

### 한글 텍스트 매칭
실제 앱의 placeholder와 버튼 텍스트를 정확히 일치시켜야 함
```typescript
await page.getByPlaceholder('작업을 입력하세요').fill(taskText);
await page.getByRole('button', { name: '추가' }).click();
```

## 참고
- [Playwright 문서](https://playwright.dev)
- [Radix UI Checkbox](https://www.radix-ui.com/primitives/docs/components/checkbox)
