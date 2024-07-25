use std::fs;

use dirs;
use indoc::indoc;

pub static CONFIG_FILE: &'static str = "/config.json";
pub static CONFIG_DIR: &'static str = "/booktrack";
pub static DEFAULT_CONFIG: &'static str = indoc! {r#"
{
    "username": "",
    "dbDetails": {
        "name": "",
        "url": ""
    },
    "theme": ""
}
"#};

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
        Err(String::from("Unable to find default a configuration directory for user's OS"))
    }
}

