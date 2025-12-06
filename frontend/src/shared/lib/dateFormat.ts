/**
 * 상대 시간 또는 절대 시간으로 날짜를 포맷팅합니다.
 * - 1분 미만: "방금"
 * - 1시간 미만: "N분 전"
 * - 24시간 미만: "N시간 전"
 * - 어제: "어제"
 * - 그 외: "YYYY-MM-DD"
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return '방금';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else if (diffDays === 1) {
    return '어제';
  } else {
    return formatDate(dateString);
  }
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅합니다.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
