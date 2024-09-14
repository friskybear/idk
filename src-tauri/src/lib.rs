mod encryption;

use bundle::{generate_fake_bundle, Bundle};
use encryption::{decrypt, encrypt, get_key, Encryption};
use std::{
    env::set_current_dir,
    fs::{create_dir_all, File},
    io::{Read, Write},
    path::PathBuf,
    thread,
    time::Duration,
};
use surrealdb::{
    engine::{local::SurrealKV, remote::ws::Ws},
    sql::Uuid,
};
mod database;
use database::{import_bundle, DB};
mod util;
//use google_drive::{traits::FileOps, Client, Response};
use rand::Rng;
use tauri::Manager;
use util::{
    get_data_titles, new_qrcode, qr_reader, DATA, /*GOOGLE_DRIVE_CLIENT,*/ LOCAL_DIR, TEMP_DIR,
};
mod bundle;
mod error;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            encrypt,
            decrypt,
            get_key,
            new_qrcode,
            qr_reader,
            get_data_titles,
        ])
        .setup(|app| {
            LOCAL_DIR
                .lock()
                .replace(app.path().app_local_data_dir().unwrap());

            init();
            Ok(())
        })
        .on_window_event(move |_, event| match event {
            tauri::WindowEvent::Resized(_) => {}
            tauri::WindowEvent::Moved(_) => {}
            tauri::WindowEvent::CloseRequested { .. } => {}
            tauri::WindowEvent::Destroyed => {
                if let Some(dir) = TEMP_DIR.lock().take() {
                    let _ = dir.close();
                }
            }
            tauri::WindowEvent::Focused(_) => {}
            tauri::WindowEvent::ScaleFactorChanged { .. } => {}
            tauri::WindowEvent::DragDrop(_) => {}
            tauri::WindowEvent::ThemeChanged(_) => {}
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn init() {
    let path_lock = LOCAL_DIR.lock();
    let path = path_lock.as_ref().unwrap();
    create_dir_all(path.clone()).unwrap();
    set_current_dir("../").unwrap();

    let runtime = tokio::runtime::Runtime::new().unwrap();
    *DB.lock() = runtime.block_on(async {
        let db = surrealdb::Surreal::new::<surrealdb::engine::local::SurrealKV>(
            path.join("db").to_str().unwrap(),
        )
        .await
        .unwrap();
        db.use_db("idk").await.unwrap();
        db.use_ns("idk").await.unwrap();
        db
    });
    let mut lock = DATA.lock();
    *lock = Some(generate_fake_bundle());
    if let Ok(mut file) = File::open(path.join("data")) {
        lock.replace(Bundle::decompress(file.decrypt("hi").unwrap()).unwrap());
        runtime
            .block_on(import_bundle(lock.as_ref().unwrap()))
            .unwrap();
    } else {
        let mut file = File::options()
            .create(true)
            .truncate(true)
            .write(true)
            .read(true)
            .open(path.join("data"))
            .unwrap();
        file.encrypt(lock.as_ref().unwrap().compress(), "hi")
            .unwrap();
        println!("ads");
        let _ = runtime.block_on(import_bundle(lock.as_ref().unwrap()));
    }
}
