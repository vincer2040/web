package appmiddleware

import (
	"database/sql"
	"net/http"
	"vincer2040/stock/internal/routes"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
)

func CustomContextMiddleware(db *sql.DB, store *sessions.CookieStore, tickers []string, names []string, alphavantage string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cc := &routes.CustomContext{
				Context:      c,
				Store:        store,
				DB:           db,
				Symbols:      tickers,
				Names:        names,
				AlphaVantage: alphavantage,
			}
			return next(cc)
		}
	}
}

func IsAuthenticated(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		cc := c.(*routes.CustomContext)
		store := cc.Store
		session, _ := store.Get(c.Request(), "auth")
		authenticated, ok := session.Values["authenticated"].(bool)
		if !ok || authenticated == false {
			return c.Redirect(http.StatusSeeOther, "/signin")
		}
		return next(c)
	}
}

func IsAlreadyAuthenticated(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		cc := c.(*routes.CustomContext)
		store := cc.Store
		session, _ := store.Get(c.Request(), "auth")
		authenticated, ok := session.Values["authenticated"].(bool)
		if ok && authenticated == true {
			return c.Redirect(http.StatusSeeOther, "/me")
		}
		return next(c)
	}
}
