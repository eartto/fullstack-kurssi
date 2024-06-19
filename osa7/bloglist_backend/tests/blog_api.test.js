const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')


const initialBlogs = [
  {
    "title": "bloggausblogi",
    "author": "Blogi Bloggaaja",
    "url": "blogiblogspot.com/blogi",
    "likes": 1,
    "id": "65fb1a2feea6773eeafe823b"
  }
]

var TOKEN = ''

beforeAll(async () => {
  const users = await api.get('/api/users')
  await api
    .post('/api/users')
    .send({
      "username": "Bourbon",
      "name": "Bobby",
      "password": "#1274398279djksahufh"
    })

  const response = await api
    .post('/api/login')
    .send({
      "username": "Bourbon",
      "password": "#1274398279djksahufh"
    })
  TOKEN = response.body.token
})


beforeEach(async () => {

  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  const response = await api.get('/api/blogs')
    .expect('Content-type', /application\/json/)

  expect(response.body).toHaveLength(1)
})

test('blogs have id field', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})

test('adding blogs with POST request', async () => {
  await api
    .post('/api/blogs')
    .send({
      "id": "65b11ab8803be4294eaf51d2",
      "title": "bloggausblogiblogi",
      "author": "Blogi Bloggaajanpoika",
      "url": "blogiblogspot.com/blogiblogi",
      "userId": "65f99559cea88c8b04533ccc",
      "likes": 2
    })
    .set('Authorization', `Bearer ${TOKEN}`)

  const response = await api.get('/api/blogs')

  expect(response.body[1].title).toEqual('bloggausblogiblogi')
})

test('if likes is undefined, the value is set as 0', async () => {
  await api
    .post('/api/blogs')
    .send({
      "id": "65b11ab8803be4294eaf51d2",
      "title": "bloggausblogiblogi",
      "author": "Blogi Bloggaajanpoika",
      "url": "blogiblogspot.com/blogiblogi",
      user: {
        "username": "Bourbon",
        "name": "Bobby",
        "id": "65f99559cea88c8b04533ccc"
      }
    })
    .set('Authorization', `Bearer ${TOKEN}`)

  const response = await api.get('/api/blogs')

  expect(response.body[1].likes).toEqual(0)
})

test('if title or url is undefined, return status 400', async () => {
  await api
    .post('/api/blogs')
    .send({
      "id": "65b11ab8803be4294eaf51d2",
      "author": "Blogi Bloggaajanpoika",
      "url": "blogiblogspot.com/blogiblogi",
      user: {
        "username": "Bourbon",
        "name": "Bobby",
        "id": "65f99559cea88c8b04533ccc"
      },
      "likes": 2
    })
    .set('Authorization', `Bearer ${TOKEN}`)
    .expect(400)
})

test('blog is removed with DELETE request', async () => {
  await Blog.deleteMany({})

  await api
    .post('/api/blogs')
    .send({
      "id": "65b11ab8803be4294eaf51d2",
      "title": "bloggausblogiblogi",
      "author": "Blogi Bloggaajanpoika",
      "url": "blogiblogspot.com/blogiblogi",
      "likes": 2
    })
    .set('Authorization', `Bearer ${TOKEN}`)

  const res = await api
    .get('/api/blogs')
  const id = res.body[0].id

  await api
    .delete(`/api/blogs/${id}`)
    .set('Authorization', `Bearer ${TOKEN}`)
    .expect(204)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(0)

})

test('blogs likes can be modified with PUT request', async () => {
  await api
    .put(`/api/blogs/${initialBlogs[0].id}`)
    .send({ likes: 10 })
    .expect(201)

  const response = await api.get('/api/blogs')
  expect(response.body[0].likes).toEqual(10)
})

test('bad token', async () => {
  await api
    .post('/api/blogs')
    .send({
      "id": "65b11ab8803be4294eaf51d2",
      "title": "bloggausblogiblogi",
      "author": "Blogi Bloggaajanpoika",
      "url": "blogiblogspot.com/blogiblogi",
      "userId": "65f99559cea88c8b04533ccc",
      "likes": 2
    })
    .expect(401)
})

afterAll(async () => {
  await mongoose.connection.close()
})