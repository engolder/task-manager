package task

import (
	"go.uber.org/fx"
)

var Module = fx.Module("persistence.task",
	fx.Provide(New),
)
