# Go 백엔드 서비스 가이드

## 🎯 기술 스택

### Backend
- **언어**: Go 1.22+
- **웹 프레임워크**: Gin (HTTP 라우팅, 미들웨어)
- **ORM**: GORM (타입 안전한 데이터베이스 접근)
- **데이터베이스**: SQLite (개발용), PostgreSQL (프로덕션 대비)
- **아키텍처**: Clean Architecture + Domain Driven Design (DDD)
- **의존성 주입**: Uber Fx (생명주기 관리, 모듈 기반 DI)
- **HTTP 클라이언트**: 내장 net/http
- **UUID**: Google UUID 라이브러리

### 개발 도구
- **의존성 관리**: Go Modules
- **CORS**: gin-contrib/cors
- **구조화된 로깅**: 표준 log 패키지 (향후 zap/logrus 전환 예정)

---

## 📁 프로젝트 구조

```
backend/
├── cmd/
│   └── task-service/
│       └── main.go              # Fx 모듈 조립
├── pkg/                         # 공용 인터페이스
│   ├── http/
│   │   └── server.go           # HTTPServer 인터페이스
│   └── config/
│       ├── config.go
│       └── module.go           # Config Fx 모듈
├── internal/
│   ├── domain/                  # 순수 비즈니스 로직
│   │   └── task/
│   │       ├── entity.go        # Task 엔티티
│   │       └── repository.go    # Repository 인터페이스
│   ├── usecase/                 # 비즈니스 시나리오
│   │   └── task/
│   │       ├── usecase.go
│   │       └── module.go
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
│   └── controller/              # 외부 인터페이스
│       └── http/
│           └── task/
│               ├── handler.go
│               ├── router.go
│               └── module.go
├── go.mod
├── go.sum
└── data/tasks.db
```

---

## 🏗️ Clean Architecture 레이어별 책임

### 1. Domain Layer (`internal/domain/task/`)
- **책임**: 순수한 비즈니스 모델과 규칙 정의
- **특징**: 외부 의존성 없음, 프레임워크 독립적
- **파일**:
  - `entity.go`: Task 엔티티, 비즈니스 규칙
  - `repository.go`: Repository 인터페이스 (계약)

### 2. UseCase Layer (`internal/usecase/task/`)
- **책임**: 비즈니스 로직 조율, 사용 사례 구현
- **특징**: Domain 인터페이스만 의존
- **파일**:
  - `usecase.go`: Task 비즈니스 로직, 입력 검증
  - `module.go`: Fx 모듈 정의

**의존성**: Domain Repository 인터페이스 → Infrastructure에서 구현체 주입

### 3. Infrastructure Layer (`internal/infrastructure/`)
- **책임**: 외부 시스템과의 연동 (DB, HTTP 서버, 외부 API)
- **특징**: Domain 인터페이스 구현, 프레임워크 의존적
- **서브 디렉토리**:
  - `database/`: GORM 연결, 생명주기 관리
  - `persistence/task/`: TaskRepository 구현
  - `http/`: Gin 서버, HTTPServer 인터페이스 구현

### 4. Controller Layer (`internal/controller/http/task/`)
- **책임**: HTTP 요청/응답 처리
- **특징**: pkg/http.HTTPServer 인터페이스 사용 (Infrastructure 직접 의존 X)
- **파일**:
  - `handler.go`: HTTP 핸들러
  - `router.go`: RegisterRoutes 함수 (HTTPServer 인터페이스 활용)
  - `module.go`: Fx 모듈, fx.Invoke로 RegisterRoutes 자동 호출

---

## 🔄 Uber Fx 의존성 주입 패턴

### 모듈 조립 (`cmd/task-service/main.go`)
```go
func main() {
    fx.New(
        config.Module,           // 환경 설정
        database.Module,         // DB 연결
        taskPersistence.Module,  // Repository 구현
        http.Module,             // HTTP 서버
        taskUseCase.Module,      // 비즈니스 로직
        taskController.Module,   // HTTP 컨트롤러
    ).Run()
}
```

### 모듈 패턴

각 기능은 `module.go`에서 Fx 모듈을 정의:

**기본 Provide 패턴** (`usecase/task/module.go`):
```go
var Module = fx.Module("usecase.task",
    fx.Provide(New),
)
```

