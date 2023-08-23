package routes

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"net/http"
	"os"
	"stock/internal/api"
	"strings"

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

