---
description: "PR을 머지하고 브랜치와 worktree를 자동으로 정리합니다"
---

PR 머지 및 정리를 시작합니다.

## 실행 단계

### 1. 현재 상태 확인
```bash
git branch --show-current
git worktree list
gh pr list --head $(git branch --show-current)
```

**확인 항목:**
- 현재 브랜치명
- 활성화된 worktree 목록
- 현재 브랜치의 열린 PR

### 2. PR 확인 및 머지
- 현재 브랜치와 연관된 열린 PR 찾기
- PR이 없으면 에러 메시지 출력
- PR이 있으면 squash merge 수행:
  ```bash
  gh pr merge <PR번호> --squash --delete-branch
  ```

### 3. 정리 작업 수행
**main 브랜치로 이동:**
```bash
cd /Users/joonmo.yeon/codes/task-manager
git checkout main
git pull origin main
```

**브랜치 및 worktree 정리:**
```bash
# Worktree 제거 (존재하는 경우)
git worktree remove ../task-manager-[branch-name]

# 로컬 브랜치 삭제
git branch -d [branch-name]

# 원격 브랜치 정리 (이미 삭제된 경우)
git fetch --prune
```

### 4. 결과 안내
```
✅ PR 머지 후 정리 완료
   - Worktree 제거: ../task-manager-[branch-name]
   - 로컬 브랜치 삭제: [branch-name]
   - main 브랜치로 전환 완료
   - 최신 코드 동기화 완료
```

## 예외 처리

### PR이 없는 경우
- "현재 브랜치에 열린 PR이 없습니다" 안내
- 정리 작업 중단

### PR 머지 실패
- 머지 충돌이나 CI 실패 등으로 머지가 불가능한 경우
- 에러 메시지 표시
- 정리 작업 중단

### main 브랜치에서 실행한 경우
- "이미 main 브랜치입니다" 안내
- 정리할 브랜치 선택 옵션 제공

### Worktree가 없는 경우
- Worktree 제거 단계 스킵
- 브랜치 삭제만 진행

## 주의사항
- 커밋되지 않은 변경사항이 있으면 경고
- `gh pr merge`는 자동으로 원격 브랜치 삭제 (`--delete-branch`)
- 로컬 브랜치와 worktree는 수동으로 정리
