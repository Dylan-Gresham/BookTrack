// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use libsql_client::Client;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

async fn create_db_connection() -> Client {
    let db = libsql_client::Client::from_config(libsql_client::Config {
        url: url::Url::parse("libsql://booktrack-db-dylan-gresham.turso.io").unwrap(),
        auth_token: Some(String::from("DB_TOKEN_HERE")),
    }).await.unwrap();

    return db;
}

fn main() {
    let db = create_db_connection();
    // I think I need to create a DB struct that has all the database methods there
    // that way the entire struct has access to the connection and that way I don't
    // need to figure out how to make a global connection variable

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
