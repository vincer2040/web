use axum::response::Html;

pub async fn google_auth_post(body: String) -> Html<String> {
    println!("{}", body);
    Html("ok".to_string())
}
