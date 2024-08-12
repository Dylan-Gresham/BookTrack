use std::fs;

use dirs;
use indoc::indoc;
use serde::{Deserialize, Serialize};
use serde_json;

pub static CONFIG_FILE: &'static str = "/config.json";
pub static CONFIG_DIR: &'static str = "/booktrack";
pub static DEFAULT_CONFIG: &'static str = indoc! {r#"
{
    "username": "",
    "db_name": "",
    "db_url": "",
    "db_token": "",
    "theme": "dark"
}
"#};

#[derive(Serialize, Deserialize)]
pub struct Config {
    pub username: String,
    pub db_name: String,
    pub db_url: String,
    pub db_token: String,
    pub theme: String,
}

impl Config {
    pub fn from_config_file() -> Config {
        match read_config() {
            Ok(config_string) => match serde_json::from_str(&config_string) {
                Ok(config) => config,
                Err(_) => Config::default_config(),
            },
            Err(_) => Config::default_config(),
        }
    }

    pub fn default_config() -> Config {
        Config {
            username: "".into(),
            db_name: "".into(),
            db_url: "".into(),
            db_token: "".into(),
            theme: "dark".into(),
        }
    }
}

/// ## read_config
///
/// If a configuration file already exists at $CONFIG_DIR/booktrack/config.json
/// reads it and returns it as an Ok(String). Otherwise, it creates a new
/// configuration file and directories as needed, and returns the default
/// configuarion as an Ok(String).
///
/// In the event that no configuration exists and the program is unable to
/// creeate a new default configuration, returns an error message as an Err(String).
pub fn read_config() -> Result<String, String> {
    if let Some(config) = dirs::config_dir() {
        let config_dir_path = config.into_os_string();

        // Add the application config dir to the config dir
        let mut directories = config_dir_path.clone();
        directories.push(CONFIG_DIR);

        // Add the config path to the config dir
        let mut config_file = config_dir_path;
        config_file.push(CONFIG_DIR);
        config_file.push(CONFIG_FILE);

        match fs::read_to_string(config_file.clone()) {
            Ok(contents) => {
                return Ok(contents);
            }
            Err(_) => {
                // Create the parent directories
                match fs::create_dir_all(directories.clone()) {
                    Ok(_) => println!("Config file created {:?}", directories),
                    Err(_) => println!("Config path either already exists or couldn't be created"),
                }

                // Create the config file
                match fs::write(config_file, DEFAULT_CONFIG) {
                    Ok(_) => {
                        println!("Defailt config file created");
                        return Ok(DEFAULT_CONFIG.to_string());
                    }
                    Err(_) => {
                        return Err(String::from("Unable to create default config file"));
                    }
                }
            }
        }
    } else {
        Err(String::from(
            "Unable to find default a configuration directory for user's OS",
        ))
    }
}

/// ## write_config
///
/// Writes the input config to the config file. If the write
/// was successful, returns an Ok(()). If the write failed,
/// returns an Err(`msg`) where `msg` is the error message.
pub fn write_config(config: Config) -> Result<(), String> {
    if let Some(config_dir) = dirs::config_dir() {
        let config_dir_path = config_dir.into_os_string();

        let mut directories = config_dir_path.clone();
        directories.push(CONFIG_DIR);

        let mut config_file = config_dir_path;
        config_file.push(CONFIG_DIR);
        config_file.push(CONFIG_FILE);

        let formatted_config = indoc::formatdoc! {r#"
{{
    "username": "{username}",
    "db_name": "{db_name}",
    "db_url": "{db_url}",
    "db_token": "{db_token}",
    "theme": "{theme}"
}}
"#,
        username = config.username,
        db_name = config.db_name,
        db_url = config.db_url,
        db_token = config.db_token,
        theme = config.theme
        };

        match fs::write(config_file, formatted_config) {
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string()),
        }
    } else {
        Err(String::from(
            "There was an error writing the config to file",
        ))
    }
}
