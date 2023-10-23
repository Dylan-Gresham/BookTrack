function BookCard({backgroundUrl, title}) {
    return (
        <div className="bookCard" style={{backgroundImage: `url(${backgroundUrl})`}}>
            <h3>{title}</h3>
        </div>
    );
}

export default BookCard;
