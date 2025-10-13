# Playwright E2E Testing 구축

## 작업 개요
- **목적**: TodoList 앱에 E2E 테스팅 환경 구축 (`make dev` + GitHub Actions)

## 최종 구조
```
frontend/
├── playwright.config.ts        # 최소 설정 (36줄)
├── package.json               # test:e2e, test:e2e:ui
└── e2e/
    └── tests/
        ├── health-check.spec.ts
        ├── task-crud.spec.ts
        └── ui-interactions.spec.ts
```

## 구현 세부사항

### 컴포넌트 수정
```tsx
// TaskList.tsx - data-testid 추가
<div className={styles.list} data-testid="task-list">

// TaskItem.tsx - data-testid 추가
<div className={styles.item} data-testid="task-item">

// index.html - 타이틀 수정
<title>Task List</title>
```

### Radix UI Checkbox 처리
```typescript
// ❌ 일반 checkbox 방식 (작동 안함)
const checkbox = taskItem.getByRole('checkbox');
await expect(checkbox).toBeChecked();

// ✅ Radix UI 방식
const checkbox = taskItem.locator('button[role="checkbox"]');
await expect(checkbox).toHaveAttribute('data-state', 'checked');
```

### 한글 텍스트 매칭
```typescript
// 실제 앱의 텍스트와 정확히 일치
await page.getByPlaceholder('작업을 입력하세요').fill(taskText);
await page.getByRole('button', { name: '추가' }).click();
await page.getByRole('button', { name: '삭제' }).click();
```

## GitHub Actions 설정
```yaml
# .github/workflows/e2e-tests.yml 핵심 부분
- name: Start backend
  run: go run cmd/task-service/main.go & sleep 5

- name: Run E2E tests
  run: yarn test:e2e
  env:
    CI: true
```

## 사용법
```bash
# 로컬 테스트
make dev          # 터미널 1
make test-e2e     # 터미널 2

# 디버깅
yarn test:e2e:ui  # UI 모드
```

## 참고
- [Playwright 문서](https://playwright.dev)
- [Radix UI Checkbox](https://www.radix-ui.com/primitives/docs/components/checkbox) - data-state 속성 사용