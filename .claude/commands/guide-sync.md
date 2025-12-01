---
description: "Git 변경사항을 분석하여 README 또는 CLAUDE.md 파일을 자동으로 업데이트합니다"
---

## 동작 방식

1. **변경사항 분석**: `git diff`와 `git status`로 현재 변경된 파일들을 분석
2. **변경 수준 판별**: 프로젝트 개요 수준 vs 구현 세부사항 수준 분류
3. **영역 판별**: Frontend, Backend, E2E, 또는 공통 영역 분류
4. **적절한 문서 선택**: 변경 수준과 영역에 따라 README 또는 CLAUDE.md 결정
5. **문서 업데이트**: 중요한 변경사항을 해당 문서에 추가

## 변경사항 수준별 라우팅 규칙

### Level 1: 프로젝트 개요 수준 → README 업데이트

사용자가 프로젝트를 이해하거나 시작할 때 알아야 하는 변경사항

#### 루트 `README.md` 업데이트 대상
- **새로운 기술 스택/프레임워크 추가**
  - 예: Fx 프레임워크, gRPC, Redis, Kafka
- **아키텍처 패턴 변경**
  - 예: 모놀리스 → 마이크로서비스, RESTful → GraphQL
- **새로운 Make 명령어 추가/변경**
  - 예: `make deploy`, `make test-integration`
- **프로젝트 구조 대폭 변경**
  - 예: 새로운 디렉토리 추가 (`.github/workflows`, `docker/`)
- **새로운 서비스/모듈 추가**
  - 예: auth-service, payment-service, notification-service
- **CI/CD 도구 변경**
  - 예: GitHub Actions → GitLab CI, Jenkins

#### `frontend/README.md` 업데이트 대상
- **주요 라이브러리 추가/변경**
  - 예: React Query → SWR, Zustand → Redux
- **빌드 도구 변경**
  - 예: Vite → Webpack, Turbopack
- **새로운 플랫폼 지원**
  - 예: Android Capacitor 추가, Electron 추가
- **테스트 프레임워크 변경**
  - 예: Playwright → Cypress, Jest → Vitest
- **Frontend 개발 서버 명령어 변경**
  - 예: `yarn dev` 포트 변경, 새로운 환경 변수

#### `backend/README.md` 업데이트 대상
- **주요 프레임워크 변경**
  - 예: Gin → Echo, Fiber
- **데이터베이스 추가/변경**
  - 예: SQLite → PostgreSQL, MongoDB 추가
- **새로운 미들웨어/핵심 라이브러리**
  - 예: gRPC 서버, Redis 캐싱, Message Queue
- **API 버전 추가**
  - 예: `/api/v1/` → `/api/v2/` 추가
- **Backend 실행 방식 변경**
  - 예: 새로운 환경 변수, 실행 명령어 변경

### Level 2: 구현 세부사항 수준 → CLAUDE.md 업데이트

개발자가 코드를 작성할 때 참고해야 하는 패턴과 규칙

#### 루트 `CLAUDE.md` 업데이트 대상
- **API 통신 규약 세부사항**
  - 예: 요청/응답 헤더 규칙, 에러 코드 규칙
- **공통 개발 패턴/컨벤션**
  - 예: 네이밍 규칙, 파일 구조 규칙
- **워크로그 작성 가이드**
- **슬래시 명령어 사용법**
- **Git 워크플로우**

#### `frontend/CLAUDE.md` 업데이트 대상
- **React 컴포넌트 패턴**
  - 예: 새로운 Hook 패턴, 컴포넌트 구조
- **상태 관리 구현 패턴**
  - 예: React Query 사용 패턴, Zustand 스토어 구조
- **폴더 구조 세부 규칙**
  - 예: features 디렉토리 구조, 파일 명명 규칙
- **스타일링 패턴**
  - 예: Vanilla Extract 사용법, Radix UI 커스터마이징
- **코딩 스타일 가이드**

#### `backend/CLAUDE.md` 업데이트 대상
- **Clean Architecture 레이어 구현 패턴**
  - 예: 의존성 주입 패턴, 레이어 간 통신
- **에러 핸들링 패턴**
  - 예: 커스텀 에러 타입, 에러 전파
- **도메인 모델 설계 가이드**
  - 예: 엔티티 구조, 비즈니스 로직 위치
- **Repository 패턴 구현**
  - 예: GORM 사용 패턴, 트랜잭션 처리
- **테스트 작성 패턴**

#### `frontend/e2e/CLAUDE.md` 업데이트 대상
- **Playwright 테스트 작성 패턴**
- **E2E 테스트 구조 및 조직화**
- **테스트 헬퍼 함수 사용법**
- **Mock 데이터 관리**

## 변경사항 영역별 파일 매핑

### 파일 경로 기반 영역 판별

