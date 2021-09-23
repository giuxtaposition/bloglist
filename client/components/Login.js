import React from 'react'
const Login = ({
  username,
  setUsername,
  password,
  setPassword,
  handleLogin,
}) => (
  <div>
    <form onSubmit={handleLogin}>
      <div>
        username{' '}
        <input
          id='login-username'
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password{' '}
        <input
          id='login-password'
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit' id='login-button'>
        login
      </button>
    </form>
  </div>
)

export default Login
