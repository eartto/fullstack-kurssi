const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { request, response } = require('express')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { title: 1, author: 1, url: 1, id: 1 })
  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User
  .findById(request.params.id)
  response.json(user)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  if (request.body.password.length < 3 || request.body.password === undefined) {
    return response.status(400).json({ error: 'password too weird' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  await user.save()
    .catch(error => {
      if (error.name === 'ValidationError') {
        return response.status(400).json({ error: 'username too weird' })
      } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({ error: 'expected `username` to be unique' })
      }
    })

  response.status(201).end()
})

module.exports = usersRouter