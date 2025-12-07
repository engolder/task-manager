package main

import (
	"tasklist-backend/pkg/config"

	"tasklist-backend/internal/infrastructure/database"
	"tasklist-backend/internal/infrastructure/http"
	taskPersistence "tasklist-backend/internal/infrastructure/persistence/task"

	taskUseCase "tasklist-backend/internal/usecase/task"

	taskController "tasklist-backend/internal/controller/http/task"
	searchController "tasklist-backend/internal/controller/http/search"

	"go.uber.org/fx"
)

func main() {
	fx.New(
		config.Module,
		database.Module,
		taskPersistence.Module,
		http.Module,
		taskUseCase.Module,
		taskController.Module,
		searchController.Module,
	).Run()
}
