// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use libsql_client::Client;

struct DB {
    connection: Client
}

impl DB {
    async fn create_db_connection(db_url: &str, db_auth_token: &str) -> Self {
        Self {
            connection: libsql_client::Client::from_config(libsql_client::Config {
                url: url::Url::parse(db_url).unwrap(),
                auth_token: Some(String::from(db_auth_token)),
            }).await.unwrap(),
        }
    }
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    let _db = DB::create_db_connection(
        "libsql://booktrack-db-dylan-gresham.turso.io",
         "TOKEN");
    
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
