package task

import (
	"errors"
	"net/http"
	"tasklist-backend/internal/domain/task"
	taskUseCase "tasklist-backend/internal/usecase/task"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	useCase *taskUseCase.UseCase
}

func NewHandler(uc *taskUseCase.UseCase) *Handler {
	return &Handler{useCase: uc}
}

func (h *Handler) GetTasks(c *gin.Context) {
	tasks, err := h.useCase.GetAllTasks()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tasks"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": tasks})
}

func (h *Handler) GetTask(c *gin.Context) {
	id := c.Param("id")

	t, err := h.useCase.GetTaskByID(id)
	if err != nil {
		if errors.Is(err, taskUseCase.ErrInvalidInput) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch task"})
		return
	}

	if t == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": t})
}

func (h *Handler) CreateTask(c *gin.Context) {
	var input task.CreateTaskInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	t, err := h.useCase.CreateTask(input)
	if err != nil {
		if errors.Is(err, taskUseCase.ErrInvalidInput) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create task"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": t})
}

func (h *Handler) UpdateTask(c *gin.Context) {
	id := c.Param("id")

	var input task.UpdateTaskInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	t, err := h.useCase.UpdateTask(id, input)
	if err != nil {
		if errors.Is(err, taskUseCase.ErrInvalidInput) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}
		if errors.Is(err, taskUseCase.ErrTaskNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update task"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": t})
}

func (h *Handler) DeleteTask(c *gin.Context) {
	id := c.Param("id")

	err := h.useCase.DeleteTask(id)
	if err != nil {
		if errors.Is(err, taskUseCase.ErrInvalidInput) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
			return
		}
		if errors.Is(err, taskUseCase.ErrTaskNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete task"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}
