package routes

import (
	"database/sql"
	"fmt"
	"html/template"
	"io"
	"net/http"
	"strings"
	"vincer2040/stock/internal/api"
	"vincer2040/stock/internal/util"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
)

type CustomContext struct {
	echo.Context
	Store        *sessions.CookieStore
	DB           *sql.DB
	Symbols      []string
	Names        []string
	AlphaVantage string
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

func SearchPost(c echo.Context) error {

	symbol := c.FormValue("stock")

	return c.Render(http.StatusOK, "initsearch.html", map[string]interface{}{
		"Search": fmt.Sprintf("/search/%s", symbol),
	})
}

func StockGet(c echo.Context) error {
	cc := c.(*CustomContext)

	symbol := c.Param("symbol")
	apiKey := cc.AlphaVantage

	overview, err := api.GetOverview(symbol, apiKey)
	if err != nil {
		return err
	}

	marketCap, err := util.FormatCurrency(overview.MarketCapitalization)
	if err != nil {
		return err
	}

	divYield, err := util.FormatPercent(overview.DividendYield)
	if err != nil {
		return err
	}

	divPerShare, err := util.FormatSmallCurrency(overview.DividendPerShare)
	if err != nil {
		return err
	}

	sharesOutstanding, err := util.FormatLargeNumber(overview.SharesOutstanding)
	if err != nil {
		return err
	}

	return c.Render(http.StatusOK, "stock.html", map[string]interface{}{
		"Name":              overview.Name,
		"Sector":            strings.ToLower(overview.Sector),
		"Industry":          strings.ToLower(overview.Industry),
		"MarketCap":         marketCap,
		"BookValue":         overview.BookValue,
		"EPS":               overview.EPS,
		"PE":                overview.PERatio,
		"EVEBITDA":          overview.EVToEBITDA,
		"SharesOutstanding": sharesOutstanding,
		"DivPerShare":       divPerShare,
		"DivYield":          divYield,
	})
}
