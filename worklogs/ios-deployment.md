## iOS 앱 배포 및 TestFlight 설정

### 1. 환경 정보
- OS: macOS
- Xcode 버전: 설치됨
- 프로젝트: Capacitor iOS 앱
- 배포 대상: TestFlight 및 실제 기기

### 2. 필수 준비사항

1. Apple Developer Program 가입 [⚠️]
   - 연간 $99 비용 발생
   - https://developer.apple.com/programs/ 에서 가입
   - 개인 또는 조직 계정 선택

2. 개발 환경 설정 [✅]
   - macOS 설치된 컴퓨터
   - Xcode 최신 버전
   - Apple ID
   - iPhone/iPad (테스트용)
   - USB 케이블

### 3. 진행된 작업 및 결과

1. 프로젝트 빌드 [✅]
   ```bash
   cd frontend && yarn build
   ```
   - 결과: 성공
   - 빌드 산출물이 `dist` 디렉토리에 생성됨

2. iOS 프로젝트 동기화 [✅]
   ```bash
   npx cap sync ios
   ```
   - 결과: 성공
   - 웹 빌드가 iOS 프로젝트로 복사됨
   - Pod install 완료

3. Xcode 프로젝트 설정 [✅]
   - 문제 해결 과정:
     1. "Communication with Apple Failed" 에러 진단
        - Apple 서버 연결 테스트 완료 (정상)
        - 네트워크 경로 추적 완료 (정상)
     
     2. 프로비저닝 프로파일 설정 [✅]
        - 실제 기기 연결 필요 메시지 확인
        - iPhone을 Mac에 연결
        - Xcode가 자동으로 프로비저닝 프로파일 생성
     
     3. iPhone 개발자 모드 설정 [✅]
        - 설정 → 개인정보 보호 및 보안
        - 개발자 모드 활성화
        - iPhone 재시작으로 적용
     
     4. 개발자 인증서 신뢰 설정 [✅]
        - 설정 → 일반 → VPN 및 기기 관리
        - Apple Development 인증서 선택
        - 인증서 신뢰하도록 설정

       - 최종 결과:
      - Xcode에서 앱 빌드 및 실행 성공
      - iPhone에서 앱 정상 실행 확인
      - 개발용 프로비저닝 프로파일 설정 완료

    - 문제 해결 과정 및 원인 분석:
      1. 검은 화면 문제의 원인
         - Capacitor는 웹 앱을 iOS 네이티브 앱으로 래핑하는 방식으로 동작
         - 검은 화면은 주로 웹뷰가 콘텐츠를 제대로 로드하지 못할 때 발생
         - 원인 1: 빌드된 웹 앱이 iOS 프로젝트에 제대로 포함되지 않은 경우
         - 원인 2: capacitor.config.ts의 설정이 잘못된 경우
         - 원인 3: 웹뷰 설정이 올바르지 않은 경우

      2. 해결 단계별 설명
         ```bash
         # 1. 프론트엔드 앱 빌드
         cd frontend
         yarn build
         # 이유: Vite로 프론트엔드 코드를 production 빌드
         # 결과물은 dist/ 디렉토리에 생성됨
         # capacitor.config.ts의 webDir이 이 디렉토리를 참조

         # 2. iOS 프로젝트와 동기화
         npx cap sync ios
         # 이유: dist/ 디렉토리의 빌드 결과물을 iOS 프로젝트로 복사
         # iOS 프로젝트의 public/ 디렉토리에 웹 앱 파일들이 복사됨
         # 이 과정에서 capacitor.config.ts도 iOS 프로젝트에 반영

         # 3. capacitor.config.ts 설정
         # 참고: https://capacitorjs.com/docs/config
         cat > capacitor.config.ts << 'EOL'
         import { CapacitorConfig } from '@capacitor/cli';

         const config: CapacitorConfig = {
           appId: 'io.cursor.todolist',    // 앱의 고유 식별자
           appName: 'TodoList',            // 앱 이름
           webDir: 'dist',                 // 웹 앱 빌드 결과물 위치
           ios: {
             contentInset: 'automatic',    // iOS 웹뷰 여백 자동 조정
             preferredContentMode: 'mobile', // 모바일 최적화 모드
             scheme: 'app',                // 앱 URL 스키마
             backgroundColor: '#ffffff',    // 웹뷰 기본 배경색
             limitsNavigationsToAppBoundDomains: true  // 보안을 위한 도메인 제한
           }
         };

         export default config;
         EOL
         # 이유: 
         # - server 설정 제거: 로컬 개발 서버 대신 번들된 파일 사용
         # - ios 설정 추가: 웹뷰 동작 방식 최적화
         # - backgroundColor 설정: 웹 앱 로드 전 보이는 배경색 지정

         # 4. 다시 빌드 및 동기화
         yarn build && npx cap sync ios
         # 이유: 변경된 설정을 iOS 프로젝트에 적용
         # 이 과정에서 웹 앱 파일과 설정이 모두 업데이트됨

         # 5. Xcode 열기
         npx cap open ios
         # Xcode에서 최종 빌드 및 실행
         ```

      3. Xcode 추가 작업의 필요성
         - Clean Build Folder (Cmd + Shift + K)
           이유: 이전 빌드 캐시를 완전히 제거하여 깨끗한 상태에서 시작
         
         - 앱 재빌드 및 실행
           이유: 새로운 설정과 파일들이 완전히 반영된 상태로 빌드
         
         - 문제 지속 시 앱 재설치
           이유: iOS의 앱 캐시나 설정이 충돌을 일으킬 수 있음
           
      4. 설정 값 선택 근거
         - capacitor.config.ts 설정:
           - Capacitor 공식 문서의 권장 설정 참조
           - iOS 웹뷰의 기본 동작 특성 고려
           - 일반적인 웹 앱의 요구사항 반영
         
         - 빌드 프로세스:
           - Vite의 빌드 최적화 활용
           - Capacitor의 자동 동기화 메커니즘 활용
           - iOS의 앱 배포 요구사항 준수

    - 참고사항:
      - 무료 Apple ID 사용 시 7일마다 재설치 필요
      - TestFlight 배포는 Apple Developer Program($99/년) 필요
      - 각 명령어 실행 후 에러 메시지 확인 필요
      - capacitor.config.ts 수정 시 오타 주의

