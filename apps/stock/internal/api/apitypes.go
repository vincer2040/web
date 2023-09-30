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
