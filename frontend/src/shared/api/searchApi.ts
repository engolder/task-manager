import ky from 'ky';

export interface SearchQuery {
  q: string;
  completed?: boolean;
  sort?: 'relevance' | 'date_desc' | 'date_asc';
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  score: number;
  highlights: Record<string, string[]>;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  totalPages: number;
}

interface ApiResponse<T> {
  data: T;
}

const api = ky.create({
  prefixUrl: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchApi = {
  async search(query: SearchQuery): Promise<SearchResponse> {
    const searchParams = new URLSearchParams();
    searchParams.set('q', query.q);

    if (query.completed !== undefined) {
      searchParams.set('completed', query.completed.toString());
    }
    if (query.sort) {
      searchParams.set('sort', query.sort);
    }
    if (query.limit) {
      searchParams.set('limit', query.limit.toString());
    }
    if (query.offset) {
      searchParams.set('offset', query.offset.toString());
    }

    const response = await api
      .get('search', { searchParams })
      .json<ApiResponse<SearchResponse>>();
    return response.data;
  },
};
