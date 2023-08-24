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
        Templates: template.Must(template.ParseGlob("public/views/*.html")),
    }

    e := echo.New()

    e.Renderer = t

    e.Use(middleware.Logger())

    e.Static("/", "public/static")
    e.GET("/api/load", routes.LoadApi)
    e.GET("/search/:search", routes.StockApiGet)
    e.POST("/googleauth", routes.GoogleAuth)
    e.POST("/email/signup", routes.EmailSignUp)

    e.Logger.Fatal(e.Start(":6969"))
}
