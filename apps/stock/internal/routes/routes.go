package routes

import (
	"database/sql"
	"html/template"
	"io"
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
)

type CustomContext struct {
	echo.Context
	Store *sessions.CookieStore
	DB    *sql.DB
}

type Template struct {
	Templates *template.Template
}

func (t *Template) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	if viewContext, isMap := data.(map[string]interface{}); isMap {
		viewContext["reverse"] = c.Echo().Reverse
	}

	return t.Templates.ExecuteTemplate(w, name, data)
}


func SearchGet(c echo.Context) error {
	return c.Render(http.StatusOK, "search.html", map[string]interface{}{})
}

