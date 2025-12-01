# 프론트엔드 개발 가이드라인

## 🎯 기술 스택

### Frontend
- **프레임워크**: React 18+ (함수형 컴포넌트 + Hooks)
- **언어**: TypeScript 5.0+ (strict 모드)
- **상태 관리**: 
  - 로컬 상태: useState, useReducer
  - 클라이언트 전역 상태: Zustand (UI 상태) 또는 Context API (복잡한 상태)
  - 서버 상태: React Query (TanStack Query) - 주요 상태 관리 방식
- **라우팅**: React Router v6
- **스타일링**: 
  - Vanilla Extract (타입 안전한 CSS-in-JS)
  - Radix UI (접근성이 보장된 UI 컴포넌트)
- **HTTP 클라이언트**: ky (모던 fetch wrapper)
- **빌드 도구**: Vite (빠른 개발 환경)
- **패키지 매니저**: Yarn (안정적이고 빠른 의존성 관리)

### iOS 앱 래핑
- **프레임워크**: Capacitor 7.4.2
- **개발 환경**:
  - Xcode 15.0+
  - CocoaPods
  - Ruby 3.4.5+
- **지원 버전**: iOS 14.0 이상
- **빌드 도구**: Xcode Build System

### 개발 도구
- **코드 포맷터/린터**: Biome (빠르고 일관된 코드 스타일)
- **타입 체크**: TypeScript strict 모드
- **테스팅**: Vitest + React Testing Library + MSW
- **상태 관리 도구**: React Query DevTools, Zustand DevTools

---

## 📁 폴더 구조

```
src/
├── app/             # 앱 초기화, 프로바이더, 라우팅
│   ├── styles/      # 전역 스타일
│   ├── providers/   # 앱 프로바이더
│   └── index.ts     # 앱 진입점
├── pages/           # 페이지 컴포넌트
│   ├── home/        # 홈 페이지
│   │   ├── ui/      # 페이지 UI 컴포넌트
│   │   └── index.ts # 페이지 진입점
│   └── index.ts     # 페이지 모음
├── widgets/         # 독립적인 큰 블록
│   ├── task/        # Task 위젯
│   │   ├── ui/      # 위젯 UI 컴포넌트
│   │   ├── lib/     # 위젯 로직
│   │   └── index.ts # 위젯 진입점
│   └── index.ts     # 위젯 모음
├── features/        # 기능 단위 모듈
│   ├── task-list/   # Task 리스트 기능
│   │   ├── hooks/   # React Query 훅 (서버 상태)
│   │   ├── ui/      # 기능 UI 컴포넌트
│   │   ├── model/   # 기능 상태 관리 (클라이언트 상태)
│   │   ├── lib/     # 기능 로직
│   │   └── index.ts # 기능 진입점
│   └── index.ts     # 기능 모음
├── entities/        # 비즈니스 엔티티
│   ├── task/        # Task 엔티티
│   │   ├── ui/      # 엔티티 UI 컴포넌트
│   │   ├── model/   # 엔티티 모델
│   │   ├── lib/     # 엔티티 로직
│   │   └── index.ts # 엔티티 진입점
│   └── index.ts     # 엔티티 모음
└── shared/          # 공유 리소스
    ├── ui/          # UI 키트
    ├── api/         # API 클라이언트 (HTTP 함수)
    ├── lib/         # 유틸리티
    ├── config/      # 설정
    └── index.ts     # 공유 리소스 진입점

ios/                # iOS 프로젝트 디렉토리
├── App/           # Xcode 프로젝트
│   ├── App/      # 앱 소스
│   ├── Podfile   # CocoaPods 의존성
│   └── App.xcworkspace  # Xcode 워크스페이스
└── .gitignore    # iOS 관련 gitignore
```

---

## 🏗️ 레이어별 책임

### 1. app/ - 앱 초기화
- 전역 프로바이더 (QueryProvider, 기타 Context)
- 라우팅 설정
- 전역 스타일
- 앱 설정

### 2. pages/ - 페이지 컴포넌트
- 라우트에 매핑되는 페이지
- 위젯과 피처를 조합하여 페이지 구성
- 페이지별 레이아웃

### 3. widgets/ - 독립적인 큰 블록
- 재사용 가능한 큰 UI 블록
- 여러 페이지에서 공통으로 사용되는 컴포넌트
- 독립적인 기능을 가진 UI 모듈

