// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod config;
use config::Config;

use tauri::Manager;

use libsql::{Builder, Connection};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Debug)]
struct Error {
    msg: String,
}

type Result<T> = std::result::Result<T, Error>;

impl<T> From<T> for Error
where
    T: std::error::Error,
{
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

fn get_config() -> Config {
    config::Config::from_config_file()
}

async fn get_db_connection() -> Result<Connection> {
    let config = config::Config::from_config_file();

    let db = match Builder::new_remote(config.db_url, config.db_token)
        .build()
        .await
    {
        Ok(db) => db,
        Err(_) => {
            return Err(Error {
                msg: String::from("Unable to find remote database."),
            })
        }
    };

    let db_connection = match db.connect() {
        Ok(conn) => conn,
        Err(_) => {
            return Err(Error {
                msg: String::from("Unable to connect to remote database."),
            })
        }
    };

    Ok(db_connection)
}

#[tauri::command]
async fn get_all_books() -> Result<Vec<DBItem>> {
    let db_connection = match get_db_connection().await {
        Ok(conn) => conn,
        Err(msg) => return Err(msg),
    };

    let mut results = db_connection.query("SELECT * FROM books", ()).await?;

    let mut books: Vec<DBItem> = Vec::new();
    while let Some(row) = results.next().await? {
        let book: DBItem = DBItem {
            title: row.get(0)?,
            author: row.get(1)?,
            total_pages: row.get(2)?,
            pages_read: row.get(3)?,
            image: row.get(4)?,
        };

        books.push(book);
    }

    Ok(books)
}

#[tauri::command]
fn update_config(
    username: String,
    db_name: String,
    db_url: String,
    db_token: String,
    theme: String,
) -> Result<String> {
    match config::write_config(Config {
        username,
        db_name,
        db_url,
        db_token,
        theme,
    }) {
        Ok(_) => Ok(String::from("Wrote new config successfully!")),
        Err(e) => Err(Error { msg: e }),
    }
}

fn main() {
    tracing_subscriber::fmt::init();

    tauri::Builder::default()
        .setup(|app| {
            let splashscreen_window = app
                .get_window("splashscreen")
                .expect("No window labeled 'splashscreen' found");
            let main_window = app
                .get_window("main")
                .expect("No window labeled 'main' found");

            let app_handle = app.app_handle();

            // Perform initialization on a new task so app doesn't freeze
            tauri::async_runtime::spawn(async move {
                println!("Getting all books in DB...");

                match get_all_books().await {
                    Ok(books) => {
                        println!("Books:");
                        for book in books {
                            println!("\t{:?}", book);
                        }
                    }
                    Err(_) => println!("Unable to get books"),
                }

                println!("Done initializing!");

                // Close splashscreen and show main window
                splashscreen_window.close().unwrap();
                main_window.show().unwrap();
            });

            println!("Getting config...");

            let config = get_config();
            println!("{:?}", config.clone());

            match app_handle.emit_all("START_CONFIG", config) {
                Ok(_) => println!("Config emitted to frontend"),
                Err(e) => eprintln!("Unable to emit config to frontend\nError: {}", e),
            };

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_all_books,
            update_config,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
