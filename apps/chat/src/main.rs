use std::{sync::{Arc, Mutex}, collections::HashMap};

use axum::{
    response::Html,
    routing::{get, post},
    Router,
    extract::{
        ws::WebSocket,
        State,
    },
    Form,
};
use anyhow::Result;
use serde::Deserialize;

#[derive(Debug)]
struct Room {
    messages: Vec<String>,
}

impl Room {
    pub fn new() -> Self {
        let messages: Vec<String> = Vec::new();
        Room { messages }
    }
}

#[derive(Clone)]
struct AppState {
    rooms: Arc<Mutex<HashMap<String, Room>>>
}

impl AppState {
    pub fn new() -> Self {
        let rooms = Arc::new(Mutex::new(HashMap::new()));
        AppState { rooms }
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    let state = AppState::new();
    let app = Router::new()
        .route("/", get(root_get))
        .route("/rooms", get(rooms_get))
        .route("/create", get(room_create_get))
        .route("/create-room", post(new_room))
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

fn create_room_btns(rooms: Vec<&String>) -> String {
    let mut s = String::from("<section>");
    if rooms.len() == 0 {
        s.push_str("<h2 class=\"text-2xl\">No rooms yet</h2>");
        s.push_str("<a href=\"/create\" class=\"px-4 py-2 bg-sky-400 rounded-md text-xl text-sky-50\">create a room</a>");
    } else {
        rooms
            .iter()
            .for_each(|x| {
                let st = format!("<button class=\"px-4 py-2 bg-sky-400 rounded-md text-xl text-sky-50\">{}</button>", x);
                s.push_str(&st);
            })
    }
    s.push_str("</section>");
    s
}

async fn rooms_get(State(state): State<AppState>) -> Html<String> {
    let mut html = tokio::fs::read_to_string("./apps/chat/chat-app/rooms/index.html").await.expect("rooms/index.html");
    let rms_s = state
        .rooms
        .lock()
        .unwrap();
    let rms: Vec<&String> = rms_s
        .keys()
        .collect();
    let btns = create_room_btns(rms);
    html = html.replace("<!--#-->", &btns);
    Html(html)
}

async fn room_create_get() -> Html<String> {
    let html = tokio::fs::read_to_string("./apps/chat/chat-app/create/index.html").await.expect("create/index.html");
    Html(html)
}

#[derive(Deserialize)]
struct RoomCreateData {
    name: String,
}

async fn new_room(State(state): State<AppState>, Form(d): Form<RoomCreateData>) -> Html<String> {
    let mut rms = state.rooms
        .lock()
        .unwrap();
    let has = rms.contains_key(&d.name);
    if has {
        println!("has");
    } else {
        let room = Room::new();
        rms.insert(d.name, room);
    }
    Html("Ok".to_owned())
}
