use axum::{
    extract::{
        State,
        Path
    },
    routing::{
        get,
        post
    },
    Router,
    response::{
        Html,
        Json,
    },
};
use serde::{
    Deserialize,
    Serialize
};
use dotenv::dotenv;
use anyhow::Result;
use std::sync::Arc;
use argon2::{
    password_hash::{
        rand_core::OsRng,
        PasswordHash, PasswordHasher, PasswordVerifier, SaltString
    },
    Argon2
};

struct AppState {
    api: Api,
}

#[derive(Deserialize, Serialize, Debug)]
struct EmailPassword {
    email: String,
    password: String,
}

trait Authenticate {
    fn authenticate(self) -> Result<bool>;
}

impl Authenticate for EmailPassword {
    fn authenticate(self) -> Result<bool> {
        let salt = SaltString::generate(&mut OsRng);
        let pbytes = self.password.as_bytes();
        let argon2 = Argon2::default();
        let hash = argon2.hash_password(pbytes, &salt).expect("argon2").to_string();
        println!("{}", hash);
        Ok(true)
    }
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    let alpha_token = std::env::var("ALPHAVANTAGE").expect("api token");
    let api = Api::new(alpha_token);

    let shared_state = Arc::new(AppState {
        api,
    });

    let app = Router::new()
        .route("/", get(root_get))
        .route("/search", get(search_get))
        .route("/signin/", get(signin_get))
        .route("/auth", post(auth_post))
        .route("/api/fundamentals/:symbol", get(api_get_fundamentals))
        .route("/api/income/:symbol", get(api_get_income))
        .route("/api/balance/:symbol", get(api_get_balance))
        .route("/api/cash/:symbol", get(api_get_cash))
        .route("/api/earnings/:symbol", get(api_get_earnings))
        .with_state(shared_state)
        .route("/api/tickers", get(api_get_ticket_list));
    println!("running: http://localhost:42069");
    axum::Server::bind(&"0.0.0.0:42069".parse().expect("address to parse"))
        .serve(app.into_make_service())
        .await
        .expect("app to serve");
}

async fn root_get() -> Html<String> {
    let file = tokio::fs::read_to_string("./apps/stock/app/index.html").await.expect("html to be read");
    Html(file)
}

async fn search_get() -> Html<String> {
    let file = tokio::fs::read_to_string("./apps/stock/app/search/index.html").await.expect("html to be read");
    Html(file)
}

async fn signin_get() -> Html<String> {
    let file = tokio::fs::read_to_string("./apps/stock/app/signin/index.html").await.expect("html to be read");
    Html(file)
}

async fn auth_post(Json(payload): Json<EmailPassword>) -> Json<bool>{
    payload.authenticate().expect("authenticate");
    Json(true)
}

async fn api_get_fundamentals(State(state): State<Arc<AppState>>, Path(symbol): Path<String>) -> Json<Fundamentals> {
    let api = &state.api;
    let symb = symbol.to_uppercase();
    let fundamentals = api.fundamentals(&symb).await.expect("yes");
    Json(fundamentals)
}

async fn api_get_income(State(state): State<Arc<AppState>>, Path(symbol): Path<String>) -> Json<Income> {
    let api = &state.api;
    let symb = symbol.to_uppercase();
    let income = api.income(&symb).await.expect("yes");
    Json(income)
}

async fn api_get_balance(State(state): State<Arc<AppState>>, Path(symbol): Path<String>) -> Json<Balance> {
    let api = &state.api;
    let symb = symbol.to_uppercase();
    let balance = api.balance_sheet(&symb).await.expect("yes");
    Json(balance)
}

async fn api_get_cash(State(state): State<Arc<AppState>>, Path(symbol): Path<String>) -> Json<CashFlow> {
    let api = &state.api;
    let symb = symbol.to_uppercase();
    let cash = api.cash_flow(&symb).await.expect("yes");
    Json(cash)
}

async fn api_get_earnings(State(state): State<Arc<AppState>>, Path(symbol): Path<String>) -> Json<Earnings> {
    let api = &state.api;
    let symb = symbol.to_uppercase();
    let earnings = api.earnings(&symb).await.expect("yes");
    Json(earnings)
}

