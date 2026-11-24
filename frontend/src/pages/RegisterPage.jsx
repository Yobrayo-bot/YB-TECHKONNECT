import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { authClient, getJWTToken } from '../lib/neonAuth'

function RegisterPage() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Location data
  const [countries, setCountries] = useState([])
  const [regions, setRegions] = useState([])
  const [cities, setCities] = useState([])

  // Selected locations
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)

  // Search inputs
  const [countrySearch, setCountrySearch] = useState('')
  const [regionSearch, setRegionSearch] = useState('')
  const [citySearch, setCitySearch] = useState('')

  // Loading states
  const [loadingCountries, setLoadingCountries] = useState(true)
  const [loadingRegions, setLoadingRegions] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)
  const [locationError, setLocationError] = useState('')

  const API_URL = import.meta.env.VITE_API_URL

  // Load all countries
  useEffect(() => {
    let active = true

    async function loadCountries() {
      try {
        const response = await fetch(
          `${API_URL}/api/locations/countries`
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error('Unable to load countries.')
        }

        if (active) {
          setCountries(result.countries || [])
        }
      } catch (error) {
        if (active) {
          setLocationError(error.message)
        }
      } finally {
        if (active) {
          setLoadingCountries(false)
        }
      }
    }

    loadCountries()

    return () => {
      active = false
    }
  }, [API_URL])

  // Load regions when a country is selected
  useEffect(() => {
    let active = true

    async function loadRegions() {
      if (!selectedCountry) {
        setRegions([])
        return
      }

      setLoadingRegions(true)
      setRegions([])
      setLocationError('')

      try {
        const response = await fetch(
          `${API_URL}/api/locations/countries/${selectedCountry.iso2}/regions`
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error('Unable to load regions.')
        }

        if (active) {
          setRegions(result.regions || [])
        }
      } catch (error) {
        if (active) {
          setLocationError(error.message)
        }
      } finally {
        if (active) {
          setLoadingRegions(false)
        }
      }
    }

    loadRegions()

    return () => {
      active = false
    }
  }, [selectedCountry, API_URL])

  // Load cities when a region is selected
  useEffect(() => {
    let active = true

    async function loadCities() {
      if (!selectedRegion) {
        setCities([])
        return
      }

      setLoadingCities(true)
      setCities([])
      setLocationError('')

      try {
        const response = await fetch(
          `${API_URL}/api/locations/regions/${selectedRegion.id}/cities`
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error('Unable to load cities.')
        }

        if (active) {
          setCities(result.cities || [])
        }
      } catch (error) {
        if (active) {
          setLocationError(error.message)
        }
      } finally {
        if (active) {
          setLoadingCities(false)
        }
      }
    }

    loadCities()

    return () => {
      active = false
    }
  }, [selectedRegion, API_URL])

  // Country selection
  function handleCountryChange(value) {
    setCountrySearch(value)

    const country = countries.find(
      item => item.name.toLowerCase() === value.trim().toLowerCase()
    )

    setSelectedCountry(country || null)
    setSelectedRegion(null)
    setSelectedCity(null)

    setRegionSearch('')
    setCitySearch('')
    setRegions([])
    setCities([])
  }

  // Region selection
  function handleRegionChange(value) {
    setRegionSearch(value)

    const region = regions.find(
      item => item.name.toLowerCase() === value.trim().toLowerCase()
    )

    setSelectedRegion(region || null)
    setSelectedCity(null)

    setCitySearch('')
    setCities([])
  }

  // City selection
  function handleCityChange(value) {
    setCitySearch(value)

    const city = cities.find(
      item => item.name.toLowerCase() === value.trim().toLowerCase()
    )

    setSelectedCity(city || null)
  }

  async function handleRegistration(event) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    if (!selectedCountry || !selectedRegion || !selectedCity) {
      setMessage(
        'Please select a valid country, region and city from the suggestions.'
      )
      return
    }

    const fullName = formData.get('fullName').trim()
    const email = formData.get('email').trim()
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    const location =
      `${selectedCity.name}, ${selectedRegion.name}, ${selectedCountry.name}`

    setLoading(true)
    setMessage('Creating your account...')

    try {
      // Create Neon Auth account
      const signup = await authClient.signUp.email({
        name: fullName,
        email,
        password
      })

      if (signup.error) {
        throw new Error(signup.error.message)
      }

      // Retrieve authentication JWT
      const token = await getJWTToken()

      if (!token) {
        setMessage(
          'Account created. Please complete email verification or sign in before submitting your professional profile.'
        )
        return
      }

      setMessage('Saving your professional profile...')

      // Submit professional details
      const response = await fetch(
        `${API_URL}/api/technicians/register`,
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
            location,

            countryCode: selectedCountry.iso2,
            countryName: selectedCountry.name,
            regionId: selectedRegion.id,
            regionName: selectedRegion.name,
            cityId: selectedCity.id,
            cityName: selectedCity.name,

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

      setCountrySearch('')
      setRegionSearch('')
      setCitySearch('')

      setSelectedCountry(null)
      setSelectedRegion(null)
      setSelectedCity(null)

      setRegions([])
      setCities([])

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

            {/* Country selector */}
            <div className="form-group">
              <label htmlFor="countrySearch">
                Country
              </label>

              <input
                id="countrySearch"
                type="text"
                list="countryOptions"
                value={countrySearch}
                onChange={event =>
                  handleCountryChange(event.target.value)
                }
                placeholder={
                  loadingCountries
                    ? 'Loading countries...'
                    : 'Search for a country'
                }
                disabled={loadingCountries}
                autoComplete="off"
                required
              />

              <datalist id="countryOptions">
                {countries.map(country => (
                  <option
                    key={country.id}
                    value={country.name}
                  />
                ))}
              </datalist>
            </div>

            {/* Region selector */}
            <div className="form-group">
              <label htmlFor="regionSearch">
                State / County / Province / Region
              </label>

              <input
                id="regionSearch"
                type="text"
                list="regionOptions"
                value={regionSearch}
                onChange={event =>
                  handleRegionChange(event.target.value)
                }
                placeholder={
                  !selectedCountry
                    ? 'Select a country first'
                    : loadingRegions
                      ? 'Loading regions...'
                      : 'Search for a region'
                }
                disabled={!selectedCountry || loadingRegions}
                autoComplete="off"
                required
              />

              <datalist id="regionOptions">
                {regions.map(region => (
                  <option
                    key={region.id}
                    value={region.name}
                  />
                ))}
              </datalist>
            </div>

            {/* City selector */}
            <div className="form-group">
              <label htmlFor="citySearch">
                City / Town
              </label>

              <input
                id="citySearch"
                type="text"
                list="cityOptions"
                value={citySearch}
                onChange={event =>
                  handleCityChange(event.target.value)
                }
                placeholder={
                  !selectedRegion
                    ? 'Select a region first'
                    : loadingCities
                      ? 'Loading cities...'
                      : 'Search for a city or town'
                }
                disabled={!selectedRegion || loadingCities}
                autoComplete="off"
                required
              />

              <datalist id="cityOptions">
                {cities.map(city => (
                  <option
                    key={city.id}
                    value={city.name}
                  />
                ))}
              </datalist>
            </div>

            {locationError && (
              <p className="full-width" role="alert">
                {locationError}
              </p>
            )}

            <div className="form-group">
              <label>Years of Experience</label>

              <select
                name="experience"
                required
                defaultValue=""
              >
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
              {loading
                ? 'Creating Account...'
                : 'Create Professional Profile'}
            </button>

          </form>

        </section>

      </main>

      <Footer />
    </>
  )
}

export default RegisterPage
