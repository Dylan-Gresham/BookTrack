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
