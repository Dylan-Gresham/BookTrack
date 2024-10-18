// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Define and use the Config module
mod config;
use std::sync::Mutex;

use config::Config;

// Tauri imports
use tauri::{Manager, State};

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
    id: u64,
    title: String,
    author: String,
    total_pages: u32,
    pages_read: u32,
    image: String,
    list: String,
}

// Define state structs

struct DbConnection {
    conn: Mutex<Option<libsql::Connection>>,
}

#[derive(Serialize, Deserialize)]
struct BookList {
    list: Mutex<Vec<DBItem>>,
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
            id: row.get(0)?,
            title: row.get(1)?,
            author: row.get(2)?,
            total_pages: row.get(3)?,
            pages_read: row.get(4)?,
            image: row.get(5)?,
            list: row.get(6)?,
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
    book_lists: Vec<String>,
) -> Result<String> {
    match config::write_config(Config {
        username,
        db_name,
        db_url,
        db_token,
        theme,
        book_lists,
    }) {
        Ok(_) => Ok(String::from("Wrote new config successfully!")),
        Err(e) => Err(Error { msg: e }),
    }
}

#[tauri::command]
fn print_to_console(msg: String) {
    println!("{}", msg);
}

#[tauri::command]
fn add_to_booklist(book: DBItem, state: State<BookList>) {
    state.list.lock().unwrap().push(book);
}

#[tauri::command]
async fn refresh_db_connection(state: State<'_, DbConnection>) -> Result<()> {
    *state.conn.lock().unwrap() = match get_db_connection().await {
        Ok(c) => Some(c),
        Err(_) => None,
    };

    Ok(())
}

#[tauri::command]
fn get_config_from_state(state: State<Config>) -> Config {
    state.inner().clone()
}

#[tauri::command]
fn get_booklist_from_state(state: State<BookList>) -> Vec<DBItem> {
    state.list.lock().unwrap().to_vec()
}

fn initialize_booklist() -> BookList {
    let mut books: Vec<DBItem> = Vec::with_capacity(25);

    println!("Initializing book list...");

    match tokio::runtime::Runtime::new()
        .expect("Unable to create a Tokio runtime")
        .block_on(get_all_books())
    {
        Ok(books_db) => books.extend(books_db),
        Err(_) => eprintln!("Get all books returned none"),
    };

    println!("{:?}", books);

    println!("Done initializing book list!");

    BookList {
        list: Mutex::new(books),
    }
}

fn main() {
    tracing_subscriber::fmt::init();

    tauri::Builder::default()
        .manage(initialize_booklist())
        .manage(get_config())
        .manage(DbConnection { conn: Mutex::new(None) })
        .setup(|app: &mut tauri::App| {
            // Get the app and windows
            let splashscreen_window = app
                .get_window("splashscreen")
                .expect("No window labeled 'splashscreen' found");
            let main_window = app
                .get_window("main")
                .expect("No window labeled 'main' found");

            let app_handle = app.app_handle();

            // Perform initialization on a new task so app doesn't freeze
            tauri::async_runtime::spawn(async move {
                println!("Initializing database connection...");

                match refresh_db_connection(app_handle.state()).await {
                    Ok(_) => println!("Done initializing database connection!"),
                    Err(_) => {
                        let mut attempts = 0;
                        loop {
                            if attempts == 10 { break; }
                            match refresh_db_connection(app_handle.state()).await {
                                Ok(_) => println!("Done initializing database connection!"),
                                Err(_) => {
                                    attempts += 1;
                                    continue;
                                }
                            }
                        }

                        if attempts == 10 {
                            eprintln!("Failed to initialize database connection. Please check your internet connection");
                        }
                    }
                };

                // Close splashscreen and show main window
                splashscreen_window.close().unwrap();
                main_window.show().unwrap();
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_all_books,
            update_config,
            add_to_booklist,
            refresh_db_connection,
            get_config_from_state,
            get_booklist_from_state,
            print_to_console,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
