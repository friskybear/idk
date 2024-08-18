use base64::prelude::*;
use rand::Rng;
use ring::rand::SecureRandom;

fn derive_key(key: &str, salt: &[u8]) -> Result<[u8; 32], ring::error::Unspecified> {
    let salt = ring::hkdf::Salt::new(ring::hkdf::HKDF_SHA256, salt);
    let prk = salt.extract(key.as_bytes());
    let mut key = [0u8; 32];
    prk.expand(&[], ring::hkdf::HKDF_SHA256)?.fill(&mut key)?;
    Ok(key)
}
#[tauri::command]
pub fn encrypt(data: &str, key: String) -> Result<Vec<u8>, &str> {
    let (nonce, key) = key.split_at(12);
    let mut data = data.as_bytes().to_vec();
    let key = derive_key(key, b"IDK").expect("failed to derive the key");
    let unbound_key = ring::aead::UnboundKey::new(&ring::aead::AES_256_GCM, &key).unwrap();
    let key = ring::aead::LessSafeKey::new(unbound_key);

    let nonce = ring::aead::Nonce::assume_unique_for_key(nonce.as_bytes().try_into().unwrap());

    match key.seal_in_place_append_tag(nonce, ring::aead::Aad::empty(), &mut data) {
        Err(_) => Err("failed to encrypt the data"),
        Ok(_) => Ok(data),
    }
}

#[tauri::command]
pub fn decrypt<'a>(mut data: Vec<u8>, mut key: String) -> Result<Vec<u8>, &'a str> {
    let (nonce, key) = key.split_at_mut(12);
    let key = derive_key(key, b"IDK").expect("failed to derive the key");
    let unbound_key = ring::aead::UnboundKey::new(&ring::aead::AES_256_GCM, &key).unwrap();
    let key = ring::aead::LessSafeKey::new(unbound_key);

    let nonce = ring::aead::Nonce::assume_unique_for_key(nonce.as_bytes().try_into().unwrap());

    match key.open_in_place(nonce, ring::aead::Aad::empty(), &mut data) {
        Ok(decrypted_data) => Ok(decrypted_data.to_vec()),
        Err(_) => Err("failed to decrypt data"),
    }
}

#[tauri::command]
pub fn get_key(key: Option<&str>, nonce: Option<u8>) -> String {
    match key {
        Some(key) => {
            let nonce = [nonce.unwrap(); 12];
            let mut result = Vec::new();
            result.extend_from_slice(&nonce);
            result.extend_from_slice(key.as_bytes());
            BASE64_URL_SAFE.encode(result)
        }
        None => {
            let mut nonce = [0u8; 12];
            rand::thread_rng().fill(&mut nonce);
            let rng = ring::rand::SystemRandom::new();
            let mut key = [0u8; 32];
            rng.fill(&mut key).expect("Failed to generate key");
            let mut result = Vec::new();
            result.extend_from_slice(&nonce);
            result.extend_from_slice(&key);
            BASE64_URL_SAFE.encode(result)
        }
    }
}
