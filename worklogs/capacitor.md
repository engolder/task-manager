# Capacitor iOS 앱 래핑

## 작업 개요
웹앱을 Capacitor로 iOS 네이티브 앱으로 래핑하여 App Store 배포 가능한 앱 제작

## 핵심 결정사항

### 1. Capacitor 선택 (vs React Native/Flutter)
**이유**:
- 기존 React 웹앱을 그대로 활용 가능 (재작성 불필요)
- WebView 기반으로 웹 → 네이티브 전환이 가장 간단
- React Native는 컴포넌트 재작성 필요, Flutter는 언어 전환(Dart) 필요
- 웹 개발 경험을 그대로 iOS로 확장 가능

**트레이드오프**: 네이티브 대비 약간의 성능 오버헤드, 웹앱 최적화가 iOS 성능에 직접 영향

### 2. Capacitor 7.4.2 버전 선택
**이유**:
- 작업 시점의 최신 안정 버전 (LTS)
- iOS 14.0 이상 지원으로 대부분의 iOS 디바이스 커버
- Xcode 15.0+ 호환성 보장

### 3. Scheme 네이밍: 'App' (대문자) 사용
**이유**:
- Capacitor CLI는 'app'(소문자)를 찾지만 Xcode는 'App'(대문자)로 생성
- iOS 네이밍 컨벤션과 크로스플랫폼 도구 간 차이
- `xcodebuild: error: The workspace named "App" does not contain a scheme named "app"` 에러 발생

**해결**: `--scheme App` 옵션으로 명시적 지정
```json
"ios:dev": "yarn ios:serve & npx cap run ios --scheme App"
```

### 4. 병렬 개발 서버 구조
**이유**:
- 매번 전체 빌드 후 시뮬레이터 실행은 개발 속도 저하
- 개발 서버와 시뮬레이터 병렬 실행으로 핫 리로드 가능
- `&`로 백그라운드 실행하여 웹 변경사항 즉시 반영

**구현**:
```json
"ios:dev": "yarn ios:serve & npx cap run ios --scheme App"
```

### 5. iOS 설정 최적화
**이유**:
- `contentInset: 'automatic'`: Safe Area 자동 처리
- `preferredContentMode: 'mobile'`: 모바일 최적화 뷰포트
- `scheme: 'app'`: 커스텀 URL scheme (딥링크 지원 준비)
- `limitsNavigationsToAppBoundDomains: true`: 보안 강화 (앱 외부 탐색 제한)

## 최종 구조
```
frontend/
├── capacitor.config.ts      # Capacitor 설정
├── ios/                      # Xcode 프로젝트
│   └── App/
│       └── App.xcworkspace   # iOS 앱 워크스페이스
└── package.json              # iOS 개발 스크립트
```

## 사용법
```bash
yarn ios:build    # 빌드 후 Xcode 동기화
yarn ios:open     # Xcode 열기
yarn ios:dev      # 개발 서버 + 시뮬레이터 실행
```

## 환경 준비
```bash
# Ruby & CocoaPods (iOS 의존성 관리)
brew install ruby
gem install cocoapods

# Xcode 명령줄 도구
sudo xcode-select --switch /Applications/Xcode.app
```

## 참고
- [Capacitor iOS 공식 문서](https://capacitorjs.com/docs/ios)
- [Capacitor Configuration](https://capacitorjs.com/docs/config)