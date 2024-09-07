// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Define and use the Config module
mod config;
use config::Config;

// Tauri imports
use tauri::Manager;

// 3rd-party crate imports
use libsql::{Builder, Connection};
use serde::{Deserialize, Serialize};

// Define the Error struct
#[derive(Serialize, Debug)]
struct Error {
    msg: String,
}

// Define the Result shorthand struct using the custom Error struct
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

// Define the struct for Database entries

/// # Booktrack::DBItem
///
/// Struct used for holding database entries.
#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct DBItem {
    title: String,
    author: String,
    total_pages: u32,
    pages_read: u32,
    image: String,
}

// Alias function for readability
fn get_config() -> Config {
    config::Config::from_config_file()
}

/// # Booktrack::get_db_connection
///
/// Gets a `Connection` struct instance to the database using the token and URL in the
/// configuration file.
///
/// If a connection, can't be made, an error message is returned instead.
async fn get_db_connection() -> Result<Connection> {
    let config = get_config();

    // Get the database instance
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

    // Create the database connection
    let db_connection = match db.connect() {
        Ok(conn) => conn,
        Err(_) => {
            return Err(Error {
                msg: String::from("Unable to connect to remote database."),
            })
        }
    };

    // Return the connection if it was successful
    Ok(db_connection)
}

/// # Booktrack::get_all_books
///
/// Tauri command that queries the databse for all books stored within it.
///
/// ## Returns
///
/// Either a Vector of DBItems containing every database entry or an error message.
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

/// # Booktrack::update_config
///
/// Updates the config file with the input parameters.
///
/// ## Returns
///
/// A String that affirms or negates whether or not the file was overwritten.
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

#[tauri::command]
fn print_to_console(msg: String) {
    println!("{}", msg);
}

fn main() {
    tracing_subscriber::fmt::init();

    tauri::Builder::default()
        .setup(|app| {
            // Get the app and windows
            let splashscreen_window = app
                .get_window("splashscreen")
                .expect("No window labeled 'splashscreen' found");
            let main_window = app
                .get_window("main")
                .expect("No window labeled 'main' found");

            // Perform initialization on a new task so app doesn't freeze
            tauri::async_runtime::spawn(async move {
                println!("Getting all books in DB...");

                let books: Option<Vec<DBItem>> = match get_all_books().await {
                    Ok(books) => {
                        println!("Books:");
                        for book in &books {
                            println!("\t{:?}", book);
                        }

                        Some(books)
                    }
                    Err(_) => {
                        println!("Unable to get books");

                        None
                    }
                };

                println!("Done initializing!");

                println!("Getting config...");

                let config = get_config();
                println!("{:?}", config.clone());

                // Close splashscreen and show main window
                splashscreen_window.close().unwrap();
                main_window.show().unwrap();

                tokio::time::sleep(tokio::time::Duration::from_secs(3)).await;

                // Emit the configuration to the frontend
                match &main_window.emit("START_CONFIG", config) {
                    Ok(_) => println!("Config emitted to frontend"),
                    Err(e) => eprintln!("Unable to emit config to frontend\nError: {}", e),
                };

                // Emit the starting books array to the frontend
                if let Some(books_vec) = books {
                    match &main_window.emit("START_BOOKS", books_vec) {
                        Ok(_) => println!("Books emitted to frontend"),
                        Err(e) => eprintln!("Unable to emit config to frontend\nError: {}", e),
                    };
                } else {
                    // If there's no books to send, send an empty array anyways
                    //
                    // This prevents complicated logic with the frontend where
                    // we'd have to listen for the event to either occur or some other criteria
                    // to happen to stop listening for this event.
                    let books_vec: Vec<DBItem> = Vec::with_capacity(0);
                    match &main_window.emit("START_BOOKS", books_vec) {
                        Ok(_) => println!("Books emitted to frontend"),
                        Err(e) => eprintln!("Unable to emit config to frontend\nError: {}", e),
                    };
                }
            });


            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_all_books,
            update_config,
            print_to_console,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
