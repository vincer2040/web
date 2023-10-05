package api

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

func GetOverview(company string, apikey string) (*Overview, error) {
	url := fmt.Sprintf(
		"https://www.alphavantage.co/query?function=OVERVIEW&symbol=%s&apikey=%s",
		strings.ToUpper(company), apikey)
	var overview Overview

	response, err := http.Get(url)
	if err != nil {
		return nil, err
	}

	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(body, &overview)
	if err != nil {
		return nil, err
	}

	return &overview, nil
}

func GetIncomeStatements(company string, apikey string) (*IncomeStatements, error) {
	url := fmt.Sprintf(
		"https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=%s&apikey=%s",
		strings.ToUpper(company), apikey)
	var incomeStatements IncomeStatements

	response, err := http.Get(url)
	if err != nil {
		return nil, err
	}

	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(body, &incomeStatements)
	if err != nil {
		return nil, err
	}

	return &incomeStatements, nil
}

func GetBalanceSheet(company string, apikey string) (*BalanceSheet, error) {
	url := fmt.Sprintf(
		"https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=%s&apikey=%s",
		strings.ToUpper(company), apikey)
	var balanceSheet BalanceSheet

	response, err := http.Get(url)
	if err != nil {
		return nil, err
	}

	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(body, &balanceSheet)
	if err != nil {
		return nil, err
	}

	return &balanceSheet, nil
}
