use anyhow::Result;

use axum::{
    extract::{Path, State},
    response::Html,
    routing::{get, post, delete},
    Form, Router,
    response::IntoResponse,
    http::header::{self, HeaderMap},
};
use serde::{Deserialize, Serialize};

use std::sync::Arc;

use lexi_rust::{LexiClient, LexiResult};

use chrono;

#[derive(Deserialize, Clone, Debug)]
struct TodoEntry {
    title: String,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
struct DbEntry {
    date: String,
    pub done: bool,
}

impl DbEntry {
    pub fn create_html(&self, title: &str) -> String {
        let mut res = String::new();
        res.push_str("<div class=\"grid place-items-center gap-3\">");

        let formatted_title = format!("<h3>{}</h3>", title);
        res.push_str(&formatted_title);

        let dt = self.date.parse::<chrono::DateTime<chrono::Utc>>().expect("date to parse").format("%a %b %e %Y");
        let formatted_date = format!("<p>date added: {}</p>", dt);
        res.push_str(&formatted_date);

        let formatted_done = format!("<p>complete: {}</p>", self.done);
        res.push_str(&formatted_done);

        let url_encoded = urlencoding::encode(title);
        let done_btn = format!(
            "<button hx-post=\"/done/{}\" class=\"clickable bg-indigo-500 text-indigo-100 px-4 py-2 rounded-md\" hx-target=\"#item\">mark as complete</button>",
            url_encoded
        );
        let delete_btn = format!(
            "<button hx-delete=\"/delete/{}\" class=\"clickable bg-rose-400 text-rose-100 px-4 py-2 rounded-md\" hx-target=\"#content\">delete</button>",
            url_encoded
        );
        res.push_str(&done_btn);
        res.push_str(&delete_btn);

        res.push_str("</div>");
        res
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    let mut client = LexiClient::new("127.0.0.1:5174")?;

    client.connect().await?;

    let db = Arc::new(client);
    let app = Router::new()
        .route("/", get(root_get))
        .route("/index.css", get(css_get))
        .route("/item/:title", get(store_get))
        .route("/delete/:title", delete(item_delete))
        .route("/done/:title", post(item_done))
        .route("/store", post(store_post))
        .with_state(db);
    let addr = &"127.0.0.1:6969".parse()?;
    let server = axum::Server::bind(addr).serve(app.into_make_service());
    println!("listening on http://{}", server.local_addr());
    server.await?;
    Ok(())
}

fn build_html_from_keys(keys: LexiResult) -> String {
    let mut res = String::new();
    res.push_str("<ul>");
    match keys {
        LexiResult::Array(ks) => {
            if ks.len() == 0 {
                res.push_str("<li><p>Nothing to do!</p></li>");
            } else {
                ks.iter().for_each(|k| match k {
                    LexiResult::String(v) => {
                        let url_encoded = urlencoding::encode(&v);
                        let formatted = format!(
                            "<li>
                            <p hx-get=\"/item/{}\" hx-target=\"#item\" class=\"clickable\">{}</p>
                            </li>",
                            url_encoded, v
                            );
                        res.push_str(&formatted);
                    }
                    _ => {
                    }
                });
            }
        }
        _ => {
            res.push_str("<li><p>Nothing to do!</p></li>");
        }
    }
    res.push_str("</ul>");
    res
}

async fn item_delete(State(db): State<Arc<LexiClient>>, Path(title): Path<String>) -> Html<String> {
    let delete_res = db.del(&title).await;
    match delete_res {
        Ok(_) => {}
        Err(e) => {
            return Html(format!("Error: {}", e));
        }
    }
    let keys = db.keys().await;
    match keys {
        Ok(v) => {
            let html_of_keys = build_html_from_keys(v);
            let html = format!("<h1>Todos:</h1><div id=\"todos\">{}</div><div id=\"item\"></div>", html_of_keys);
            Html(html)
        }
        Err(e) => {
            let html_of_error = format!("Error! {}", e);
            Html(html_of_error)
        }
    }
}

async fn store_get(State(db): State<Arc<LexiClient>>, Path(title): Path<String>) -> Html<String> {
    let item = db.get(&title).await;
    match item {
        Ok(v) => match v {
            LexiResult::String(s) => {
                let deserialized_item: Result<DbEntry, _> = serde_json::from_str(&s);
                match deserialized_item {
                    Ok(di) => {
                        let html = di.create_html(&title);
                        return Html(html);
                    }
                    Err(e) => {
                        println!("error {}", e);
                        return Html("error".to_string());
                    }
                }
            }
            LexiResult::None => {
                return Html("None".to_string());
            }
            _ => {
                return Html("error".to_string());
            }
        },
        Err(e) => {
            let html_of_error = format!("Error! {}", e);
            return Html(html_of_error);
        }
    }
}

async fn store_post(
    State(db): State<Arc<LexiClient>>,
    Form(item): Form<TodoEntry>,
) -> Html<String> {
    let cur_time = chrono::offset::Utc::now();
    let db_entry = DbEntry {
        date: cur_time.to_string(),
        done: false,
    };
    let serialized_entry = serde_json::to_string(&db_entry).expect("to json");
    let set_res = db.set(&item.title, &serialized_entry).await;
    match set_res {
        Ok(_) => {}
        Err(e) => {
            let html_of_error = format!("Error! {}", e);
            return Html(html_of_error);
        }
    }
    let keys = db.keys().await;
    match keys {
        Ok(v) => {
            let html_of_keys = build_html_from_keys(v);
            Html(html_of_keys)
        }
        Err(e) => {
            let html_of_error = format!("Error! {}", e);
            Html(html_of_error)
        }
    }
}

async fn root_get(State(db): State<Arc<LexiClient>>) -> Html<String> {
    let keys = db.keys();
    let mut html = tokio::fs::read_to_string("./apps/axum-htmx/index.html")
        .await
        .expect("index.html");
    match keys.await {
        Ok(v) => {
            let html_keys = build_html_from_keys(v);
            html = html.replace("<!--#-->", &html_keys);
        }
        Err(e) => {
            println!("{}", e);
        }
    }
    Html(html)
}

async fn item_done(State(db): State<Arc<LexiClient>>, Path(title): Path<String>) -> Html<String> {
    let item = db.get(&title).await;
    match item {
        Ok(im) => {
            match im {
                LexiResult::String(v) => {
                    let item_v: Result<DbEntry, _> = serde_json::from_str(&v);
                    match item_v {
                        Ok(mut v) => {
                            v.done = true;
                            let serialzed = serde_json::to_string(&v);
                            match serialzed {
                                Ok(s) => {
                                    let set_result = db.set(&title, &s).await;
                                    match set_result {
                                        Ok(_) => {
                                            let v_html = v.create_html(&title);
                                            Html(v_html)
                                        }
                                        Err(e) => {
                                            Html(format!("Error: {}", e))
                                        }
                                    }
                                }
                                Err(e) => {
                                    Html(format!("Error: {}", e))
                                }
                            }
                        }
                        Err(_) => {
                            Html("Error".to_string())
                        }
                    }
                }
                LexiResult::None => {
                    Html("None".to_string())
                }
                _ => {
                    Html("Error".to_string())
                }
            }
        }
        Err(e) => {
            Html(format!("Error: {}", e))
        }
    }
}

async fn css_get() -> impl IntoResponse {
    let mut headers = HeaderMap::new();
    headers.insert(header::CONTENT_TYPE, "text/css".parse().expect("text/css to parse"));
    let css = tokio::fs::read_to_string("./apps/axum-htmx/dist/index.css").await.expect("read css");
    (headers, css)
}

