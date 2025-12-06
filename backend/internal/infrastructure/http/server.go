package http

import (
	"context"
	"log"
	"net/http"
	"os"
	pkgConfig "tasklist-backend/pkg/config"
	pkgHttp "tasklist-backend/pkg/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.uber.org/fx"
)

type Server struct {
	engine *gin.Engine
	config *pkgConfig.Config
}

func New(lc fx.Lifecycle, cfg *pkgConfig.Config) pkgHttp.HTTPServer {
	phase := os.Getenv("PHASE")
	if phase == "debug" {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}

	engine := gin.Default()

	corsConfig := cors.DefaultConfig()
	if gin.Mode() == gin.DebugMode || gin.Mode() == gin.TestMode {
		corsConfig.AllowAllOrigins = true
	} else {
		corsConfig.AllowOrigins = []string{
			"http://localhost:5173",
			"http://localhost:5174",
			"http://localhost:4173",
			"http://localhost:4174",
		}
	}
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	engine.Use(cors.New(corsConfig))

	engine.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "service": "task-service"})
	})

	engine.GET("/ready", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ready", "service": "task-service"})
	})

	server := &Server{
		engine: engine,
		config: cfg,
	}

	lc.Append(fx.Hook{
		OnStart: func(ctx context.Context) error {
			addr := ":" + cfg.Port
			log.Printf("Starting task-service on port %s", cfg.Port)
			log.Printf("Database path: %s", cfg.DBPath)
			log.Printf("API endpoints available:")
			log.Printf("  GET    /health")
			log.Printf("  GET    /ready")
			log.Printf("  GET    /api/v1/tasks")
			log.Printf("  GET    /api/v1/tasks/:id")
			log.Printf("  POST   /api/v1/tasks")
			log.Printf("  PUT    /api/v1/tasks/:id")
			log.Printf("  DELETE /api/v1/tasks/:id")

			go func() {
				if err := engine.Run(addr); err != nil && err != http.ErrServerClosed {
					log.Fatalf("Failed to start server: %v", err)
				}
			}()
			return nil
		},
		OnStop: func(ctx context.Context) error {
			log.Println("Stopping HTTP server")
			return nil
		},
	})

	return server
}

func (s *Server) Group(path string) *gin.RouterGroup {
	return s.engine.Group(path)
}

func (s *Server) Engine() *gin.Engine {
	return s.engine
}
