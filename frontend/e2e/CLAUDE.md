# E2E Testing with Playwright

간단하고 효과적인 E2E 테스트 설정입니다.

## 구조

```
e2e/
├── CLAUDE.md                    # 이 파일
└── tests/                       # 테스트 파일들
    ├── health-check.spec.ts     # 기본 동작 확인
    ├── task-crud.spec.ts        # CRUD 작업 테스트
    └── ui-interactions.spec.ts  # UI 동작 테스트
```

## 테스트 실행

### 사전 준비
```bash
# 앱 전체 실행 (백엔드 + 프론트엔드)
make dev
```

### 테스트 명령어
```bash
# 기본 테스트 실행
yarn test:e2e

# UI 모드로 디버깅
yarn test:e2e:ui

# 추가 옵션 (필요시 직접 실행)
npx playwright test --headed  # 브라우저 보면서 실행
npx playwright test --debug   # 디버그 모드
npx playwright show-report     # 리포트 보기
```

## 테스트 작성 가이드

### 기본 구조
```typescript
import { test, expect } from '@playwright/test';

test.describe('기능명', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('테스트 케이스', async ({ page }) => {
    // Playwright의 기본 API 직접 사용
    await page.getByPlaceholder('Add a new task...').fill('할 일');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('할 일')).toBeVisible();
  });
});
```

### 선택자 우선순위
1. **Role**: `getByRole('button', { name: 'Add' })`
2. **Text**: `getByText('할 일')`
3. **Placeholder**: `getByPlaceholder('Add a new task...')`
4. **TestId**: `getByTestId('task-list')` (최후의 수단)

### 작성 원칙
- 각 테스트는 독립적으로 실행 가능해야 함
- 명확한 테스트 이름 사용
- Playwright 기본 API 활용 (Page Object 패턴 불필요)
- `waitFor` 대신 Playwright의 자동 대기 활용

## CI/CD

GitHub Actions에서 자동 실행:
- `main` 브랜치 push/PR 시
- 단순한 설정으로 안정적 실행

## 디버깅

```bash
# 특정 테스트만 실행
npx playwright test --grep "should create a task"

# 트레이스 생성
npx playwright test --trace on

# 실패 시 자동으로 스크린샷과 트레이스 저장
# playwright-report/ 폴더 확인
```

## 자주 발생하는 문제

1. **서비스 미실행**: `make dev` 먼저 실행
2. **포트 충돌**: 5173(프론트), 8080(백엔드) 포트 확인
3. **브라우저 미설치**: `npx playwright install` 실행