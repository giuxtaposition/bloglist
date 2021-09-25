const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({ username: 'potato', name: 'potato', passwordHash })

  await user.save()
})

describe('Creating a new user', () => {
  test('succeeds', async () => {
    const initialUsers = await helper.usersInDb()

    const newUser = {
      username: 'watermelon',
      name: 'watermelon',
      password: 'watermelon',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const finalUsers = await helper.usersInDb()
    expect(finalUsers).toHaveLength(initialUsers.length + 1)

    const usernames = finalUsers.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('username is required', async () => {
    const newUser = {
      name: 'cucumber',
      password: 'cucumber',
    }
    await api.post('/api/users').send(newUser).expect(400)
  })

  test('password is required', async () => {
    const newUser = {
      username: 'aubergine',
      name: 'aubergine',
    }
    await api.post('/api/users').send(newUser).expect(400)
  })
})

afterAll(() => mongoose.connection.close())
