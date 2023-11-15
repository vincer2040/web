package routes

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func Hello(c echo.Context) error {
    return c.String(http.StatusOK, "hello")
}

func Count(c echo.Context) error {
    return c.Render(http.StatusOK, "count.html", map[string]interface{}{
        "Count": 1,
    })
}
