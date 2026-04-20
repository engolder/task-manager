import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { searchApi, type SearchQuery } from '../../../shared/api/searchApi';

interface UseSearchOptions {
  completed?: boolean;
  sort?: 'relevance' | 'date_desc' | 'date_asc';
  limit?: number;
}

export function useSearch(query: string, options?: UseSearchOptions) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce 처리 (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return useQuery({
    queryKey: ['search', debouncedQuery, options],
    queryFn: () => {
      const searchQuery: SearchQuery = {
        q: debouncedQuery,
        ...options,
      };
      return searchApi.search(searchQuery);
    },
    enabled: debouncedQuery.length >= 2, // 최소 2글자 이상
    staleTime: 1000 * 60 * 5, // 5분
  });
}
