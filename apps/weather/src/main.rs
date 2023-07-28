use dotenv;
use anyhow::Result;
use serde::Deserialize;

// http://api.weatherapi.com/v1/current.json?key=<YOUR_API_KEY>&q=London

#[allow(unused)]
#[derive(Debug, Deserialize)]
struct Location {
        name: String,
        region: String,
        country: String,
        lat: f32,
        lon: f32,
        tz_id: String,
        localtime_epoch: u64,
        localtime: String,
}

#[allow(unused)]
#[derive(Debug, Deserialize)]
struct Condition {
    text: String,
    icon: String,
    code: u64,
}

#[allow(unused)]
#[derive(Debug, Deserialize)]
struct Current {
    last_updated_epoch: u64,
    last_updated: String,
    temp_c: f32,
    temp_f: f32,
    is_day: u64,
    condition: Condition,
    wind_mph: f32,
    wind_kph: f32,
    wind_degree: f32,
    wind_dir: String,
    pressure_mb: f32,
    pressure_in: f32,
    precip_mm: f32,
    precip_in: f32,
    humidity: f32,
    cloud: f32,
    feelslike_c: f32,
    feelslike_f: f32,
    vis_km: f32,
    vis_miles: f32,
    uv: f32,
    gust_mph: f32,
    gust_kph: f32,
}

#[allow(unused)]
#[derive(Debug, Deserialize)]
struct Weather{
    location: Location,
    current: Current,
}

#[tokio::main]
async fn main() -> Result<()> {


    let key = dotenv::var("WEATHER")?;

    let req = reqwest::get(format!("http://api.weatherapi.com/v1/current.json?key={}&q=43015", key)).await?;

    let txt: Weather = req.json().await?;

    println!("{:#?}", txt);


    Ok(())
}
