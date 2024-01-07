// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dirs;
use libsql_client::Client;
use std::fs;

#[derive(Clone)]
struct DbOptions {
    url: Box<String>,
    token: Box<String>,
}

impl DbOptions {
    fn new(url: Box<String>, token: Box<String>) -> Self {
        Self { url, token }
    }

    fn new_from_strings(url: String, token: String) -> Self {
        Self {
            url: Box::new(url),
            token: Box::new(token),
        }
    }

    fn new_empty() -> Self {
        Self {
            url: Box::new(String::from("")),
            token: Box::new(String::from("")),
        }
    }
}

struct DB {
    connection: Client,
}

impl DB {
    async fn create_db_connection(db_url: &str, db_auth_token: &str) -> libsql_client::Client {
        let connection_result = libsql_client::Client::from_config(libsql_client::Config {
            url: url::Url::parse(db_url).unwrap(),
            auth_token: Some(String::from(db_auth_token)),
        })
        .await
        .unwrap();

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

fn create_parse_config() -> Result<DbOptions, String> {
    let home_dir_path_opt = dirs::home_dir();
    let home_dir_path = match home_dir_path_opt {
        Some(item) => item,
        None => return Err(String::from("ERROR: Unable to find a home directory")),
    };
    let home_dir_str_opt = home_dir_path.to_str();
    let home_dir = match home_dir_str_opt {
        Some(item) => item,
        None => {
            return Err(String::from(
                "ERROR: Unable to parse home directory as a `&str`",
            ))
        }
    };
    let config_dir_format = format!("{}/config/BookTrackConfig", home_dir);
    let config_dir = config_dir_format.as_str();

    let dir_creation_result = fs::create_dir_all(config_dir);
    match dir_creation_result {
        Ok(_) => (),
        Err(e) => {
            return Err(String::from(format!(
                "Error encountered while attempting to create ~/config/BookTrackConfig/ : {e}"
            )))
        }
    };

    let dir = match fs::read_dir(config_dir) {
        Ok(dir) => dir,
        Err(e) => {
            return Err(String::from(format!(
            "Error encountered while attempting to read the dir ~/config/BookTrackConfig/ : {e}"
        )))
        }
    };

    let mut found_config_file: bool = false;
    for file in dir {
        let file = match file {
            Ok(file) => file,
            Err(e) => {
                return Err(String::from(format!(
                    "ERROR: Error happened while attempting to read files in the config dir : {e}"
                )))
            }
        };

        found_config_file = file.file_name() == "library_options.txt";
    }

    if found_config_file {
        let file = fs::read_to_string(format!("{config_dir}/library_options.txt"))
            .expect("ERROR: Config file `library_options.txt` couldn't be read");

        let lines = file.lines().map(|line| line.trim()).collect::<Vec<&str>>();
        let db_options = DbOptions::new_from_strings(lines[0].to_string(), lines[1].to_string());

        return Ok(db_options);
    } else {
        // Run user through setup/Ask user for their DB url & token
        Err(String::from("Unimplemented portion"))
    }
}

#[tokio::main]
async fn main() -> Result<(), String> {
    // TODO: Need to figure out how to get the url and token from the struct

    let db_opts: DbOptions = create_parse_config().unwrap_or_else(|e| DbOptions::new_empty());

    let db_url = db_opts.url.to_string();
    let db_token = db_opts.token.to_string();

    let _db = DB::create_db_connection(&db_url, &db_token).await;

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, update_db_connection])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}
