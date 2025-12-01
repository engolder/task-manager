package http

import (
	pkgHttp "tasklist-backend/pkg/http"

	"go.uber.org/fx"
)

var Module = fx.Module("http",
	fx.Provide(
		fx.Annotate(
			New,
			fx.As(new(pkgHttp.HTTPServer)),
		),
	),
)
