const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const jwt = require('jsonwebtoken')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')

var tokenForUser
var userTest

beforeAll(async () => {
  await api.post('/api/testing/reset').expect(204)

  const passwordForUser = await bcrypt.hash('ILikePotatoes', 10)
  userTest = await new User({
    username: 'giuxtaposition',
    name: 'giuxtaposition',
    passwordHash: passwordForUser,
  }).save()

  await api
    .post('/api/users')
    .send(userTest)
    .set('Accept', 'application/json')
    .expect('Content-Type', /application\/json/)

  const userForToken = {
    username: userTest.username,
    id: userTest.id,
  }

  tokenForUser = jwt.sign(userForToken, process.env.SECRET)

  const initialBlogs = await Blog.insertMany(
    helper.initialBlogs.map(blog => ({ ...blog, user: userTest.id }))
  )
  userTest.blogs = initialBlogs
  await userTest.save()
})

describe('when there is initially some blogs saved', () => {
  test('are returned in JSON format', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('are returned the correct number of blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('can be viewed individually', async () => {
    const allBlogsInDb = await helper.blogsInDb()
    const blogToView = allBlogsInDb[0]

    const response = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.id).toBe(blogToView.id)
  })

  test('have a unique identifier named "id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('Adding a new blog', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'I like potatoes',
      author: 'Giulia Ye',
      url: 'https://www.giuxtaposition.tech',
      likes: 69,
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${tokenForUser}`)
      .send(newBlog)
      .expect(200 | 201)
    const updatedBlogs = await api.get('/api/blogs')
    expect(updatedBlogs.body).toHaveLength(helper.initialBlogs.length + 1)
  })

  test('if number of likes is missing set to 0', async () => {
    const newBlog = {
      title: 'I like tomatoes',
      author: 'Giulia Ye',
      url: 'https://www.giuxtaposition.tech',
      user: userTest.id,
    }
    const savedBlog = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${tokenForUser}`)
      .send(newBlog)
      .expect(200 | 201)
    expect(savedBlog.body.likes).toBe(0)
  })

  test('title is required', async () => {
    const newBlog = {
      author: 'Giulia Ye',
      url: 'https://www.giuxtaposition.tech',
      likes: 69,
      user: userTest.id,
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${tokenForUser}`)
      .send(newBlog)
      .expect(400)
  })

  test('author is required', async () => {
    const newBlog = {
      title: 'I like potatoes',
      url: 'https://www.giuxtaposition.tech',
      likes: 69,
      user: userTest.id,
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${tokenForUser}`)
      .send(newBlog)
      .expect(400)
  })
})

afterAll(() => mongoose.connection.close())
