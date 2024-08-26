// Defining the Config interface
export interface Config {
  username: string;
  dbName: string;
  dbUrl: string;
  dbToken: string;
  theme: "light" | "dark";
}

/**
 * Checks if the object is an instance of the Config interface
 */
export function instanceOfConfig(object: any): object is Config {
  if (
    object.username !== undefined &&
    object.db_name !== undefined &&
    object.db_url !== undefined &&
    object.db_token !== undefined &&
    object.theme !== undefined &&
    (object.theme === "light" || object.theme === "dark")
  ) {
    return true;
  } else {
    return false;
  }
}