async fn api_get_ticket_list() -> String {
    let url = "https://www.sec.gov/files/company_tickers.json";
    let body = reqwest::get(url)
        .await.expect("company_tickers")
        .text()
        .await.expect("company tickers text");
    body
}

struct Api {
    key: String,
}

impl Api {
    pub fn new(key: String) -> Self {
        Api {
            key,
        }
    }

    pub async fn fundamentals(&self, symbol: &str) -> Result<Fundamentals> {
        let url = format!("https://www.alphavantage.co/query?function=OVERVIEW&symbol={}&apikey={}", symbol, self.key);
        let body = reqwest::get(&url)
            .await?
            .json::<Fundamentals>()
            .await?;
        Ok(body)
    }

    pub async fn income(&self, symbol: &str) -> Result<Income> {
        let url = format!("https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol={}&apikey={}", symbol, self.key);
        let body = reqwest::get(&url)
            .await?
            .json::<Income>()
            .await?;
        Ok(body)
    }

    pub async fn balance_sheet(&self, symbol: &str) -> Result<Balance> {
        let url = format!("https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol={}&apikey={}", symbol, self.key);
        let body = reqwest::get(&url)
            .await?
            .json::<Balance>()
            .await?;
        Ok(body)
    }

    pub async fn cash_flow(&self, symbol: &str) -> Result<CashFlow> {
        let url = format!("https://www.alphavantage.co/query?function=CASH_FLOW&symbol={}&apikey={}", symbol, self.key);
        let body = reqwest::get(&url)
            .await?
            .json::<CashFlow>()
            .await?;
        Ok(body)
    }

    pub async fn earnings(&self, symbol: &str) -> Result<Earnings> {
        let url = format!("https://www.alphavantage.co/query?function=EARNINGS&symbol={}&apikey={}", symbol, self.key);
        let body = reqwest::get(&url)
            .await?
            .json::<Earnings>()
            .await?;
        Ok(body)
    }
}

#[derive(Debug, Deserialize, Serialize)]
struct Fundamentals {
    #[serde(rename = "Symbol")]
    symbol: String,
    #[serde(rename = "AssetType")]
    asset_type: String,
    #[serde(rename = "Name")]
    name: String,
    #[serde(rename = "Description")]
    description: String,
    #[serde(rename = "CIK")]
    cik: String,
    #[serde(rename = "Exchange")]
    exchange: String,
    #[serde(rename = "Currency")]
    currency: String,
    #[serde(rename = "Country")]
    country: String,
    #[serde(rename = "Sector")]
    sector: String,
    #[serde(rename = "Industry")]
    industry: String,
    #[serde(rename = "Address")]
    address: String,
    #[serde(rename = "FiscalYearEnd")]
    fiscal_year_end: String,
    #[serde(rename = "LatestQuarter")]
    latest_quarter: String,
    #[serde(rename = "MarketCapitalization")]
    market_capitalization: String,
    #[serde(rename = "EBITDA")]
    ebitda: String,
    #[serde(rename = "PERatio")]
    pe_ratio: String,
    #[serde(rename = "PEGRatio")]
    peg_ratio: String,
    #[serde(rename = "BookValue")]
    book_value: String,
    #[serde(rename = "DividendPerShare")]
    dividend_per_share: String,
    #[serde(rename = "DividendYield")]
    dividend_yield: String,
    #[serde(rename = "EPS")]
    eps: String,
    #[serde(rename = "RevenuePerShareTTM")]
    revenue_per_share_ttm: String,
    #[serde(rename = "ProfitMargin")]
    profit_margin: String,
    #[serde(rename = "OperatingMarginTTM")]
    operating_margin_ttm: String,
    #[serde(rename = "ReturnOnAssetsTTM")]
    return_on_assets_ttm: String,
    #[serde(rename = "ReturnOnEquityTTM")]
    return_on_equity_ttm: String,
    #[serde(rename = "RevenueTTM")]
    revenue_ttm: String,
    #[serde(rename = "GrossProfitTTM")]
    gross_profit_ttm: String,
    #[serde(rename = "DilutedEPSTTM")]
    diluted_epsttm: String,
    #[serde(rename = "QuarterlyEarningsGrowthYOY")]
    quarterly_earnings_growth_yoy: String,
    #[serde(rename = "QuarterlyRevenueGrowthYOY")]
    quarterly_revenue_growth_yoy: String,
    #[serde(rename = "AnalystTargetPrice")]
    analyst_target_price: String,
    #[serde(rename = "TrailingPE")]
    trailing_pe: String,
    #[serde(rename = "ForwardPE")]
    forward_pe: String,
    #[serde(rename = "PriceToSalesRatioTTM")]
    price_to_sales_ratio_ttm: String,
    #[serde(rename = "PriceToBookRatio")]
    price_to_book_ratio: String,
    #[serde(rename = "EVToRevenue")]
    ev_to_revenue: String,
    #[serde(rename = "EVToEBITDA")]
    ev_to_ebitda: String,
    #[serde(rename = "Beta")]
    beta: String,
    #[serde(rename = "52WeekHigh")]
    fiftytwo_week_high: String,
    #[serde(rename = "52WeekLow")]
    fiftytwo_week_low: String,
    #[serde(rename = "50DayMovingAverage")]
    fifty_day_moving_average: String,
    #[serde(rename = "200DayMovingAverage")]
    twohundred_day_moving_average: String,
    #[serde(rename = "SharesOutstanding")]
    shares_outstanding: String,
    #[serde(rename = "DividendDate")]
    dividend_date: String,
    #[serde(rename = "ExDividendDate")]
    ex_dividend_date: String
}

