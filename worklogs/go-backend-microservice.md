# Go 백엔드 마이크로서비스 구축

## 작업 개요
클라이언트 사이드만 있던 Task 기능을 Go 백엔드 REST API로 구축하여 데이터 영속성 확보 및 마이크로서비스 전환 준비

**기술 스택**: Go + Gin + GORM + SQLite + Clean Architecture

## 핵심 결정사항

### 1. Clean Architecture + 4계층 구조
**이유**:
- 마이크로서비스 전환 대비: 비즈니스 로직을 인프라와 완전히 분리하여 독립 배포 가능
- 기존 모놀리식 구조에서는 프론트/백엔드 강결합이 마이크로서비스 전환 시 병목
- 레이어별 책임 분리로 코드 변경 시 영향도 최소화

**구현**:
- **Domain**: 비즈니스 엔티티 및 규칙 (데이터베이스 독립)
- **Application**: Use Case 및 비즈니스 로직
- **Infrastructure**: GORM, SQLite 등 외부 의존성
- **Interface**: Gin HTTP 핸들러, REST API

### 2. SQLite 선택 (vs PostgreSQL)
**이유**:
- 로컬 개발 시 별도 DB 서버 불필요 (개발 시작 장벽 낮춤)
- 파일 기반이므로 데이터 백업/이동 간단
- GORM의 자동 마이그레이션 활용 가능
- 프로덕션에서는 PostgreSQL로 교체 가능 (Repository Pattern으로 추상화됨)

**트레이드오프**: PostgreSQL 대비 동시성 제한, 프로덕션에서는 교체 필요

### 3. 마이크로서비스 준비 구조
**이유**:
- 향후 확장 시 서비스별 독립 배포 필요
- 서비스마다 독립적인 데이터베이스, 설정, 진입점 필요
- Health Check는 오케스트레이션 도구(k8s, ECS)의 필수 요구사항

**구현**:
- 서비스별 진입점: `cmd/task-service/main.go` (향후 `user-service`, `auth-service` 추가 가능)
- 독립 데이터베이스: 서비스마다 별도 DB 파일
- API 버저닝: `/api/v1/` (하위 호환성 보장)
- Health Check: `/health` 엔드포인트

### 4. 프론트엔드 상태 관리 전환 (Zustand → React Query)
**이유**:
- Zustand는 클라이언트 전역 상태 관리에 특화
- 서버 데이터는 React Query가 캐싱, 동기화, 리패칭 등을 자동 처리
- 로딩/에러 상태를 React Query가 선언적으로 관리
- 서버 상태와 클라이언트 상태 분리 (관심사 분리)

**구현**: React Query Provider로 App 래핑, `useQuery`/`useMutation` hooks 사용

### 5. CORS 및 타입 호환성 처리
**CORS 설정 이유**:
- 브라우저는 다른 포트 접근 시 CORS 정책으로 차단 (프론트 5173, 백엔드 8080)
- `gin-contrib/cors`로 개발 환경 포트 허용

**타입 호환성 처리**:
- Go `time.Time`과 TypeScript `string` 불일치 문제
- JSON 태그로 ISO 8601 문자열 직렬화 강제

## 최종 구조
```
backend/
├── cmd/task-service/main.go    # 서비스 진입점
├── internal/
│   ├── domain/                  # 엔티티 (DB 독립)
│   ├── application/             # Use Case
│   ├── infrastructure/          # GORM, SQLite
│   └── interface/               # Gin HTTP
└── data/tasks.db                # SQLite DB
```

## 검증 결과
- Health check: `curl http://localhost:8080/health` ✅
- CRUD 동작: Task 생성/조회/업데이트/삭제 ✅
- 자동 마이그레이션: 앱 시작 시 DB 스키마 자동 생성 ✅
- 프론트엔드 연동: React Query로 서버 상태 관리 ✅

## 참고
- [Go 공식 문서](https://golang.org/doc/)
- [Gin Web Framework](https://gin-gonic.com/docs/)
- [GORM ORM Library](https://gorm.io/docs/)
- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Query 문서](https://tanstack.com/query/latest)
- `backend/CLAUDE.md` - 프로젝트 구조 및 API 명세