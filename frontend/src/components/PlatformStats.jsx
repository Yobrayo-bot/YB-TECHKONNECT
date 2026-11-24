
const statistics = [
  {
    id: 1,
    value: '06',
    label: 'Service Categories',
    description: 'Multiple areas of technology expertise.'
  },
  {
    id: 2,
    value: '04',
    label: 'Core Principles',
    description: 'Expertise, solutions, customer focus and trust.'
  },
  {
    id: 3,
    value: '01',
    label: 'Connected Platform',
    description: 'One place to discover technology services.'
  }
]

function PlatformStats() {
  return (
    <section className="stats-section">
      <div className="stats-heading">
        <p className="section-label">
          YB TECHKONNECT AT A GLANCE
        </p>

        <h2>
          Technology expertise.
          <span> Connected in one place.</span>
        </h2>
      </div>

      <div className="stats-grid">
        {statistics.map((stat) => (
          <div className="stat-item" key={stat.id}>
            <h3>{stat.value}</h3>

            <h4>{stat.label}</h4>

            <p>{stat.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PlatformStats
