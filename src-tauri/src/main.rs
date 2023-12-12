// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use libsql_client::Client;
use std::fs;

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

#[tokio::main]
async fn main() -> Result<(), String> {
    let _db = DB::create_db_connection(
        "libsql://booktrack-db-dylan-gresham.turso.io",
         "TOKEN").await;

    let dir_creation_result = fs::create_dir_all("~/config/BookTrack/");
    let (dir_creation_continue, error) = match dir_creation_result {
        Ok(_) => (true, String::from("")),
        Err(e) => {
            eprintln!("Error encountered while attempting to create ~/config/BookTrack/ : {e}");
            (false, e.to_string())
        }
    };

    if dir_creation_continue {
        tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, update_db_connection])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
        Ok(())
    } else {
        Err(error)
    }
}
