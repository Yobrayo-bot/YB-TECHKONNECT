
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
  const [updatingId, setUpdatingId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  const filteredTechnicians = technicians.filter((technician) => {
    if (activeFilter === 'all') return true
    return technician.approval_status === activeFilter
  })

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
      setMessage('')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(userId, action) {
    try {
      setUpdatingId(userId)
      setMessage('')

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
        throw new Error(data.message || 'Unable to update technician.')
      }

      await fetchTechnicians()
      setMessage(data.message || 'Technician status updated successfully.')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setUpdatingId(null)
    }
  }

  function selectFilter(filter) {
    setActiveFilter(filter)
    setSidebarOpen(false)
  }

  useEffect(() => {
    fetchTechnicians()
  }, [])

  return (
    <>
      <Navbar />

      <main className="admin-layout">

        {sidebarOpen && (
          <button
            type="button"
            className="admin-sidebar-overlay"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>

          <div className="admin-brand">
            <div className="admin-brand-icon">YB</div>
            <div>
              <h2>TECHKONNECT</h2>
              <span>ADMIN PANEL</span>
            </div>
          </div>

          <div className="admin-sidebar-label">MAIN MENU</div>

          <nav className="admin-sidebar-nav">

            <button
              type="button"
              className={activeFilter === 'all' ? 'active' : ''}
              onClick={() => selectFilter('all')}
            >
              <span className="admin-nav-icon">▦</span>
              Dashboard
            </button>

            <button
              type="button"
              className={activeFilter === 'pending' ? 'active' : ''}
              onClick={() => selectFilter('pending')}
            >
              <span className="admin-nav-icon">◷</span>
              Pending Applications
              <span className="admin-nav-count">{pendingTechnicians}</span>
            </button>

            <button
              type="button"
              className={activeFilter === 'approved' ? 'active' : ''}
              onClick={() => selectFilter('approved')}
            >
              <span className="admin-nav-icon">✓</span>
              Approved Technicians
            </button>

            <button
              type="button"
              className={activeFilter === 'rejected' ? 'active' : ''}
              onClick={() => selectFilter('rejected')}
            >
              <span className="admin-nav-icon">×</span>
              Rejected Applications
            </button>

          </nav>

          <div className="admin-sidebar-bottom">
            <span>YB TECHKONNECT</span>
            <p>Administrator workspace</p>
          </div>

        </aside>

        <section className="admin-main-content">

          <header className="admin-topbar">

            <button
              type="button"
              className="admin-menu-toggle"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>

            <div>
              <span className="admin-topbar-label">ADMINISTRATION</span>
              <h1>Dashboard Overview</h1>
            </div>

            <div className="admin-topbar-user">
              <div className="admin-avatar">A</div>
              <div>
                <strong>Administrator</strong>
                <span>System Manager</span>
              </div>
            </div>

          </header>

          <div className="admin-dashboard-content">

            <div className="admin-welcome">
              <div>
                <p className="section-label">WELCOME BACK</p>
                <h2>Manage Your Platform</h2>
                <p>
                  Monitor technician applications and manage your
                  YB TECHKONNECT community.
                </p>
              </div>

              <button
                type="button"
                className="admin-refresh-button"
                onClick={fetchTechnicians}
                disabled={loading}
              >
                ↻ Refresh Data
              </button>
            </div>

            <div className="admin-stats">

              <article className="admin-stat-card">
                <div className="admin-stat-top">
                  <span>Total Technicians</span>
                  <span className="admin-stat-icon total">▦</span>
                </div>
                <h3>{totalTechnicians}</h3>
                <p>All applications</p>
              </article>

              <article className="admin-stat-card">
                <div className="admin-stat-top">
                  <span>Pending Applications</span>
                  <span className="admin-stat-icon pending">◷</span>
                </div>
                <h3>{pendingTechnicians}</h3>
                <p>Awaiting review</p>
              </article>

              <article className="admin-stat-card">
                <div className="admin-stat-top">
                  <span>Approved Technicians</span>
                  <span className="admin-stat-icon approved">✓</span>
                </div>
                <h3>{approvedTechnicians}</h3>
                <p>Successfully approved</p>
              </article>

              <article className="admin-stat-card">
                <div className="admin-stat-top">
                  <span>Rejected Applications</span>
                  <span className="admin-stat-icon rejected">×</span>
                </div>
                <h3>{rejectedTechnicians}</h3>
                <p>Not approved</p>
              </article>

            </div>

            <section className="admin-applications-section">

              <div className="admin-section-heading">
                <div>
                  <p className="section-label">APPLICATION MANAGEMENT</p>
                  <h2>Technician Applications</h2>
                  <p>Review and manage technician registration requests.</p>
                </div>
              </div>

              <div className="admin-filter-tabs">

                <button
                  type="button"
                  className={activeFilter === 'all' ? 'active' : ''}
                  onClick={() => selectFilter('all')}
                >
                  All <span>{totalTechnicians}</span>
                </button>

                <button
                  type="button"
                  className={activeFilter === 'pending' ? 'active' : ''}
                  onClick={() => selectFilter('pending')}
                >
                  Pending <span>{pendingTechnicians}</span>
                </button>

                <button
                  type="button"
                  className={activeFilter === 'approved' ? 'active' : ''}
                  onClick={() => selectFilter('approved')}
                >
                  Approved <span>{approvedTechnicians}</span>
                </button>

                <button
                  type="button"
                  className={activeFilter === 'rejected' ? 'active' : ''}
                  onClick={() => selectFilter('rejected')}
                >
                  Rejected <span>{rejectedTechnicians}</span>
                </button>

              </div>

              {message && (
                <div className="admin-message" role="status">
                  {message}
                </div>
              )}

              {loading ? (
                <div className="admin-empty-state">
                  Loading technician applications...
                </div>
              ) : filteredTechnicians.length === 0 ? (
                <div className="admin-empty-state">
                  <span>▦</span>
                  <h3>No applications found</h3>
                  <p>There are no technicians in this category yet.</p>
                </div>
              ) : (

                <div className="admin-technicians">

                  {filteredTechnicians.map((technician) => (

                    <article
                      className="admin-technician-card"
                      key={technician.user_id}
                    >

                      <div className="admin-technician-heading">
                        <div className="admin-technician-avatar">
                          {technician.full_name?.charAt(0)?.toUpperCase() || 'T'}
                        </div>

                        <div className="admin-technician-identity">
                          <h3>{technician.full_name}</h3>
                          <p>{technician.professional_title}</p>
                        </div>

                        <span className={`admin-status ${technician.approval_status}`}>
                          {technician.approval_status}
                        </span>
                      </div>

                      <div className="admin-technician-details">
                        <p><strong>Phone:</strong> {technician.phone || 'Not provided'}</p>
                        <p><strong>Category:</strong> {technician.category || 'Not provided'}</p>
                        <p><strong>Location:</strong> {technician.location || 'Not provided'}</p>
                        <p><strong>Experience:</strong> {technician.experience || 'Not provided'}</p>
                      </div>

                      {technician.description && (
                        <p className="admin-technician-description">
                          {technician.description}
                        </p>
                      )}

                      <div className="admin-card-actions">

                        {technician.approval_status !== 'approved' && (
                          <button
                            type="button"
                            className="admin-approve-button"
                            disabled={updatingId === technician.user_id}
                            onClick={() => updateStatus(
                              technician.user_id,
                              'approve'
                            )}
                          >
                            {updatingId === technician.user_id
                              ? 'Updating...'
                              : 'Approve Technician'}
                          </button>
                        )}

                        {technician.approval_status !== 'rejected' && (
                          <button
                            type="button"
                            className="admin-reject-button"
                            disabled={updatingId === technician.user_id}
                            onClick={() => updateStatus(
                              technician.user_id,
                              'reject'
                            )}
                          >
                            Reject
                          </button>
                        )}

                      </div>

                    </article>

                  ))}

                </div>

              )}

            </section>

          </div>

        </section>

      </main>

      <Footer />
    </>
  )
}

export default AdminPage
