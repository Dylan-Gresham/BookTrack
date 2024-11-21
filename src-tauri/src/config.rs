// Rust std library imports
use std::fs;

// 3rd-party crate imports
use indoc::indoc;
use serde::{Deserialize, Serialize};

// Define constants
pub static CONFIG_FILE: &str = "/config.json";
pub static CONFIG_DIR: &str = "/booktrack";
pub static DEFAULT_CONFIG: &str = indoc! {r#"
{
    "username": "",
    "db_name": "",
    "db_url": "",
    "db_token": "",
    "theme": "dark",
    "book_lists": ["In Progress", "Planned", "Aside", "Completed", "Dropped"]
}
"#};

// Define Config struct fields and methods

/// # Booktrack::Config
///
/// Struct containing the fields for the configuration file.
///
/// The configuration file itself will live in the users default configuration path ->
/// booktrack/config.json.
///
/// According to the `dirs` crate documentation, this path is:
///
/// ```console
/// Linux = /home/<USER>/.config/booktrack/config.json
/// MacOS = /Users/<USER>/Library/Application Support/booktrack/config.json
/// Windows = C:\Users\<USER>\AppData\Roaming\booktrack\config.json
/// ```
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Config {
    pub username: String,
    pub db_name: String,
    pub db_url: String,
    pub db_token: String,
    pub theme: String,
    pub book_lists: Vec<String>,
}

impl Config {
    /// # Booktrack::Config::from_config_file
    ///
    /// Reads the configuratin file from disk.
    ///
    /// ## Returns
    ///
    /// Always returns a Confing struct.
    ///
    /// If the configuration file exists, can be read, and is a valid JSON format that can be read
    /// by `serde_json::from_str` that is what is returned.
    ///
    /// If any of the above conditions aren't met, then the default configuration is returned.
    pub fn from_config_file() -> Config {
        match read_config() {
            Ok(config_string) => match serde_json::from_str(&config_string) {
                Ok(config) => config,
                Err(_) => Config::default_config(),
            },
            Err(_) => Config::default_config(),
        }
    }

    /// # Booktrack::Config::default_config
    ///
    /// Returns a Config struct with the default values.
    pub fn default_config() -> Config {
        Config {
            username: "".into(),
            db_name: "".into(),
            db_url: "".into(),
            db_token: "".into(),
            theme: "dark".into(),
            book_lists: vec![
                "In Progress".into(),
                "Planned".into(),
                "Aside".into(),
                "Completed".into(),
                "Dropped".into(),
            ],
        }
    }
}

/// ## Booktrack::read_config
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
                Ok(contents)
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
                        println!("Default config file created");
                        Ok(DEFAULT_CONFIG.to_string())
                    }
                    Err(_) => {
                        Err(String::from("Unable to create default config file"))
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

/// ## Booktrack::write_config
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

        let serialized_string = serde_json::to_string_pretty(&config)
            .map_err(|e| format!("error serializing config: {e}"))?;

        match fs::write(config_file, serialized_string) {
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string()),
        }
    } else {
        Err(String::from(
            "There was an error writing the config to file",
        ))
    }
}
