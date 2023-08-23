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
	symbol := c.Param("search")

    println(symbol)

	overview, err := utils.GetOverview(symbol, alphavantage)
	if err != nil {
		return err
	}

	// income, err := utils.GetIncome(symbol, alphavantage)
	// fmt.Println(income.Symbol)

	formatedEbitda, err := utils.FormatCurrency(overview.EBITDA)
	if err != nil {
		return err
	}

	formatedMarketCap, err := utils.FormatCurrency(overview.MarketCapitalization)
	if err != nil {
		return err
	}

	formatedDivYield, err := utils.FormatPercent(overview.DividendYield)
	if err != nil {
		return err
	}

	return c.Render(http.StatusOK, "search.html", map[string]interface{}{
		"symbol":   overview.Symbol,
		"name":     overview.Name,
		"sector":   strings.ToLower(overview.Sector),
		"industry": strings.ToLower(overview.Industry),
		"address":  strings.ToLower(overview.Address),
		"mc":       formatedMarketCap,
		"ebitda":   formatedEbitda,
		"pe":       overview.PERatio,
		"book":     overview.BookValue,
		"dps":      overview.DividendPerShare,
		"dy":       formatedDivYield,
		"ete":      overview.EVToEBITDA,
	})
}

func LoadApi(c echo.Context) error {
	symbol := c.FormValue("search")
	html := fmt.Sprintf("<div class=\"loader\" hx-get=\"api/search/%s\" hx-trigger=\"load\" hx-target=\"#stock\"></div>", symbol)
	return c.HTML(http.StatusOK, html)
}
