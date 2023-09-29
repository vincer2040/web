package user

import (
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	First    string
	Last     string
	Email    string
	Password string
}

type UserInfo struct {
	First string
	Last  string
	Email string
}

func New(first string, last string, email string, password string) (*User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	return &User{
		First:    first,
		Last:     last,
		Email:    email,
		Password: string(hashedPassword),
	}, nil
}

func (user *User) Validate(password string) (bool, error) {
	stored := user.Password
	err := bcrypt.CompareHashAndPassword([]byte(stored), []byte(password))
	if err == nil {
		return true, nil
	} else if err == bcrypt.ErrMismatchedHashAndPassword {
		return false, nil
	} else {
		return false, err
	}
}
