# PHASE 환경 변수 관리

## 작업 개요
환경별 서버 동작 제어를 위한 `PHASE` 환경 변수 도입

## 핵심 결정사항

### 1. 환경 변수명: `PHASE`
**선택 이유**:
- `GIN_MODE`보다 프레임워크 독립적
- `ENV`보다 명확한 의도 표현
- 향후 다른 설정에도 활용 가능

**값**: `debug` / `release`
- Gin 프레임워크의 모드 네이밍과 일치
- 직관적이고 명확함

### 2. 하드코딩된 Gin 모드 제거
**기존 문제**:
```go
gin.SetMode(gin.ReleaseMode)  // 항상 Release 모드
```

**개선**:
```go
phase := os.Getenv("PHASE")
if phase == "debug" {
    gin.SetMode(gin.DebugMode)
} else {
    gin.SetMode(gin.ReleaseMode)  // 기본값: release (안전)
}
```

### 3. Makefile 통합
**dev 타겟**: `PHASE=debug`
- 개발자 친화적 환경
- 상세한 로깅
- 모든 Origin CORS 허용

**run 타겟**: `PHASE=release`
- 프로덕션 환경
- 최소 로깅
- 제한적 CORS

## 최종 구조

```
backend/Makefile:
  dev-task:  PHASE=debug go run cmd/task-service/main.go
  run-task:  PHASE=release ./bin/task-service

backend/internal/interfaces/router.go:
  - PHASE 환경 변수 읽기
  - Gin 모드 설정
  - CORS 정책 분기

Makefile (루트):
  test-e2e: PHASE 기반 포트 선택 (debug=5173, release=4173)

scripts/wait-for-services.sh:
  - PHASE 기반 프론트엔드 포트 감지
```

## 사용법

### 백엔드 실행
```bash
# 개발 모드
make dev
PHASE=debug go run cmd/task-service/main.go

# 프로덕션 모드
make build && make preview
PHASE=release ./bin/task-service
```

### E2E 테스트 실행
```bash
# Debug 모드 (포트 5173)
make test-e2e

# Release 모드 (포트 4173)
make test-e2e PHASE=release
```

**PHASE 통일로 얻은 이점**:
- 백엔드와 E2E 테스트가 동일한 환경 변수 사용
- 일관된 네이밍으로 혼란 방지
- `debug`/`release`로 의도가 명확

## 관련 문서
- `worklogs/backend-cors-configuration.md` - CORS 설정 상세
- `worklogs/playwright-e2e-testing.md` - E2E 테스트 구축
