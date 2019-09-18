const express = require('express');
const booksController = require('../controllers/booksController');

const routes = (Book) => {
const bookRouter = express.Router();
const controller = booksController(Book);


bookRouter.route('/books')
//Save A Book
.post(controller.post)
//Get All Books
.get(controller.get);

//Set up middleware to prevent repeatation of code
bookRouter.use('/books/:bookId', (req, res, next) => {
    const query = req.params.bookId;
    Book.findById(query, (err, book) => {
        if(err){
         return res.send(err);
        }
        if(book){
            req.book = book;
            return next();
        }
         return res.sendStatus(404);
    });
})

//Get A Single Book By The ID
bookRouter.route('/books/:bookId')
.get((req, res) => {
    //Implementing Hypermedia to ease search by genre
    const returnBook = req.book.toJSON();
    returnBook.links = {};
    const genre = req.book.genre.replace(' ', '%20');
    returnBook.links.FilterByThisGenre = `http://${req.headers.host}/api/books/?genre=${genre}`;
     res.json(returnBook);
    })

//Update A Book
.put((req,res) => {
    const { book } = req;
        book.title = req.body.title;
        book.author = req.body.author;
        book.genre = req.body.genre;
        book.read = req.body.read;
        req.book.save((err) => {
            if(err){
                return res.send(err);
            }
            return res.json(book);
        });
    })

//Update just a part of the books info
.patch((req, res) => {
    const { book } = req;
    if(req.body._id){
        delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
        const key = item[0];
        const value = item[1];
        book[key] = value;
    });
    req.book.save((err) => {
        if(err){
            return res.send(err);
        }
        return res.json(book);
    });
})

//Delete A Book
.delete((req, res) => {
    req.book.remove((err) => {
        if(err){
            return res.send(err)
        }
        return res.sendStatus(204);
    });
})

return bookRouter;
} 

module.exports = routes;
