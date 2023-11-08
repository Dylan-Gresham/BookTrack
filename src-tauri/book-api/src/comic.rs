use serde_json::{json, Value};
use reqwest::Client;

#[derive(Debug, Clone)]
pub struct Comic {
    pub title: String,
    pub chapters: u64,
    pub genres: Vec<String>,
    pub thumbnail_urls: Vec<String>,
}

impl Comic {
    pub fn new(title: String, chapters: u64, genres: Vec<String>,
               thumbnail_urls: Vec<String>) -> Self {
        Self { title, chapters, genres, thumbnail_urls }
    }

    pub fn to_string(&self) -> String {
        // Get starting String
        let mut genres_list: String = String::from("");

        if !self.genres.is_empty() {
            // Push all genres on
            for genre in self.genres.iter() {
                genres_list.push_str(genre);
                genres_list.push_str(", ");
            }

            // Remove trailing ", "
            let mut genres_list_len = genres_list.len();
            genres_list.remove(genres_list_len - 1);
            genres_list_len -= 1;
            genres_list.remove(genres_list_len - 1);
        }

        // Get starting String
        let mut thumbnail_urls_list: String = String::from("");

        if !self.thumbnail_urls.is_empty() {
            // Push all urls on
            for url in self.thumbnail_urls.iter() {
                thumbnail_urls_list.push_str(format!("{}\n", url).as_str());
            }

            // Remove trailing ", "
            let url_list_length = thumbnail_urls_list.len();
            if url_list_length > 2 {
                thumbnail_urls_list.remove(url_list_length - 1);
            }
        }

        // Format and return
        format!("\
                {} has {} chapters and is labeled as being a(n) {} \
                manga/manhua/manhwa\nThumbnail urls:\n{}",
                self.title, self.chapters, genres_list, thumbnail_urls_list)
    }
}

fn build_comic_search_query(title: &str) -> Result<Value, String> {
    let time_of_start = std::time::SystemTime::now();
    println!("Building query...\n");
    if title == "" { // If invalid to search for
        Err(String::from("invalid input data"))
    } else {
        // Define query
        const QUERY: &str = "
        query ($str: String) {
          Media (search: $str) {
            chapters
            genres
            title {
              english
            }
            coverImage {
              medium
              large
            }
          }
        }
        ";

        // Make the actual json query to send
        let json = json!({"query": QUERY, "variables": {"str": title}});
        match time_of_start.elapsed() {
            Ok(elapsed) => {println!("\
                                     Took {} milliseconds to build the query \
                                     \n\n", elapsed.as_millis());}
            Err(e) => {println!("\
                                Error occurred getting the time it took to \
                                build the query. Error: {:?}\n\n", e);}
        };

        Ok(json)
    }
}
fn trim_field(field: &str) -> String {
    let time_of_start = std::time::SystemTime::now();
    println!("Start trimming the response...\n");
    // Get the iterator which trims the desired things off
    let chars = field.chars();

    // Return
    let chars: String = chars.as_str().to_string();
    match time_of_start.elapsed() {
        Ok(elapsed) => {println!("\
                                 Took {} milliseconds to build the query\n\n",
                                 elapsed.as_millis());}
        Err(e) => {println!("\
                            Error occurred getting the time it took to trim \
                            the response. Error: {:?}\n\n", e);}
    };

    chars
}

fn valuevec_to_stringvec(value_vec: &Vec<Value>) -> Result<Vec<String>, String> {
    let mut ret_vec: Vec<String>;
    if value_vec.is_empty() {
        ret_vec = Vec::new();
    } else {
        // Create a Vec<String> of the ret_vec without any leading/trailing
        ret_vec = Vec::with_capacity(value_vec.iter().count());
        for genre in value_vec.into_iter() {
            let value_as_str = match genre.as_str() {
                Some(str) => str,
                None => return Err("\
                                   An error occurred unwrapping the value as \
                                   str in valuevec_to_stringvec"
                                   .parse().unwrap()),
            };

            ret_vec.push(trim_field(value_as_str));
        }
    }

    Ok(ret_vec)
}

