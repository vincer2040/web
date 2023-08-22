pub mod util;
mod api;
mod routes;
use api::to_html::ToHtml;
use axum::routing::{get, post};
use routes::{root::root_get, api_news::api_news_get, signup::{signup_get, email_signin_post}, google_auth::google_auth_post};
static APP_USER_AGENT: &str = "newsapp";

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let app = axum::Router::new()
        .route("/", get(root_get))
        .route("/signup", get(signup_get))
        .route("/email-signup", post(email_signin_post))
        .route("/googleauth", post(google_auth_post))
        .route("/api/news", get(api_news_get));

    let addr = &"127.0.0.1:6969".parse()?;
    let server = axum::Server::bind(addr).serve(app.into_make_service());
    println!("listening on http://{}", server.local_addr());
    server.await?;

    Ok(())
}

async fn get_news(query: &str) -> anyhow::Result<String> {

    let url = format!(
        "https://newsapi.org/{}",
        query
    );

    let req_client = reqwest::Client::builder()
        .user_agent(APP_USER_AGENT)
        .build()?;
    let req = req_client.get(url).send().await?;

    let res: Result<api::news::NewsApiGet, reqwest::Error> = req.json().await;
    match res {
        Ok(v) => Ok(v.to_html()),
        Err(e) => {
            println!("{}", e);
            Ok("error".to_owned())
        },
    }
}
