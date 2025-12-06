# iOS 하단 레이아웃 아키텍처

## 작업 개요
iOS에서 입력 필드와 하단 네비게이션을 올바르게 표시하기 위한 레이아웃 아키텍처 설계 및 개선

## 1단계: 초기 구현 (Fixed Positioning)

### Safe Area 및 입력창 하단 배치
**목적**: 입력창을 화면 하단으로 이동하여 모바일 UX 개선, iOS 홈 인디케이터(Safe Area) 침범 방지 및 키보드 대응

### 하단 배치 UX 선택
**이유**:
- 모바일에서는 하단 입력창이 엄지 접근성 우수
- 채팅 앱 패턴(Slack, Messenger 등)과 일관성
- 입력 중 리스트 전체 가시성 유지

**트레이드오프**: 데스크탑에서는 상단이 더 자연스러울 수 있지만, 모바일 우선 전략 채택

### CSS env() Safe Area 접근
**이유**:
- JavaScript로 Safe Area 감지하는 방법도 있지만 CSS가 더 선언적이고 성능 우수
- `env(safe-area-inset-bottom, 0px)` fallback으로 크로스플랫폼 호환
- iOS뿐만 아니라 Android도 지원 (API 28+)

**구현**:
```css
.form {
  position: fixed;
  bottom: env(safe-area-inset-bottom, 0px);
}
```

**viewport-fit=cover 필수**:
- `env()` 값이 동작하려면 viewport 메타 태그에 `viewport-fit=cover` 필요
- 없으면 Safe Area insets가 0으로 계산됨

### Capacitor Keyboard 플러그인 사용
**이유**:
- iOS에서 키보드가 올라오면 `position: fixed`가 키보드 높이를 고려하지 않음
- Safe Area insets는 하드웨어 기준이므로 키보드 상태와 무관
- `resize: 'body'`로 키보드 표시 시 body를 자동 리사이즈하여 입력창이 키보드 위로 올라감

**구현**:
```typescript
plugins: {
  Keyboard: {
    resize: 'body',           // 키보드 표시 시 body 리사이즈
    style: 'dark',            // 키보드 테마
    resizeOnFullScreen: true  // 전체 화면 모드에서도 리사이즈
  }
}
```

**resize: 'body' 선택 이유**:
- `resize: 'native'`는 iOS의 기본 동작이지만 WebView에서는 예측 불가능
- `resize: 'ionic'`은 Ionic 프레임워크 전용
- `resize: 'body'`가 Capacitor에서 가장 안정적

### 크로스플랫폼 호환성 전략
**이유**:
- iOS 전용 설정이 데스크탑/Android에 영향 주지 않도록 방어적 설계
- CSS fallback 값으로 Safe Area 미지원 환경에서 `0px` 사용

**구현**:
```css
padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 4.5rem);
```

**초기 구조**:
```css
.container {
  padding-top: env(safe-area-inset-top, 1rem);
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 4.5rem);
}

.form {
  position: fixed;
  bottom: env(safe-area-inset-bottom, 0px);
  z-index: 1000;
}
```

## 2단계: 하단 네비게이션 추가 후 문제 발생

### Fixed Positioning의 한계
**문제 상황**:
- 하단 네비게이션 추가 후 입력 필드가 iOS 시뮬레이터에서 사라짐
- 두 개의 fixed 요소(form과 bottom nav)가 iOS에서 충돌
- `position: fixed` + `bottom` 값 조정으로는 해결 불가

**시도한 방법들**:
- bottom 값 60px → 70px → 74px 조정 → 실패
- left/right + margin: auto 조정 → 실패
- **근본 원인**: fixed positioning 자체가 iOS에서 두 개의 하단 요소를 다루기에 부적합

## 3단계: Flexbox 기반 아키텍처로 전환

### 전환 결정
**이유**:
- Page 컨테이너에 명확한 높이 제약 제공 (하단 네비게이션 제외)
- 입력 필드를 normal flow로 배치하여 iOS 렌더링 문제 회피
- Flexbox로 스크롤 가능한 리스트와 고정된 입력 필드 분리

**구현 구조**:
```
App (main) - height: calc(100vh - 74px - safe-area-inset-bottom)
  └─ Page (container) - flex column, height: 100%
       ├─ List - flex: 1, overflow-y: auto
       └─ Form - flex-shrink: 0
```

### 하단 네비게이션 높이 상수화
**이유**:
- 실측값 74px를 여러 곳에서 사용
- 유지보수성: 높이 변경 시 한 곳만 수정

**구현**:
```typescript
// shared/ui/constants.ts
export const BOTTOM_NAV_HEIGHT = 74; // safe-area-inset-bottom 제외

// app.css.ts
height: `calc(100vh - ${BOTTOM_NAV_HEIGHT}px - env(safe-area-inset-bottom, 0px))`

// bottomNavigation.css.ts
height: `calc(${BOTTOM_NAV_HEIGHT}px + env(safe-area-inset-bottom, 0px))`
```

### 컴포넌트 구조 개선
**해결**:
- Form을 container 밖으로 이동 (Fragment로 분리)
- Container의 padding을 list로 이동
- Form은 독립적으로 padding 관리

**구조**:
```tsx
<>
  <div className={styles.container}>
    <div className={styles.list}> {/* 좌우 padding 여기에 */}
      {/* task items */}
    </div>
  </div>

  <form className={styles.form}> {/* 독립 padding */}
    {/* input + button */}
  </form>
</>
```

### 하단 네비게이션 내부 레이아웃 가변화
**이전**:
- 고정 padding 값들로 레이아웃 구성
- 높이 변경 시 내부 패딩도 수동 조정 필요

**변경**:
```css
/* Before */
paddingTop: '8px',
paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',

/* After */
height: `calc(${BOTTOM_NAV_HEIGHT}px + env(safe-area-inset-bottom, 0px))`,
alignItems: 'center',  // 수직 중앙 정렬
paddingBottom: 'env(safe-area-inset-bottom, 0px)',  // safe area만 패딩
```

## 최종 아키텍처

### 레이어별 책임
1. **App (main)**: 하단 네비게이션을 제외한 뷰포트 높이 제공
2. **Page (container)**: 100% 높이를 list와 form에 분배
3. **List**: 남은 공간 전체 사용, 스크롤 가능
4. **Form**: 최소 공간 차지, 하단 고정 (normal flow)
5. **Bottom Navigation**: Fixed positioning, 명시적 높이

### Safe Area 처리
- **App**: 높이 계산에서 safe-area-inset-bottom 차감
- **Bottom Navigation**: 높이에 safe-area-inset-bottom 추가
- **결과**: 콘텐츠와 네비게이션이 safe area를 침범하지 않음

## 검증 결과
- iOS 시뮬레이터: Safe Area 정상 적용 ✅
- 키보드 표시: 입력창이 키보드 위에 올바르게 위치 ✅
- 데스크탑: 레이아웃 정상 동작 (fallback 동작) ✅
- 하단 네비게이션 + 입력 필드: iOS에서 정상 표시 ✅

## 참고
- [CSS Flexible Box Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout)
- [iOS Safe Area](https://developer.apple.com/design/human-interface-guidelines/layout)
- [MDN - CSS env()](https://developer.mozilla.org/en-US/docs/Web/CSS/env)
- [Capacitor Keyboard Plugin](https://capacitorjs.com/docs/apis/keyboard)
- [CSS Environment Variables](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
