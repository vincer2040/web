use crate::api::to_html::ToHtml;
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct Source {
    #[allow(unused)]
    id: Option<String>,
    name: String,
}

#[derive(Debug, Deserialize)]
pub struct Article {
    source: Source,
    author: Option<String>,
    title: String,
    description: Option<String>,
    url: String,
    #[allow(unused)]
    #[serde(rename = "urlToImage")]
    url_to_image: Option<String>,
    #[serde(rename = "publishedAt")]
    #[allow(unused)]
    published_at: String,
    #[allow(unused)]
    content: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct NewsApiGet {
    #[allow(unused)]
    status: String,
    #[serde(rename = "totalResults")]
    total_results: usize,
    articles: Vec<Article>,
}

impl ToHtml for Source {
    fn to_html(&self) -> String {
        format!("<section><p>source: {}</p></section>", self.name)
    }
}

impl ToHtml for Article {
    fn to_html(&self) -> String {
        let author = match &self.author {
            Some(a) => a,
            None => "no author provided",
        };
        let description = match &self.description {
            Some(d) => d,
            None => "no description provided",
        };
        format!("<li>{}<section><div><p>title: {}</p></div><div><p>author: {}</p></div><div><a href={}>link</a></div></section></li>",
            self.source.to_html(),
            self.title,
            author,
            self.url,
        )
    }
}

impl ToHtml for NewsApiGet {
    fn to_html(&self) -> String {
        let mut articles_html = "<section><p>articles</p></section><section><ul>".to_owned();
        for article in &self.articles {
            articles_html += &article.to_html();
        }
        articles_html += "</ul></section>";
        format!(
            "<div><section><p>total results: {}</p></section><section>{}</section></div>",
            self.total_results, articles_html,
        )
    }
}