fn parse_graphql_response(response: Value) -> Result<Comic, String> {
    let time_of_start = std::time::SystemTime::now();
    println!("Start parsing graphql response...\n");

    // Check if we received an error back
    let err: Option<&Value> = response.get("errors");
    if err.is_some() { // If we did receive an error
        return Err(String::from("Query returned an error")) // Return Result
    }

    // Grab the title from the response
    let title_option: Option<&str> = response.get("data")
        .and_then(|response| response.get("Media"))
        .and_then(|response| response.get("title"))
        .and_then(|response| response.get("english"))
        .and_then(|response| response.as_str());
    let title: String = match title_option {
        Some(title) => title.to_string(),
        None => "Not found".to_string(),
    };

    // Grab the chapters from the response
    let chapters_option: Option<u64> = response.get("data")
        .and_then(|response| response.get("Media"))
        .and_then(|response| response.get("chapters"))
        .and_then(|response| response.as_u64());
    let chapters: u64 = match chapters_option {
        Some(chapters) => chapters,
        None => 0,
    };

    // Grab the genres from the response
    let genres_array_option: Option<&Vec<Value>> = response.get("data")
        .and_then(|response| response.get("Media"))
        .and_then(|response| response.get("genres"))
        .and_then(|response| response.as_array());
    let binding = &vec!();
    let genres_array = match genres_array_option {
        Some(arr) => arr,
        None => &binding,
    };

    let genres = valuevec_to_stringvec(genres_array).unwrap();

    // Thumbnail URLs are individual properties like the title field so can't
    // get them as an array, need to get them individually then put them 
    // together into an array or reconfigure the Comic struct to hold a 
    // separate field for each URL
    let thumbnail_medium_url: Option<&str> = response.get("data")
        .and_then(|response| response.get("Media"))
        .and_then(|response| response.get("coverImage"))
        .and_then(|response| response.get("medium"))
        .and_then(|response| response.as_str());
    let thumbnail_large_url: Option<&str> = response.get("data")
        .and_then(|response| response.get("Media"))
        .and_then(|response| response.get("coverImage"))
        .and_then(|response| response.get("large"))
        .and_then(|response| response.as_str());

    let medium_thumbnail: String = match thumbnail_medium_url {
        Some(url) => url.to_string(),
        None => "No URL Found".to_string(),
    };

    let large_thumbnail: String = match thumbnail_large_url {
        Some(url) => url.to_string(),
        None => "No URL Found".to_string(),
    };

    let thumbnails: Vec<String> = vec!(medium_thumbnail, large_thumbnail);

    // Return the comic struct
    let comic: Comic = Comic::new(title,
                                  chapters,
                                  genres,
                                  thumbnails);

    match time_of_start.elapsed() {
        Ok(elapsed) => {println!("\
                                 Took {} milliseconds to parse the json and \
                                 build the Comic struct\n\n",
                                 elapsed.as_millis());}
        Err(e) => {println!("\
                            An error occurred trying to get the time it took \
                            to parse the json and build the Comic struct. \
                            Error: {:?}\n\n", e);}
    }

    Ok(comic)
}

pub async fn search_for_comic(client: &Client, title: &str) -> Result<Comic, String> {
    let time_of_start = std::time::SystemTime::now();
    println!("Start searching for comic...\n");
    // Make json
    let json = match build_comic_search_query(title) {
        Ok(json) => json,
        Err(e) => {return Err(format!("Invalid title: {}\nError: {}",
                                      title, e))},
    };
    
    // Make HTTP POST request
    let response_result = client.post("https://graphql.anilist.co/")
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .body(json.to_string())
                    .send()
                    .await;

    // Handle cases for the HTTP POST request
    let response_matched = match response_result {
        Ok(response) => response,
        Err(_) => return Err(String::from("Failed to send the request")),
    };

    // Unwrap and get the text (json) that was sent back
    let response = response_matched.text().await.unwrap();

    // Get as a Value to then parse into a Comic
    let result: Value = serde_json::from_str(&response).unwrap();

    // Parse and return as Comic object 
    // or as a Err(String) if there was an error returned
    let parsed_comic_result = parse_graphql_response(result);
    match time_of_start.elapsed() {
        Ok(elapsed) => {println!("\
                                 Took {} milliseconds to search for the \
                                 comic\n\n",
                                 elapsed.as_millis());}
        Err(e) => {println!("\
                            An error occurred getting the time it took \
                            searching for the comic. Error: {:?}\n\n",
                            e);}
    }

    parsed_comic_result
}
