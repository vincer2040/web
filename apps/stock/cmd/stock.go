package main

import (
	"html/template"
	"vincer2040/stock/internal/appmiddleware"
	"vincer2040/stock/internal/db"
	"vincer2040/stock/internal/routes"
	"vincer2040/stock/internal/util"

	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	_ "github.com/libsql/libsql-client-go/libsql"
	_ "modernc.org/sqlite"

	"database/sql"
	"fmt"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	err := godotenv.Load()
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to load .env %s\n", err)
		os.Exit(1)
	}

	alphavantageKey := os.Getenv("ALPHA_VANTAGE")
    dbUrl := os.Getenv("DB_URL")

	symbols, names := util.GetCompanyTickers()

	mydb, err := sql.Open("libsql", dbUrl)
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to open db %s: %s\n", dbUrl, err)
		os.Exit(1)
	}

	defer mydb.Close()

	err = db.CreateUserTable(mydb)
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to create user table %s\n", err)
		os.Exit(1)
	}

	resetUserTable := util.ShouldResetUserTable(os.Args[1:])

	if resetUserTable {
		fmt.Println("resetting user db")
		err = db.ResetUsersTable(mydb)
		if err != nil {
			fmt.Fprintf(os.Stderr, "failed to reset user table %s\n", err)
			os.Exit(1)
		}
	} else {
		fmt.Println("not resetting user table")
	}

	key, err := util.GenerateRandomKey(32)

	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to generate random key %s\n", err)
		os.Exit(1)
	}

	store := sessions.NewCookieStore([]byte(key))

	t := &routes.Template{
		Templates: template.Must(template.ParseGlob("public/views/*.html")),
	}

	e.Renderer = t

	e.Use(appmiddleware.CustomContextMiddleware(mydb, store, symbols, names, alphavantageKey))

	e.Use(middleware.Logger())

	e.Static("/", "public/static")
	e.Static("/signup", "public/static/signup")

	e.GET("/signin", routes.SigninGet, appmiddleware.IsAlreadyAuthenticated)
	e.POST("/auth/email", routes.AuthEmail)
	e.POST("/signup/email", routes.SignupEmail)
	e.GET("/me", routes.Me, appmiddleware.IsAuthenticated)
	e.POST("/logout", routes.Logout)
	e.GET("/logout", routes.Logout)
	e.GET("/search", routes.SearchGet /*appmiddleware.IsAuthenticated*/)
	e.POST("/search", routes.SearchPost)
	e.GET("/search/:symbol", routes.StockGet)

	e.Logger.Fatal(e.Start(":6969"))
}
