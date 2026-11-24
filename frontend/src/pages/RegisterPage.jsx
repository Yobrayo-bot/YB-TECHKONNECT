import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { authClient, getJWTToken } from '../lib/neonAuth'

function RegisterPage() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegistration(event) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const fullName = formData.get('fullName').trim()
    const email = formData.get('email').trim()
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setLoading(true)
    setMessage('Creating your account...')

    try {
      const signup = await authClient.signUp.email({
        name: fullName,
        email,
        password
      })

      if (signup.error) {
        throw new Error(signup.error.message)
      }

      const token = await getJWTToken()

      if (!token) {
        setMessage(
          'Account created. Please complete email verification or sign in before submitting your professional profile.'
        )
        return
      }

      setMessage('Saving your professional profile...')

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/technicians/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            fullName,
            professionalTitle: formData.get('professionalTitle'),
            phone: formData.get('phone'),
            category: formData.get('category'),
            location: formData.get('location'),
            experience: formData.get('experience'),
            description: formData.get('description')
          })
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Profile submission failed.')
      }

      setMessage(
        'Registration successful! Your professional profile is awaiting approval.'
      )

      form.reset()

    } catch (error) {
      setMessage(error.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <main className="register-page">
        <section className="register-hero">
          <p className="section-label">
            JOIN YB TECHKONNECT
          </p>

          <h1>
            Grow Your Career.
            <span> Connect With Opportunities.</span>
          </h1>

          <p>
            Create your professional profile and connect
            with customers looking for reliable technology
            services.
          </p>
        </section>

        <section className="registration-section">
          <div className="registration-heading">
            <p className="section-label">
              PROFESSIONAL REGISTRATION
            </p>

            <h2>Create Your Professional Profile</h2>

            <p>
              Provide your details so customers can learn
              about your skills and services.
            </p>
          </div>

          <form
            className="registration-form"
            onSubmit={handleRegistration}
          >
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                minLength="8"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                minLength="8"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="e.g. 0712345678"
                required
              />
            </div>

            <div className="form-group">
              <label>Professional Title</label>
              <input
                type="text"
                name="professionalTitle"
                placeholder="e.g. Web Developer"
                required
              />
            </div>

            <div className="form-group">
              <label>Service Category</label>
              <select name="category" required defaultValue="">
                <option value="" disabled>
                  Select your service category
                </option>
                <option>Computer & IT Support</option>
                <option>Web Development</option>
                <option>Networking</option>
                <option>Cybersecurity</option>
                <option>Graphic Design</option>
                <option>Software Development</option>
                <option>Digital Marketing</option>
                <option>Data Analysis</option>
              </select>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Nairobi, Kenya"
                required
              />
            </div>

            <div className="form-group">
              <label>Years of Experience</label>
              <select name="experience" required defaultValue="">
                <option value="" disabled>
                  Select your experience
                </option>
                <option>Less than 1 year</option>
                <option>1–2 years</option>
                <option>3–5 years</option>
                <option>6–10 years</option>
                <option>More than 10 years</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Professional Description</label>
              <textarea
                name="description"
                rows="5"
                placeholder="Describe your skills, experience and the services you offer..."
                required
              />
            </div>

            {message && (
              <p className="full-width" role="status">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="registration-submit"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Professional Profile'}
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default RegisterPage
