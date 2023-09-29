package main

import (
	// routes "vincer2040/stock/internal"

	"github.com/labstack/echo/v4"
)

func main() {

    e := echo.New()

    e.Static("/", "public/static")

    e.Logger.Fatal(e.Start(":6969"))
}
