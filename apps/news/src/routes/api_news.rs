use axum::response::Html;
use axum::Form;
use serde::Deserialize;

use crate::get_news;
use crate::util::query::top_headlines_query_query;

#[derive(Deserialize)]
pub struct ApiNewsGet {
    search: String,
}

pub async fn api_news_get(Form(data): Form<ApiNewsGet>) -> Html<String> {
    let url = top_headlines_query_query(&data.search);
    match get_news(&url).await {
        Ok(v) => Html(v),
        Err(_) => Html("error".to_owned()),
    }
}

