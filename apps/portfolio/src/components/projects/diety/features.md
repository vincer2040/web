### Features

- Creates C binary and library projects
    - Configure cmake to build the project
    - Set up test suites for the project
- Configure web based projects and libraries
    - Runs several commands to scaffold web application projects
    - Ability to select Rust, Go, or Java for the backend
    - Ability to select htmx, Astro, or Solidjs for the frontent
- Can be used as a higher level build tool for monorepos
    - Uses configuration of the scaffolded project it
    created to determine specific build steps
    - Commands like "start" or "test" can start or test projects
    that it initialized
