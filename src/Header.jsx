import {useState} from "react";
import AddModal from "./AddModal.jsx"

export default function Header({homeBtnClick, addBtnClick}) {
    const [modal, setModal] = useState(false);

    function changeView() {
        /* Display a modal for user to select a view to change to */

        /* Callback to `App.jsx` to change the view appropriately */
    }

    function handleAddButtonClick() {
        setModal(true);
    }

    if(!document.body.classList.contains("modal") && modal) {
        document.body.classList.add("modal");
        document.documentElement.classList.add("modal");
    } else if(document.body.classList.contains("modal") && !modal) {
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
                    Change View
                </button>
                <button className="addButton" onClick={handleAddButtonClick} type="button">
                    Add Book
                </button>
            </div>
            <AddModal open={modal} addFunc={addBtnClick} setModal={setModal}></AddModal>
        </div>
    );
}