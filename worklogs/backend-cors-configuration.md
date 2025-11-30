# 백엔드 CORS 설정 - 개발/프로덕션 환경 분리

## 문제 상황
iOS Live Reload 모드에서 403 에러 발생. Mac의 IP 주소(예: `http://192.168.219.112:5173`)로 접근 시 CORS에서 차단됨.

## 핵심 결정사항

### 1. 개발 환경에서 모든 Origin 허용
**이유**:
- iOS Live Reload는 동적 IP 주소 사용 (네트워크 환경에 따라 변경)
- IP 주소를 하드코딩하면 네트워크 변경 시마다 수정 필요
- 개발 편의성 > 보안 (로컬 개발 환경)

**구현**:
```go
if gin.Mode() == gin.DebugMode || gin.Mode() == gin.TestMode {
    config.AllowAllOrigins = true
} else {
    config.AllowOrigins = []string{
        "http://localhost:5173", // Vite dev
        "http://localhost:5174", // Vite dev (alternative)
        "http://localhost:4173", // Vite preview
        "http://localhost:4174", // Vite preview (alternative)
    }
}
```

### 2. 프로덕션 Origin 목록 정리
**변경사항**:
- `localhost:3000` 제거 (사용하지 않는 포트)
- Vite 개발/프리뷰 포트만 명시적으로 허용

## 최종 동작
- **Debug 모드**: `AllowAllOrigins = true` → iOS Live Reload, 모든 IP 접근 가능
- **Release 모드**: 특정 localhost 포트만 허용 → 프로덕션 보안 유지

## 관련 문서
- `worklogs/phase-environment-management.md` - PHASE 환경 변수 설정
- `worklogs/ios-deployment.md` - iOS Live Reload 설정
