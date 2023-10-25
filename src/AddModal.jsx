function AddModal({open, addFunc}) {
    function closeProperly() {
        /*
         * Close the modal properly without doing any submission or form validation
         */
    }

    function validateEverything() {
        /*
         * Do input validation
         * If everything passes --> Create book obj, close modal, call addFunc(book)
         */
    }

    if(open) {
        return (
            <dialog className="addModal" open={open}>
                <div className="addModalTopBar">
                    <h1 className="addModalTitle">Add a Book</h1>
                    <button className="addInputButton" id="addInputCloseButton" type="submit"
                            onClick={closeProperly}>
                        Cancel
                    </button>
                </div>
                <form className="addForm" method="dialog">
                    <div className="labelInputContainer">
                        <label htmlFor="bookTitleInput" id="bookTitleLabel">Title: </label>
                        <input id="bookTitleInput" name="bookTitleInput" className="addInput"
                               placeholder="To Sleep in a Sea of Stars" type="text"/>
                    </div>
                    <div className="labelInputContainer">
                        <label htmlFor="bookAuthorInput" id="bookAuthorLabel">Author/Source: </label>
                        <input id="bookAuthorInput" name="bookAuthorInput" className="addInput"
                               placeholder="Christopher Paolini" type="text"/>
                    </div>
                    <div className="labelInputContainer">
                        <label htmlFor="bookPagesInput" id="bookPagesLabel">Pages: </label>
                        <input id="bookPagesInput" name="bookPagesInput" className="addInput"
                               placeholder="880" type="number" min="0" max="100000"/>
                    </div>
                    <div className="labelInputContainer">
                        <label htmlFor="bookChaptersInput" id="bookChaptersLabel">Chapters: </label>
                        <input id="bookChaptersInput" name="bookChaptersInput" className="addInput"
                               placeholder="40" type="number" min="0" max="100000"/>
                    </div>
                    <div className="labelInputContainer">
                        <label htmlFor="bookComicInput" id="bookComicLabel">Is a comic?: </label>
                        <input id="bookComicInput" name="bookComicInput" className="addInput"
                               placeholder="880" type="checkbox"/>
                    </div>
                    <div className="labelInputContainer">
                        <label htmlFor="bookRatingInput" id="bookRatingLabel">Is a comic?: </label>
                        <input id="bookRatingInput" name="bookRatingInput" className="addInput"
                               placeholder="100" type="number" min="-1" max="100"/>
                    </div>
                    <div className="labelInputContainer">
                        <label htmlFor="bookCommentsInput" id="bookCommentsLabel">Is a comic?: </label>
                        <textarea id="bookCommentsInput" name="bookCommentsInput" className="addInput"
                               placeholder="Amazing book, 10/10!" rows="5" cols="50"/>
                    </div>
                    <div className="buttonContainer">
                        <button className="addInputButton" id="addInputCloseButton" type="submit"
                                onClick={closeProperly}>
                            Cancel
                        </button>
                        <button className="addInputButton" id="addInputSubmitButton" type="submit"
                                onClick={validateEverything}>
                            Add
                        </button>
                    </div>
                </form>
            </dialog>
        );
    } else {
        return (<></>);
    }
}

export default AddModal;