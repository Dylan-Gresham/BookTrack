// Imports
use serde_json::Value;
use reqwest::Client;

// Definition of Book struct
#[derive(Debug, Clone)]
pub struct Book {
    pub title: String,
    pub authors: Vec<String>,
    pub page_count: u64,
    pub main_genre: String,
    pub all_genres: Vec<String>,
    pub thumbnails: Vec<String>,
}

// Methods for Book struct
impl Book {
    // Book constructor
    pub fn new(title: String, authors: Vec<String>, page_count: u64, 
               main_genre: String, all_genres: Vec<String>, 
               thumbnails: Vec<String>) -> Self {
        Self { title, authors, page_count, main_genre, all_genres, thumbnails }
    }

    // Book's to_string method
    pub fn to_string(&self) -> String {
        format!("This is a Book")
    }
}

fn build_book_search_url(title: String, author: String, api_key: &str)
    -> Result<String, String> {
    if title == "" {
        if author == "" {
            Err(String::from("Both title and author search terms are blank"))
        } else {
           Ok(format!("\
                    https://www.googleapis.com/books/v1/volumes?q=inauthor:{}\
                          &key={}", author, api_key)) 
        }
    } else if author == "" {
       Ok(format!("\
                https://www.googleapis.com/books/v1/volumes?q=intitle:{}\
                      &key={}", title, api_key)) 
    } else {
       Ok(format!("https://www.googleapis.com/books/v1/volumes?q=intitle:{}\
                +inauthor:{}&key={}", title, author, api_key)) 
    }
}

fn parse_book_result(result: Value) -> Result<Book, String> {
    println!("{:?}", result);
    Err(String::from("Doing"))
}

pub async fn search_for_book(client: &Client, api_key: &str,
                             search_title: String, search_author: String)
                            -> Result<Book, String> {

    let time_of_start = std::time::SystemTime::now();
    println!("Start search for book...\n");

    // Build GET request url
    let request_url = match build_book_search_url(search_title,
                                                  search_author,
                                                  api_key) {
        Ok(url) => url,
        Err(e) => {return Err(format!("Invalid search parameters\nError: {}", 
                                      e))},
    };

    // Send the GET request
    let response_result = client.get(request_url)
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .send()
                    .await;

    // Match on the result
    let response_matched = match response_result {
        Ok(response) => response,
        Err(_) => return Err(String::from("Failed to send the request")),
    };

    // Get the text of the Response
    let response = response_matched.text().await.unwrap();

    // Get the JSON of the response to be parsed into a Book
    let result: Value = serde_json::from_str(&response).unwrap();

    // Parse and return
    match parse_book_result(result) {
        Ok(parsed) => {
            let elapsed_time = match time_of_start.elapsed() {
                Ok(time) => time.as_millis(),
                Err(e) => return Err(format!("An error occurred figuring out \
                                             the elapsed time. Error: {:?}",
                                             e))
            };

            println!("Took {} milliseconds to search for the book",
                     elapsed_time);
            Ok(parsed)
        }
        Err(e) => {
            let elapsed_time = match time_of_start.elapsed() {
                Ok(time) => time.as_millis(),
                Err(e) => return Err(format!("An error occurred figuring out \
                                             the elapsed time. Error: {:?}",
                                             e))
            };

            println!("Took {} milliseconds to search for the book",
                     elapsed_time);
            Err(format!("An error occurred during the parsing of the \
                              response. Error {:?}", e))
        }
    }
}
