package task

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Task struct {
	ID        string    `json:"id" gorm:"primaryKey;type:varchar(36)"`
	Text      string    `json:"text" gorm:"not null"`
	Completed bool      `json:"completed" gorm:"default:false"`
	CreatedAt time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
}

func (t *Task) BeforeCreate(tx *gorm.DB) error {
	if t.ID == "" {
		t.ID = uuid.New().String()
	}
	return nil
}

type CreateTaskInput struct {
	Text string `json:"text" binding:"required,min=1"`
}

type UpdateTaskInput struct {
	Text      *string `json:"text,omitempty"`
	Completed *bool   `json:"completed,omitempty"`
}
