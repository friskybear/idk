mod encryption;

use std::env::set_current_dir;

use encryption::{decrypt, encrypt, get_key};
mod util;
use util::{new_qrcode, qr_reader, TEMP_DIR};
mod error;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[cfg(dev)]
    set_current_dir("../").unwrap();
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            encrypt, decrypt, get_key, new_qrcode, qr_reader
        ])
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
