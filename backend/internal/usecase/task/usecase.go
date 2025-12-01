package task

import (
	"errors"
	"tasklist-backend/internal/domain/task"
)

var (
	ErrTaskNotFound = errors.New("task not found")
	ErrInvalidInput = errors.New("invalid input")
)

type UseCase struct {
	repo task.Repository
}

func New(repo task.Repository) *UseCase {
	return &UseCase{
		repo: repo,
	}
}

func (uc *UseCase) GetAllTasks() ([]task.Task, error) {
	return uc.repo.GetAll()
}

func (uc *UseCase) GetTaskByID(id string) (*task.Task, error) {
	if id == "" {
		return nil, ErrInvalidInput
	}
	return uc.repo.GetByID(id)
}

func (uc *UseCase) CreateTask(input task.CreateTaskInput) (*task.Task, error) {
	if input.Text == "" {
		return nil, ErrInvalidInput
	}
	return uc.repo.Create(input)
}

func (uc *UseCase) UpdateTask(id string, input task.UpdateTaskInput) (*task.Task, error) {
	if id == "" {
		return nil, ErrInvalidInput
	}

	existing, err := uc.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, ErrTaskNotFound
	}

	return uc.repo.Update(id, input)
}

func (uc *UseCase) DeleteTask(id string) error {
	if id == "" {
		return ErrInvalidInput
	}

	existing, err := uc.repo.GetByID(id)
	if err != nil {
		return err
	}
	if existing == nil {
		return ErrTaskNotFound
	}

	return uc.repo.Delete(id)
}
