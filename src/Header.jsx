import {useState} from "react";
import AddModal from "./AddModal.jsx"

export default function Header({homeBtnClick, addBtnClick, modalBooks}) {
    function changeView() {
        /* Display a modal for user to select a view to change to */

        /* Callback to `App.jsx` to change the view appropriately */
    }

    function handleSetNewBook(param) {
        if(param === null) {
            addBtnClick(null, false, false);
        } else {
            addBtnClick(param, false, false);
        }
    }

    if(!document.body.classList.contains("modal") && modalBooks.modal) {
        document.body.classList.add("modal");
        document.documentElement.classList.add("modal");
    } else if(document.body.classList.contains("modal") && !modalBooks.modal) {
        document.body.classList.remove("modal");
        document.documentElement.classList.remove("modal");
    }

    return (
        <div className="headerContainer">
            <button className="homeButton" onClick={homeBtnClick} type="button">
                Home
            </button>
            <div className="rightHeaderButtons">
                <button className="changeViewButton" onClick={changeView} type="button">
                    Go To...
                </button>
                <button className="addButton" onClick={() => addBtnClick(null, false, true)} type="button">
                    Add Book
                </button>
            </div>
            <AddModal open={modalBooks.modal} addFunc={handleSetNewBook}></AddModal>
        </div>
    );
}