import { useState } from 'react';
import { SearchInput } from '../features/search/ui/SearchInput';
import { SearchResultItem } from '../features/search/ui/SearchResultItem';
import { useSearch } from '../features/search/hooks/useSearch';
import * as styles from './SearchPage.css';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const { data, isLoading, error } = useSearch(query);

  const handleResultClick = (id: string) => {
    // TODO: Task 상세 또는 편집 화면으로 이동
    console.log('Clicked task:', id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <SearchInput onSearch={setQuery} autoFocus />
      </div>

      <div className={styles.results}>
        {isLoading && <div className={styles.loading}>Searching...</div>}

        {error && (
          <div className={styles.error}>
            Error: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        )}

        {data && data.results.length === 0 && query.length >= 2 && (
          <div className={styles.empty}>No results found for "{query}"</div>
        )}

        {data && data.results.length > 0 && (
          <>
            <div className={styles.resultCount}>
              Found {data.total} result{data.total !== 1 ? 's' : ''}
            </div>
            <div className={styles.resultList}>
              {data.results.map((result) => (
                <SearchResultItem
                  key={result.id}
                  result={result}
                  onClick={handleResultClick}
                />
              ))}
            </div>
          </>
        )}

        {query.length > 0 && query.length < 2 && (
          <div className={styles.hint}>Type at least 2 characters to search</div>
        )}

        {query.length === 0 && (
          <div className={styles.welcome}>
            <span className={styles.welcomeIcon}>🔍</span>
            <p className={styles.welcomeText}>Start typing to search your tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}
