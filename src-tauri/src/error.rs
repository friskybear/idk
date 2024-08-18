use tauri::ipc::InvokeError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("An error occurred: {0}")]
    CustomError(String),
}

impl From<AppError> for InvokeError {
    fn from(error: AppError) -> Self {
        match error {
            AppError::CustomError(err) => err.to_string().into(),
        }
    }
}
