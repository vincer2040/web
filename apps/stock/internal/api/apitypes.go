package api

import "vincer2040/stock/internal/util"

type Overview struct {
	Symbol                     string
	AssetType                  string
	Name                       string
	Description                string
	CIK                        string
	Exchange                   string
	Currency                   string
	Country                    string
	Sector                     string
	Industry                   string
	Address                    string
	FiscalYearEnd              string
	LatestQuarter              string
	MarketCapitalization       string
	EBITDA                     string
	PERatio                    string
	PEGRatio                   string
	BookValue                  string
	DividendPerShare           string
	DividendYield              string
	EPS                        string
	RevenuePerShareTTM         string
	ProfitMargin               string
	OperatingMarginTTM         string
	ReturnOnAssetsTTM          string
	ReturnOnEquityTTM          string
	RevenueTTM                 string
	GrossProfitTTM             string
	DilutedEPSTTM              string
	QuarterlyEarningsGrowthYOY string
	QuarterlyRevenueGrowthYOY  string
	AnalystTargetPrice         string
	TrailingPE                 string
	ForwardPE                  string
	PriceToSalesRatioTTM       string
	PriceToBookRatio           string
	EVToRevenue                string
	EVToEBITDA                 string
	Beta                       string
	FiftyTwoWeekHigh           string `json:"52WeekHigh"`
	FiftyTwoWeekLow            string `json:"52WeekLow"`
	FiftyTwoDayMovingAverage   string `json:"50DayMovingAverage"`
	TwoHundredDayMovingAverage string `json:"200DayMovingAverage"`
	SharesOutstanding          string
	DividendDate               string
	ExDividendDate             string
}

type IncomeStatementItem struct {
	FiscalDateEnding                  string `json:"fiscalDateEnding"`
	ReportedCurrency                  string `json:"reportedCurrency"`
	GrossProfit                       string `json:"grossProfit"`
	TotalRevenue                      string `json:"totalRevenue"`
	CostOfRevenue                     string `json:"costOfRevenue"`
	CostofGoodsAndServicesSold        string `json:"costofGoodsAndServicesSold"`
	OperatingIncome                   string `json:"operatingIncome"`
	SellingGeneralAndAdministrative   string `json:"sellingGeneralAndAdministrative"`
	ResearchAndDevelopment            string `json:"researchAndDevelopment"`
	OperatingExpenses                 string `json:"operatingExpenses"`
	InvestmentIncomeNet               string `json:"investmentIncomeNet"`
	NetInterestIncome                 string `json:"netInterestIncome"`
	InterestIncome                    string `json:"interestIncome"`
	InterestExpense                   string `json:"interestExpense"`
	NonInterestIncome                 string `json:"nonInterestIncome"`
	OtherNonOperatingIncome           string `json:"otherNonOperatingIncome"`
	Depreciation                      string `json:"depreciation"`
	DepreciationAndAmortization       string `json:"depreciationAndAmortization"`
	IncomeBeforeTax                   string `json:"incomeBeforeTax"`
	IncomeTaxExpense                  string `json:"incomeTaxExpense"`
	InterestAndDebtExpense            string `json:"interestAndDebtExpense"`
	NetIncomeFromContinuingOperations string `json:"netIncomeFromContinuingOperations"`
	ComprehensiveIncomeNetOfTax       string `json:"comprehensiveIncomeNetOfTax"`
	Ebit                              string `json:"ebit"`
	Ebitda                            string `json:"ebitda"`
	NetIncome                         string `json:"netIncome"`
}

type IncomeStatements struct {
	Symbol           string                `json:"symbol"`
	AnnualReports    []IncomeStatementItem `json:"annualReports"`
	QuarterlyReports []IncomeStatementItem `json:"quarterlyReports"`
}

func (is *IncomeStatements) ExtractDates() ([]int, error) {
	var dates []int

	for i := range is.AnnualReports {
		year, err := util.ExtractYear(is.AnnualReports[i].FiscalDateEnding)
		if err != nil {
			return nil, err
		}

		dates = append(dates, *year)
	}

    util.ReverseInts(dates)
	return dates, nil
}

func (is *IncomeStatements) GetTotalRevenues() []string {
	var revenues []string

	for i := range is.AnnualReports {
		rev := is.AnnualReports[i].TotalRevenue

		revenues = append(revenues, rev)
	}

    util.Reverse(revenues)
	return revenues
}

