package routes

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func RootGet(c echo.Context) error {
	return c.String(http.StatusOK, "root get")
}
