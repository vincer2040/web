package main

import (
	"html/template"
	"log"

	"stock/internal/routes"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github.com/joho/godotenv"
)

func main() {

    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

    t := &routes.Template{
        Templates: template.Must(template.ParseGlob("public/views/search.html")),
    }

    e := echo.New()

    e.Renderer = t

    e.Use(middleware.Logger())

    e.Static("/", "static")
    e.GET("/api/search", routes.StockApiGet)

    e.Logger.Fatal(e.Start(":6969"))
}
