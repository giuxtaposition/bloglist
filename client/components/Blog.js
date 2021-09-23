import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteBlog, currentUser }) => {
  const [user, setUser] = useState('')
  const [visible, setVisible] = useState(false)

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    updateBlog: PropTypes.func.isRequired,
    deleteBlog: PropTypes.func.isRequired,
    currentUser: PropTypes.string.isRequired,
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  useEffect(() => {
    if (blog.user) {
      setUser(blog.user.username)
    }
  }, [blog.user])

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const addLike = async () => {
    const likedBlog = { ...blog, likes: blog.likes + 1 }
    updateBlog(blog.id, likedBlog)
  }

  const remove = async () => {
    const result = window.confirm(
      `Do you really want to delete ${blog.title} by ${blog.author}?`
    )
    if (result) {
      deleteBlog(blog.id, blog)
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      <p>
        <b>{blog.title}</b> by {blog.author}{' '}
        <button onClick={toggleVisibility}>{!visible ? 'View' : 'Hide'}</button>
      </p>
      {visible && (
        <>
          <p>{blog.url}</p>
          <p>
            Likes: <span id='blog-likes'>{blog.likes}</span>{' '}
            <button onClick={addLike}>Like</button>
          </p>
          <p>{user}</p>
          {user === currentUser && (
            <p>
              <button onClick={remove}>Remove</button>
            </p>
          )}
        </>
      )}
    </div>
  )
}

export default Blog
