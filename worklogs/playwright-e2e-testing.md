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
- lsof로 포트 8080, 5173 체크
- 5초 타임아웃 (즉시 실패하지 않고 재시도)
- 타임아웃 시 명확한 에러 메시지

**타임아웃 5초 선택 이유**: 로컬 환경에서 충분하면서도 너무 길지 않아 빠른 피드백 가능

### 3. CI에서도 make dev 사용
**이유**:
- 백엔드/프론트엔드를 구분해서 시작할 필요 없음
- 로컬과 CI의 실행 방식을 완전히 동일하게 유지
- wait 로직은 `make test-e2e`에 위임

**변경사항**:
```yaml
# 변경 전: 백엔드만 수동 시작 + sleep 5
- name: Start backend
  run: go run cmd/task-service/main.go & sleep 5

# 변경 후: make dev로 통합
- name: Start application
  run: make dev &

- name: Run E2E tests
  run: make test-e2e
```

### 4. make test-e2e가 서비스 대기
**이유**:
- CI에서 별도로 wait 루프를 돌 필요 없음
- `make test-e2e`가 알아서 체크하고 타임아웃 내면 됨
- 로컬/CI 모두 동일한 방식으로 동작

## 최종 구조
```
scripts/wait-for-services.sh  # 5초간 포트 체크 + 재시도
Makefile                       # test-e2e 타겟에서 스크립트 호출
playwright.config.ts           # webServer 제거
.github/workflows/e2e-tests.yml  # make dev & + make test-e2e
```

## 검증 결과
- ✅ 서버 없이 실행 시 5초 후 명확한 에러 메시지
- ✅ 서버 실행 시 2초 내 감지 후 테스트 진행
- ✅ 15개 테스트 중 14개 통과 (1개는 테스트 자체 버그)

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

## 사용법
```bash
# 로컬
make dev          # 터미널 1
make test-e2e     # 터미널 2

# CI
# make dev & → make test-e2e (자동)
```

## 참고
- [Playwright 문서](https://playwright.dev)
- [Radix UI Checkbox](https://www.radix-ui.com/primitives/docs/components/checkbox)
