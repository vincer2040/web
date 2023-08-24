package routes

import (
	// "context"
	"fmt"
	"html/template"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"strings"

	"stock/internal/utils"

	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
	// "google.golang.org/api/oauth2/v2"
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

	overview, err := utils.GetOverview(symbol, alphavantage)
	if err != nil {
		return err
	}

	income, err := utils.GetIncome(symbol, alphavantage)
	fmt.Println(income.Symbol)

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

	balance, err := utils.GetBalance(symbol, alphavantage)
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
		"Income":   income.AnnualReports,
		"Balance":  balance.AnnualReports,
	})
}

func LoadApi(c echo.Context) error {
	symbol := c.FormValue("search")
	return c.Render(http.StatusOK, "loader.html", map[string]interface{}{
		"symbol": symbol,
	})
}

func GoogleAuth(c echo.Context) error {

    // ctx := context.Background()

    // oauth2Service, err := oauth2.NewService(ctx)

    clientId := c.FormValue("clientId")
    credential := c.FormValue("credential")
    GCSRFToken := c.FormValue("g_csrf_token")

    fmt.Println("clientID:", clientId)
    fmt.Println("credential:", credential)
    fmt.Println("g_csrf_token:", GCSRFToken)

    cookie, err := c.Cookie("g_csrf_token")
    if err != nil {
        fmt.Println(err)
        return err
    }

    fmt.Println("cookie:", cookie.Value)

    body, err := ioutil.ReadAll(c.Request().Body)
    if err != nil {
        fmt.Println(err)
        return err
    }

    fmt.Println(string(body))

    return c.String(http.StatusOK, "ok")
}

func EmailSignUp(c echo.Context) error {
    name := c.FormValue("name")
    email := c.FormValue("email")
    pw := c.FormValue("pw")
    repeat := c.FormValue("repeat")

    if pw != repeat {
        return c.String(http.StatusOK, "passwords do not match")
    }

    hashed, err := bcrypt.GenerateFromPassword([]byte(pw), bcrypt.DefaultCost)
    if err != nil {
        return err
    }

    fmt.Println("hashed pw:", hashed)

    err = bcrypt.CompareHashAndPassword(hashed, []byte(pw))
    if err != nil {
        return c.String(http.StatusOK, "could not make password secure")
    }

    fmt.Println(name, email, pw, repeat)
    return c.String(http.StatusOK, "ok")
}
