# 기능 확장 로드맵

## 팀 협업

### 기능
- 회원가입/로그인
- 팀 생성 및 초대
- 할일 담당자 배정
- 댓글

### 기술 검토
- Docker/PostgreSQL (다중 사용자)
- Auth Service 분리
- API Gateway

---

## 실시간 알림

### 기능
- 브라우저 실시간 알림 (배정, 댓글, 마감)
- 이메일 알림
- 일일/주간 요약
- 알림 설정

### 기술 검토
- Kafka (이벤트 발행/구독)
- Redis (WebSocket 세션, 카운트 캐싱)
- WebSocket
- Email Service

---

## 검색 & 대시보드

### 기능
- 전체 텍스트 검색 (제목, 설명, 댓글)
- 자동완성
- 개인/팀 대시보드 (통계, 완료율)

### 기술 검토
- Elasticsearch (검색 엔진)
- Redis (대시보드 쿼리 캐싱)
- Search Service 분리

---

## 외부 연동

### 기능
- Slack 연동 (알림, 명령)
- GitHub 연동 (Issue ↔ 할일)
- Google Calendar 동기화
- 자동화 규칙 (정기 할일 생성)

### 기술 검토
- Webhook Service
- OAuth 2.0
- Temporal/Cron (스케줄링)

---

## 모니터링

### 기능
- Status Page (서비스 상태)
- Admin Dashboard (성능 지표)
- 자동 복구

### 기술 검토
- Prometheus/Grafana (메트릭, 시각화)
- Jaeger (분산 트레이싱)
- ELK (중앙 로깅)

---

## 확장성

### 기능
- 자동 확장 (트래픽 증가 시)
- 무중단 배포

### 기술 검토
- Kubernetes
- Istio
