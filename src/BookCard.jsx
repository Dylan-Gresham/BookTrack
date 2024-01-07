import {useEffect} from "react";

function BookCard({book}) {
    useEffect(() => {
        document.addEventListener('click', (e) => {
            console.log(book);
        });
        return () => {document.removeEventListener('click', () => {console.log(book);});}
    }, []);

    /*
     * TODO: Implement a pop-up dialog to allow clicking of a card to show
     * details such as progress, status, etc, and allow the user to edit the 
     * fields right there.
     */
    if(book.thumbnailUrl === undefined) {
        return (
            <div className="bookCard" style={{backgroundColor: '#8875ff'}}>
                <h3>{book.title}</h3>
            </div>
        );
    } else {
        return (
            <div className="bookCard" style={{backgroundImage: `url(${book.thumbnailUrl})`}}>
                <h3>{book.title}</h3>
            </div>
        );
    }
}

export default BookCard;
