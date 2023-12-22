require('dotenv').config()

const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/app', express.static(path.join(__dirname, 'public')))

const apiRouter = require('./api/routes/apiRouter')

app.use('/api', apiRouter)

const port = process.env.PORT || 5432
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
