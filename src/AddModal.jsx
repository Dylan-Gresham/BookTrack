function AddModal({open, addFunc, setModal}) {
    function closeProperly() {
        /*
         * Close the modal properly without doing any submission or form validation
         */

        document.getElementById('addModal').close(); // Close the modal
        setModal(false); // Update the modal state in Header.jsx
    }

    function validateEverything() {
        /*
         * Do input validation
         * If everything passes --> Create book obj, close modal, call addFunc(book)
         */
        let title = undefined;
        let author = undefined;
        let pageCount = undefined;
        let chapterCount = undefined;
        let isComic;
        let rating = undefined;
        let comments = undefined;

        const titleInput = document.getElementById('bookTitleInput');
        if(titleInput.textContent !== null && titleInput.textContent !== undefined && titleInput.textContent !== '') {
            if(titleInput.classList.contains('invalid-input')) {
                titleInput.classList.toggle('invalid-input');
            }

            if(!titleInput.classList.contains('valid-input')) {
                titleInput.classList.toggle('valid-input');
            }

            title = titleInput.textContent;
        } else {
            if(titleInput.classList.contains('valid-input')) {
                titleInput.classList.toggle('valid-input');
            }

            if(!titleInput.classList.contains('invalid-input')) {
                titleInput.classList.toggle('invalid-input');
            }
        }

        const authorInput = document.getElementById('bookAuthorInput');
        if(authorInput.textContent !== null && authorInput.textContent !== undefined && authorInput.textContent !== '') {
            if(authorInput.classList.contains('invalid-input')) {
                authorInput.classList.toggle('invalid-input');
            }

            if(!authorInput.classList.contains('valid-input')) {
                authorInput.classList.toggle('valid-input');
            }

            author = authorInput.textContent;
        } else {
            if(authorInput.classList.contains('valid-input')) {
                authorInput.classList.toggle('valid-input');
            }

            if(!authorInput.classList.contains('invalid-input')) {
                authorInput.classList.toggle('invalid-input');
            }
        }

        const isComicInput = document.getElementById('bookComicInput');
        isComic = !!isComicInput.checked;

        if(isComic) {
            const chapterCountInput = document.getElementById('bookChaptersInput');
            if(chapterCountInput.textContent !== null && chapterCountInput.textContent !== undefined && chapterCountInput.textContent !== '') {
                if(chapterCountInput.classList.contains('invalid-input')) {
                    chapterCountInput.classList.toggle('invalid-input');
                }

                if(!chapterCountInput.classList.contains('valid-input')) {
                    chapterCountInput.classList.toggle('valid-input');
                }

                chapterCount = parseInt(chapterCountInput.textContent);
            } else {
                if(chapterCountInput.classList.contains('valid-input')) {
                    chapterCountInput.classList.toggle('valid-input');
                }

                if(!chapterCountInput.classList.contains('invalid-input')) {
                    chapterCountInput.classList.toggle('invalid-input');
                }
            }
        } else {
            const pageCountInput = document.getElementById('bookPagesInput');
            if(pageCountInput.textContent !== null && pageCountInput.textContent !== undefined && pageCountInput.textContent !== '') {
                if(pageCountInput.classList.contains('invalid-input')) {
                    pageCountInput.classList.toggle('invalid-input');
                }

                if(!pageCountInput.classList.contains('valid-input')) {
                    pageCountInput.classList.toggle('valid-input');
                }

                pageCount = parseInt(pageCountInput.textContent);
            } else {
                if(pageCountInput.classList.contains('valid-input')) {
                    pageCountInput.classList.toggle('valid-input');
                }

                if(!pageCountInput.classList.contains('invalid-input')) {
                    pageCountInput.classList.toggle('invalid-input');
                }
            }
        }

        const ratingInput = document.getElementById('bookRatingInput');
        if(ratingInput.textContent !== null && ratingInput.textContent !== undefined && ratingInput.textContent !== '') {
            if(ratingInput.classList.contains('invalid-input')) {
                ratingInput.classList.toggle('invalid-input');
            }

            if(!ratingInput.classList.contains('valid-input')) {
                ratingInput.classList.toggle('valid-input');
            }

            rating = parseInt(ratingInput.textContent);
        } else {
            if(ratingInput.classList.contains('valid-input')) {
                ratingInput.classList.toggle('valid-input');
            }

            if(!ratingInput.classList.contains('invalid-input')) {
                ratingInput.classList.toggle('invalid-input');
            }
        }

        const commentsTextArea = document.getElementById('bookCommentsInput');
        if(commentsTextArea.textContent !== null && commentsTextArea.textContent !== undefined) {
            if(commentsTextArea.classList.contains('invalid-input')) {
                commentsTextArea.classList.toggle('invalid-input');
            }

            if(!commentsTextArea.classList.contains('valid-input')) {
                commentsTextArea.classList.toggle('valid-input');
            }

            comments = commentsTextArea.textContent;
        } else {
            if(commentsTextArea.classList.contains('valid-input')) {
                commentsTextArea.classList.toggle('valid-input');
            }

            if(!commentsTextArea.classList.contains('invalid-input')) {
                commentsTextArea.classList.toggle('invalid-input');
            }
        }

        let book = undefined;
        if(title === undefined || author === undefined || (pageCount === undefined && chapterCount === undefined)
           || rating === undefined || comments === undefined) {
            return;
        } else {
            book = {
                title: title,
                author: author,
                rating: rating,
                comments: comments,
            };

            if(pageCount === undefined) {
                book = {...book, chapters: chapterCount};
            } else {
                book = {...book, pages: pageCount};
            }
        }

        document.getElementById('addModal').close(); // Close the modal
        setModal(false); // Update the modal state in Header.jsx
        addFunc(book);
    }

    if(open) {
        return (
            <dialog id="addModal" open={open}>
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
                               type="checkbox"/>
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