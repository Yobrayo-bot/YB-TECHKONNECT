
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getJWTToken } from '../lib/neonAuth'
import './AdminPage.css'

function AdminPage() {
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  // Dashboard statistics
  const totalTechnicians = technicians.length

  const pendingTechnicians = technicians.filter(
    (technician) => technician.approval_status === 'pending'
  ).length

  const approvedTechnicians = technicians.filter(
    (technician) => technician.approval_status === 'approved'
  ).length

  const rejectedTechnicians = technicians.filter(
    (technician) => technician.approval_status === 'rejected'
  ).length

  // Filter technicians
  const filteredTechnicians = technicians.filter((technician) => {
    if (activeFilter === 'all') return true

    return technician.approval_status === activeFilter
  })

  // Fetch technicians
  async function fetchTechnicians() {
    try {
      const token = await getJWTToken()

      if (!token) {
        setMessage('Please log in to access the dashboard.')
        return
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/technicians`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to load technicians.'
        )
      }

      setTechnicians(data.technicians || [])
      setMessage('')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Approve or reject technician
  async function updateStatus(userId, action) {
    try {
      const token = await getJWTToken()

      if (!token) {
        throw new Error('Authentication required.')
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/technicians/${userId}/${action}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to update technician.'
        )
      }

      setMessage(data.message)
      await fetchTechnicians()
    } catch (error) {
      setMessage(error.message)
    }
  }

  useEffect(() => {
    fetchTechnicians()
  }, [])

  return (
    <>
      <Navbar />

      <main className="admin-page">
        <section className="admin-container">

          <p className="section-label">
            ADMINISTRATION
          </p>

          <h1>Admin Dashboard</h1>

          <p>
            Review technician applications and manage approvals.
          </p>

          {/* Dashboard Statistics */}

          <div className="admin-stats">

            <div className="admin-stat-card">
              <span>Total Technicians</span>
              <h2>{totalTechnicians}</h2>
            </div>

            <div className="admin-stat-card pending">
              <span>Pending Applications</span>
              <h2>{pendingTechnicians}</h2>
            </div>

            <div className="admin-stat-card approved">
              <span>Approved Technicians</span>
              <h2>{approvedTechnicians}</h2>
            </div>

            <div className="admin-stat-card rejected">
              <span>Rejected Technicians</span>
              <h2>{rejectedTechnicians}</h2>
            </div>

          </div>

          {/* Dashboard Navigation */}

          <div className="admin-navigation">

            <button
              type="button"
              className={activeFilter === 'all' ? 'active' : ''}
              onClick={() => setActiveFilter('all')}
            >
              All Technicians
            </button>

            <button
              type="button"
              className={activeFilter === 'pending' ? 'active' : ''}
              onClick={() => setActiveFilter('pending')}
            >
              Pending
            </button>

            <button
              type="button"
              className={activeFilter === 'approved' ? 'active' : ''}
              onClick={() => setActiveFilter('approved')}
            >
              Approved
            </button>

            <button
              type="button"
              className={activeFilter === 'rejected' ? 'active' : ''}
              onClick={() => setActiveFilter('rejected')}
            >
              Rejected
            </button>

          </div>

          {message && (
            <p role="status">
              {message}
            </p>
          )}

          {/* Technician Applications */}

          {loading ? (
            <p>Loading technician applications...</p>
          ) : (
            <>

              <h2>
                {activeFilter === 'all'
                  ? 'All Technician Applications'
                  : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Applications`
                } ({filteredTechnicians.length})
              </h2>

              {filteredTechnicians.length === 0 ? (
                <p>No technician applications found in this category.</p>
              ) : (

                <div className="admin-technicians">

                  {filteredTechnicians.map((technician) => (

                    <article
                      className="admin-technician-card"
                      key={technician.user_id}
                    >

                      <h3>{technician.full_name}</h3>

                      <p>{technician.professional_title}</p>

                      <p>Phone: {technician.phone}</p>

                      <p>Category: {technician.category}</p>

                      <p>Location: {technician.location}</p>

                      <p>Experience: {technician.experience}</p>

                      <p>{technician.description}</p>

                      <div className={`admin-status ${technician.approval_status}`}>
                        {technician.approval_status}
                      </div>

                      {technician.approval_status !== 'approved' && (
                        <button
                          type="button"
                          onClick={() => updateStatus(
                            technician.user_id,
                            'approve'
                          )}
                        >
                          Approve
                        </button>
                      )}

                      {technician.approval_status !== 'rejected' && (
                        <button
                          type="button"
                          onClick={() => updateStatus(
                            technician.user_id,
                            'reject'
                          )}
                        >
                          Reject
                        </button>
                      )}

                    </article>

                  ))}

                </div>

              )}

            </>
          )}

        </section>
      </main>

      <Footer />
    </>
  )
}

export default AdminPage
