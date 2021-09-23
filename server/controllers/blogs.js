const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
  })
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  if (!request.token || !request.decodedToken) {
    return response.status(401).json({ error: 'missing or invalid token' })
  }

  const body = request.body
  const user = request.user

  if (!body.likes) {
    body.likes = 0
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  // Populate user field on the returned blog
  const populatedBlog = await savedBlog
    .populate('user', { username: 1, name: 1 })
    .execPopulate()

  if (populatedBlog) {
    response.status(201).json(savedBlog.toJSON())
  } else {
    response.status(400).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  if (!request.token || !request.decodedToken) {
    return response.status(401).json({ error: 'missing or invalid token' })
  }

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(400).json({
      error: 'blog already deleted',
    })
  }

  if (blog['user'].toString() !== request.user.id.toString()) {
    console.log(blog.user)
    console.log(request.user.id)
    return response.status(401).json({
      error: 'blogs can be deleted only by the user who added the blog',
    })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  if (!request.token || !request.decodedToken) {
    return response.status(401).json({ error: 'missing or invalid token' })
  }

  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })

  // Populate user field on the returned blog
  const populatedBlog = await updatedBlog
    .populate('user', { username: 1, name: 1 })
    .execPopulate()

  response.json(populatedBlog.toJSON())
})

module.exports = blogsRouter
