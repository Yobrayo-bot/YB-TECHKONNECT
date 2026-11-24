import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import technicians from '../data/technicians'

function TechnicianProfilePage() {

  const { id } = useParams()

  const technician = technicians.find(
    (person) => person.id === Number(id)
  )

  if (!technician) {
    return (
      <>
        <Navbar />

        <main className="profile-not-found">
          <h1>Professional Not Found</h1>

          <p>
            The technician profile you are looking
            for does not exist.
          </p>

          <Link to="/technicians">
            Back to Technicians
          </Link>
        </main>

        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      <main className="technician-profile-page">

        <section className="profile-header">

          <div className="profile-avatar">
            {technician.name.charAt(0)}
          </div>

          <div className="profile-heading">

            <p className="section-label">
              VERIFIED PROFESSIONAL NETWORK
            </p>

            <h1>{technician.name}</h1>

            <h2>{technician.profession}</h2>

            <p>{technician.location}</p>

          </div>

        </section>

        <section className="profile-details">

          <div className="profile-about">

            <h2>About This Professional</h2>

            <p>{technician.description}</p>

          </div>

          <div className="profile-information">

            <h2>Professional Information</h2>

            <div>
              <span>Service Category</span>
              <strong>{technician.category}</strong>
            </div>

            <div>
              <span>Experience</span>
              <strong>{technician.experience}</strong>
            </div>

            <div>
              <span>Location</span>
              <strong>{technician.location}</strong>
            </div>

          </div>

        </section>

        <Link to="/technicians" className="back-to-directory">
          Back to All Professionals
        </Link>

      </main>

      <Footer />
    </>
  )
}

export default TechnicianProfilePage