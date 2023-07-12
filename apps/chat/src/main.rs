use std::{sync::{Arc, Mutex}, collections::HashSet};
use rand::{distributions::Alphanumeric, Rng}; // 0.8

use axum::{
    response::Html,
    routing::get,
    Router,
    extract::{
        ws::WebSocket,
        State,
    },
};
use anyhow::Result;

#[derive(Debug, Eq, Hash, PartialEq)]
struct Room {
    id: String,
}

impl Room {
    pub fn new(id: String) -> Self {
        Room { id }
    }
}

#[derive(Clone)]
struct AppState {
    rooms: Arc<Mutex<HashSet<Room>>>
}

impl AppState {
    pub fn new() -> Self {
        let rooms = Arc::new(Mutex::new(HashSet::new()));
        AppState { rooms }
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    let state = AppState::new();
    let app = Router::new()
        .route("/", get(root_get))
        .route("/rooms", get(rooms_get))
        .route("/create", get(room_create))
        .with_state(state);
    let addr = &"127.0.0.1:6969".parse()?;
    let server = axum::Server::bind(addr).serve(app.into_make_service());
    println!("listening on http://{}", server.local_addr());
    server.await?;
    Ok(())
}

async fn root_get() -> Html<String> {
    let html = tokio::fs::read_to_string("./apps/chat/chat-app/index.html").await.expect("index.html");
    Html(html)
}

async fn rooms_get(State(state): State<AppState>) -> &'static str{
    state.rooms
        .lock()
        .iter()
        .for_each(|room| {
            println!("{:#?}", room);
        });
    "ok"
}

async fn room_create(State(state): State<AppState>) -> String {
    let s: String = rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(7)
        .map(char::from)
        .collect();
    let mut rms = state.rooms.lock().unwrap();
    let room = Room::new(s.clone());
    rms.insert(room);
    s
}
