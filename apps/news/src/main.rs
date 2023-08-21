pub mod api;
use api::to_html::ToHtml;
use axum::{response::Html, routing::get};

static APP_USER_AGENT: &str = "newsapp";

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let app = axum::Router::new().route("/", get(root_get));

    let addr = &"127.0.0.1:6969".parse()?;
    let server = axum::Server::bind(addr).serve(app.into_make_service());
    println!("listening on http://{}", server.local_addr());
    server.await?;

    Ok(())
}

async fn get_news() -> anyhow::Result<String> {
    let key = dotenv::var("NEWS")?;

    let url = format!(
        "https://newsapi.org/v2/top-headlines?q=trump&apiKey={}",
        key
    );

    let req_client = reqwest::Client::builder()
        .user_agent(APP_USER_AGENT)
        .build()?;
    let req = req_client.get(url).send().await?;

    let res: Result<api::news::NewsApiGet, reqwest::Error> = req.json().await;
    match res {
        Ok(v) => Ok(v.to_html()),
        Err(_) => Ok("error".to_owned()),
    }
}

async fn root_get() -> Html<String> {
    let html_res = tokio::fs::read_to_string("./apps/news/index.html")
        .await
        .expect("html");
    match get_news().await {
        Ok(v) => {
            let html = html_res.replace("<!--#-->", &v);
            Html(html)
        }
        Err(_) => Html("error".to_owned()),
    }
}
