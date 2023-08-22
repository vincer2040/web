pub fn top_headlines_us_query() -> String {
    let key = dotenv::var("NEWS").expect("news api key");
    let url = format!("v2/top-headlines?country=us&apiKey={}", key);
    url
}

pub fn top_headlines_query_query(query: &str) -> String {
    let key = dotenv::var("NEWS").expect("news api key");
    let url = format!("v2/top-headlines?q={}&apiKey={}", query, key);
    url
}
