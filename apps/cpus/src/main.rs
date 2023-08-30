use axum::{
    Router,
    routing::get,
    extract::{
        State,
        WebSocketUpgrade,
        ws::{
            WebSocket,
            Message,
        }
    },
    response::{
        Html,
        IntoResponse,
    },
};

use serde::Serialize;
use sysinfo::{
    System,
    CpuExt,
    SystemExt,
};

use tokio::sync::broadcast;

type Snapshot = Vec<f32>;

#[derive(Debug, Clone, Serialize)]
struct ProcessInfo {
    name: String,
    pid: String,
}

#[derive(Clone)]
struct AppState {
    cpu_tx: broadcast::Sender<Snapshot>,
}

use anyhow::Result;

#[tokio::main]
async fn main() -> Result<()> {
    let (cpu_tx, _) = broadcast::channel::<Snapshot>(1);
    let app_state = AppState {
        cpu_tx: cpu_tx.clone(),
    };
    tokio::task::spawn_blocking(move || {
        let mut sys = System::new();
        loop {
            sys.refresh_cpu();
            let v: Vec<f32> = sys.cpus().iter().map(|cpu| {cpu.cpu_usage()}).collect();
            let _ = cpu_tx.send(v);
            std::thread::sleep(System::MINIMUM_CPU_UPDATE_INTERVAL);
        }
    });
    let app = Router::new()
        .route("/", get(root_get))
        .route("/realtime/cpus", get(realtime_cpus_get))
        .with_state(app_state);

    let addr = &"127.0.0.1:6969".parse()?;
    let server = axum::Server::bind(addr).serve(app.into_make_service());
    println!("listening on http://{}", server.local_addr());
    server.await?;
    Ok(())
}

async fn realtime_cpus_stream(state: AppState, mut ws: WebSocket) {
    let mut rx = state.cpu_tx.subscribe();
    while let Ok(msg) = rx.recv().await {
        let payload: String = serde_json::to_string(&msg).unwrap();
        let send_result = ws.send(Message::Text(payload)).await;
        match send_result {
            Ok(_) => (),
            Err(_) => break,
        };
    }
}

async fn realtime_cpus_get(State(state): State<AppState>, ws: WebSocketUpgrade) -> impl IntoResponse {
    ws.on_upgrade(|ws: WebSocket| async {
        realtime_cpus_stream(state, ws).await
    })
}

async fn root_get() -> Html<String> {
    let html = tokio::fs::read_to_string("./apps/cpus/cpus-app/index.html").await.expect("index.html");
    Html(html)
}

