# Backend Fx + Clean Architecture 재구조화

## 작업 개요
기존 수동 의존성 주입 방식을 Uber Fx로 전환하고, DDD 스타일의 명확한 Clean Architecture 구조로 재구성

**목적**: 마이크로서비스 전환 대비 + 테스트 용이성 + 확장성 확보

## 핵심 결정사항

### 1. Uber Fx 도입
**이유**:
- 수동 의존성 주입의 한계: 서비스 증가 시 main.go가 복잡해지고 순서 관리 어려움
- 생명주기 관리: Graceful Shutdown, DB 연결 종료 등을 프레임워크 수준에서 자동 처리
- 순환 의존성 감지: 컴파일 타임에 의존성 그래프 오류 발견
- 모듈화: 기능별로 독립적인 Fx 모듈 구성 가능

**트레이드오프**: 초기 학습 곡선, 프레임워크 의존성 증가

### 2. DDD 스타일 네이밍
**변경 사항**:
- `application/` → `usecase/` (UseCase가 더 명확)
- `interfaces/` → `controller/` (HTTP Controller 역할 명시)
- `infrastructure/task_repository.go` → `infrastructure/persistence/task/` (도메인별 분리)

**이유**:
- 표준 Clean Architecture 용어 사용 (커뮤니티 Best Practice)
- 도메인별 응집도 향상 (task, user 등을 독립적으로 관리)
- 코드베이스 탐색 시 직관성 증가

### 3. Repository 패턴 명확화
**구조**:
```
domain/task/repository.go        # Repository 인터페이스 (계약)
    ↑ 구현
infrastructure/persistence/task/  # Repository 구현체 (GORM)
```

**왜 Domain에 인터페이스가 있나?**:
- Domain은 "데이터를 어떻게 저장하고 싶다"는 **계약**만 정의
- UseCase는 Domain의 인터페이스만 의존 → DB 기술(GORM, SQL)을 전혀 모름
- Infrastructure가 Domain의 인터페이스를 **구현** → 의존성 역전 원칙(DIP) 준수

**핵심**: Repository는 "2개의 레이어"가 아니라 "인터페이스 + 구현"의 분리

### 4. pkg/http 인터페이스 분리
**구조**:
```
pkg/http/server.go                # HTTPServer 인터페이스 (공용 계약)
    ↑ 구현              ↑ 사용
infrastructure/http/  controller/http/task/
```

**이유**:
- Controller가 Infrastructure를 직접 의존하지 않음 (Clean Architecture 원칙)
- pkg는 재사용 가능한 공개 패키지 (다른 프로젝트에서도 import 가능)
- HTTP 프레임워크 교체 시 Controller 수정 불필요 (Gin → Echo 등)

**의존성 흐름**:
```
Controller → pkg/http.HTTPServer (인터페이스)
                 ↑
            Infrastructure 구현
```

### 5. Infrastructure 레이어 세분화
**database/ vs persistence/**:
- `database/`: DB 연결 풀 관리 (모든 Repository가 공통으로 사용)
- `persistence/task/`: Task 도메인의 CRUD 구현 (database에서 주입받음)

**이유**: 공통 리소스(DB 연결)와 도메인별 로직(Repository)을 명확히 분리

**http/ (서버)**:
- Gin 서버 생성, CORS 설정, 미들웨어
- 모든 Controller가 사용하는 공통 HTTP 서버

### 6. 모듈 구성 방식
**결정**: 각 기능별로 `module.go` 배치 (중앙 집중 방식 X)

```
usecase/task/module.go          # Task UseCase 모듈
persistence/task/module.go      # Task Repository 모듈
controller/http/task/module.go  # Task HTTP Controller 모듈
```

**이유**:
- 도메인별 응집도 향상 (task 관련 코드가 한 곳에)
- 새 기능 추가 시 동일한 패턴 반복 (확장 용이)
- 각 모듈이 자신의 의존성만 관리

## 최종 구조

```
backend/
├── cmd/
│   └── task-service/
│       └── main.go              # Fx.New()로 모듈 조립
│
├── pkg/                         # 공용 인터페이스
│   ├── http/
│   │   └── server.go           # HTTPServer 인터페이스
│   └── config/
│       ├── config.go
│       └── module.go
│
├── internal/
│   ├── domain/                  # 순수 비즈니스 로직
│   │   └── task/
│   │       ├── entity.go        # Task 엔티티
│   │       └── repository.go    # Repository 인터페이스
│   │
│   ├── usecase/                 # 비즈니스 시나리오
│   │   └── task/
│   │       ├── usecase.go
│   │       └── module.go
│   │
│   ├── infrastructure/          # 외부 기술
│   │   ├── database/
│   │   │   ├── database.go     # DB 연결
│   │   │   └── module.go
│   │   ├── persistence/         # Repository 구현
│   │   │   └── task/
│   │   │       ├── repository.go
│   │   │       └── module.go
│   │   └── http/
│   │       ├── server.go       # Gin 서버
│   │       └── module.go
│   │
│   └── controller/              # 외부 인터페이스
│       └── http/
│           └── task/
│               ├── handler.go
│               ├── router.go
│               └── module.go
```

## Controller ↔ HTTP Server 소통

```go
// pkg/http/server.go - 인터페이스 정의
type HTTPServer interface {
    Group(path string) *gin.RouterGroup
}

// infrastructure/http/server.go - 구현
func (s *Server) Group(path string) *gin.RouterGroup {
    return s.engine.Group(path)
}

// controller/http/task/router.go - 사용
func RegisterRoutes(server pkgHttp.HTTPServer, handler *Handler) {
    v1 := server.Group("/api/v1")
    tasks := v1.Group("/tasks")
    tasks.GET("", handler.GetAll)
}
```

**실행 순서**:
1. HTTP Server 생성 (Fx Module)
2. Server를 HTTPServer 인터페이스로 제공 (fx.As)
3. Controller가 HTTPServer 주입받아 RegisterRoutes 호출 (fx.Invoke)
4. Server 시작 (OnStart 훅)

## 의존성 흐름

```
main.go
  ├─> config.Module
  ├─> database.Module         → DB 연결
  │     ↓
  ├─> persistence.Module      → TaskRepository 구현 (DB 주입)
  │     ↓
  ├─> usecase.Module          → TaskUseCase (Repository 주입)
  │     ↓
  ├─> controller.Module       → TaskHandler (UseCase 주입)
  │     ↓
  └─> http.Module             → HTTP Server (RegisterRoutes 자동 호출)
```

## 참고
- [Uber Fx Documentation](https://uber-go.github.io/fx/)
- [Three Dots Labs - Clean Architecture in Go](https://threedots.tech/post/introducing-clean-architecture/)
- [Repository Pattern in Go](https://threedots.tech/post/repository-pattern-in-go/)
- `backend/CLAUDE.md` - 상세 구현 가이드
