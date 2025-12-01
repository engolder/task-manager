package task

import (
	"tasklist-backend/internal/domain/task"

	"gorm.io/gorm"
)

type repository struct {
	db *gorm.DB
}

func New(db *gorm.DB) task.Repository {
	return &repository{db: db}
}

func (r *repository) GetAll() ([]task.Task, error) {
	var tasks []task.Task
	err := r.db.Order("created_at DESC").Find(&tasks).Error
	return tasks, err
}

func (r *repository) GetByID(id string) (*task.Task, error) {
	var t task.Task
	err := r.db.Where("id = ?", id).First(&t).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &t, nil
}

func (r *repository) Create(input task.CreateTaskInput) (*task.Task, error) {
	t := task.Task{
		Text:      input.Text,
		Completed: false,
	}

	err := r.db.Create(&t).Error
	if err != nil {
		return nil, err
	}

	return &t, nil
}

func (r *repository) Update(id string, input task.UpdateTaskInput) (*task.Task, error) {
	var t task.Task
	err := r.db.Where("id = ?", id).First(&t).Error
	if err != nil {
		return nil, err
	}

	updates := make(map[string]interface{})
	if input.Text != nil {
		updates["text"] = *input.Text
	}
	if input.Completed != nil {
		updates["completed"] = *input.Completed
	}

	if len(updates) > 0 {
		err = r.db.Model(&t).Updates(updates).Error
		if err != nil {
			return nil, err
		}
	}

	err = r.db.Where("id = ?", id).First(&t).Error
	return &t, err
}

func (r *repository) Delete(id string) error {
	return r.db.Where("id = ?", id).Delete(&task.Task{}).Error
}
