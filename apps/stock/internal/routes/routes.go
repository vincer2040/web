package routes

import (
	"fmt"
	"html/template"
	"io"
	"net/http"
	"os"
	"strings"

	"stock/internal/utils"

	"github.com/labstack/echo/v4"
)

type Template struct {
    Templates *template.Template
}

func (t *Template) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	if viewContext, isMap := data.(map[string]interface{}); isMap {
		viewContext["reverse"] = c.Echo().Reverse
	}

	return t.Templates.ExecuteTemplate(w, name, data)
}

func StockApiGet(c echo.Context) error {
	alphavantage := os.Getenv("ALPHAVANTAGE")
	symbol := c.FormValue("search")

    overview, err := utils.GetOverview(symbol, alphavantage)
    if err != nil {
        return err
    }

    income, err := utils.GetIncome(symbol, alphavantage)
    fmt.Println(income.Symbol)

    return c.Render(http.StatusOK, "search.html", map[string]interface{}{
        "symbol": overview.Symbol,
        "name": overview.Name,
        "sector": strings.ToLower(overview.Sector),
        "industry": strings.ToLower(overview.Industry),
        "address": strings.ToLower(overview.Address),
        "ebitda": overview.EBITDA,
        "pe": overview.PERatio,
        "book": overview.BookValue,
        "dps": overview.DividendPerShare,
        "dy": overview.DividendYield,
        "ete": overview.EVToEBITDA,
    })
}

