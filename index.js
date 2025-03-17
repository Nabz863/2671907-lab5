const express = require('express');
const app = express ();
app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server listening on PORT:", PORT);
});

//GET 	/whoami 	Returns an object with your student number.
app.get('/whoami', (request,response) => {
    const num = {
        "studentNumber": "2671907"
    };
    response.json(num);
});

let books = [];

//GET 	/books 	Returns a list of all books.
app.get('/books', (request, response) => {
    response.json(books);
});

//GET 	/books/:id 	Returns details of a specific book. If the book does not exist, return a 404 Not Found.
app.get('/books/:id', (request, response) => {
    const book = books.find(b => b.id === request.params.id);
    if (!book) 
        return response.status(404).json({error: "Book not found"});
    response.json(book);
});

//POST 	/books 	Adds a new book to the collection. If the request is invalid, return a 400 Bad Request.
app.post('/books', (request, response) => {
    const { id, title, details } = request.body;
    if (!id) {
        return response.status(400).json({error : "No Book ID provided"});
    }
    if (typeof(id) != 'string') {
        return response.status(400).json({error: "Invalid Book ID provided"})
    }
    if (!title) {
        return response.status(400).json({error: "No title provided"});
    }
    if (typeof(title) !== 'string') {
        return response.status(400).json({error : "Invalid title provided"});
    }
    if (!details) {
        return response.status(400).json({error : "Missing required book details"});
    }
    if (!Array.isArray(details)) {
        return response.status(400).json({error : "Details in invalid format."});
    }
    for (var i = 0; i < details.length; i++) {
        var detail = details[i];
        if (!detail.id || typeof(detail.id) !== 'string' || !detail.author || typeof(detail.author) !== 'string' || !detail.genre || typeof(detail.genre) !== 'string' || !detail.publicationYear || typeof(detail.publicationYear) !== 'number') {
            return response.status(400).json({error: 'Invalid details provided'});
        }
    }
    var newBook = {
        id,
        title,
        details : details.map((detail, index) => {
            return {
                id : detail.id,
                author : detail.author,
                genre : detail.genre,
                publicationYear : detail.publicationYear
            };
        })
    };
    books.push(newBook);
    response.status(201).json(newBook);
});

//PUT 	/books/:id 	Updates an existing book's information.
app.put('/books/:id', (request,response) => {
    const book = books.find(b => b.id === request.params.id);
    if (!book) return response.status(404).json({error : "Book not found"});
    const {id, title, details} = request.body;
    if (id !== undefined) {
        if (typeof(id) !== 'string') {
            return response.status(400).json({error : "Invalid ID"});
        }
        book.id = id;
    }
    if (title !== undefined) {
        if (typeof(title) !== 'string') {
            return response.status(400).json({error : "Invalid title"});
        }
        book.title = title;
    }
    if (details !== undefined) {
        if (!Array.isArray(details)) {
            return response.status(400).json({error : "Details in invalid format"});
        }
        for (var i = 0; i < details.length; i++) {
            var detail = details[i];
            if (!detail.id || typeof(detail.id) !== 'string' || !detail.author || typeof(detail.author) !== 'string' || !detail.genre || typeof(detail.genre) !== 'string' || !detail.publicationYear || typeof(detail.publicationYear) !== 'number') {
                return response.status(400).json({error: 'Invalid details provided'});
            }
        book.details = details;
        }
    }
    var newDetails = details.map((detail, index) => {
        return {
            id : detail.id,
            author : detail.author,
            genre : detail.genre,
            publicationYear : detail.publicationYear
        };

    });
    book.details = book.details.concat(newDetails);
    response.status(201).json(book);
});

//DELETE 	/books/:id 	Deletes a book from the collection.
app.delete('/books/:id', (request, response) => {
    const index = books.findIndex(b => b.id === request.params.id);
    if (index === -1) return response.status(404).json({error : "Book not found"});
    books.splice(index, 1);
    response.status(204).send();

});

//POST 	/books/:id/details 	Adds a detail (e.g., author, genre, year) to a book.
app.post('/books/:id/details', (request, response) => {
    const book = books.find(b => b.id === request.params.id);
    if (!book) return response.status(404).json({error : "Book not found"});
    const {id, author, genre, publicationYear} = request.body;
    if (!author || !genre || !publicationYear || typeof(publicationYear) !== 'number') {
        return response.status(400).json({error : "Invalid or missing details"});
    }
    const newDetail = {
        id,
        author,
        genre,
        publicationYear
    };
    book.details.push(newDetail);
    response.status(201).json(book);

})

//DELETE 	/books/:id/details/:detailId 	Removes a detail from a book.
app.delete('books/:id/details/:detailId', (request, response) => {
    const book = books.find(b => b.id === request.params.id);
    if (!book) return response.status(404).json({error : "Book not found"});
    const index = book.details.findIndex(c => c.id === request.params.detailId);
    if (index === -1) return response.status(400).json({error : "Detail not found"});
    book.details.splice(index, 1);
    response.status(204).send();
});