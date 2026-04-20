package search

import "go.uber.org/fx"

var Module = fx.Module("controller.http.search",
	fx.Provide(NewHandler),
	fx.Invoke(RegisterRoutes),
)
