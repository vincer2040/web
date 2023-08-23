package routes

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"stock/internal/api"

	"github.com/labstack/echo/v4"
)

func StockApiGet(c echo.Context) error {
    alphavantage := os.Getenv("ALPHAVANTAGE")
    symbol := c.FormValue("search")
    url := fmt.Sprintf("https://www.alphavantage.co/query?function=OVERVIEW&symbol=%s&apikey=%s", symbol, alphavantage)

    resp, err := http.Get(url)
    if err != nil {
        return err
    }

    defer resp.Body.Close()
    body, err := io.ReadAll(resp.Body)
    if err != nil {
        return err
    }

    var overview api.CompanyOverview
    err = json.Unmarshal(body, &overview)
    if err != nil {
        fmt.Println("Error:", err)
        return err
    }

    fmt.Println("symbol:", overview.Symbol)
    return c.String(http.StatusOK, "ok")
}
