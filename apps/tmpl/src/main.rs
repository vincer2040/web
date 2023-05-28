use axum::{
    Router,
    routing::get,
    response::Html,
};
#[tokio::main]
async fn main() {

    let app = Router::new()
        .route("/", get(root_get))
        .route("/about/", get(about_get));
    println!("running: http://localhost:42069");
    axum::Server::bind(&"0.0.0.0:42069".parse().expect("address to parse"))
        .serve(app.into_make_service())
        .await
        .expect("app to serve");
}

async fn root_get() -> Html<String> {
    let file = tokio::fs::read_to_string("./apps/tmpl/tmplapp/index.html").await.expect("html to be read");
    Html(file)
}

async fn about_get() -> Html<String> {
    let file = tokio::fs::read_to_string("./apps/tmpl/tmplapp/about/index.html").await.expect("html to be read");
    Html(file)
}
