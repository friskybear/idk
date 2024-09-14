use std::sync::LazyLock;

use crate::bundle::{Bundle, Header};
use anyhow::Result;
use parking_lot::Mutex;
use surrealdb::engine::any::Any;
use surrealdb::engine::local::Db;
use surrealdb::engine::remote::ws::Client;
use surrealdb::sql::Uuid;
use surrealdb::{Response, Surreal};

pub(crate) static DB: LazyLock<Mutex<Surreal<Db>>> = LazyLock::new(|| Mutex::new(Surreal::init()));

pub(crate) async fn import_bundle(bundle: &Bundle) -> Result<()> {
    let db = DB.lock();
    let existing_ids: Vec<Uuid> = db
        .query("SELECT header.id as id FROM bundle")
        .await?
        .take("id")
        .unwrap();

    if existing_ids.contains(&bundle.header.id) {
        let existing_bundle: Option<Bundle> = db
            .query("SELECT * FROM bundle WHERE header.id = $id")
            .bind(("id", bundle.header.id))
            .await
            .unwrap()
            .take(0)
            .unwrap();

        if let Some(existing) = existing_bundle {
            if bundle.header.time > existing.header.time {
                db.query("UPDATE bundle SET * = $bundle WHERE header.id = $id")
                    .bind(("bundle", bundle.clone()))
                    .bind(("id", bundle.header.id))
                    .await
                    .unwrap();
            }
        }
    } else {
        let x: Option<Bundle> = db.create("bundle").content(bundle.clone()).await.unwrap();
    }

    Ok(())
}
