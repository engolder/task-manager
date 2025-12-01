package task

import "go.uber.org/fx"

var Module = fx.Module("usecase.task",
	fx.Provide(New),
)
