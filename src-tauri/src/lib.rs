mod encryption;
use std::env::set_current_dir;

use encryption::{decrypt, encrypt, get_key};
mod util;
use util::{new_qrcode, qr_reader};
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
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
