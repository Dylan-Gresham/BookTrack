import {useState} from "react";

function AddModal({open, addFunc}) {
    const [isComic, setIsComic] = useState(false);
    function closeProperly() {
        document.getElementById('addModal').close(); // Close the modal
        addFunc(null);
    }

    function validateEverything() {
        let title = undefined;
        let author = undefined;
        let pageCount = undefined;
        let chapterCount = undefined;
        let isComic = false;
        let rating = undefined;
        let thumbnailUrl = undefined;
        let comments = undefined;

        const titleInput = document.getElementById('bookTitleInput');
        if(titleInput.value !== null && titleInput.value !== undefined && titleInput.value !== '') {
            if(titleInput.classList.contains('invalid-input')) {
                titleInput.classList.toggle('invalid-input');
            }

            if(!titleInput.classList.contains('valid-input')) {
                titleInput.classList.toggle('valid-input');
            }

            title = titleInput.value;
        } else {
            if(titleInput.classList.contains('valid-input')) {
                titleInput.classList.toggle('valid-input');
            }

            if(!titleInput.classList.contains('invalid-input')) {
                titleInput.classList.toggle('invalid-input');
            }
        }

        const authorInput = document.getElementById('bookAuthorInput');
        if(authorInput.value !== null && authorInput.value !== undefined && authorInput.value !== '') {
            if(authorInput.classList.contains('invalid-input')) {
                authorInput.classList.toggle('invalid-input');
            }

            if(!authorInput.classList.contains('valid-input')) {
                authorInput.classList.toggle('valid-input');
            }

            author = authorInput.value;
        } else {
            if(authorInput.classList.contains('valid-input')) {
                authorInput.classList.toggle('valid-input');
            }

            if(!authorInput.classList.contains('invalid-input')) {
                authorInput.classList.toggle('invalid-input');
            }
        }

        if(isComic) {
            const chapterCountInput = document.getElementById('bookChaptersInput');
            if(chapterCountInput.value !== null && chapterCountInput.value !== undefined && chapterCountInput.value !== '') {
                if(chapterCountInput.classList.contains('invalid-input')) {
                    chapterCountInput.classList.toggle('invalid-input');
                }

                if(!chapterCountInput.classList.contains('valid-input')) {
                    chapterCountInput.classList.toggle('valid-input');
                }

                chapterCount = parseInt(chapterCountInput.value);
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
            if(pageCountInput.value !== null && pageCountInput.value !== undefined && pageCountInput.value !== '') {
                if(pageCountInput.classList.contains('invalid-input')) {
                    pageCountInput.classList.toggle('invalid-input');
                }

                if(!pageCountInput.classList.contains('valid-input')) {
                    pageCountInput.classList.toggle('valid-input');
                }

                pageCount = parseInt(pageCountInput.value);
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
        if(ratingInput.value !== null && ratingInput.value !== undefined && ratingInput.value !== '') {
            if(ratingInput.classList.contains('invalid-input')) {
                ratingInput.classList.toggle('invalid-input');
            }

            if(!ratingInput.classList.contains('valid-input')) {
                ratingInput.classList.toggle('valid-input');
            }

            rating = parseInt(ratingInput.value);
        } else {
            if(ratingInput.classList.contains('valid-input')) {
                ratingInput.classList.toggle('valid-input');
            }

            if(!ratingInput.classList.contains('invalid-input')) {
                ratingInput.classList.toggle('invalid-input');
            }
        }

        const thumbnailInput = document.getElementById('bookThumbnailInput');
        if(thumbnailInput.value !== null && thumbnailInput.value !== undefined) {
            if(thumbnailInput.classList.contains('invalid-input')) {
                thumbnailInput.classList.toggle('invalid-input');
            }

            if(!thumbnailInput.classList.contains('valid-input')) {
                thumbnailInput.classList.toggle('valid-input');
            }

            thumbnailUrl = thumbnailInput.value;
        } else {
            if(thumbnailInput.classList.contains('valid-input')) {
                thumbnailInput.classList.toggle('valid-input');
            }

            if(!thumbnailInput.classList.contains('invalid-input')) {
                thumbnailInput.classList.toggle('invalid-input');
            }
        }

        const commentsTextArea = document.getElementById('bookCommentsInput');
        if(commentsTextArea.value !== null && commentsTextArea.value !== undefined) {
            if(commentsTextArea.classList.contains('invalid-input')) {
                commentsTextArea.classList.toggle('invalid-input');
            }

            if(!commentsTextArea.classList.contains('valid-input')) {
                commentsTextArea.classList.toggle('valid-input');
            }

            comments = commentsTextArea.value;
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
                thumbnailUrl: thumbnailUrl,
                isComic: isComic,
            };

            if(pageCount === undefined) {
                book = {...book, chapters: chapterCount};
            } else {
                book = {...book, pages: pageCount};
            }
        }

        document.getElementById('addModal').close(); // Close the modal
        addFunc(book);
    }

    if(open && isComic) {
        return (
            <>
                <div id="dialogBackdrop"></div>
                <dialog id="addModal" open={open}>
                    <div className="addModalTopBar">
                        <h1 className="addModalTitle">Add a Book</h1>
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
                                   placeholder="Christopher Paolini/Asura Scans" type="text"/>
                        </div>
                        <div className="labelInputContainer">
                            <label htmlFor="bookChaptersInput" id="bookChaptersLabel">Chapters: </label>
                            <input id="bookChaptersInput" name="bookChaptersInput" className="addInput"
                                   placeholder="40" type="number" min="0" max="100000"/>
                        </div>
                        <div className="labelInputContainer">
                            <label htmlFor="bookComicInput" id="bookComicLabel">Is a comic?: </label>
                            <input id="bookComicInput" name="bookComicInput" className="addInput"
                                   type="checkbox" onClick={() => {
                                if(isComic) {
                                    setIsComic(false);
                                } else {
                                    setIsComic(true);
                                }}}/>
                        </div>
                        <div className="labelInputContainer">
                            <label htmlFor="bookRatingInput" id="bookRatingLabel">Rating: </label>
                            <input id="bookRatingInput" name="bookRatingInput" className="addInput"
                                   placeholder="100" type="number" min="-1" max="100"/>
                        </div>
                        <div className="labelInputContainer">
                            <label htmlFor="bookThumbnailInput" id="bookThumbnailLabel">Thumbnail URL: </label>
                            <input id="bookThumbnailInput" name="bookThumbnailInput" className="addInput"
                                   placeholder="https://example.com/image.png" type="url"/>
                        </div>
                        <div className="labelInputContainer">
                            <label htmlFor="bookCommentsInput" id="bookCommentsLabel">Comments: </label>
                            <textarea id="bookCommentsInput" name="bookCommentsInput" className="addInput"
                                      placeholder="Amazing book, 10/10!" rows="10"/>
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
            </>
        );
    } else if(open && !isComic) {
        return (
            <>
                <div id="dialogBackdrop"></div>
                <dialog id="addModal" open={open}>
                    <div className="addModalTopBar">
                        <h1 className="addModalTitle">Add a Book</h1>
                    </div>
                    <form className="addForm" method="dialog">
                        <div className="labelInputContainer">
                            <label htmlFor="bookTitleInput" id="bookTitleLabel">Title: </label>
                            <input id="bookTitleInput" name="bookTitleInput" className="addInput"
                                   placeholder="To Sleep in a Sea of Stars" type="text"/>
                        </div>
                        <div className="labelInputContainer">
                            <label htmlFor="bookAuthorInput" id="bookAuthorLabel">Author: </label>
                            <input id="bookAuthorInput" name="bookAuthorInput" className="addInput"
                                   placeholder="Christopher Paolini" type="text"/>
                        </div>
                        <div className="labelInputContainer">
                            <label htmlFor="bookPagesInput" id="bookPagesLabel">Pages: </label>
                            <input id="bookPagesInput" name="bookPagesInput" className="addInput"
                                   placeholder="879" type="number" min="0" max="100000"/>
                        </div>
                        <div className="labelInputContainer">
                            <label htmlFor="bookComicInput" id="bookComicLabel">Is a comic?: </label>
                            <input id="bookComicInput" name="bookComicInput" className="addInput"
                                   type="checkbox" onClick={() => {
                                       if(isComic) {
                                           setIsComic(false);
                                       } else {
                                           setIsComic(true);
                                       }}}/>
                        </div>
                        <div className="labelInputContainer">
                            <label htmlFor="bookRatingInput" id="bookRatingLabel">Rating: </label>
                            <input id="bookRatingInput" name="bookRatingInput" className="addInput"
                                   placeholder="100" type="number" min="-1" max="100"/>
                        </div>
                        <div className="labelInputContainer">
                            <label htmlFor="bookThumbnailInput" id="bookThumbnailLabel">Thumbnail URL: </label>
                            <input id="bookThumbnailInput" name="bookThumbnailInput" className="addInput"
                                   placeholder="https://example.com/image.png" type="url"/>
                        </div>
                        <div className="labelInputContainer">
                            <label htmlFor="bookCommentsInput" id="bookCommentsLabel">Comments: </label>
                            <textarea id="bookCommentsInput" name="bookCommentsInput" className="addInput"
                                      placeholder="Amazing book, 10/10!" rows="10"/>
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
            </>
        );
    } else {
        return (<></>);
    }
}

export default AddModal;