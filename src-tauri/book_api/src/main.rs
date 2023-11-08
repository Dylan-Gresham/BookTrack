use reqwest::Client;

use book_api::*;

#[tokio::main]
async fn main() {
    let client = Client::new();

    // Make the request
    let search_result: Result<comic::Comic, String> = comic::search_for_comic(&client, "Solo Leveling").await;

    let search = match search_result {
        Ok(comic) => comic,
        Err(e) => comic::Comic::new(e, 0, vec!(), vec!()),
    };
    
    // Print fields to validate request was sent properly
    dbg!(search.clone());
    println!("Solo Leveling Comic from main: {}", search.to_string());
    println!("Solo Leveling Comic Fields:");
    println!("Title: {}", search.title);
    println!("Chapters: {}", search.chapters);
    println!("Genres: {:?}", search.genres);
    println!("Thumbnail URLs: {:?}", search.thumbnail_urls);
}

