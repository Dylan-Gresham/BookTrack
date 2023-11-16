import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Header from "./Header";
import BookCard from "./BookCard.jsx";

function App() {
  const [home, setHome] = useState(true);
  const [modalBooks, setModalBooks] = useState({
      modal: false,
      isComic: false,
      books: [{title: "Martial Peak", thumbnailUrl: undefined}, {title: "Solo Leveling", thumbnailUrl: "https://upload.wikimedia.org/wikipedia/en/9/99/Solo_Leveling_Webtoon.png"}],
  });

  function handleHomeButton() {
    if(!home) {
      setHome(true);
    }
  }

  function handleAddButton(book, isComic, modality) {
      if(book !== null) {
          let newBooks = modalBooks.books;
          newBooks.push(book);
          if(modality === null) {
              setModalBooks({modal: false, isComic: false, books: newBooks});
          } else {
              setModalBooks({modal: modality, isComic: false, books: newBooks});
          }
      } else {
          if(isComic === null) {
              if(modality === null) {
                  setModalBooks({...modalBooks});
              } else {
                  setModalBooks({...modalBooks, modal: modality, isComic: false});
              }
          } else {
              if(modality === null) {
                  setModalBooks({...modalBooks, isComic: isComic});
              } else {
                  setModalBooks({...modalBooks, modal: modality, isComic: isComic});
              }
          }
      }
  }

  let key = 0;

  if(home) {
    return (
        <div className="mainContainer">
          <Header homeBtnClick={handleHomeButton} addBtnClick={handleAddButton} modalBooks={modalBooks} />
          <div className="cardList">
              {modalBooks.books.map( (book) => {
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
          <Header homeBtnClick={handleHomeButton} addBtnClick={handleAddButton} modalBooks={modalBooks} setModalBooks={setModalBooks} />
        </div>
    )
  }
}

export default App;