### 4. features/ - 기능 단위 모듈
- 비즈니스 로직
- 서버 상태 관리 (React Query 훅 - `hooks/` 폴더)
- 클라이언트 상태 관리 (Zustand, Context - `model/` 폴더)
- 특정 기능에 관련된 모든 컴포넌트와 로직

### 5. entities/ - 비즈니스 엔티티
- 도메인 모델
- 엔티티 관련 로직
- 비즈니스 규칙

### 6. shared/ - 공유 리소스
- UI 키트
- API 클라이언트 (HTTP 함수, ky 기반)
- 유틸리티 함수
- 설정 파일

---

## 🎨 코딩 표준

### React 컴포넌트 작성 규칙
- **함수형 컴포넌트**: Hooks 기반
- **타입 안전성**: strict 모드 사용
- **명명 규칙**: camelCase (변수, 함수), PascalCase (컴포넌트)

### 컴포넌트 작성 가이드라인
```typescript
// ✅ 좋은 예시
interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle }) => {
  return (
    <div className={styles.container}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />
      <span className={styles.text}>{task.text}</span>
    </div>
  );
};
```

### 상태 관리 패턴
- **로컬 상태**: useState, useReducer (컴포넌트 내부 상태)
- **클라이언트 전역 상태**: Zustand (UI 상태, 설정 등)
- **서버 상태**: React Query (API 데이터, 캐싱, 동기화)

### React Query 사용 예시
```typescript
// features/task-list/hooks/useTasks.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../../../shared/api';

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: taskApi.getAll,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: taskApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
```

### API 클라이언트 구조
```typescript
// shared/api/taskApi.ts
import ky from 'ky';

const api = ky.create({
  prefixUrl: 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

export const taskApi = {
  getAll: () => api.get('tasks').json<ApiResponse<Task[]>>(),
  create: (input: CreateTaskInput) => 
    api.post('tasks', { json: input }).json<ApiResponse<Task>>(),
  // ...
};
```

### 스타일링 가이드라인
```typescript
// ✅ Vanilla Extract 사용법
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
});
```

---

## 🔧 개발 도구

### 기본 명령어
```bash
# 개발 서버 시작
yarn dev

# iOS 빌드 (자동 라이브 리로드)
yarn ios:dev

# 타입 체크
yarn build  # tsc -b 포함

# 코드 포맷팅
yarn format

# 린트 체크
yarn lint

# 린트 체크 및 자동 수정
yarn check

# 빌드
yarn build

# E2E 테스트
yarn test:e2e      # Playwright E2E 테스트 실행
yarn test:e2e:ui   # UI 모드로 디버깅
```

### 백엔드 연동 개발
```bash
# 1. 백엔드 서버 실행 (별도 터미널)
cd ../backend
go run cmd/task-service/main.go

# 2. 프론트엔드 개발 서버 실행
yarn dev

# API 테스트 (백엔드 서버 실행 상태에서)
curl http://localhost:8080/health
curl http://localhost:8080/api/v1/tasks
```

### iOS 개발 명령어
```bash
# Capacitor 동기화
npx cap sync ios

# Xcode에서 프로젝트 열기
npx cap open ios

# iOS 시뮬레이터에서 실행
npx cap run ios
```

---

## 🐛 자주 발생하는 문제

### iOS 빌드 실패
**문제**: Xcode에서 빌드 실패
**해결**:
```bash
# 1. 의존성 정리
cd ios/App
pod deintegrate
pod install

# 2. Capacitor 동기화
cd ../..
npx cap sync ios

# 3. Xcode에서 프로젝트 열기
npx cap open ios
```

### TypeScript 타입 에러
**문제**: strict 모드에서 타입 에러
**해결**:
- 명시적 타입 정의 추가
- 타입 가드 사용
- any 타입 사용 금지

### 스타일링 문제
**문제**: Vanilla Extract 스타일 적용 안됨
**해결**:
```typescript
// ✅ 올바른 사용법
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
});
```

### React Query 문제
**문제**: API 호출이 작동하지 않거나 캐시가 업데이트되지 않음
**해결**:
```typescript
// ✅ QueryProvider 설정 확인
// app/App.tsx
import { QueryProvider } from './providers/QueryProvider';

export const App = () => (
  <QueryProvider>
    <main>{/* 컴포넌트 */}</main>
  </QueryProvider>
);

// ✅ Mutation 후 캐시 무효화
const createMutation = useMutation({
  mutationFn: taskApi.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  },
});
```

