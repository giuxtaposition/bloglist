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

beforeAll(async () => {
  await User.deleteMany({})
  const passwordForUser = await bcrypt.hash('ILikePotatoes', 10)
  const userTest = await new User({
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

  tokenForUser = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  })
})

beforeEach(async () => {
  await Blog.deleteMany({})

  await Promise.all(await Blog.insertMany(helper.initialBlogs))
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
      title: 'I like potatoes',
      author: 'Giulia Ye',
      url: 'https://www.giuxtaposition.tech',
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${tokenForUser}`)
      .send(newBlog)
      .expect(200 | 201)
    const updatedBlogs = await api.get('/api/blogs')
    expect(updatedBlogs.body[helper.initialBlogs.length].likes).toBe(0)
  })

  test('title is required', async () => {
    const newBlog = {
      author: 'Giulia Ye',
      url: 'https://www.giuxtaposition.tech',
      likes: 69,
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
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${tokenForUser}`)
      .send(newBlog)
      .expect(400)
  })
})

afterAll(() => mongoose.connection.close())
