import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Header from "./Header";
import BookCard from "./BookCard.jsx";

function App() {
  const [home, setHome] = useState(true);
  const [books, setBooks] = useState([]);

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

  if(home) {
    return (
        <div className="mainContainer">
          <Header homeBtnClick={handleHomeButton} addBtnClick={handleAddButton} />
          <div className="cardList">
            <BookCard title={"Martial Peak"}></BookCard>
            <BookCard backgroundUrl={"https://upload.wikimedia.org/wikipedia/en/9/99/Solo_Leveling_Webtoon.png"} title={"Solo Leveling"}></BookCard>
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
