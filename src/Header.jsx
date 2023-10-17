export default function Header({homeBtnClick}) {
    function changeView() {
        /* Display a modal for user to select a view to change to */

        /* Callback to `App.jsx` to change the view appropriately */ 
    }

    return (
        <div className="headerContainer">
            <button className="homeButton" onClick={homeBtnClick} type="button">
                {/*Icon Here*/}
            </button>
            <div className="rightHeaderButtons">
                <button className="changeViewButton" onClick={changeView} type="button">
                    Change View
                </button>
            </div>
        </div>
    );
}