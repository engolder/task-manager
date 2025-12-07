# Search Microservice 구현

## 작업 개요
전체 Task에 대한 full-text search 기능을 제공하는 독립적인 search-service 마이크로서비스 추가. 프론트엔드에 3번째 검색 탭 추가.

## 핵심 결정사항

### 1. 마이크로서비스 아키텍처 선택
**이유**:
- 검색 기능의 독립적 확장 가능
- 전용 검색 엔진(Elasticsearch) 활용 가능
- 향후 다른 서비스에서도 검색 기능 재사용 가능
- 기존 task-service와 책임 분리 (SRP)

**트레이드오프**:
- 초기 구현 복잡도 증가 (단일 서비스 대비)
- 데이터 동기화 필요
- 인프라 관리 포인트 증가 (Elasticsearch, 포트 관리)

**대안 고려**:
- Monolithic 접근 (task-service에 `/api/v1/tasks/search` 추가): 빠른 구현 가능하지만 확장성 제한

### 2. Elasticsearch 선택
**이유**:
- 강력한 full-text search 엔진 (relevance scoring, 한글 형태소 분석)
- 검색어 하이라이팅 기본 지원
- 대용량 데이터에도 빠른 검색 성능
- 향후 자동완성, fuzzy search 등 고급 기능 추가 용이

**초기 단계 고려사항**:
- SQLite FTS5나 PostgreSQL full-text도 가능했으나, 장기적 확장성 고려
- 현재는 단순한 검색이지만 향후 복잡한 쿼리나 집계(aggregation) 기능 필요 예상

### 3. 데이터 동기화 전략: 단계적 접근
**Phase 1 (초기)**: DB 공유
- search-service가 tasks 테이블 직접 읽기
- 간단한 구현, 빠른 MVP
- 진정한 마이크로서비스는 아니지만 구조는 분리

**Phase 2 (향후)**: Event-driven
- Task 생성/수정/삭제 시 이벤트 발행
- search-service가 이벤트 구독하여 Elasticsearch 인덱스 업데이트
- Message Queue (RabbitMQ, Kafka 등) 도입 필요

**이유**:
- 초기에는 복잡도를 낮추고 빠르게 기능 구현
- 서비스 경계는 명확히 나눠서 나중에 이벤트 기반으로 전환 용이

### 4. 프론트엔드 UI 설계
**검색 탭 위치**: 3번째 하단 탭 (Tasks - History - Search)

**핵심 기능**:
- 실시간 검색 (debounced 500ms)
- 검색어 하이라이팅 (`<mark>` 태그)
- 최소 2글자 이상 입력 시 검색 시작

**이유**:
- 즉각적인 피드백으로 UX 개선
- Debounce로 불필요한 API 호출 최소화
- 하이라이팅으로 검색 결과의 관련성 시각화

### 5. API 설계
**Endpoint**: `GET /api/v1/search?q={query}&completed={bool}&sort={relevance|date_desc|date_asc}`

**응답 형식**:
```json
{
  "data": {
    "results": [
      {
        "id": "uuid",
        "text": "Task text",
        "completed": false,
        "createdAt": "2025-01-26T...",
        "updatedAt": "2025-01-26T...",
        "score": 0.85,
        "highlights": {
          "text": ["Task <mark>text</mark>"]
        }
      }
    ],
    "total": 42,
    "page": 1,
    "totalPages": 3
  }
}
```

**이유**:
- RESTful 설계 원칙 준수
- 기존 task-service API와 일관된 응답 구조
- score와 highlights로 검색 품질 정보 제공

## 기술 스택

### Backend (search-service)
- **Framework**: Go + Gin + GORM + Uber Fx (task-service와 동일)
- **Search Engine**: Elasticsearch 8.11.0
- **Port**: 8081 (task-service는 8080)
- **Clean Architecture**: task-service와 동일한 레이어 구조

### Frontend
- **State Management**: React Query (debounced search hook)
- **API Client**: ky
- **Styling**: Vanilla Extract
- **새 컴포넌트**:
  - `SearchPage.tsx`
  - `SearchInput.tsx` (debounced input)
  - `SearchResultItem.tsx` (highlighting 지원)

### Infrastructure
- **Docker Compose**: Elasticsearch 컨테이너 관리
- **Development**: Air (hot reload for search-service)
- **Orchestration**: Makefile 확장

## 아키텍처 다이어그램

```
┌─────────────┐
│  Frontend   │
│ (port 5173) │
└──────┬──────┘
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌─────────────┐  ┌──────────────┐
│task-service │  │search-service│
│ (port 8080) │  │ (port 8081)  │
└──────┬──────┘  └──────┬───────┘
       │                │
       ▼                ▼
   ┌────────┐    ┌──────────────┐
   │ SQLite │◄───┤Elasticsearch │
   └────────┘    └──────────────┘
   (초기 DB 공유)
```

## 디렉토리 구조

```
backend/
├── cmd/
│   ├── task-service/       # 기존
│   └── search-service/     # 신규 (포트 8081)
│       └── main.go
├── internal/
│   ├── domain/
│   │   └── search/         # 신규
│   │       ├── entity.go   # SearchQuery, SearchResult
│   │       └── repository.go
│   ├── usecase/search/     # 신규
│   ├── infrastructure/
│   │   ├── elasticsearch/  # 신규 (ES 클라이언트)
│   │   └── persistence/search/  # 신규
│   └── controller/http/search/  # 신규 (더미 라우트)

frontend/src/
├── pages/
│   └── SearchPage.tsx      # 신규
├── features/search/        # 신규
│   ├── ui/
│   │   ├── SearchInput.tsx
│   │   └── SearchResultItem.tsx
│   └── hooks/
│       └── useSearch.ts
└── shared/
    ├── api/
    │   └── searchApi.ts    # 신규
    └── ui/
        └── BottomNavigation.tsx  # 3탭으로 수정
```

## 구현 순서

1. **Worklog 작성** (현재)
2. **Backend 더미 라우트**: search-service에 기본 엔드포인트만 구현 (Elasticsearch 연동 전)
3. **Frontend 구현**: 검색 탭, UI 컴포넌트, API 연동 (더미 데이터 사용)
4. **Backend 완전 구현**: Elasticsearch 연동, 실제 검색 로직 (사용자가 직접 구현 예정)

## 초기 Reindex
search-service 시작 후 기존 SQLite의 모든 Task를 Elasticsearch로 인덱싱:
```bash
curl -X POST http://localhost:8081/api/v1/search/reindex
```

## 향후 개선사항
- Event-driven 데이터 동기화 (Message Queue 도입)
- 한글 형태소 분석기 (Elasticsearch nori plugin)
- 자동완성 (Elasticsearch suggest API)
- 검색 필터 (날짜 범위, 태그)
- 검색 히스토리 저장
- 검색 통계 및 인기 검색어

## 참고
- Elasticsearch Go Client: https://github.com/elastic/go-elasticsearch
- React Query Debouncing: https://tkdodo.eu/blog/practical-react-query#debouncing
- Clean Architecture 패턴: 기존 task-service 구조 참조
