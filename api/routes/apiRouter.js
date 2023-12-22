/* eslint-disable import/order */
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const apiRouter = express.Router()
const knexConfig =
  require('../../knexfile')[process.env.NODE_ENV || 'development']
const knex = require('knex')(knexConfig)

const endpoint = '/'

const checkToken = (req, res, next) => {
  const authToken = req.headers.authorization
  if (!authToken) {
    res.status(401).json({ message: 'Token não informado' })
    return
  }
  const token = authToken.split(' ')[1]
  req.token = token

  jwt.verify(req.token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: 'Token inválido' })
      return
    }
    req.decoded = decoded
    next()
  })
}

const isAdmin = (req, res, next) => {
  knex
    .select('*')
    .from('users')
    .where({ id: req.usuarioId })
    .then((usuarios) => {
      if (usuarios.length) {
        const usuario = usuarios[0]
        const roles = usuario.roles.split(';')
        const adminRole = roles.find((i) => i === 'ADMIN')
        if (adminRole === 'ADMIN') {
          next()
        } else {
          res.status(403).json({ message: 'Role de ADMIN requerida' })
        }
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: `Erro ao verificar roles de usuário - ${err.message}`,
      })
    })
}

apiRouter.post(`${endpoint}seguranca/register`, (req, res) => {
  knex('users')
    .insert(
      {
        name: req.body.nome,
        password: bcrypt.hashSync(req.body.senha, 8),
        email: req.body.email,
      },
      ['id']
    )
    .then((result) => {
      const usuario = result[0]
      res.status(200).json({ id: usuario.id })
    })
    .catch((err) => {
      res.status(500).json({
        message: `Erro ao registrar usuario - ${err.message}`,
      })
    })
})

apiRouter.post(`${endpoint}seguranca/login`, (req, res) => {
  knex
    .select('*')
    .from('users')
    .where({ email: req.body.email })
    .then((usuarios) => {
      if (usuarios.length) {
        const usuario = usuarios[0]
        const checkSenha = bcrypt.compareSync(req.body.senha, usuario.password)
        if (checkSenha) {
          const tokenJWT = jwt.sign(
            { id: usuario.id },
            process.env.SECRET_KEY,
            {
              expiresIn: 3600,
            }
          )
          res.status(200).json({
            id: usuario.id,
            nome: usuario.nome,
            roles: usuario.roles,
            token: tokenJWT,
          })
          return
        }
      }
      res.status(200).json({ message: 'Login ou senha incorretos' })
    })
    .catch((err) => {
      res.status(500).json({
        message: `Erro ao verificar login - ${err.message}`,
      })
    })
})

apiRouter.get(`${endpoint}books`, checkToken, function (_req, res) {
  knex('books')
    .select('*')
    .then((dados) => res.status(200).json(dados))
    .catch((err) => {
      console.log(err)
      res
        .status(500)
        .json({ message: `Erro ao recuperar lista de livros: ${err.message}` })
    })
})

apiRouter.get(`${endpoint}books/:id`, checkToken, function (req, res) {
  const bookId = req.params.id

  knex('books')
    .select('*')
    .where('id', bookId)
    .first()
    .then((book) => {
      if (book) {
        res.status(200).json(book)
      } else {
        res.status(404).json({ message: 'Livro não encontrado' })
      }
    })
    .catch((err) => {
      console.log(err)
      res
        .status(500)
        .json({ message: `Erro ao recuperar o livro: ${err.message}` })
    })
})

apiRouter.post(`${endpoint}books`, checkToken, isAdmin, function (req, res) {
  const newBook = req.body

  knex('books')
    .insert(newBook)
    .returning('*')
    .then((createdBook) => {
      res.status(201).json(createdBook[0])
    })
    .catch((err) => {
      console.log(err)
      res
        .status(500)
        .json({ message: `Erro ao criar um novo livro: ${err.message}` })
    })
})

apiRouter.put(`${endpoint}books/:id`, checkToken, isAdmin, function (req, res) {
  const bookId = req.params.id
  const updatedBook = req.body

  knex('books')
    .where('id', bookId)
    .update(updatedBook)
    .returning('*')
    .then((updatedBooks) => {
      if (updatedBooks.length > 0) {
        res.status(200).json(updatedBooks[0])
      } else {
        res.status(404).json({ message: 'Livro não encontrado' })
      }
    })
    .catch((err) => {
      console.log(err)
      res
        .status(500)
        .json({ message: `Erro ao atualizar o livro: ${err.message}` })
    })
})

apiRouter.delete(
  `${endpoint}books/:id`,
  checkToken,
  isAdmin,
  function (req, res) {
    const bookId = req.params.id

    knex('books')
      .where('id', bookId)
      .del()
      .then((numDeleted) => {
        if (numDeleted > 0) {
          res.status(204).send()
        } else {
          res.status(404).json({ message: 'Livro não encontrado' })
        }
      })
      .catch((err) => {
        console.log(err)
        res
          .status(500)
          .json({ message: `Erro ao excluir o livro: ${err.message}` })
      })
  }
)

module.exports = apiRouter
