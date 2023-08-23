package utils

import(
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "stock/internal/api"
)


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