### 4. Live Reload 설정 [🔄]
   - 목적: 프론트엔드 코드 변경사항 실시간 반영

   1. 기본 설정
      ```typescript
      // capacitor.config.ts
      const config: CapacitorConfig = {
        appId: 'io.cursor.todolist',
        appName: 'TodoList',
        webDir: 'dist'
      };
      ```

   2. 실행 방법
      ```bash
      # 1. 프론트엔드 개발 서버 실행
      cd frontend && yarn dev

      # 2. 기기 ID 확인 및 실행
      npx cap run ios --target=YOUR_DEVICE_ID --live-reload
      # 에러 메시지에서 사용 가능한 기기 ID 목록 확인 가능
      ```

   3. 문제 해결
      - 검은 화면이 나오는 경우:
        ```bash
        # 캐시 삭제 후 재시도
        rm -rf dist/ ios/App/App/public/
        yarn build && npx cap sync ios
        ```
      - VPN이나 회사 네트워크에서 문제가 발생하는 경우:
        - 네트워크 IP를 직접 지정
        ```typescript
        // capacitor.config.ts
        server: {
          url: 'http://YOUR_IP:5173',
          cleartext: true
        }
        ```

  ### 5. TestFlight 배포 계획

1. App Store Connect 설정 [🔄]
   - 새로운 앱 등록
   - 앱 기본 정보 설정
   - 스크린샷 및 설명 준비

2. 빌드 및 업로드 준비 [🔄]
   - 버전 및 빌드 번호 설정
   - 앱 아이콘 확인
   - 필요한 권한 설정 검토

3. TestFlight 설정 [🔄]
   - 내부 테스터 그룹 구성
   - 테스트 정보 작성
   - 빌드 노트 준비

### 5. 현재 상태
- 빌드 및 동기화까지는 정상 완료
- Apple Developer 계정 연동 필요
- TestFlight 배포를 위한 준비 작업 필요

### 6. 다음 단계

1. Apple Developer Program 가입
   - 계정 생성 및 결제
   - 개발자 인증서 발급

2. App Store Connect 설정
   - 앱 등록 및 기본 정보 입력
   - 스크린샷 및 설명 준비

3. TestFlight 배포
   - 앱 빌드 및 업로드
   - 테스터 그룹 설정
   - 테스트 시작

### 7. 참고사항
- TestFlight 배포 후 테스트 가능까지 약 1일 소요
- 내부 테스터는 즉시 테스트 가능
- 외부 테스터는 Apple 심사 후 테스트 가능 (약 1일 소요)
- 무료 Apple ID로는 TestFlight 배포 불가 (Apple Developer Program 필수)