import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getJWTToken } from '../lib/neonAuth'

function AdminPage() {
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

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
        throw new Error(data.message || 'Unable to load technicians.')
      }

      setTechnicians(data.technicians || [])
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(userId, action) {
    try {
      const token = await getJWTToken()

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
        throw new Error(data.message || 'Unable to update technician.')
      }

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

          <p className="section-label">ADMINISTRATION</p>

          <h1>Admin Dashboard</h1>

          <p>
            Review technician applications and manage approvals.
          </p>

          {message && <p role="alert">{message}</p>}

          {loading ? (
            <p>Loading technician applications...</p>
          ) : (
            <>
              <h2>Technician Applications ({technicians.length})</h2>

              {technicians.length === 0 ? (
                <p>No technician applications found.</p>
              ) : (
                <div className="admin-technicians">
                  {technicians.map((technician) => (
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

                      <p>
                        Status: <strong>{technician.approval_status}</strong>
                      </p>

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
