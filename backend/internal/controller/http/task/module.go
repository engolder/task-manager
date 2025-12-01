package task

import "go.uber.org/fx"

var Module = fx.Module("controller.http.task",
	fx.Provide(NewHandler),
	fx.Invoke(RegisterRoutes),
)
