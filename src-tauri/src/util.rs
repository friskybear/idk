use parking_lot::Mutex;
use qrcode_generator::to_png_to_file;
use serde_json::{json, Value};
use std::{env::current_dir, path::PathBuf, sync::LazyLock, thread::sleep, time::Duration};
use surrealdb::{engine::local::Db, Surreal};
use tempfile::TempDir;

use crate::{bundle::Bundle, error::AppError};

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
#[tauri::command]
pub async fn get_data(n: usize) -> Value {
    //sleep(Duration::from_secs(5));
    serde_json::to_value(DATA.lock().as_ref().unwrap().get_n(n)).unwrap()
}
#[tauri::command]
pub async fn get_data_titles(start: usize, end: Option<usize>) -> Vec<Value> {
    //sleep(Duration::from_secs(5));
    DATA.lock()
        .as_ref()
        .unwrap()
        .get_n_titles(start, end.unwrap_or(start + 20))
}

// fn create_file() -> Response<File> {
//     let mut lock = GOOGLE_DRIVE_CLIENT.lock();
//     let file_metadata = File {
//         name: "hello.txt".to_string(),
//         ..Default::default()
//     };
//     tauri::async_runtime::block_on(async {
//         lock.as_mut()
//             .unwrap()
//             .files()
//             .create(
//                 false,
//                 "published",
//                 false,
//                 "",
//                 true,
//                 true,
//                 false,
//                 &file_metadata,
//             )
//             .await
//             .unwrap()
//     })
// }

// fn delete() -> Response<()> {
//     let mut lock = GOOGLE_DRIVE_CLIENT.lock();

//     tauri::async_runtime::block_on(async {
//         lock.as_mut()
//             .unwrap()
//             .files()
//             .delete_by_name("", "", "hello.txt")
//             .await
//             .unwrap()
//     })
// }

// #[tauri::command(async)]
// async fn google_drive_log_in(
//     redirect_url: String,
//     client_secret: String,
//     client_id: String,
//     token: String,
//     refresh_token: String,
// ) -> String {
//     println!("hello");
//     let mut lock = GOOGLE_DRIVE_CLIENT.lock();
//     *lock = Some(google_drive::Client::new(
//         client_id,
//         client_secret,
//         redirect_url,
//         token,
//         refresh_token,
//     ));
//     drop(lock);
//     let result = thread::spawn(create_file).join().unwrap();
//     println!("{result:?}");
//     let result = thread::spawn(delete).join().unwrap();
//     println!("{result:?}");
//     "done".to_owned()
// }

// temp directory
pub static TEMP_DIR: LazyLock<Mutex<Option<TempDir>>> =
    LazyLock::new(|| Mutex::new(Some(TempDir::with_prefix("idk").unwrap())));
pub static LOCAL_DIR: LazyLock<Mutex<Option<PathBuf>>> = LazyLock::new(|| Mutex::new(None));
//pub static GOOGLE_DRIVE_CLIENT: LazyLock<Mutex<Option<google_drive::Client>>> =
//    LazyLock::new(|| Mutex::new(None));
pub static DATA: LazyLock<Mutex<Option<Bundle>>> = LazyLock::new(|| Mutex::new(None));
