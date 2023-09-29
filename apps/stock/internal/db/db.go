package db

import (
	"context"
	"database/sql"
	"fmt"
	"os"
	"vincer2040/stock/internal/user"

	_ "github.com/libsql/libsql-client-go/libsql"
	_ "modernc.org/sqlite"
)

func exec(ctx context.Context, db *sql.DB, stmt string, args ...any) (sql.Result, error) {
	res, err := db.ExecContext(ctx, stmt, args...)
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to execute statement %s: %s\n", stmt, err)
		return nil, err
	}
	return res, nil
}

func CreateUserTable(db *sql.DB) error {
	ctx := context.Background()
	_, err := exec(ctx, db, "CREATE TABLE IF NOT EXISTS users(first TEXT, last TEXT, email TEXT, password TEXT, PRIMARY KEY(email))")
	if err != nil {
		return err
	}
	return nil
}

func InsertNewUser(db *sql.DB, user *user.User) error {
	ctx := context.Background()
	newUserStatementPositionalArgs := "INSERT INTO users(first, last, email, password) VALUES(?, ?, ?, ?)"
	_, err := exec(ctx, db, newUserStatementPositionalArgs, user.First, user.Last, user.Email, user.Password)
	if err != nil {
		return err
	}
	return nil
}

func GetUserInfoFromEmail(db *sql.DB, email string) (*user.UserInfo, error) {
	var userInfo user.UserInfo
	query := "SELECT first, last, email FROM users WHERE email = ?"
	row := db.QueryRow(query, email)
	err := row.Scan(&userInfo.First, &userInfo.Last, &userInfo.Email)
	if err != nil {
		return nil, err
	}
	return &userInfo, nil
}

func GetUserFromEmail(db *sql.DB, email string) (*user.User, error) {
	var user user.User
	query := "SELECT * FROM users WHERE email = ?"
	row := db.QueryRow(query, email)
	err := row.Scan(&user.First, &user.Last, &user.Email, &user.Password)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func ResetUsersTable(db *sql.DB) error {
	ctx := context.Background()
	_, err := exec(ctx, db, "DELETE FROM users")
	if err != nil {
		return err
	}
	return nil
}
