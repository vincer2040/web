use std::env;
use std::io::Write;
use anyhow::Result;
use tokio::process::Command;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let arg: String = get_arg(env::args());
    let a = ArgType::new(&arg);
    let name = get_project_name().expect("name");
    let project = Project::new(a, name);
    project.run().await.expect("run");
    Ok(())
}

fn get_arg(args: env::Args) -> String {
    let mut arg: String = String::new();
    if args.len() != 2 {
        panic!("expected one argument");
    }

    for a in args {
        arg = a;
    }
    return arg;
}

fn get_project_name() -> Result<String> {
    print!("Enter the prject name: ");
    std::io::stdout().flush().unwrap();
    let mut buffer = String::new();
    std::io::stdin().read_line(&mut buffer)?;
    buffer = buffer.trim_end().to_owned();
    Ok(buffer)
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

#[derive(Debug)]
struct Project {
    t: ArgType,
    name: String,
}

impl Project {
    pub fn new(t: ArgType, name: String) -> Self {
        Project {
            t,
            name,
        }
    }

    async fn create_rust_project(&self) -> Result<()> {
        let mut child = Command::new("cargo")
            .arg("new")
            .arg(format!("./apps/{}", self.name))
            .spawn()?;
        let _ = child.wait().await?;
        Ok(())
    }

    async fn create_vite_in_rust(&self) -> Result<()> {
        let mut child = Command::new("pnpm")
            .arg("create")
            .arg("vite")
            .arg(format!("./apps/{}/{}app", self.name, self.name))
            .spawn()?;
        let _ = child.wait().await?;
        Ok(())
    }

    async fn delete_vite_app_boilerplate(&self) -> Result<()> {
        let mut child0 = Command::new("rm")
            .arg(format!("./apps/{}/{}app/src/counter.ts", self.name, self.name))
            .spawn()?;
        let mut child1 = Command::new("rm")
            .arg(format!("./apps/{}/{}app/src/typescript.svg", self.name, self.name))
            .spawn()?;
        let mut child2 = Command::new("rm")
            .arg(format!("./apps/{}/{}app/src/style.css", self.name, self.name))
            .spawn()?;
        let _ = child0.wait().await?;
        let _ = child1.wait().await?;
        let _ = child2.wait().await?;
        Ok(())
    }

    async fn create_vite_lib(&self) -> Result<()> {
        let mut child = Command::new("pnpm")
            .arg("create")
            .arg("vite")
            .arg(format!("./lib/{}", self.name))
            .spawn()?;
        let _ = child.wait().await?;
        Ok(())
    }

    async fn create_web_lib(&self) -> Result<()> {
        self.create_vite_lib().await?;
        Ok(())
    }

    async fn create_v4_app(&self) -> Result<()> {
        self.create_rust_project().await?;
        self.create_vite_in_rust().await?;
        self.delete_vite_app_boilerplate().await?;
        Ok(())
    }

    pub async fn run(&self) -> Result<()> {
        match self.t {
            ArgType::V4 => self.create_v4_app().await,
            ArgType::WebLib => self.create_web_lib().await,
            _ => Ok(())
        }
    }
}
