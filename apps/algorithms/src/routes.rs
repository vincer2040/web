
pub async fn root_get() -> axum::response::Html<String>{
    let html = tokio::fs::read_to_string("apps/algorithms/algs-app/index.html").await.expect("index.html");
    axum::response::Html(html)
}
