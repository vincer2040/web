package cmd

import (
	"vincer2040/chess/internal/routes"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func Server() {

    e := echo.New();

    e.Use(middleware.Logger())
    e.Use(middleware.Recover())

    e.GET("/", routes.Hello)
    e.Logger.Fatal(e.Start(":6969"))
}
