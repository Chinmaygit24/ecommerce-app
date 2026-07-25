import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(name, email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    }
  }

  return (
    <div className="page auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Create your account</h1>
        {error && <p className="error-message">{error}</p>}
        <label>Full Name
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>Password
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button className="btn-primary" type="submit">Sign Up</button>
        <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  )
}
