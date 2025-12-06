---
description: "새로운 git worktree를 생성하고 Claude 설정을 symlink로 연결합니다"
---

브랜치명: $ARGUMENTS

다음 단계를 수행해주세요:

1. `./scripts/create-worktree.sh $ARGUMENTS` 스크립트를 실행
2. 실행 결과 확인 및 사용자에게 안내
3. 다음 단계 안내:
   - `cd ../task-manager-$ARGUMENTS`
   - `cd frontend && yarn install`
   - `cd ../backend && go mod download`

worktree가 `../task-manager-$ARGUMENTS` 경로에 생성되고, `.claude/` 디렉토리는 symlink로 연결됩니다.
