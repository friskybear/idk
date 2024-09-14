use core::str;
use std::io::Write;

use chrono::{DateTime, Utc};
use rand::{distributions::Alphanumeric, Rng};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use surrealdb::sql::Uuid;

use crate::error::AppError;

#[derive(Serialize, Deserialize, Debug, Clone)]
enum Content {
    Text(String),
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Item {
    time: DateTime<Utc>,
    content: Content,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Data {
    time: DateTime<Utc>,
    id: Uuid,
    name: String,
    pinned: bool,
    key_words: Option<Vec<String>>,
    description: Option<String>,
    items: Option<Vec<Item>>,
}
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Bundle {
    pub header: Header,
    data: Option<Vec<Data>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Header {
    pub id: Uuid,
    pub time: DateTime<Utc>,
    pub created: DateTime<Utc>,
}
impl Default for Header {
    fn default() -> Self {
        Self {
            id: Uuid::new_v4(),
            time: Utc::now(),
            created: Utc::now(),
        }
    }
}
impl Data {
    fn new(
        name: String,
        key_words: Option<Vec<String>>,
        description: Option<String>,
        items: Option<Vec<Item>>,
    ) -> Self {
        Data {
            time: Utc::now(),
            id: Uuid::new_v4(),
            name,
            pinned: false,
            key_words,
            description,
            items,
        }
    }

    fn add_item(&mut self, item: Item) {
        if let Some(items) = self.items.as_mut() {
            items.push(item);
        } else {
            self.items = Some(vec![item]);
        }
    }
}

trait Sort {
    fn sort_by_time(&mut self);
}
impl Sort for Bundle {
    fn sort_by_time(&mut self) {
        self.data
            .as_mut()
            .unwrap()
            .sort_by_key(|f| std::cmp::Reverse(f.time));
    }
}
impl Sort for Data {
    fn sort_by_time(&mut self) {
        self.items
            .as_mut()
            .unwrap()
            .sort_by_key(|f| std::cmp::Reverse(f.time));
    }
}

impl Bundle {
    pub fn new(data: Option<Vec<Data>>) -> Self {
        Bundle {
            header: Header::default(),
            data,
        }
    }

    pub fn add_data(&mut self, data: Data) {
        if let Some(datas) = self.data.as_mut() {
            datas.push(data);
        } else {
            self.data = Some(vec![data]);
        }
    }
    pub fn get_n(&self, n: usize) -> Option<&Data> {
        self.data.as_ref()?.get(n)
    }
    pub fn get_n_titles(&self, start: usize, end: usize) -> Vec<Value> {
        self.data.as_ref()
            .map(|data_vec| {
                data_vec.iter()
                    .skip(start)
                    .take(end - start)
                    .enumerate().map(|(count,item)| json!({"id":item.id,"pinned":item.pinned,"name":item.name,"key_words":item.key_words,"description":item.description}))
                    .collect()
            })
            .unwrap_or_default()
    }

    pub fn compress(&self) -> Vec<u8> {
        println!("first {}::", serde_json::to_vec(self).unwrap().len());
        let mut compressor = brotli::CompressorWriter::new(
            Vec::new(),
            4096, // buffer size
            11,   // quality (0-11)
            22,   // lgwin
        );
        compressor
            .write_all(&serde_json::to_vec(self).unwrap())
            .expect("Failed to compress data");
        let x = compressor.into_inner();
        println!("second {}", x.len());
        x
    }

    pub fn decompress(data: Vec<u8>) -> Result<Bundle, AppError> {
        let mut decompressor = brotli::DecompressorWriter::new(
            Vec::new(),
            4096, // buffer size
        );
        decompressor.write_all(&data).unwrap();
        match decompressor.into_inner() {
            Ok(vec) => Ok(serde_json::from_slice(&vec).unwrap()),
            Err(_) => Err(AppError::Decompress()),
        }
    }
}

pub fn generate_fake_bundle() -> Bundle {
    // Generate fake Items
    let items: Vec<Item> = (0..100)
        .map(|_| Item {
            time: Utc::now(),
            content: Content::Text(
                rand::thread_rng()
                    .sample_iter(&Alphanumeric)
                    .take(10)
                    .map(char::from)
                    .collect(),
            ),
        })
        .collect();

    // Generate fake Data objects
    let data_entries: Vec<Data> = (0..100)
        .map(|i| {
            Data::new(
                rand::thread_rng()
                    .sample_iter(&Alphanumeric)
                    .take(8)
                    .map(char::from)
                    .collect(),
                {
                    let n = rand::thread_rng().gen_range(1..=6);
                    let vec = (0..=n)
                        .map(|f| {
                            rand::thread_rng()
                                .sample_iter(&Alphanumeric)
                                .take(5)
                                .map(char::from)
                                .collect::<String>()
                        })
                        .collect();
                    Some(vec)
                },
                Some(
                    rand::thread_rng()
                        .sample_iter(&Alphanumeric)
                        .take(20)
                        .map(char::from)
                        .collect(),
                ),
                Some(items.clone()),
            )
        })
        .collect();

    // Create a Bundle with the generated Data
    let mut bundle = Bundle::new(Some(data_entries));

    bundle.sort_by_time();

    // Optionally add more Data entries
    // bundle.add_data(Data::new(
    //     rand::thread_rng()
    //         .sample_iter(&Alphanumeric)
    //         .take(200)
    //         .map(char::from)
    //         .collect(),
    //     None,
    //     None,
    //     None,
    // ));

    bundle
}