func (is *IncomeStatements) GetOperatingIncomes() []string {
	var operatingIncomes []string

	for i := range is.AnnualReports {
		rev := is.AnnualReports[i].OperatingIncome

		operatingIncomes = append(operatingIncomes, rev)
	}

    util.Reverse(operatingIncomes)
	return operatingIncomes
}

func (is *IncomeStatements) GetNetIncomes() []string {
	var netIncomes []string

	for i := range is.AnnualReports {
		rev := is.AnnualReports[i].NetIncome

		netIncomes = append(netIncomes, rev)
	}

    util.Reverse(netIncomes)
	return netIncomes
}

type BalaceSheetItem struct {
	FiscalDateEnding                       string `json:"fiscalDateEnding"`
	ReportedCurrency                       string `json:"reportedCurrency"`
	TotalAssets                            string `json:"totalAssets"`
	TotalCurrentAssets                     string `json:"totalCurrentAssets"`
	CashAndCashEquivalentsAtCarryingValue  string `json:"cashAndCashEquivalentsAtCarryingValue"`
	CashAndShortTermInvestments            string `json:"cashAndShortTermInvestments"`
	Inventory                              string `json:"inventory"`
	CurrentNetReceivables                  string `json:"currentNetReceivables"`
	TotalNonCurrentAssets                  string `json:"totalNonCurrentAssets"`
	PropertyPlantEquipment                 string `json:"propertyPlantEquipment"`
	AccumulatedDepreciationAmortizationPPE string `json:"accumulatedDepreciationAmortizationPPE"`
	IntangibleAssets                       string `json:"intangibleAssets"`
	IntangibleAssetsExcludingGoodwill      string `json:"intangibleAssetsExcludingGoodwill"`
	Goodwill                               string `json:"goodwill"`
	Investments                            string `json:"investments"`
	LongTermInvestments                    string `json:"longTermInvestments"`
	ShortTermInvestments                   string `json:"shortTermInvestments"`
	OtherCurrentAssets                     string `json:"otherCurrentAssets"`
	OtherNonCurrentAssets                  string `json:"otherNonCurrentAssets"`
	TotalLiabilities                       string `json:"totalLiabilities"`
	TotalCurrentLiabilities                string `json:"totalCurrentLiabilities"`
	CurrentAccountsPayable                 string `json:"currentAccountsPayable"`
	DeferredRevenue                        string `json:"deferredRevenue"`
	CurrentDebt                            string `json:"currentDebt"`
	ShortTermDebt                          string `json:"shortTermDebt"`
	TotalNonCurrentLiabilities             string `json:"totalNonCurrentLiabilities"`
	CapitalLeaseObligations                string `json:"capitalLeaseObligations"`
	LongTermDebt                           string `json:"longTermDebt"`
	CurrentLongTermDebt                    string `json:"currentLongTermDebt"`
	LongTermDebtNoncurrent                 string `json:"longTermDebtNoncurrent"`
	ShortLongTermDebtTotal                 string `json:"shortLongTermDebtTotal"`
	OtherCurrentLiabilities                string `json:"otherCurrentLiabilities"`
	OtherNonCurrentLiabilities             string `json:"otherNonCurrentLiabilities"`
	TotalShareholderEquity                 string `json:"totalShareholderEquity"`
	TreasuryStock                          string `json:"treasuryStock"`
	RetainedEarnings                       string `json:"retainedEarnings"`
	CommonStock                            string `json:"commonStock"`
	CommonStockSharesOutstanding           string `json:"commonStockSharesOutstanding"`
}

type BalanceSheet struct {
	Symbol           string            `json:"symbol"`
	AnnualReports    []BalaceSheetItem `json:"annualReports"`
	QuarterlyReports []BalaceSheetItem `json:"quarterlyReports"`
}

func (bs *BalanceSheet) GetCash() []string {
    var cash []string

    for i := range bs.AnnualReports {
        c := bs.AnnualReports[i].CashAndCashEquivalentsAtCarryingValue
        cash = append(cash, c)
    }

    util.Reverse(cash)
    return cash
}

func (bs *BalanceSheet) GetTotalAssets() []string {
    var assets []string

    for i := range bs.AnnualReports {
        a := bs.AnnualReports[i].TotalAssets
        assets = append(assets, a)
    }

    util.Reverse(assets)
    return assets
}

func (bs *BalanceSheet) GetLongTermDebt() []string {
    var longTermDebt []string

    for i := range bs.AnnualReports {
        ltd := bs.AnnualReports[i].LongTermDebt
        longTermDebt = append(longTermDebt, ltd)
    }

    util.Reverse(longTermDebt)
    return longTermDebt
}
