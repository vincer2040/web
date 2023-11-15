package cmd

import (
	"io"
	"text/template"
	"vincer2040/chess/internal/routes"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Template struct {
	templates *template.Template
}

func (t *Template) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	return t.templates.ExecuteTemplate(w, name, data)
}

func NewTemplates() *Template {
	return &Template{
		templates: template.Must(template.ParseGlob("views/templates/*.html")),
	}
}

func Server() {

	e := echo.New()

    e.Renderer = NewTemplates()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.Static("/", "views/static")
	e.Static("/styles", "views/styles")
    e.GET("/count", routes.Count)
	e.Logger.Fatal(e.Start(":6969"))
}
