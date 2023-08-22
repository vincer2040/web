use axum::response::Html;
use axum::Form;
use serde::Deserialize;
use std::fmt::Display;

pub async fn signup_get() -> Html<String> {
    let html_res = tokio::fs::read_to_string("./apps/news/public/signup.html")
        .await
        .expect("html");
        Html(html_res)
}

#[derive(Deserialize)]
pub struct EmailSignIn {
    name: String,
    email: String,
    password: String,
    repeat: String,
}

impl Display for EmailSignIn {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str("EmailSignIn {\n")?;
        f.write_str("\tname: ")?;
        f.write_str(&self.name)?;
        f.write_str("\n")?;
        f.write_str("\temail: ")?;
        f.write_str(&self.email)?;
        f.write_str("\n")?;
        f.write_str("\tpassword: ")?;
        f.write_str(&self.password)?;
        f.write_str("\n")?;
        f.write_str("\trepeat: ")?;
        f.write_str(&self.repeat)?;
        f.write_str("\n")?;
        f.write_str("}")?;
        Ok(())
    }
}


pub async fn email_signin_post(Form(data): Form<EmailSignIn>) -> Html<String> {
    println!("{}", data);
    Html("ok".to_string())
}

