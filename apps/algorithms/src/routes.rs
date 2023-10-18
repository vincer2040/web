use crate::algorithms;

pub async fn root_get() -> axum::response::Html<String> {
    let html = tokio::fs::read_to_string("apps/algorithms/algs-app/index.html")
        .await
        .expect("index.html");
    axum::response::Html(html)
}

fn cmp(a: &i32, b: &i32) -> std::cmp::Ordering {
    a.cmp(&b)
}

pub async fn qs_websocket_get(ws: axum::extract::ws::WebSocketUpgrade) -> impl axum::response::IntoResponse{
    ws.on_upgrade(|mut ws: axum::extract::ws::WebSocket| async move {
        let req = ws.recv().await;
        if let Some(msg_result) = req {
            match msg_result {
                Ok(msg) => {
                    let mut data: Vec<i32> = match msg {
                        axum::extract::ws::Message::Text(d) => serde_json::from_str(&d).expect("json to parse"),
                        _ => panic!("unexpected data type from client"),
                    };
                    algorithms::qs::quick_sort(data.as_mut_slice(), cmp, &mut ws).await;
                }
                Err(_) => {
                    return;
                }
            }
        }
    })
}
