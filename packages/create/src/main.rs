use std::env;

fn main() {
    let args = env::args();
    let mut arg: String = String::new();
    if args.len() != 2 {
        panic!("expected one argument");
    }

    for a in args {
        arg = a;
    }

    let a = ArgType::new(&arg);

    println!("{:#?}", a);
}

#[derive(Debug)]
enum ArgType {
    V4,
    WebLib,
    RsLib,
    Invalid,
}

impl ArgType {
    pub fn new(arg: &str) -> Self {
        match arg {
            "--v4" => ArgType::V4,
            "--weblib" => ArgType::WebLib,
            "--rslib" => ArgType::RsLib,
            _ => ArgType::Invalid,
        }
    }
}
