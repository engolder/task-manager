# Claude Code 작업 가이드

## ⚠️ 중요 - Git 작업 시 필수 준수사항 ⚠️
**모든 커밋과 PR에서 다음 문구들은 절대 사용 금지:**
- ❌ `"🤖 Generated with [Claude Code](https://claude.ai/code)"`
- ❌ `"Co-Authored-By: Claude <noreply@anthropic.com>"`
- ❌ 기타 Claude 관련 메타 정보

**항상 개발자가 직접 작성한 것처럼 자연스럽고 깔끔하게 작성**

---

## 1. Claude Code 기본 동작 원칙

### 1.1 기본 워크플로우
- Claude Code의 기본적인 작업 방식을 유지
- 사용자 요청을 직접적이고 효율적으로 처리
- TaskWrite 도구를 활용한 체계적 작업 관리

### 1.2 작업 진행 방식
- 사용자 요청 즉시 분석 및 작업 시작
- 복잡한 작업의 경우 TaskWrite로 단계별 계획 수립
- 각 단계 완료 시 진행 상황 업데이트

### 1.3 워크로그 참조 및 활용
- **작업 시작 전 워크로그 검토**: 관련 작업이 이전에 수행된 적이 있는지 `worklogs/` 디렉토리 확인
- **컨텍스트 파악**: 기존 워크로그에서 유사한 작업의 접근 방법, 문제점, 해결책 참조
- **일관성 유지**: 이전 작업의 패턴과 결정사항을 고려하여 일관된 접근 방식 적용
- **경험 활용**: 과거의 실패 사례나 성공 사례를 바탕으로 더 효율적인 작업 진행
- **작업 완료 후**: 새로운 워크로그 생성 또는 기존 워크로그 업데이트로 지식 축적

## 2. 개발 도구 및 명령어

### 2.1 Git 및 PR 관리
**Git 작업 및 PR 생성은 `/pr-open` 명령어를 사용하세요.**
- 자동으로 Git 상태 확인 및 커밋 생성
- PR 본문 자동 작성 및 사용자 승인 프로세스
- 상세한 가이드라인: `.claude/commands/pr-open.md` 참조

### 2.2 가이드라인 동기화
**코드 변경사항을 CLAUDE.md 파일에 자동 반영하려면 `/guide-sync` 명령어를 사용하세요.**
- Git 변경사항을 자동 분석하여 해당하는 CLAUDE.md 파일 업데이트
- 아키텍처 변경, 새로운 기술 스택, API 변경 등 중요한 변경사항을 문서화
- Frontend/Backend/공통 영역별로 적절한 가이드라인 파일에 자동 매핑
- 상세한 가이드라인: `.claude/commands/guide-sync.md` 참조

### 2.3 E2E 테스트
**전체 앱 통합 테스트는 `make test-e2e` 명령어를 사용하세요.**
- Frontend(React) + Backend(Go) 전체 통합 테스트
- Playwright 기반 브라우저 자동화 테스트
- GitHub Actions에서 자동 실행 (main 브랜치 push/PR 시)
- **사전 조건**: 서버 실행 후 테스트 (자동으로 서비스 준비 상태 확인)
- 서비스 대기 로직: `scripts/wait-for-services.sh` (10초 타임아웃)

**STAGE 변수 지원:**
```bash
# Local 모드 (기본값, vite dev - 포트 5173)
make test-e2e

# Production 모드 (vite preview - 포트 4173)
make test-e2e STAGE=production
```

**실행 환경별 사용 예시:**
- 로컬 개발: `make dev` → `make test-e2e` (local 모드, 기본값)
- CI/CD 환경: `make build` → `make run` → `make test-e2e STAGE=production` (production 모드)

## 3. 품질 관리

### 3.1 코드 수정 원칙
- **최소 변경 원칙 준수**
  - 요청된 변경사항에만 집중
  - 불필요한 코드 재작성 지양
  - 기존 코드의 의도와 맥락 유지

- **변경 범위 명확화**
  - 수정이 필요한 부분을 명확히 식별
  - 연관된 부분에 미치는 영향 검토
  - 의도하지 않은 변경사항 방지

### 3.2 코드 리뷰 체크리스트
변경사항 적용 전 다음 사항 확인:
- [ ] 요청된 변경사항만 포함되었는가?
- [ ] 기존 기능이 그대로 유지되는가?
- [ ] UI/스타일링이 의도치 않게 변경되지 않았는가?
- [ ] 연관된 테스트가 모두 통과하는가?
- [ ] 성능에 부정적 영향을 주지 않는가?

## 4. 문제 해결 및 커뮤니케이션

### 4.1 문제 해결 원칙
- 오류 상황 명확히 파악하고 원인 분석
- 해결 방안의 영향도 평가 후 사용자에게 제시
- 환경 설정 문제는 영구적 해결 방안 우선 제시

### 4.2 커뮤니케이션 원칙
- 명확하고 구조화된 형식으로 보고
- 전문 용어 사용 시 설명 추가
- 대안이 있는 경우 장단점과 함께 제시
- 기술적 제안 시 근거와 예상 효과 제시

## 5. 정보 정확성 관리

### 5.1 정보 출저 우선순위
1. 공식 문서 (최신 버전)
2. 프레임워크/라이브러리의 공식 블로그나 릴리즈 노트
3. 프로젝트 내부 문서 (워크로그 등)
4. 커뮤니티 문서나 블로그 포스트

### 5.2 버전 관리
- 모든 기술 문서 참조 시 반드시 버전 정보 확인
- 프로젝트에서 사용 중인 버전과 문서의 버전이 일치하는지 검증
- 버전 차이가 있는 경우 반드시 사용자에게 고지

## 6. 코드와 룰의 동기화

### 6.1 코드 변경에 따른 룰 업데이트
- 코드베이스가 변경될 때 관련 룰도 함께 업데이트
- 더 이상 유효하지 않은 예시나 설명 제거
- 새로운 코드 패턴이나 구조를 반영하여 룰 수정

### 6.2 업데이트 프로세스
- 코드 변경 시 관련 룰 파일 검토
- 룰의 예시 코드가 최신 코드베이스와 일치하는지 확인
- 필요한 경우 새로운 예시 추가 또는 기존 예시 수정
- 변경된 코드 구조나 패턴을 룰에 반영

### 6.3 동기화 검증
- 정기적으로 룰의 예시와 실제 코드베이스 비교
- 더 이상 사용되지 않는 패턴이나 구조 식별
- 새롭게 도입된 패턴이나 구조가 룰에 반영되었는지 확인

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.