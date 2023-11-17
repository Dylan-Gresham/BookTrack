function BookCard({backgroundUrl, title}) {
    /*
     * TODO: Implement a pop-up dialog to allow clicking of a card to show
     * details such as progress, status, etc, and allow the user to edit the 
     * fields right there.
     */ 
    if(backgroundUrl === undefined) {
        return (
            <div className="bookCard" style={{backgroundColor: '#8875ff'}}>
                <h3>{title}</h3>
            </div>
        );
    } else {
        return (
            <div className="bookCard" style={{backgroundImage: `url(${backgroundUrl})`}}>
            <h3>{title}</h3>
            </div>
        );
    }
}

export default BookCard;