#[derive(Debug, Deserialize, Serialize)]
struct Income {
    symbol: String,
    #[serde(rename = "annualReports")]
    annual_reports: Vec<IncomeReport>,
    #[serde(rename = "quarterlyReports")]
    quarterly_reports: Vec<IncomeReport>,
}

#[derive(Debug, Deserialize, Serialize)]
struct IncomeReport {
    #[serde(rename = "fiscalDateEnding")]
    fiscal_date_ending: String,
    #[serde(rename = "reportedCurrency")]
    reported_currency: String,
    #[serde(rename = "grossProfit")]
    gross_profit: String,
    #[serde(rename = "totalRevenue")]
    total_revenue: String,
    #[serde(rename = "costOfRevenue")]
    cost_of_revenue: String,
    #[serde(rename = "costofGoodsAndServicesSold")]
    cost_of_goods_and_services_sold: String,
    #[serde(rename = "operatingIncome")]
    operating_income: String,
    #[serde(rename = "sellingGeneralAndAdministrative")]
    selling_general_and_administrative: String,
    #[serde(rename = "researchAndDevelopment")]
    research_and_development: String,
    #[serde(rename = "operatingExpenses")]
    operating_expenses: String,
    #[serde(rename = "investmentIncomeNet")]
    investment_income_net: String,
    #[serde(rename = "netInterestIncome")]
    net_interest_income: String,
    #[serde(rename = "interestIncome")]
    interest_income: String,
    #[serde(rename = "interestExpense")]
    interest_expense: String,
    #[serde(rename = "nonInterestIncome")]
    non_interest_income: String,
    #[serde(rename = "otherNonOperatingIncome")]
    other_non_operating_income: String,
    #[serde(rename = "depreciation")]
    depreciation: String,
    #[serde(rename = "depreciationAndAmortization")]
    depreciation_and_amortization: String,
    #[serde(rename = "incomeBeforeTax")]
    income_before_tax: String,
    #[serde(rename = "incomeTaxExpense")]
    income_tax_expense: String,
    #[serde(rename = "interestAndDebtExpense")]
    interest_and_debt_expense: String,
    #[serde(rename = "netIncomeFromContinuingOperations")]
    net_income_from_continuing_operations: String,
    #[serde(rename = "comprehensiveIncomeNetOfTax")]
    comprehensive_income_net_of_tax: String,
    #[serde(rename = "ebit")]
    ebit: String,
    #[serde(rename = "ebitda")]
    ebitda: String,
    #[serde(rename = "netIncome")]
    net_income: String,
}


