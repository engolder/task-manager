package search

import (
	pkgHttp "tasklist-backend/pkg/http"
)

type Router struct {
	handler *Handler
}

func NewRouter(handler *Handler) *Router {
	return &Router{handler: handler}
}

func RegisterRoutes(server pkgHttp.HTTPServer, handler *Handler) {
	router := NewRouter(handler)

	v1 := server.Group("/api/v1")
	searchGroup := v1.Group("/search")
	{
		searchGroup.GET("", router.handler.Search)
		searchGroup.POST("/reindex", router.handler.Reindex)
	}
}
