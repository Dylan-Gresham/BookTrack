import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Header from "./Header";
import BookCard from "./BookCard.jsx";

function App() {
  const [home, setHome] = useState(true);
  const [books, setBooks] = useState([{title: "Martial Peak", thumbnailUrl: undefined}, {title: "Solo Leveling", thumbnailUrl: "https://upload.wikimedia.org/wikipedia/en/9/99/Solo_Leveling_Webtoon.png"}]);

  function handleHomeButton() {
    if(!home) {
      setHome(true);
    }
  }

  function handleAddButton(book) {
      if(typeof book === 'object') {
          let newBooks = books;
          newBooks.push(book);
          setBooks(newBooks);
      }
  }

  let key = 0;

  if(home) {
    return (
        <div className="mainContainer">
          <Header homeBtnClick={handleHomeButton} addBtnClick={handleAddButton} />
          <div className="cardList">
              {books.map( (book) => {
                  return (
                      <BookCard title={book.title} backgroundUrl={book.thumbnailUrl} key={key++}></BookCard>
                  )
              })}
          </div>
        </div>
    );
  } else {
    return (
        <div className="mainContainer">
          <Header homeBtnClick={handleHomeButton} />
        </div>
    )
  }
}

export default App;
