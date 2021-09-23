import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import Blog from './components/Blog'
import Login from './components/Login'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import AddBlogForm from './components/AddBlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  //Notification
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationStatus, setNotificationStatus] = useState('')

  // GET blogs
  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
  }, [])

  // GET Logged in user
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      setNotificationStatus('success')
      setNotificationMessage(`${user.username} logged in successfully`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (exception) {
      setNotificationStatus('error')
      setNotificationMessage('Wrong credentials')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    blogService.setToken(null)
    setNotificationStatus('success')
    setNotificationMessage(`${user.username} logged out successfully`)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const createBlog = async blogObject => {
    try {
      const blog = await blogService.create(blogObject)
      setBlogs(blogs.concat(blog))

      blogFormRef.current.toggleVisibility()
      setNotificationStatus('success')
      setNotificationMessage(
        `A new blog "${blogObject.title}" by ${blogObject.author} added successfully`
      )

      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (error) {
      setNotificationStatus('error')
      setNotificationMessage('Request failed')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const updateBlog = async (id, blogObject) => {
    try {
      const updatedBlog = await blogService.update(id, blogObject)

      // Update blog list
      const updatedBlogs = blogs.map(b =>
        b.id === updatedBlog.id ? updatedBlog : b
      )

      // Set updated blogs state, sort by number of likes
      setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes))

      setNotificationStatus('success')
      setNotificationMessage(
        `Liked "${blogObject.title}" by ${blogObject.author}`
      )

      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (error) {
      console.log(error)
      setNotificationStatus('error')
      setNotificationMessage('Request failed')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const deleteBlog = async (id, blog) => {
    try {
      await blogService.remove(id).catch(error => {
        if (error.response.status !== 204) {
          throw new Error(error.response.data.error)
        }
      })
      setBlogs(
        blogs.filter(blog => blog.id !== id).sort((a, b) => b.likes - a.likes)
      )

      setNotificationStatus('success')
      setNotificationMessage(`Deleted "${blog.title}" by ${blog.author}`)

      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (error) {
      setNotificationStatus('error')
      setNotificationMessage(error.message)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <h1>Blog App</h1>
      <Notification message={notificationMessage} status={notificationStatus} />

      {user === null ? (
        <div>
          <h2>Login</h2>
          <Login
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />
        </div>
      ) : (
        <div>
          <p>
            {user.username} logged in{' '}
            <button onClick={handleLogout}>Logout</button>
          </p>

          <Togglable buttonLabel='Create New Blog' ref={blogFormRef}>
            <AddBlogForm createBlog={createBlog} />
          </Togglable>
          <h2>blogs</h2>
          <div className='blog-list'>
            {blogs.map(blog => (
              <Blog
                blog={blog}
                key={blog.id}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
                currentUser={user.username}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
