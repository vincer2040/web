mod routes;
use axum::routing::get;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let app = axum::Router::new().route("/", get(routes::root::root_get));

    let addr = &"127.0.0.1:6969".parse()?;
    let server = axum::Server::bind(addr).serve(app.into_make_service());
    println!("listening on http://{}", server.local_addr());
    server.await?;
    Ok(())
}

#[derive(Debug)]
struct Message {
    user: String,
    text: String,
}

impl Message {
    pub fn new(user: String, text: String) -> Self {
        Message { user, text }
    }
}

#[derive(Debug)]
struct Room {
    messages: Vec<Message>,
}

impl Room {
    pub fn new() -> Self {
        Room {
            messages: Vec::new(),
        }
    }
}

type Rooms = std::collections::HashMap<String, Room>;

struct AppState {
    rooms_tx: tokio::sync::broadcast::Sender<Rooms>,
}
