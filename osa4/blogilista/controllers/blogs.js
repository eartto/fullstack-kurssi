const blogsRouter = require('express').Router()
const { request } = require('../app')
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')


const userExtractor = async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      response.status(401).json({ error: 'token invalid' })
      next()
    } else {
      const user = await User.findById(decodedToken.id)
      request.user = user
      next()
    }
  } catch (e) {
    response.status(401).json({ error: 'token invalid' })
  }
}


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  delete request.body.__v
  const body = request.body

  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
    likes: body.likes
  })

  if (blog.title === undefined || blog.url === undefined) {
    response.status(400).json()
  }
  else {
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()

    response.status(201).json(savedBlog)
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() === decodedToken.id.toString()) {

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
  else {
    response.status(400).end()
  }
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {

  const body = request.body
  const user = request.user

  const blog = {
    likes: body.likes
  }

  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blog, {
      new: false
    })


  response.status(201).json(updatedBlog)

})

module.exports = blogsRouter