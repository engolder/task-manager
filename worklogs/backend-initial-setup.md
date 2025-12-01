# Go 백엔드 초기 구축

## 작업 개요
클라이언트 사이드만 있던 Task 기능을 Go 백엔드 REST API로 구축하여 데이터 영속성 확보

**기술 스택**: Go + Gin + GORM + SQLite

## 핵심 결정사항

### 1. Go + Gin 웹 프레임워크 선택
**이유**:
- Go: 높은 성능, 간단한 동시성 처리(goroutine), 컴파일 언어의 타입 안정성
- Gin: 빠른 HTTP 라우팅, 미들웨어 지원, 활발한 커뮤니티

### 2. GORM ORM 라이브러리
**이유**:
- 타입 안전한 쿼리 작성
- 자동 마이그레이션 (스키마 자동 생성)
- Repository 패턴 구현 용이

### 3. SQLite 선택 (vs PostgreSQL)
**이유**:
- 로컬 개발 시 별도 DB 서버 불필요 (개발 시작 장벽 낮춤)
- 파일 기반이므로 데이터 백업/이동 간단
- GORM의 자동 마이그레이션 활용 가능
- 프로덕션에서는 PostgreSQL로 교체 가능 (Repository Pattern으로 추상화됨)

**트레이드오프**: PostgreSQL 대비 동시성 제한, 프로덕션에서는 교체 필요

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

## 검증 결과
- Health check: `curl http://localhost:8080/health` ✅
- CRUD 동작: Task 생성/조회/업데이트/삭제 ✅
- 자동 마이그레이션: 앱 시작 시 DB 스키마 자동 생성 ✅
- 프론트엔드 연동: React Query로 서버 상태 관리 ✅

## 참고
- [Go 공식 문서](https://golang.org/doc/)
- [Gin Web Framework](https://gin-gonic.com/docs/)
- [GORM ORM Library](https://gorm.io/docs/)
- [React Query 문서](https://tanstack.com/query/latest)
- `worklogs/backend-fx-clean-architecture.md` - 아키텍처 상세 설명
- `backend/CLAUDE.md` - 프로젝트 구조 및 API 명세