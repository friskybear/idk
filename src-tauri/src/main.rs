// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use tracing::level_filters::LevelFilter;
// use tracing_subscriber::EnvFilter;

fn main() {
    // let sub = tracing_subscriber::FmtSubscriber::builder()
    //     .compact()
    //     .with_env_filter(
    //         EnvFilter::builder()
    //             .with_default_directive(LevelFilter::INFO.into())
    //             .from_env()
    //             .unwrap(),
    //     )
    //     .pretty()
    //     .with_ansi(true)
    //     .compact()
    //     .finish();
    // let _ = tracing::subscriber::set_global_default(sub);
    idk_lib::run()
}
