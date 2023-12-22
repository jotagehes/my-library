require('dotenv').config()

const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/app', express.static(path.join(__dirname, 'public')))

const apiRouter = require('./api/routes/apiRouter')

app.use('/api', cors(corsOptions), apiRouter)

const port = process.env.PORT || 5432
app.listen(port)
