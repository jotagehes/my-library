const express = require ('express')
const apiRouter = express.Router()
const knexConfig = require ('../../knexfile')[process.env.NODE_ENV || 'development']
const knex = require ('knex')(knexConfig)

const endpoint = '/'

apiRouter.get (endpoint + 'books', function (req, res) {
    knex('books').select('*')
    .then (dados => res.status(200).json (dados))
    .catch (err => {
        console.log (err)
        res.status(500).json ({ message: `Erro ao recuperar lista de livros: ${err.message}` })
    })
})

apiRouter.get(endpoint + 'books/:id', function (req, res) {
    const bookId = req.params.id;

    knex('books')
        .select('*')
        .where('id', bookId)
        .first()
        .then((book) => {
            if (book) {
                res.status(200).json(book);
            } else {
                res.status(404).json({ message: 'Livro não encontrado' });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: `Erro ao recuperar o livro: ${err.message}` });
        });
});



apiRouter.post(endpoint + 'books', function (req, res) {
    const newBook = req.body;

    knex('books')
        .insert(newBook)
        .returning('*')
        .then((createdBook) => {
            res.status(201).json(createdBook[0]);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: `Erro ao criar um novo livro: ${err.message}` });
        });
});


apiRouter.put(endpoint + 'books/:id', function (req, res) {
    const bookId = req.params.id;
    const updatedBook = req.body;

    knex('books')
        .where('id', bookId)
        .update(updatedBook)
        .returning('*')
        .then((updatedBooks) => {
            if (updatedBooks.length > 0) {
                res.status(200).json(updatedBooks[0]);
            } else {
                res.status(404).json({ message: 'Livro não encontrado' });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: `Erro ao atualizar o livro: ${err.message}` });
        });
});


apiRouter.delete(endpoint + 'books/:id', function (req, res) {
    const bookId = req.params.id;

    knex('books')
        .where('id', bookId)
        .del()
        .then((numDeleted) => {
            if (numDeleted > 0) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Livro não encontrado' });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: `Erro ao excluir o livro: ${err.message}` });
        });
});


module.exports = apiRouter
