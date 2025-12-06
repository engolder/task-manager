package task

type Repository interface {
	GetAll(completed *bool) ([]Task, error)
	GetByID(id string) (*Task, error)
	Create(input CreateTaskInput) (*Task, error)
	Update(id string, input UpdateTaskInput) (*Task, error)
	Delete(id string) error
}
