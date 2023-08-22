use axum::response::Html;
use crate::get_news;
use crate::util::query::top_headlines_us_query;

pub async fn root_get() -> Html<String> {
    let html_res = tokio::fs::read_to_string("./apps/news/public/index.html")
        .await
        .expect("html");
    let url = top_headlines_us_query();
    match get_news(&url).await {
        Ok(v) => {
            let html = html_res.replace("<!--#-->", &v);
            Html(html)
        }
        Err(_) => Html("error".to_owned()),
    }
}
