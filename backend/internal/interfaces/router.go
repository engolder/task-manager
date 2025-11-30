package interfaces

import (
	"os"
	"tasklist-backend/internal/application"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func NewRouter(taskService *application.TaskService) *gin.Engine {
	phase := os.Getenv("PHASE")
	if phase == "debug" {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()

	config := cors.DefaultConfig()

	// 개발 환경에서는 모든 Origin 허용 (iOS Live Reload 등)
	if gin.Mode() == gin.DebugMode || gin.Mode() == gin.TestMode {
		config.AllowAllOrigins = true
	} else {
		// 프로덕션에서는 특정 도메인만 허용
		config.AllowOrigins = []string{
			"http://localhost:5173", // Vite dev
			"http://localhost:5174", // Vite dev (alternative)
			"http://localhost:4173", // Vite preview
			"http://localhost:4174", // Vite preview (alternative)
			// TODO: 프로덕션 도메인 추가 필요
		}
	}

	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	r.Use(cors.New(config))

	taskHandler := NewTaskHandler(taskService)

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "service": "task-service"})
	})
	
	r.GET("/ready", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ready", "service": "task-service"})
	})

	v1 := r.Group("/api/v1")
	{
		tasks := v1.Group("/tasks")
		{
			tasks.GET("", taskHandler.GetTasks)
			tasks.GET("/:id", taskHandler.GetTask)
			tasks.POST("", taskHandler.CreateTask)
			tasks.PUT("/:id", taskHandler.UpdateTask)
			tasks.DELETE("/:id", taskHandler.DeleteTask)
		}
	}

	return r
}