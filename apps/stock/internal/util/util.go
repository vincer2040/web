package util

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
	"strings"
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

type TickerData struct {
	CikStr int    `json:"cik_str"`
	Ticker string `json:"ticker"`
	Title  string `json:"title"`
}

type TickerMap map[string]TickerData

type Ticker struct {
	Symbol string
	Name   string
}

func GetCompanyTickers() ([]string, []string) {
	url := "https://www.sec.gov/files/company_tickers.json"

	var tickers []string
	var names []string

	response, err := http.Get(url)
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to get tickers %s\n", err)
		os.Exit(1)
	}

	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to read full body %s\n", err)
		os.Exit(1)
	}

	var data TickerMap

	err = json.Unmarshal(body, &data)
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to unmarshal ticker data %s\n", err)
		os.Exit(1)
	}

	for _, value := range data {
		nameLower := strings.ToLower(value.Title)
		tickers = append(tickers, value.Ticker)
		names = append(names, nameLower)
	}

	return tickers, names
}

func FormatCurrency(value string) (*string, error) {
	val, err := strconv.ParseFloat(value, 64)
	suffix := ""
	if err != nil {
		return nil, err
	}
	switch {
	case val >= 1e12:
		val /= 1e12
		suffix = "T"
	case val >= 1e9:
		val /= 1e9
		suffix = "B"
	case val >= 1e6:
		val /= 1e6
		suffix = "M"
	}

	res := fmt.Sprintf("$%.1f%s", val, suffix)

	return &res, nil
}

func FormatPercent(value string) (*string, error) {
	val, err := strconv.ParseFloat(value, 64)
	if err != nil {
		return nil, err
	}
	val *= 100
	res := fmt.Sprintf("%.2f%%", val)
	return &res, nil
}

func FormatSmallCurrency(value string) (*string, error) {
	val, err := strconv.ParseFloat(value, 64)
	if err != nil {
		return nil, err
	}
	res := fmt.Sprintf("$%.2f", val)
	return &res, nil
}

func FormatLargeNumber(value string) (*string, error) {
	val, err := strconv.ParseFloat(value, 64)
	suffix := ""
	if err != nil {
		return nil, err
	}
	switch {
	case val >= 1e12:
		val /= 1e12
		suffix = "T"
	case val >= 1e9:
		val /= 1e9
		suffix = "B"
	case val >= 1e6:
		val /= 1e6
		suffix = "M"
	}

	res := fmt.Sprintf("%.1f%s", val, suffix)

	return &res, nil
}