#[derive(Debug, Deserialize, Serialize)]
struct Balance {
    symbol: String,
    #[serde(rename = "annualReports")]
    annual_reports: Vec<BalanceReport>,
    #[serde(rename = "quarterlyReports")]
    quarterly_reports: Vec<BalanceReport>,
}

#[derive(Debug, Deserialize, Serialize)]
struct BalanceReport {
    #[serde(rename = "fiscalDateEnding")]
    fiscal_date_ending: String,
    #[serde(rename = "reportedCurrency")]
    reported_currency: String,
    #[serde(rename = "totalAssets")]
    total_assets: String,
    #[serde(rename = "totalCurrentAssets")]
    total_current_assets: String,
    #[serde(rename = "cashAndCashEquivalentsAtCarryingValue")]
    cash_and_cash_equivalents_at_carrying_value: String,
    #[serde(rename = "cashAndShortTermInvestments")]
    cash_and_short_term_investments: String,
    #[serde(rename = "inventory")]
    inventory: String,
    #[serde(rename = "currentNetReceivables")]
    current_net_receivables: String,
    #[serde(rename = "totalNonCurrentAssets")]
    total_non_current_assets: String,
    #[serde(rename = "propertyPlantEquipment")]
    property_plant_equipment: String,
    #[serde(rename = "accumulatedDepreciationAmortizationPPE")]
    accumulated_depreciation_amortization_ppe: String,
    #[serde(rename = "intangibleAssets")]
    intangible_assets: String,
    #[serde(rename = "intangibleAssetsExcludingGoodwill")]
    intangible_assets_excluding_goodwill: String,
    #[serde(rename = "goodwill")]
    goodwill: String,
    #[serde(rename = "investments")]
    investments: String,
    #[serde(rename = "longTermInvestments")]
    long_term_investments: String,
    #[serde(rename = "shortTermInvestments")]
    short_term_investments: String,
    #[serde(rename = "otherCurrentAssets")]
    other_current_assets: String,
    #[serde(rename = "otherNonCurrentAssets")]
    other_non_current_assets: String,
    #[serde(rename = "totalLiabilities")]
    total_liabilities: String,
    #[serde(rename = "totalCurrentLiabilities")]
    total_current_liabilities: String,
    #[serde(rename = "currentAccountsPayable")]
    current_accounts_payable: String,
    #[serde(rename = "deferredRevenue")]
    deferred_revenue: String,
    #[serde(rename = "currentDebt")]
    current_debt: String,
    #[serde(rename = "shortTermDebt")]
    short_term_debt: String,
    #[serde(rename = "totalNonCurrentLiabilities")]
    total_non_current_liabilities: String,
    #[serde(rename = "capitalLeaseObligations")]
    capital_lease_obligations: String,
    #[serde(rename = "longTermDebt")]
    long_term_debt: String,
    #[serde(rename = "currentLongTermDebt")]
    current_long_term_debt: String,
    #[serde(rename = "longTermDebtNoncurrent")]
    long_term_debt_non_current: String,
    #[serde(rename = "shortLongTermDebtTotal")]
    short_long_term_debt_total: String,
    #[serde(rename = "otherCurrentLiabilities")]
    other_current_liabilities: String,
    #[serde(rename = "otherNonCurrentLiabilities")]
    other_non_current_liabilities: String,
    #[serde(rename = "totalShareholderEquity")]
    total_shareholder_equity: String,
    #[serde(rename = "treasuryStock")]
    treasury_stock: String,
    #[serde(rename = "retainedEarnings")]
    retained_earnings: String,
    #[serde(rename = "commonStock")]
    common_stock: String,
    #[serde(rename = "commonStockSharesOutstanding")]
    common_stock_shares_outstanding: String,
}

#[derive(Debug, Deserialize, Serialize)]
struct CashFlow {
    symbol: String,
    #[serde(rename = "annualReports")]
    annual_reports: Vec<CashFlowReport>,
    #[serde(rename = "quarterlyReports")]
    quarterly_reports: Vec<CashFlowReport>,
}

