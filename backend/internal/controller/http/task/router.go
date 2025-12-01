package task

import (
	pkgHttp "tasklist-backend/pkg/http"
)

func RegisterRoutes(server pkgHttp.HTTPServer, handler *Handler) {
	v1 := server.Group("/api/v1")
	tasks := v1.Group("/tasks")
	{
		tasks.GET("", handler.GetTasks)
		tasks.GET("/:id", handler.GetTask)
		tasks.POST("", handler.CreateTask)
		tasks.PUT("/:id", handler.UpdateTask)
		tasks.DELETE("/:id", handler.DeleteTask)
	}
}
