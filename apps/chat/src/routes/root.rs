use axum::response::Html;

pub async fn root_get() -> Html<String> {
    let html = tokio::fs::read_to_string("apps/chat/public/index.html").await.expect("html");
    Html(html)
}