**Repository 제공 패턴** (`persistence/task/module.go`):
```go
var Module = fx.Module("persistence.task",
    fx.Provide(New),
)
```
- `New` 함수가 인터페이스를 반환하므로 Fx가 자동으로 타입 처리
- UseCase는 구현체가 아닌 인터페이스를 주입받음

**Invoke 패턴** (`controller/http/task/module.go`):
```go
var Module = fx.Module("controller.http.task",
    fx.Provide(NewHandler),
    fx.Invoke(RegisterRoutes),
)
```
- `fx.Invoke`: 애플리케이션 시작 시 자동 실행
- RegisterRoutes가 HTTPServer를 주입받아 라우트 등록

### 생명주기 관리

**OnStart/OnStop 훅** (`infrastructure/http/server.go`):
```go
func New(lc fx.Lifecycle, cfg *pkgConfig.Config) *Server {
    // ...
    lc.Append(fx.Hook{
        OnStart: func(ctx context.Context) error {
            // 서버 시작
            go engine.Run(addr)
            return nil
        },
        OnStop: func(ctx context.Context) error {
            // Graceful shutdown
            return nil
        },
    })
    return server
}
```

**DB 연결 종료** (`infrastructure/database/database.go`):
```go
lc.Append(fx.Hook{
    OnStop: func(ctx context.Context) error {
        sqlDB, _ := db.DB()
        return sqlDB.Close()
    },
})
```

### Controller-Infrastructure 분리

**pkg/http 인터페이스** (`pkg/http/server.go`):
```go
type HTTPServer interface {
    Group(path string) *gin.RouterGroup
}
```

**Infrastructure 구현** (`infrastructure/http/server.go`):
```go
func (s *Server) Group(path string) *gin.RouterGroup {
    return s.engine.Group(path)
}
```

**Controller 사용** (`controller/http/task/router.go`):
```go
func RegisterRoutes(server pkgHttp.HTTPServer, handler *Handler) {
    v1 := server.Group("/api/v1")
    tasks := v1.Group("/tasks")
    // ...
}
```

**장점**:
- Controller가 Gin에 직접 의존하지 않음
- HTTP 프레임워크 교체 시 Controller 수정 불필요
- 테스트 시 HTTPServer 인터페이스 모킹 가능

---

## 🚀 API 엔드포인트

### Health Check
- `GET /health` - 서비스 상태 확인
- `GET /ready` - 서비스 준비 상태 확인 (마이크로서비스용)

### Task API (v1)
- `GET /api/v1/tasks` - 전체 할일 목록 조회
- `GET /api/v1/tasks/:id` - 특정 할일 조회
- `POST /api/v1/tasks` - 새 할일 생성
- `PUT /api/v1/tasks/:id` - 할일 업데이트 (완료 상태, 텍스트 수정)
- `DELETE /api/v1/tasks/:id` - 할일 삭제

### API 응답 형식
```json
{
  "data": {
    "id": "uuid-string",
    "text": "할일 내용",
    "completed": false,
    "createdAt": "2025-01-26T09:52:48+09:00",
    "updatedAt": "2025-01-26T09:52:48+09:00"
  }
}
```

### 에러 응답 형식
```json
{
  "error": "에러 메시지"
}
```

---

## 🗄️ 데이터 모델

### Task 엔티티
```go
type Task struct {
    ID        string    `json:"id" gorm:"primaryKey;type:varchar(36)"`
    Text      string    `json:"text" gorm:"not null"`
    Completed bool      `json:"completed" gorm:"default:false"`
    CreatedAt time.Time `json:"createdAt" gorm:"autoCreateTime"`
    UpdatedAt time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
}
```

### Repository 인터페이스
```go
type TaskRepository interface {
    GetAll() ([]Task, error)
    GetByID(id string) (*Task, error)
    Create(input CreateTaskInput) (*Task, error)
    Update(id string, input UpdateTaskInput) (*Task, error)
    Delete(id string) error
}
```

---

## ⚙️ 설정 관리

### 환경 변수
- `PORT`: 서버 포트 (기본값: 8080)
- `DB_PATH`: SQLite 데이터베이스 파일 경로 (기본값: ./tasks.db)

### 설정 로딩
```go
cfg := config.Load()  // 환경변수에서 설정 로드
```

---

## 🔧 개발 및 실행

