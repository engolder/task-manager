# Backend Air 핫 리로드 도입

## 작업 개요
Go 백엔드에 Air를 도입하여 파일 변경 시 자동 재빌드 및 재시작 구현

## 핵심 결정사항

### 1. 서비스별 Air 설정 파일 방식 선택

**배경**:
- 마이크로서비스 아키텍처 (task, user, auth 등 여러 서비스 예정)
- 각 서비스가 독립적으로 실행 가능해야 함

**선택한 방식**: 서비스별 개별 설정 파일 (`.air.{service}.toml`)

**이유**:
- 각 서비스별로 다른 포트, 환경변수 설정 가능
- 서비스 추가 시 확장 용이
- 개별 서비스만 실행하거나 전체 실행 모두 가능

**대안 검토**:
- 단일 `.air.toml`: 멀티 프로세스 지원 안 됨
- Process Manager (Overmind): 추가 도구 필요, 과도한 복잡도

### 2. Air 설정 핵심

**빌드 경로**:
```toml
bin = "./tmp/task-service"
cmd = "go build -o ./tmp/task-service ./cmd/task-service/main.go"
```
- `tmp/` 디렉토리에 서비스별 바이너리 생성
- 서비스명으로 구분하여 충돌 방지

**환경변수 설정**:
```toml
full_bin = "PHASE=debug ./tmp/task-service"
```
- PHASE=debug로 Gin 디버그 모드, CORS 모든 Origin 허용

**감시 대상**:
```toml
include_dir = ["cmd", "internal", "pkg"]
include_ext = ["go", "toml"]
exclude_dir = ["tmp", "bin", "data"]
```
- 핵심 코드 디렉토리만 감시
- 빌드 결과물 및 DB 파일 제외

### 3. Makefile 통합

**변경**:
```makefile
dev-task:
	air -c .air.task.toml
```

**장점**:
- 기존 개발 워크플로우 유지 (`make dev-task`)
- 향후 서비스 추가 시 동일 패턴으로 확장

## 최종 구조

```
backend/
├── .air.task.toml          # task-service용 Air 설정
├── Makefile                # air 명령으로 변경
├── .gitignore              # tmp/, *_build_errors.log 추가
└── tmp/                    # Air 빌드 결과물 (무시됨)
    └── task-service
```

## 검증 결과

테스트 방법:
1. `make dev-task` 실행
2. `server.go` 파일 수정
3. 자동 재빌드 확인 (약 1-2초 소요)
4. API 응답 변경 확인

결과: ✅ 파일 저장 시 즉시 재빌드 및 재시작 확인

## 참고
- Air 공식 문서: https://github.com/air-verse/air
- 향후 user-service, auth-service 추가 시 `.air.{service}.toml` 파일 생성하여 동일 패턴 적용
