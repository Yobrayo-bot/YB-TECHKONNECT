import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import { authClient, getJWTToken } from '../lib/neonAuth'

function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(event) {
    event.preventDefault()

    setMessage('')
    setLoading(true)

    try {
      const result = await authClient.signIn.email({
        email,
        password
      })

      if (result.error) {
        throw new Error(
          result.error.message || 'Unable to log in.'
        )
      }

      const token = await getJWTToken()

      if (!token) {
        throw new Error(
          'Login successful, but authentication token was not received.'
        )
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/technicians`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (response.status === 403) {
        setMessage(
          'Your account is logged in, but it does not have administrator access.'
        )
        return
      }

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to verify administrator access.'
        )
      }

      setMessage('Login successful! Welcome, Administrator.')

      navigate('/admin')

    } catch (error) {
      setMessage(error.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <main className="login-page">

        <section className="login-container">

          <div className="login-heading">

            <p className="section-label">
              WELCOME BACK
            </p>

            <h1>
              Login to Your
              <span> Account.</span>
            </h1>

            <p>
              Access your YB TECHKONNECT account
              and manage your professional activities.
            </p>

          </div>

          <form
            className="login-form"
            onSubmit={handleLogin}
          >

            <div className="form-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {message && (
              <p role="status">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? 'Please wait...' : 'Login to Account'}
            </button>

            <p className="login-register">
              Don't have an account?
              <Link to="/register">Register as a Technician</Link>
            </p>

          </form>

        </section>

      </main>

      <Footer />
    </>
  )
}

export default LoginPage
