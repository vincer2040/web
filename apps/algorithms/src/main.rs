mod routes;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    let app = axum::Router::new()
        .route("/", axum::routing::get(routes::root_get));

    let addr = std::net::SocketAddr::from(([127, 0, 0, 1], 3000));

    println!("listening on http://{}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await?;
    Ok(())
}
