const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
]

const dummy = blogs => {
  blogs = 1
  return blogs
}

const totalLikes = blogs => {
  return blogs.reduce((accumulator, blog) => (accumulator += blog.likes), 0)
}

const favouriteBlog = blogs => {
  const mostLikes = (accumulator, blog) => {
    return accumulator.likes < blog.likes ? blog : accumulator
  }

  const favourite = blogs.reduce(mostLikes, blogs[0])

  return {
    title: favourite.title,
    author: favourite.author,
    likes: favourite.likes,
  }
}

const mostBlogs = blogs => {
  const authorsList = {}

  blogs.forEach(blog => {
    const author = blog.author
    authorsList[author] ? (authorsList[author] += 1) : (authorsList[author] = 1)
  })

  const authorWithMostBlogs = Object.keys(authorsList).sort(
    (a, b) => authorsList[b] - authorsList[a]
  )[0]

  return {
    author: authorWithMostBlogs,
    blogs: authorsList[authorWithMostBlogs],
  }
}

const mostLikes = blogs => {
  const authorsList = {}

  blogs.forEach(blog => {
    const author = blog.author
    authorsList[author]
      ? (authorsList[author] += blog.likes)
      : (authorsList[author] = blog.likes)
  })

  const authorWithMostLikes = Object.keys(authorsList).sort(
    (a, b) => authorsList[b] - authorsList[a]
  )[0]

  return {
    author: authorWithMostLikes,
    likes: authorsList[authorWithMostLikes],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
  blogs,
}
