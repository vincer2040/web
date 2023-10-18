pub mod algorithms;
mod routes;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    let app = axum::Router::new()
        .route("/", axum::routing::get(routes::root_get))
        .route("/qs", axum::routing::get(routes::qs_websocket_get));

    let addr = std::net::SocketAddr::from(([127, 0, 0, 1], 6969));

    println!("listening on http://{}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await?;
    Ok(())
}
