const listHelper = require('../utils/list_helper')
const blogs = listHelper.blogs

test('dummy returns one', () => {
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes([blogs[0]])
    expect(result).toBe(7)
  })
})

describe('most likes', () => {
  const answer = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 12,
  }

  test('returns blog with most likes', () => {
    const result = listHelper.favouriteBlog(blogs)
    expect(result).toEqual(answer)
  })
})

describe('author with most blogs', () => {
  const answer = {
    author: 'Robert C. Martin',
    blogs: 3,
  }

  test('returns author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual(answer)
  })
})

describe('author with most likes', () => {
  const answer = {
    author: 'Edsger W. Dijkstra',
    likes: 17,
  }

  test('returns author with most blogs', () => {
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual(answer)
  })
})
