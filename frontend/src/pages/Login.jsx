import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.')
    }
  }

  return (
    <div className="page auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        {error && <p className="error-message">{error}</p>}
        <label>Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>Password
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button className="btn-primary" type="submit">Log In</button>
        <p className="auth-switch">Don't have an account? <Link to="/register">Sign up</Link></p>
      </form>
    </div>
  )
}
