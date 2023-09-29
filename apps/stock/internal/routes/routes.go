package routes

import (
	"database/sql"
	"net/http"
	"vincer2040/stock/internal/db"
	"vincer2040/stock/internal/user"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
)

type CustomContext struct {
	echo.Context
	Store *sessions.CookieStore
	DB    *sql.DB
}

func AuthEmail(c echo.Context) error {

	cc := c.(*CustomContext)

	mydb := cc.DB

	email := c.FormValue("email")
	password := c.FormValue("password")

	user, err := db.GetUserFromEmail(mydb, email)
	if err != nil {
		return err
	}

	isAuthed, err := user.Validate(password)

	if err != nil {
		return err
	}

	if !isAuthed {
		return c.HTML(http.StatusOK, "wrong email or password")
	}

	session, _ := cc.Store.Get(c.Request(), "auth")
	session.Values["authenticated"] = true
	session.Values["name"] = user.First
	session.Save(c.Request(), c.Response())

	return c.HTML(http.StatusOK, "successfully logged in")
}

func SignupEmail(c echo.Context) error {

	cc := c.(*CustomContext)

	mydb := cc.DB

	first := c.FormValue("first-name")
	last := c.FormValue("last-name")
	email := c.FormValue("email")
	password := c.FormValue("password")
	repeat := c.FormValue("repeat-password")

	if repeat != password {
		c.String(http.StatusBadRequest, "passwords do not match")
	}

	user, err := user.New(first, last, email, password)
	if err != nil {
		return err
	}

	db.InsertNewUser(mydb, user)

	return c.HTML(http.StatusOK, "you have successfully signed up")
}

func Me(c echo.Context) error {
	cc := c.(*CustomContext)

	store := cc.Store

	session, _ := store.Get(c.Request(), "auth")

	name, ok := session.Values["name"].(string)

	if !ok {
		return c.HTML(http.StatusOK, "no name")
	}

	return c.HTML(http.StatusOK, name)
}
