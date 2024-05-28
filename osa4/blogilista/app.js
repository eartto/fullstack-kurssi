const config = require('./utils/config')
const middleware = require('./utils/middleware')
const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')


const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.substring(7)
        next()
    } else {
        next()
    }
}


const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

app.use(cors())
app.use(middleware.errorHandler)
app.use(tokenExtractor)
app.use(express.json())
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
  }

module.exports = app