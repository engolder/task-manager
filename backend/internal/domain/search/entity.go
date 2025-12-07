package search

type SearchQuery struct {
	Query     string  `form:"q" binding:"required"`
	Completed *bool   `form:"completed"`
	Sort      string  `form:"sort"`
	Limit     int     `form:"limit"`
	Offset    int     `form:"offset"`
}

type SearchResult struct {
	ID         string              `json:"id"`
	Text       string              `json:"text"`
	Completed  bool                `json:"completed"`
	CreatedAt  string              `json:"createdAt"`
	UpdatedAt  string              `json:"updatedAt"`
	Score      float64             `json:"score"`
	Highlights map[string][]string `json:"highlights"`
}

type SearchResponse struct {
	Results    []SearchResult `json:"results"`
	Total      int64          `json:"total"`
	Page       int            `json:"page"`
	TotalPages int            `json:"totalPages"`
}
