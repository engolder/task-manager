# Makefile 기반 애플리케이션 오케스트레이션

## 작업 개요
루트에서 `make dev` 한 번으로 프론트엔드(Vite) + 백엔드(Go)를 동시 실행할 수 있는 계층적 Makefile 시스템 구축

## 핵심 결정사항

### 1. 계층별 Makefile 분리
**이유**:
- 모노레포 소규모 프로젝트이므로 전체 동시 실행 전략 적용 가능
- 대규모 MSA에서는 작업 중인 서비스만 로컬 실행하고 나머지는 dev 환경 참조하지만, 이 프로젝트는 전체 로컬 실행이 현실적
- 계층별 책임 분리로 확장성 확보

**구현**:
- **루트 Makefile**: 고수준 오케스트레이션 (전체/프론트/백엔드)
- **Backend Makefile**: 세부 서비스 관리 (개별 서비스 제어)

### 2. 하이픈 기반 명명 규칙
**이유**:
- 사용자는 콜론 기반 선호 (`make dev:task`)
- Makefile에서 콜론은 타겟-의존성 구분 특수문자로 이스케이프 필요 (`dev\:task:`)
- "multiple target patterns" 문법 오류 발생
- 하이픈 방식이 더 안전하고 일반적인 패턴

**최종 선택**: `make dev-task` (문법적 안정성과 가독성)

### 3. 계층별 실행 범위 제한
**이유**:
- 초기 제안: 루트에서 모든 백엔드 서비스 개별 실행 가능
- 사용자 피드백: "루트에서 특정 서비스 실행은 어색함"
- 일관성과 직관성을 위해 레이어별 책임 명확히 구분

**구현**:
- 루트: 고수준 제어만 (`dev`, `dev-frontend`, `dev-backend`)
- backend/: 세부 제어 (`dev-task`, `dev-all` 등)

### 4. 병렬 실행 전략
**이유**:
- 프론트엔드와 백엔드를 순차 실행하면 개발 시작이 지연됨
- `&`와 `wait`로 백그라운드 병렬 실행
- 모노레포 장점 활용 (멀티레포에서는 어려움)

**구현**:
```makefile
dev:
	@$(MAKE) dev-backend &
	@$(MAKE) dev-frontend &
	@wait
```

## 최종 구조
```
/Makefile           # 루트: 전체/프론트/백엔드 레이어 실행
/backend/Makefile   # 백엔드: 개별 서비스 실행 (dev-task, dev-user 등)
```

**레이어 설계**:
- 루트 레이어: 인프라 + 프론트엔드 + 모든 서비스 통합
- 인프라 레이어: Postgres/MySQL, Redis, RabbitMQ 등 (향후)
- 프론트엔드 레이어: SPA (독립 실행)
- 백엔드 레이어: 서비스들 (SQLite 등 내장형 의존성 포함)

## 사용법
```bash
# 루트에서
make dev              # 전체 애플리케이션
make dev-frontend     # 프론트엔드만
make dev-backend      # 백엔드 전체

# backend/에서
make dev-task         # task 서비스만
```

## 참고
- [GNU Make Manual](https://www.gnu.org/software/make/manual/)
- [Make 타겟 명명 규칙](https://www.gnu.org/prep/standards/html_node/Makefile-Conventions.html)