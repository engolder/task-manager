# Go 백엔드 서비스 가이드

## 🎯 기술 스택

### Backend
- **언어**: Go 1.22+
- **웹 프레임워크**: Gin (HTTP 라우팅, 미들웨어)
- **ORM**: GORM (타입 안전한 데이터베이스 접근)
- **데이터베이스**: SQLite (개발용), PostgreSQL (프로덕션 대비)
- **아키텍처**: Clean Architecture + Domain Driven Design (DDD)
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
│   └── task-service/        # 서비스 진입점
│       └── main.go          # 메인 실행 파일
├── internal/                # 비공개 패키지 (외부 import 불가)
│   ├── domain/              # 도메인 레이어 (비즈니스 모델)
│   │   └── task.go          # Task 엔티티, Repository 인터페이스
│   ├── application/         # 애플리케이션 레이어 (비즈니스 로직)
│   │   └── task_service.go  # Task 비즈니스 서비스
│   ├── infrastructure/      # 인프라 레이어 (외부 의존성)
│   │   ├── database.go      # 데이터베이스 연결 설정
│   │   └── task_repository.go # Repository 구현체
│   └── interfaces/          # 인터페이스 레이어 (HTTP API)
│       ├── task_handler.go  # HTTP 핸들러
│       └── router.go        # API 라우터 설정
├── pkg/                     # 공개 패키지 (외부 import 가능)
│   ├── config/             # 설정 관리
│   │   └── config.go       # 환경 설정 로더
│   ├── logger/             # 로깅 유틸리티 (향후)
│   └── middleware/         # 공통 미들웨어 (향후)
├── configs/                # 설정 파일 디렉토리
├── go.mod                  # Go 모듈 정의
├── go.sum                  # 의존성 체크섬
└── tasks.db               # SQLite 데이터베이스 파일
```

---

## 🏗️ Clean Architecture 레이어별 책임

### 1. Domain Layer (`internal/domain/`)
- **책임**: 순수한 비즈니스 모델과 규칙 정의
- **특징**: 외부 의존성 없음, 프레임워크 독립적
- **파일**:
  - `task.go`: Task 엔티티, 비즈니스 규칙, Repository 인터페이스

### 2. Application Layer (`internal/application/`)
- **책임**: 비즈니스 로직 조율, 사용 사례 구현
- **특징**: Domain을 의존하지만 Infrastructure는 인터페이스로 추상화
- **파일**:
  - `task_service.go`: Task 관련 비즈니스 로직, 입력 검증

### 3. Infrastructure Layer (`internal/infrastructure/`)
- **책임**: 외부 시스템과의 연동 (DB, 외부 API 등)
- **특징**: Domain 인터페이스 구현, 프레임워크 의존적
- **파일**:
  - `database.go`: GORM 데이터베이스 연결 관리
  - `task_repository.go`: TaskRepository 인터페이스 구현

### 4. Interface Layer (`internal/interfaces/`)
- **책임**: 외부와의 통신 인터페이스 (HTTP, CLI 등)
- **특징**: 프레임워크 의존적, Application Layer 사용
- **파일**:
  - `task_handler.go`: HTTP 요청/응답 처리
  - `router.go`: API 엔드포인트 라우팅, 미들웨어 설정

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
- 허용 Origin: `localhost:5173`, `localhost:5174`, `localhost:4173`, `localhost:4174`, `localhost:3000`
  - `5173`, `5174`: Vite 개발 서버 포트
  - `4173`, `4174`: Vite preview 서버 포트 (production 빌드 테스트용)
  - `3000`: 일반적인 개발 서버 포트
- 허용 메서드: GET, POST, PUT, DELETE, OPTIONS
- 허용 헤더: Origin, Content-Type, Accept, Authorization

**중요**: Preview 모드나 CI 환경에서 E2E 테스트 시 4173/4174 포트가 필요합니다.

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