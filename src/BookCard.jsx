function BookCard({backgroundUrl, title}) {
    console.log(title);
    console.log(backgroundUrl);
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
