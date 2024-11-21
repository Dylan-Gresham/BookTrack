// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Define and use the Config module
mod config;
use std::sync::Mutex;

use config::Config;

// Tauri imports
use tauri::{Manager, State};

// 3rd-party crate imports
use libsql::{params, Builder, Connection};
use serde::{Deserialize, Serialize};
use futures::lock;
use reqwest;

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

/// # Booktrack::Book
///
/// Struct used for holding database entries.
#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Book {
    id: u64,
    title: String,
    author: String,
    total_pages: u32,
    pages_read: u32,
    synopsis: String,
    image: String,
    list: String,
}

// Define the struct for Database entries with each field being optional. This is used for making
// the Google Books API request. Some books may not have all the fields so having them be optional
// allows for us to make the requests safely.

/// # Booktrack::BookOpt
///
/// Struct used for holding database entries.
#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ImageLinks {
    small_thumbnail: Option<String>,
    thumbnail: Option<String>,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct VolumeInfo {
    title: Option<String>,
    authors: Option<Vec<String>>,
    page_count: usize,
    description: Option<String>,
    image_links: Option<ImageLinks>,
    language: Option<String>,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct BookOpt {
    id: Option<String>,
    volume_info: Option<VolumeInfo>,
    list: Option<String>,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GbApiResult {
    total_items: usize,
    items: Vec<BookOpt>,
}

// Define state structs

struct DbConnection {
    conn: lock::Mutex<Option<libsql::Connection>>,
}

#[derive(Serialize, Deserialize)]
struct BookList {
    list: Mutex<Vec<Book>>,
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
/// Either a Vector of Books containing every database entry or an error message.
#[tauri::command]
async fn get_all_books() -> Result<Vec<Book>> {
    let db_connection = match get_db_connection().await {
        Ok(conn) => conn,
        Err(msg) => return Err(msg),
    };

    let mut results = db_connection.query("SELECT * FROM dylan", ()).await?;

    let mut books: Vec<Book> = Vec::new();
    while let Some(row) = results.next().await? {
        let book: Book = Book {
            id: row.get(0)?,
            title: row.get(1)?,
            author: row.get(2)?,
            total_pages: row.get(3)?,
            pages_read: row.get(4)?,
            synopsis: row.get(5)?,
            image: row.get(6)?,
            list: row.get(7)?,
        };

        books.push(book);
    }

    Ok(books)
}

/// # Booktrack::update_config
///
/// Updates the config file and cached internal state with the input parameters.
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
    state: State<Mutex<Config>>,
) -> Result<String> {
    config::write_config(Config {
        username: username.clone(),
        db_name: db_name.clone(),
        db_url: db_url.clone(),
        db_token: db_token.clone(),
        theme: theme.clone(),
        book_lists: book_lists.clone(),
    })
    .map_err(|e| Error { msg: e })?;

    let mut state = state.lock()?;

    state.username = username;
    state.db_name = db_name;
    state.db_url = db_url;
    state.db_token = db_token;
    state.theme = theme;
    state.book_lists = book_lists;

    Ok("Wrote new config successfully!".into())
}

#[tauri::command]
fn print_to_console(msg: String) {
    println!("{}", msg);
}

#[tauri::command]
async fn make_gb_api_req(title: Option<String>, author: Option<String>) -> std::result::Result<GbApiResult, String> {
    let client = reqwest::Client::new();

    let book_title: String;
    let book_author: String;
    let book_lang = String::from("en");

    if let Some(titl) = title {
        book_title = titl;
    } else {
        book_title = String::new();
    }

    if let Some(auth) = author {
        book_author = auth;
    } else {
        book_author = String::new();
    }

    let url: String;
    if !book_title.is_empty() && !book_author.is_empty() {
        url = format!("https://www.googleapis.com/books/v1/volumes?q={}+{}&printType=books", book_title, book_author);
    } else if !book_title.is_empty() {
        url = format!("https://www.googleapis.com/books/v1/volumes?q={}&printType=books", book_title);
    } else if !book_author.is_empty() {
        url = format!("https://www.googleapis.com/books/v1/volumes?q={}&printType=books", book_author);
    } else {
        return Err(String::from("Both title and author are empty. Unable to make API request."));
    }

    let mut api_result: GbApiResult = match client.get(url).send().await {
        Ok(res) => {
            match res.json().await {
                Ok(api_res) => api_res,
                Err(api_conv_err) => return Err(api_conv_err.to_string()),
            }
        }
        Err(e) => return Err(e.to_string()),
    };

    api_result.items = api_result.items.into_iter().filter(|vol|  {
        if let Some(vol_info) = &vol.volume_info {
            if let Some(lang) = &vol_info.language {
                if *lang == book_lang {
                    if vol_info.page_count > 0 {
                        true
                    } else {
                        false
                    }
                } else {
                    false
                }
            } else {
                false
            }
        } else {
            false
        }
    }).collect();

    if api_result.items.len() > 10 {
        api_result.items = api_result.items[0..10].to_vec();
    }
    api_result.total_items = api_result.items.len();

    Ok(api_result)
}

async fn complete_book(book: &mut Book) {
    let gb_res = match make_gb_api_req(Some(book.title.clone()), Some(book.author.clone())).await {
        Ok(res) => res,
        Err(e) => {
            eprintln!("Error making Google Books API Request.\nError:\n\t{e}");
            return;
        }
    };

    match gb_res.items.first() {
        Some(item) => {
            match &item.volume_info {
                Some(info) => {
                    if book.synopsis.is_empty() {
                        match &info.description {
                            Some(desc) => book.synopsis = desc.to_string(),
                            None => (),
                        }
                    }

                    if book.title.is_empty() {
                        match &info.title {
                            Some(title) => book.title = title.to_string(),
                            None => (),
                        }
                    }

                    if book.author.is_empty() {
                        match &info.authors {
                            Some(authors) => {
                                if authors.len() > 0 {
                                    book.author = authors[0].to_string();
                                }
                            }
                            None => (),
                        }
                    }

                    if book.image.is_empty() {
                        match &info.image_links {
                            Some(links) => {
                                if let Some(thumbnail) = &links.thumbnail {
                                    book.image = thumbnail.to_string();
                                } else if let Some(small_thumbnail) = &links.small_thumbnail {
                                    book.image = small_thumbnail.to_string();
                                }
                            }
                            None => (),
                        }
                    }

                    if book.total_pages == 0 {
                        book.total_pages = info.page_count as u32;
                    }
                }
                None => (),
            }
        }
        None => (),
    }
}

#[tauri::command]
async fn update_db(conn: State<'_, DbConnection>, book_list: State<'_, BookList>, mut book: Book) -> std::result::Result<(), ()> {
    complete_book(&mut book).await;
    add_to_booklist(book.clone(), book_list);

    match &mut *conn.conn.lock().await {
        Some(connection) => {
            match connection.execute(
                "INSERT INTO books (id, title, author, totalPages, pagesRead, synopsis, link, list, label) VALUES ()",
                params![book.id, book.title, book.author, book.total_pages, book.pages_read, book.synopsis, book.image, book.list, 1],
            ).await {
                Ok(_) => {
                    println!("Database successfully updated.");
                    Ok(())
                }
                Err(e) => {
                    eprintln!("Erorr executing the SQL query.\nError\n\t{e}");
                    Err(())
                }
            }
        }
        None => {
            eprintln!("No database connection exists!");
            Err(())
        }
    }
}

#[tauri::command]
fn add_to_booklist(book: Book, state: State<BookList>) {
    state.list.lock().unwrap().push(book);
}

#[tauri::command]
async fn refresh_db_connection(state: State<'_, DbConnection>) -> Result<()> {
    *state.conn.lock().await = match get_db_connection().await {
        Ok(c) => Some(c),
        Err(_) => None,
    };

    Ok(())
}

#[tauri::command]
fn get_config_from_state(state: State<Mutex<Config>>) -> Config {
    state.inner().lock().unwrap().clone()
}

#[tauri::command]
fn get_booklist_from_state(state: State<BookList>) -> Vec<Book> {
    state.list.lock().unwrap().to_vec()
}

fn initialize_booklist() -> BookList {
    let mut books: Vec<Book> = Vec::with_capacity(25);

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
        .manage(Mutex::new(get_config()))
        .manage(DbConnection { conn: lock::Mutex::new(None) })
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
            update_db,
            refresh_db_connection,
            get_config_from_state,
            get_booklist_from_state,
            print_to_console,
            make_gb_api_req,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
