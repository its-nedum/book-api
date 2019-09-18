const booksController = (Book) => {

    const post = (req,res) => {
        const book = new Book(req.body);
        book.save();
        return res.status(201).json(book);
    }

    const get = (req,res) => {
        const query = {};
        if(req.query.genre){
            query.genre = req.query.genre;
        }
        Book.find(query, (err, books) => {
            if(err){
             return res.send(err);
            }
            //Adding Hypermedia to ease API Navigation
            const returnBooks = books.map((book) => {
                const newBook = book.toJSON();
                newBook.links = {};
                newBook.links.self = `http://${req.headers.host}/api/books/${book._id}`;
                return newBook;
            })
             return res.json(returnBooks);
        });
    }
    return {post, get};
}

module.exports = booksController;