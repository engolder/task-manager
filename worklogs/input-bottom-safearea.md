# iOS Safe Area 및 입력창 하단 배치

## 작업 개요
입력창을 화면 하단으로 이동하여 모바일 UX 개선, iOS 홈 인디케이터(Safe Area) 침범 방지 및 키보드 대응

## 핵심 결정사항

### 1. 하단 배치 UX 선택
**이유**:
- 모바일에서는 하단 입력창이 엄지 접근성 우수
- 채팅 앱 패턴(Slack, Messenger 등)과 일관성
- 입력 중 리스트 전체 가시성 유지

**트레이드오프**: 데스크탑에서는 상단이 더 자연스러울 수 있지만, 모바일 우선 전략 채택

### 2. CSS env() Safe Area 접근
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

### 3. Capacitor Keyboard 플러그인 사용
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

### 4. 크로스플랫폼 호환성 전략
**이유**:
- iOS 전용 설정이 데스크탑/Android에 영향 주지 않도록 방어적 설계
- CSS fallback 값으로 Safe Area 미지원 환경에서 `0px` 사용

**구현**:
```css
padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 4.5rem);
```

## 최종 구조
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

## 검증 결과
- iOS 시뮬레이터: Safe Area 정상 적용 ✅
- 키보드 표시: 입력창이 키보드 위에 올바르게 위치 ✅
- 데스크탑: 레이아웃 정상 동작 (fallback 동작) ✅

## 참고
- [MDN - CSS env()](https://developer.mozilla.org/en-US/docs/Web/CSS/env)
- [Capacitor Keyboard Plugin](https://capacitorjs.com/docs/apis/keyboard)
- [iOS Safe Area 가이드](https://developer.apple.com/design/human-interface-guidelines/layout)
- [CSS Environment Variables](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)