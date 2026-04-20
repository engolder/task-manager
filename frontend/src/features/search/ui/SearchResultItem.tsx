import type { SearchResult } from '../../../shared/api/searchApi';
import * as styles from './SearchResultItem.css';

interface SearchResultItemProps {
  result: SearchResult;
  onClick: (id: string) => void;
}

export function SearchResultItem({ result, onClick }: SearchResultItemProps) {
  // 하이라이트된 텍스트가 있으면 사용, 없으면 원본 텍스트
  const highlightedText = result.highlights?.text?.[0] || result.text;

  return (
    <div
      className={styles.resultItem}
      onClick={() => onClick(result.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(result.id);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className={styles.content}>
        <div
          className={styles.text}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Highlighting requires HTML rendering
          dangerouslySetInnerHTML={{ __html: highlightedText }}
        />
        <div className={styles.metadata}>
          <span className={styles.score}>Score: {result.score.toFixed(2)}</span>
          <span className={styles.date}>
            {new Date(result.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>
      <div className={styles.statusBadge}>
        {result.completed ? '✅' : '⬜'}
      </div>
    </div>
  );
}
