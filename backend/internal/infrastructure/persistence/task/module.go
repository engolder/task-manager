package task

import (
	domainTask "tasklist-backend/internal/domain/task"

	"go.uber.org/fx"
)

var Module = fx.Module("persistence.task",
	fx.Provide(
		fx.Annotate(
			New,
			fx.As(new(domainTask.Repository)),
		),
	),
)