### CORS 에러 문제
**문제**: 백엔드 API 호출 시 CORS 에러
**해결**:
1. 백엔드 서버 실행 상태 확인: `http://localhost:8080/health`
2. 프론트엔드 포트가 백엔드 CORS 설정에 포함되어 있는지 확인
3. API URL 확인: `shared/api/taskApi.ts`의 `prefixUrl` 설정

### 상태 관리 문제
**문제**: Zustand 스토어 업데이트 안됨 (클라이언트 상태용)
**해결**:
```typescript
// ✅ 올바른 사용법 (UI 상태 관리용)
import { create } from 'zustand';

interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ 
    sidebarOpen: !state.sidebarOpen 
  })),
}));
```

---

## 📱 iOS 개발 특화 가이드라인

### Capacitor 설정
- **최신 버전 사용**: Capacitor 7.4.2
- **iOS 지원**: iOS 14.0 이상
- **네이티브 기능**: Camera, Geolocation, Push Notifications 등

### iOS 빌드 프로세스
1. **웹앱 빌드**: `yarn build`
2. **Capacitor 동기화**: `npx cap sync ios`
3. **Xcode에서 열기**: `npx cap open ios`
4. **시뮬레이터 실행**: Xcode에서 시뮬레이터 선택 후 실행

### iOS 특화 개발 팁
- **Safe Area**: iOS 노치와 홈 인디케이터 고려
- **터치 인터랙션**: iOS 터치 패턴 최적화
- **성능**: iOS 디바이스 성능 고려한 최적화
- **접근성**: iOS VoiceOver 지원

---

## 🧪 테스팅 가이드라인

### 테스트 도구
- **Vitest**: 빠른 테스트 러너
- **React Testing Library**: 컴포넌트 테스팅
- **MSW**: API 모킹
- **Playwright**: E2E 테스팅 (전체 앱 통합 테스트)

### 테스트 작성 예시

**단위 테스트 (Vitest)**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskItem } from './TaskItem';

describe('TaskItem', () => {
  it('should toggle task when checkbox is clicked', () => {
    const mockToggle = jest.fn();
    const task = { id: '1', text: 'Test task', completed: false };

    render(<TaskItem task={task} onToggle={mockToggle} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockToggle).toHaveBeenCalledWith('1');
  });
});
```

**E2E 테스트 (Playwright)**
```typescript
import { test, expect } from '@playwright/test';

test('should create and complete a task', async ({ page }) => {
  await page.goto('/');

  // 작업 추가
  await page.getByPlaceholder('작업을 입력하세요').fill('새 작업');
  await page.getByRole('button', { name: '추가' }).click();

  // 작업 완료 토글
  const checkbox = page.getByText('새 작업').locator('..').locator('button[role="checkbox"]');
  await checkbox.click();
  await expect(checkbox).toHaveAttribute('data-state', 'checked');
});
```

### E2E 테스트 실행
```bash
# 로컬 개발 환경 (vite dev - 포트 5173, 기본값)
make dev          # 터미널 1
make test-e2e     # 터미널 2

# Production 빌드 환경 (vite preview - 포트 4173)
make build && make preview           # 터미널 1
make test-e2e PHASE=release          # 터미널 2
```

**주요 특징:**
- Playwright는 테스트만 담당 (webServer 설정 없음)
- `make test-e2e`가 포트 체크로 서비스 준비 상태 자동 확인
- 10초 타임아웃으로 빠른 피드백
- PHASE 변수로 로컬(5173, 기본값)/프로덕션(4173) 포트 구분
- 상세 가이드: `frontend/e2e/CLAUDE.md` 참조

---

## 📚 참고 문서
- [React 공식 문서](https://react.dev/)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [React Query 문서](https://tanstack.com/query/latest) - 서버 상태 관리
- [ky HTTP 클라이언트](https://github.com/sindresorhus/ky) - 모던 fetch wrapper
- [Capacitor 문서](https://capacitorjs.com/docs)
- [Vanilla Extract 문서](https://vanilla-extract.style/)
- [Zustand 문서](https://zustand-demo.pmnd.rs/) - 클라이언트 상태 관리
- [Radix UI 문서](https://www.radix-ui.com/docs) - 접근성 보장 컴포넌트 