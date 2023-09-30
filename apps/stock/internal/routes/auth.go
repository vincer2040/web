package routes

import (
	"net/http"
	"vincer2040/stock/internal/db"
	"vincer2040/stock/internal/user"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
)

func SigninGet(c echo.Context) error {
	return c.Render(http.StatusOK, "signin.html", map[string]interface{}{})
}

func createSession(session *sessions.Session, user *user.User, req *http.Request, res *echo.Response) {
	session.Values["authenticated"] = true
	session.Values["first"] = user.First
	session.Values["email"] = user.Email
	session.Save(req, res)
}

func AuthEmail(c echo.Context) error {

	cc := c.(*CustomContext)

	store := cc.Store

	session, _ := store.Get(c.Request(), "auth")

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

	createSession(session, user, c.Request(), c.Response())

	return c.Redirect(http.StatusSeeOther, "/search")
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

	first, ok := session.Values["first"].(string)
	email, ok := session.Values["email"].(string)

	if !ok {
		return c.HTML(http.StatusOK, "no name")
	}

	return c.Render(http.StatusOK, "me.html", map[string]interface{}{
		"name":  first,
		"email": email,
	})
}

func Logout(c echo.Context) error {
    cc := c.(*CustomContext)

    store := cc.Store
	session, _ := store.Get(c.Request(), "auth")

    session.Values["authenticated"] = false;
    session.Values["name"] = nil;
    session.Values["email"] = nil;

    session.Save(c.Request(), c.Response())

	return c.Render(http.StatusOK, "logout.html", map[string]interface{}{})
}
