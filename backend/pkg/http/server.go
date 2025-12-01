package http

import "github.com/gin-gonic/gin"

type HTTPServer interface {
	Group(path string) *gin.RouterGroup
}
