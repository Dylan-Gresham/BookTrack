// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use libsql_client::Client;
use std::fs;
use dirs;

struct DB {
    _connection: Client
}

impl DB {
    async fn create_db_connection(db_url: &str, db_auth_token: &str) -> libsql_client::Client {
        let connection_result = libsql_client::Client::from_config(libsql_client::Config {
                url: url::Url::parse(db_url).unwrap(),
                auth_token: Some(String::from(db_auth_token)),
            }).await.unwrap();

        connection_result
    }
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn update_db_connection(_db_token: &str) -> () {
    todo!()
}

fn create_parse_config() -> Result<(&'static str, &'static str), String> {
    let home_dir_path_opt = dirs::home_dir();
    let home_dir_path = match home_dir_path_opt {
        Some(item) => item,
        None => return Err(String::from("ERROR: Unable to find a home directory")),
    };
    let home_dir_str_opt = home_dir_path.to_str();
    let home_dir = match home_dir_str_opt {
        Some(item) => item,
        None => return Err(String::from("ERROR: Unable to parse home directory as a `&str`")),
    };
    let config_dir_format = format!("{}/config/BookTrackConfig", home_dir);
    let config_dir = config_dir_format.as_str();

    let dir_creation_result = fs::create_dir_all(config_dir);
    match dir_creation_result {
        Ok(_) => (),
        Err(e) => return Err(String::from(
            format!("Error encountered while attempting to create ~/config/BookTrack/ : {e}")
            ))
    };

    Ok(("https://todo.com", "todo!"))
}

#[tokio::main]
async fn main() -> Result<(), String> {
    let (url, db_token) = match create_parse_config() {
        Ok(tuple) => tuple,
        Err(e) => return Err(e),
    };

    let _db = DB::create_db_connection(url, db_token).await;

    tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![greet, update_db_connection])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
    Ok(())
}