#[derive(Debug, Deserialize, Serialize)]
struct CashFlowReport {
    #[serde(rename = "fiscalDateEnding")]
    fiscal_date_ending: String,
    #[serde(rename = "reportedCurrency")]
    reported_currency: String,
    #[serde(rename = "operatingCashflow")]
    operating_cash_flow: String,
    #[serde(rename = "paymentsForOperatingActivities")]
    payments_for_operating_activities: String,
    #[serde(rename = "proceedsFromOperatingActivities")]
    proceeds_from_operating_activities: String,
    #[serde(rename = "changeInOperatingLiabilities")]
    change_in_operating_liabilities: String,
    #[serde(rename = "changeInOperatingAssets")]
    change_in_operating_assets: String,
    #[serde(rename = "depreciationDepletionAndAmortization")]
    depreciation_depletion_and_amortization: String,
    #[serde(rename = "capitalExpenditures")]
    capital_expenditures: String,
    #[serde(rename = "changeInReceivables")]
    change_in_receivables: String,
    #[serde(rename = "changeInInventory")]
    change_in_inventory: String,
    #[serde(rename = "profitLoss")]
    profit_loss: String,
    #[serde(rename = "cashflowFromInvestment")]
    cash_flow_from_investments: String,
    #[serde(rename = "cashflowFromFinancing")]
    cash_flow_from_financing: String,
    #[serde(rename = "proceedsFromRepaymentsOfShortTermDebt")]
    proceeds_from_repayments_of_short_term_debt: String,
    #[serde(rename = "paymentsForRepurchaseOfCommonStock")]
    payments_for_repurchase_of_common_stock: String,
    #[serde(rename = "paymentsForRepurchaseOfEquity")]
    payments_for_repurchase_of_equity: String,
    #[serde(rename = "paymentsForRepurchaseOfPreferredStock")]
    payments_for_repurchase_of_preferred_stock: String,
    #[serde(rename = "dividendPayout")]
    dividend_payout: String,
    #[serde(rename = "dividendPayoutCommonStock")]
    divident_payout_common_stock: String,
    #[serde(rename = "dividendPayoutPreferredStock")]
    dividend_payout_preferred_stock: String,
    #[serde(rename = "proceedsFromIssuanceOfCommonStock")]
    proceeds_from_issuance_of_common_stock: String,
    #[serde(rename = "proceedsFromIssuanceOfLongTermDebtAndCapitalSecuritiesNet")]
    proceeds_from_issuance_of_long_term_debt_and_capital_securities_net: String,
    #[serde(rename = "proceedsFromIssuanceOfPreferredStock")]
    proceeds_from_issuance_of_preferred_stock: String,
    #[serde(rename = "proceedsFromRepurchaseOfEquity")]
    proceeds_from_repurchase_of_equity: String,
    #[serde(rename = "proceedsFromSaleOfTreasuryStock")]
    proceeds_from_sale_of_treasury_stock: String,
    #[serde(rename = "changeInCashAndCashEquivalents")]
    change_in_cash_and_cash_equivalents: String,
    #[serde(rename = "changeInExchangeRate")]
    change_in_exchange_rate: String,
    #[serde(rename = "netIncome")]
    net_income: String,
}

#[derive(Debug, Deserialize, Serialize)]
struct Earnings {
    symbol: String,
    #[serde(rename = "annualEarnings")]
    annual_earnings: Vec<EarningsAnnualItem>,
    #[serde(rename = "quarterlyEarnings")]
    quarterly_earnings: Vec<EarningsQuartlyItem>,
}


#[derive(Debug, Deserialize, Serialize)]
struct EarningsAnnualItem {
    #[serde(rename = "fiscalDateEnding")]
    fiscal_date_ending: String,
    #[serde(rename = "reportedEPS")]
    reported_eps: String,
}

#[derive(Debug, Deserialize, Serialize)]
struct EarningsQuartlyItem {
    #[serde(rename = "fiscalDateEnding")]
    fiscal_date_ending: String,
    #[serde(rename = "reportedDate")]
    reported_date: String,
    #[serde(rename = "reportedEPS")]
    reported_eps: String,
    #[serde(rename = "estimatedEPS")]
    estimated_eps: String,
    #[serde(rename = "surprise")]
    surprise: String,
    #[serde(rename = "surprisePercentage")]
    surprise_percentage: String,
}
