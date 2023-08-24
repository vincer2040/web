package utils

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"stock/internal/api"
	"strconv"
)

func FormatCurrency(currency string) (string, error) {
	if currency == "" {
		return "0.00", nil
	}
	numberRep, err := strconv.ParseFloat(currency, 64)
	if err != nil {
		fmt.Println("error parsing currency: ", err)
		return "", err
	}

	switch {
	case numberRep >= 1e12:
		return fmt.Sprintf("$%.2fT", numberRep/1e11), nil
	case numberRep >= 1e9:
		return fmt.Sprintf("$%.2fB", numberRep/1e9), nil
	case numberRep >= 1e6:
		return fmt.Sprintf("$%.2fM", numberRep/1e6), nil
	case numberRep >= 1e3:
		return fmt.Sprintf("$%.2fk", numberRep/1e3), nil
	default:
		return fmt.Sprintf("$%.2f", numberRep), nil
	}
}

func FormatPercent(percentString string) (string, error) {
	if percentString == "" {
		return "0.00", nil
	}
	numberRep, err := strconv.ParseFloat(percentString, 64)
	if err != nil {
		fmt.Println("error parsing percent: ", err)
		return "", err
	}

	percent := numberRep * 100

	return fmt.Sprintf("%.2f%%", percent), nil
}

func GetOverview(symbol string, alphavantage string) (api.CompanyOverview, error) {
	url := fmt.Sprintf("https://www.alphavantage.co/query?function=OVERVIEW&symbol=%s&apikey=%s", symbol, alphavantage)

	resp, err := http.Get(url)
	if err != nil {
		return api.CompanyOverview{}, err
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return api.CompanyOverview{}, err
	}

	var overview api.CompanyOverview
	err = json.Unmarshal(body, &overview)
	if err != nil {
		fmt.Println("Error:", err)
		return api.CompanyOverview{}, err
	}

	return overview, nil
}

func GetIncome(symbol string, alphavantage string) (api.IncomeStatement, error) {
	url := fmt.Sprintf("https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=%s&apikey=%s", symbol, alphavantage)

	resp, err := http.Get(url)
	if err != nil {
		return api.IncomeStatement{}, err
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return api.IncomeStatement{}, err
	}

	var income api.IncomeStatement
	err = json.Unmarshal(body, &income)
	if err != nil {
		fmt.Println("Error:", err)
		return api.IncomeStatement{}, err
	}

	return income, nil
}

func GetBalance(symbol string, alphavantage string) (api.BalanceSheet, error) {
	url := fmt.Sprintf("https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=%s&apikey=%s", symbol, alphavantage)

	resp, err := http.Get(url)
	if err != nil {
		return api.BalanceSheet{}, err
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return api.BalanceSheet{}, err
	}

	var balance api.BalanceSheet
	err = json.Unmarshal(body, &balance)
	if err != nil {
		fmt.Println("Error:", err)
		return api.BalanceSheet{}, err
	}

	return balance, nil
}
