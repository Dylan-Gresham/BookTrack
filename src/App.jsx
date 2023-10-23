import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Header from "./Header";
import BookCard from "./BookCard.jsx";

function App() {
  const [home, setHome] = useState(true);

  function handleHomeButton() {
    if(!home) {
      setHome(true);
    }
  }

  if(home) {
    return (
      <div className="mainContainer">
        <Header homeBtnClick={handleHomeButton} />
        <div className="cardList">
          <BookCard backgroundUrl={"https://cdn.kobo.com/book-images/a905ae89-1a86-4d04-b6fc-b91d08405d78/353/569/90/False/martial-peak-ch-1-6.jpg"} title={"Martial Peak"}></BookCard>
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
