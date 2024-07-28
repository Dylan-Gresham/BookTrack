// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod config;

use libsql::{Builder, Connection};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Debug)]
struct Error {
    msg: String,
}

type Result<T> = std::result::Result<T, Error>;

impl<T> From<T> for Error where T: std::error::Error {
    fn from(value: T) -> Self {
        Self {
            msg: value.to_string(),
        }
    }
}

#[derive(Deserialize, Serialize, Debug)]
pub struct DBItem {
    title: String,
    author: String,
    total_pages: u32,
    pages_read: u32,
    image: String,
}

async fn get_db_connection() -> Result<Connection> {
    let config = config::Config::from_config_file();

    let db = match Builder::new_remote(config.db_url, config.db_token).build().await {
        Ok(db) => db,
        Err(_) => return Err(Error {
            msg: String::from("Unable to find remote database.")
        }),
    };

    let db_connection = match db.connect() {
        Ok(conn) => conn,
        Err(_) => return Err(Error {
            msg: String::from("Unable to connect to remote database.")
        }),
    };

    Ok(db_connection)
}

#[tauri::command]
async fn get_all_books() -> Result<Vec<DBItem>> {
    let db_connection = match get_db_connection().await {
        Ok(conn) => conn,
        Err(msg) => return Err(msg),
    };

    let mut results = db_connection
        .query("SELECT * FROM books", ())
        .await?;

    let mut books: Vec<DBItem> = Vec::new();
    while let Some(row) = results.next().await? {
        let book: DBItem = DBItem {
            title: row.get(0)?,
            author: row.get(1)?,
            total_pages: row.get(2)?,
            pages_read: row.get(3)?,
            image: row.get(4)?
        };

        books.push(book);
    }

    Ok(books)
}

fn main() {
    tracing_subscriber::fmt::init();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_all_books,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
