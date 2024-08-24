use parking_lot::Mutex;
use qrcode_generator::to_png_to_file;
use std::{env::current_dir, sync::LazyLock};
use tempfile::TempDir;

use crate::error::AppError;

#[tauri::command]
pub fn new_qrcode(key: &str, prefix: &str) -> String {
    let data = key.chars().chain(prefix.chars()).collect::<String>();
    to_png_to_file(data, qrcode_generator::QrCodeEcc::Low, 128, "./key.png").unwrap();
    // Build the path to the saved file
    let path = current_dir().unwrap().join("test.png");
    path.to_str().unwrap().to_string()
}

#[tauri::command]
pub fn qr_reader(path: &str, prefix: &str) -> Result<String, AppError> {
    let mut decoder = quircs::Quirc::default();
    // Convert the path to a image
    let img = image::open(path).unwrap().to_luma8();

    let codes = decoder.identify(img.width() as usize, img.height() as usize, &img);

    for code in codes {
        let code = code.expect("failed to extract qr code");
        let decoded = code.decode().expect("failed to decode qr code");
        if let Ok(text) = std::str::from_utf8(&decoded.payload) {
            if text.starts_with(prefix) {
                let new_text = text.replace(prefix, "");
                return Ok(new_text);
            }
        }
    }
    Err(AppError::CustomError(
        "Could not find the suitable Qr code".to_owned(),
    ))
}

// temp directory
pub static TEMP_DIR: LazyLock<Mutex<Option<TempDir>>> =
    LazyLock::new(|| Mutex::new(Some(TempDir::new().unwrap())));