```
frontend/
├── src/, public/          → frontend 영역
├── ios/                   → frontend 영역 (iOS)
├── e2e/                   → e2e 영역
├── package.json           → frontend 영역
└── playwright.config.ts   → e2e 영역

backend/
├── cmd/, internal/, pkg/  → backend 영역
├── go.mod, go.sum        → backend 영역
└── *.go                  → backend 영역

루트 디렉토리
├── Makefile              → 루트 (프로젝트 개요)
├── .github/workflows/    → 루트 (CI/CD)
├── scripts/              → 루트 (빌드 스크립트)
└── .claude/              → 루트 (개발 도구)
```

## 우선순위 결정 로직

같은 변경사항이 README와 CLAUDE.md 둘 다 해당되는 경우:

1. **README 우선**: 프로젝트 개요에 영향을 주면 README 먼저 업데이트
2. **CLAUDE.md 추가**: 구현 세부사항이 있으면 CLAUDE.md에도 추가

**예시:**
- `package.json`에 React Query 추가
  - → `frontend/README.md`: "Tech Stack" 섹션에 React Query 추가
  - → `frontend/CLAUDE.md`: React Query 사용 패턴 추가

## 실행 과정

1. **Git 변경사항 스캔**
   - `git diff`, `git status`로 변경된 파일 수집

2. **변경 수준 판별**
   - 프로젝트 개요 수준인가? (README)
   - 구현 세부사항 수준인가? (CLAUDE.md)

3. **영역 판별**
   - Frontend, Backend, E2E, 또는 루트(공통)

4. **중요도 필터링**
   - 새로운 기술 스택, 아키텍처 패턴
   - 핵심 비즈니스 로직, API 변경
   - 개발 환경 설정 변경

5. **문서 업데이트**
   - 기존 섹션에 정보 추가 또는 새로운 섹션 생성
   - 더 이상 유효하지 않은 정보 제거
   - 예시 코드 업데이트 (CLAUDE.md)

## 업데이트 형식

### README 업데이트 형식
기존 섹션 구조 유지하며 정보 추가:

```markdown
## 🎯 Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
  - [NEW] State Management: React Query + Zustand
- **Backend**: Go 1.23+ + Gin + GORM
  - [NEW] Cache: Redis
```

### CLAUDE.md 업데이트 형식
변경사항은 해당 섹션에 통합하거나 새 섹션 추가:

```markdown
### React Query 사용 패턴

서버 상태 관리를 위해 React Query를 사용합니다.

**기본 사용법:**
\```typescript
// features/task-list/hooks/useTasks.ts
export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: taskApi.getAll,
  });
}
\```

**관련 파일:**
- `features/task-list/hooks/useTasks.ts`: Task 조회 훅
```

## 주의사항

- **선택적 업데이트**: 모든 변경사항을 기록하지 않고, 중요한 변경사항만 선별
- **적절한 수준 선택**: README는 간결하게, CLAUDE.md는 상세하게
- **기존 내용과의 일관성**: 기존 문서의 구조와 스타일 유지
- **중복 방지**: 이미 문서화된 내용은 업데이트하지 않음
- **실용성 우선**: 이론적 설명보다는 실제 사용 가능한 정보 우선
- **코드 참조**: 가능하면 실제 파일 경로와 라인 번호 포함

## 판별 예시

### 예시 1: 새로운 기술 스택 추가
**변경:** `go.mod`에 Redis 라이브러리 추가
- **수준:** 프로젝트 개요 (새로운 인프라)
- **영역:** Backend
- **업데이트:** `backend/README.md` - Tech Stack 섹션

### 예시 2: React Hook 패턴 변경
**변경:** `features/task-list/hooks/useTasks.ts` 구현 변경
- **수준:** 구현 세부사항
- **영역:** Frontend
- **업데이트:** `frontend/CLAUDE.md` - React Query 사용 패턴

### 예시 3: Make 명령어 추가
**변경:** `Makefile`에 `make deploy` 추가
- **수준:** 프로젝트 개요 (개발 명령어)
- **영역:** 루트 (공통)
- **업데이트:** 루트 `README.md` - Make Commands 섹션

### 예시 4: E2E 테스트 구조 변경
**변경:** `frontend/e2e/` 디렉토리 구조 재조직
- **수준:** 구현 세부사항
- **영역:** E2E
- **업데이트:** `frontend/e2e/CLAUDE.md` - 테스트 구조 섹션

### 예시 5: API 엔드포인트 추가
**변경:** `backend/internal/interfaces/router.go`에 새 엔드포인트
- **수준:** 구현 세부사항 (엔드포인트 목록은 코드 참조)
- **영역:** Backend
- **업데이트:** `backend/CLAUDE.md` - API 설계 패턴 (필요시)
- **비고:** README에는 적지 않음 (API는 코드가 정확한 참조)
