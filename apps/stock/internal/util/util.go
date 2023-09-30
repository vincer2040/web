package util

import (
	"crypto/rand"
	"encoding/hex"
)

func GenerateRandomKey(length int) (string, error) {
	key := make([]byte, length)
	_, err := rand.Read(key)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(key), nil
}

func ShouldResetUserTable(args []string) bool {
	should := false
	for _, a := range args {
		if a == "--reset" {
			should = true
			break
		}
	}

	return should
}

