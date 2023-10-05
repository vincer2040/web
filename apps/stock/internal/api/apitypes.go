package api

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
