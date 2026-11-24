
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

function TechniciansPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Professionals')
  const [searchTerm, setSearchTerm] = useState('')
  const [technicians, setTechnicians] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
useEffect(() => {
  const fetchTechnicians = async () => {
    try {
      const response = await fetch(
        'https://shiny-meme-97j46xj99rg6cpxr9-5000.app.github.dev/api/technicians'
      )

      if (!response.ok) {
        throw new Error('Failed to retrieve technicians')
      }

      const data = await response.json()

      setTechnicians(
  data.technicians.map((technician) => ({
    id: technician.user_id,
    name: technician.full_name,
    profession: technician.professional_title,
    category: technician.category,
    location: technician.location,
    experience: technician.experience,
    description: technician.description
  }))
)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  fetchTechnicians()
}, [])
const filteredTechnicians = technicians.filter((technician) => {

  const matchesCategory =
    selectedCategory === 'All Professionals' ||
    technician.category === selectedCategory

  const search = searchTerm.toLowerCase().trim()

  const matchesSearch =
  (technician.name || '').toLowerCase().includes(search) ||
  (technician.profession || '').toLowerCase().includes(search) ||
  (technician.category || '').toLowerCase().includes(search) ||
  (technician.location || '').toLowerCase().includes(search) ||
  (technician.description || '').toLowerCase().includes(search)

  return matchesCategory && matchesSearch

})
  return (
    <>
      <Navbar />

      <main className="technicians-page">

        <section className="technicians-hero">

          <p className="section-label">
            FIND THE RIGHT PROFESSIONAL
          </p>

          <h1>
            Find Skilled
            <span> Technology Professionals.</span>
          </h1>

          <p>
            Discover skilled technology professionals
            ready to help you solve problems, build
            solutions and bring your ideas to life.
          </p>

        </section>
        <section className="technician-search">

  <div className="search-heading">
    <h2>Explore Technology Professionals</h2>

    <p>
      Search for the right expertise to get your
      technology project moving.
    </p>
  </div>

  <div className="search-box">

    <input
  type="text"
  placeholder="Search for a technician or service..."
  value={searchTerm}
  onChange={(event) => setSearchTerm(event.target.value)}
/>

    <button type="button">
      Search
    </button>

  </div>

</section>
<section className="technician-categories">

  <div className="category-heading">
    <h2>Browse by Expertise</h2>

    <p>
      Select a service category to find professionals
      with the right skills.
    </p>
  </div>

  <div className="category-list">

  <button
    type="button"
    className={selectedCategory === 'All Professionals' ? 'active' : ''}
    onClick={() => setSelectedCategory('All Professionals')}
  >
    All Professionals
  </button>

  <button
    type="button"
    className={selectedCategory === 'Computer & IT Support' ? 'active' : ''}
    onClick={() => setSelectedCategory('Computer & IT Support')}
  >
    Computer & IT Support
  </button>

  <button
    type="button"
    className={selectedCategory === 'Web Development' ? 'active' : ''}
    onClick={() => setSelectedCategory('Web Development')}
  >
    Web Development

  </button>

  <button
  type="button"
  className={selectedCategory === 'Software Development' ? 'active' : ''}
  onClick={() => setSelectedCategory('Software Development')}
>
  Software Development
</button>

  <button
    type="button"
    className={selectedCategory === 'Networking' ? 'active' : ''}
    onClick={() => setSelectedCategory('Networking')}
  >
    Networking
  </button>

  <button
    type="button"
    className={selectedCategory === 'Cybersecurity' ? 'active' : ''}
    onClick={() => setSelectedCategory('Cybersecurity')}
  >
    Cybersecurity
  </button>

  <button
  type="button"
  className={selectedCategory === 'Digital Marketing' ? 'active' : ''}
  onClick={() => setSelectedCategory('Digital Marketing')}
>
  Digital Marketing
</button>

  <button
    type="button"
    className={selectedCategory === 'Graphic Design' ? 'active' : ''}
    onClick={() => setSelectedCategory('Graphic Design')}
  >
    Graphic Design
  </button>

  <button
  type="button"
  className={selectedCategory === 'Data Analysis' ? 'active' : ''}
  onClick={() => setSelectedCategory('Data Analysis')}
>
  Data Analysis
</button>

</div>

</section>
<section className="technician-directory">

  <div className="directory-heading">

    <div>
      <p className="section-label">
        OUR PROFESSIONAL NETWORK
      </p>

      <h2>Meet Our Technology Professionals</h2>

      <p>
        Explore professionals with different skills
        and expertise, ready to support your needs.
      </p>
    </div>

    <div className="technician-count">
      <strong>{technicians.length}</strong>
      <span>Professionals</span>
    </div>

  </div>
{loading ? (

  <p className="loading-message">
    Loading technology professionals...
  </p>

) : error ? (

  <p className="error-message">
    {error}
  </p>

) : filteredTechnicians.length > 0 ? (
  
  <div className="technician-grid">

    {filteredTechnicians.map((technician) => (

      <article className="technician-card" key={technician.id}>

        <div className="technician-avatar">
          {technician.name.charAt(0)}
        </div>

        <div className="technician-info">

          <h3>{technician.name}</h3>

          <p className="technician-profession">
            {technician.profession}
          </p>

          <p className="technician-location">
            {technician.location}
          </p>

          <span className="technician-experience">
            {technician.experience}
          </span>

          <p className="technician-description">
            {technician.description}
          </p>

          <Link
            to={`/technicians/${technician.id}`}
              className="profile-button"
              >
                View Profile
                </Link>

        </div>

      </article>

    ))}

  </div>

) : (

  <div className="no-results">

    <h3>No Professionals Found</h3>

    <p>
      We couldn't find any professionals matching
      your search. Try another keyword or category.
    </p>

    <button
      type="button"
      onClick={() => {
        setSearchTerm('')
        setSelectedCategory('All Professionals')
      }}
    >
      Clear Filters
    </button>

  </div>

)} 

</section>

      </main>

      <Footer />
    </>
  )
}

export default TechniciansPage
