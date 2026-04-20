package search

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"tasklist-backend/internal/domain/search"
)

type Handler struct {
	// TODO: Add UseCase when implemented
}

func NewHandler() *Handler {
	return &Handler{}
}

// Search handles the search request
// TODO: Replace with actual Elasticsearch implementation
func (h *Handler) Search(c *gin.Context) {
	var query search.SearchQuery

	if err := c.ShouldBindQuery(&query); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set defaults
	if query.Limit == 0 {
		query.Limit = 20
	}
	if query.Sort == "" {
		query.Sort = "relevance"
	}

	// TODO: Call UseCase to perform actual search
	// For now, return dummy data for frontend development
	dummyResults := []search.SearchResult{
		{
			ID:        "dummy-1",
			Text:      "Sample task with <mark>" + query.Query + "</mark> keyword",
			Completed: false,
			CreatedAt: "2025-01-26T10:00:00+09:00",
			UpdatedAt: "2025-01-26T10:00:00+09:00",
			Score:     0.95,
			Highlights: map[string][]string{
				"text": {"Sample task with <mark>" + query.Query + "</mark> keyword"},
			},
		},
		{
			ID:        "dummy-2",
			Text:      "Another task mentioning " + query.Query,
			Completed: true,
			CreatedAt: "2025-01-25T15:30:00+09:00",
			UpdatedAt: "2025-01-25T15:30:00+09:00",
			Score:     0.75,
			Highlights: map[string][]string{
				"text": {"Another task mentioning <mark>" + query.Query + "</mark>"},
			},
		},
	}

	response := search.SearchResponse{
		Results:    dummyResults,
		Total:      2,
		Page:       1,
		TotalPages: 1,
	}

	c.JSON(http.StatusOK, gin.H{"data": response})
}

// Reindex handles the reindex request
// TODO: Implement actual reindexing logic
func (h *Handler) Reindex(c *gin.Context) {
	// TODO: Implement reindexing from SQLite to Elasticsearch
	c.JSON(http.StatusOK, gin.H{"message": "Reindex endpoint - to be implemented"})
}