### 로컬 개발 서버 실행
```bash
# 의존성 설치
go mod tidy

# 개발 서버 실행
go run cmd/task-service/main.go

# 또는 빌드 후 실행
go build -o bin/task-service cmd/task-service/main.go
./bin/task-service
```

### API 테스트
```bash
# Health Check
curl http://localhost:8080/health

# Task 목록 조회
curl http://localhost:8080/api/v1/tasks

# Task 생성
curl -X POST http://localhost:8080/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"text": "새로운 할일"}'

# Task 완료 처리
curl -X PUT http://localhost:8080/api/v1/tasks/{id} \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

---

## 🛡️ 보안 및 미들웨어

### CORS 설정
**환경별 정책:**
- **Debug 모드** (`PHASE=debug`): 모든 Origin 허용 (`AllowAllOrigins = true`)
  - iOS Live Reload 지원 (동적 IP 주소)
  - 로컬 네트워크 개발 편의성
- **Release 모드** (`PHASE=release` 또는 미설정): 제한된 Origin만 허용
  - `localhost:5173`, `localhost:5174`: Vite 개발 서버 포트
  - `localhost:4173`, `localhost:4174`: Vite preview 서버 포트

**허용 메서드**: GET, POST, PUT, DELETE, OPTIONS
**허용 헤더**: Origin, Content-Type, Accept, Authorization

**PHASE 환경 변수 제어:**
```bash
# 개발 환경 (모든 Origin 허용)
PHASE=debug go run cmd/task-service/main.go

# 프로덕션 환경 (제한된 Origin만 허용)
PHASE=release ./bin/task-service
```

### 에러 처리
- 일관된 HTTP 상태 코드 사용
- 구조화된 에러 응답
- 로깅을 통한 에러 추적

---

## 📊 마이크로서비스 대비 설계

### 독립성 확보
- **데이터베이스 분리**: 각 서비스별 독립 DB
- **서비스별 진입점**: `cmd/{service-name}/` 구조
- **설정 외부화**: 환경변수 기반 설정

### 통신 패턴
- **RESTful API**: 서비스 간 HTTP 통신
- **Health Check**: 서비스 디스커버리 지원
- **API 버저닝**: `/api/v1/` 형태로 하위 호환성 보장

### 관찰성 (Observability)
- **구조화된 로깅**: JSON 형태 로그 (향후)
- **메트릭 수집**: Prometheus 연동 준비
- **분산 트레이싱**: 요청 ID 전파 (향후)

---

## 🚧 향후 개선사항

### 운영 환경 대비
- [ ] Docker 컨테이너화
- [ ] PostgreSQL 연동
- [ ] 환경별 설정 파일 분리
- [ ] Graceful Shutdown

### 보안 강화
- [ ] JWT 인증 시스템
- [ ] Rate Limiting
- [ ] 입력 검증 강화
- [ ] HTTPS 설정

### 모니터링 및 로깅
- [ ] Structured Logging (zap/logrus)
- [ ] Prometheus 메트릭
- [ ] Health Check 상세화
- [ ] 분산 트레이싱

### 마이크로서비스 전환
- [ ] Service Mesh (Istio/Linkerd)
- [ ] API Gateway
- [ ] Circuit Breaker
- [ ] 이벤트 기반 통신 (Message Queue)

---

## 📚 코딩 가이드라인

### 네이밍 규칙
- **패키지명**: 소문자, 단수형 (예: `task`, `config`)
- **구조체**: PascalCase (예: `TaskService`, `CreateTaskInput`)
- **함수/메서드**: PascalCase (공개), camelCase (비공개)
- **상수**: UPPER_SNAKE_CASE 또는 PascalCase

### 에러 처리
- 사용자 정의 에러 변수 활용: `ErrTaskNotFound`
- `errors.Is()` 사용으로 에러 체크
- HTTP 핸들러에서는 적절한 상태 코드 반환

### 의존성 주입
- 인터페이스 기반 의존성 주입
- 생성자 함수 패턴: `NewTaskService(repo TaskRepository)`
- Mock 테스트 가능한 구조

---

## 🔗 관련 문서
- [Go 공식 문서](https://golang.org/doc/)
- [Gin Web Framework](https://gin-gonic.com/docs/)
- [GORM ORM Library](https://gorm.io/docs/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)