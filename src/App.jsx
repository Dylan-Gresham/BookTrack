import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Header from "./Header";

function App() {
  const [home, setHome] = useState(true);

  function handleHomeButton() {
    if(!home) {
      setHome(false);
    }
  }

  if(home) {
    return (
      <div className="mainContainer">
        <Header homeBtnClick={handleHomeButton} />
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
