
const services = [
  {
    id: 1,
    number: '01',
    title: 'Computer & IT Support',
    description: 'Computer troubleshooting, software installation, system maintenance and technical assistance.',
    category: 'TECHNICAL SUPPORT'
  },
  {
    id: 2,
    number: '02',
    title: 'Web Development',
    description: 'Professional websites, web applications and digital platforms for individuals and businesses.',
    category: 'DIGITAL DEVELOPMENT'
  },
  {
    id: 3,
    number: '03',
    title: 'Networking Solutions',
    description: 'Network installation, Wi-Fi configuration, connectivity and infrastructure support.',
    category: 'NETWORKING'
  },
  {
    id: 4,
    number: '04',
    title: 'Cybersecurity',
    description: 'Authorized security assessments, system protection and practical security guidance.',
    category: 'DIGITAL SECURITY'
  },
  {
    id: 5,
    number: '05',
    title: 'Graphic & Brand Design',
    description: 'Visual identities, marketing materials and creative digital designs.',
    category: 'CREATIVE SERVICES'
  },
  {
    id: 6,
    number: '06',
    title: 'Data & Business Solutions',
    description: 'Data management, spreadsheets, reporting systems and business automation.',
    category: 'BUSINESS TECHNOLOGY'
  }
]

function Services() {
  return (
    <section className="services-section">
      <div className="services-heading">
        <p className="section-label">WHAT WE DO</p>

        <h2>
          Technology services.
          <span> One trusted connection.</span>
        </h2>

        <p className="section-description">
          Find the expertise you need to solve technical
          challenges and bring your digital ideas to life.
        </p>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <article className="service-card" key={service.id}>
            <div className="service-card-top">
              <span>{service.category}</span>
              <span>{service.number}</span>
            </div>

            <h3>{service.title}</h3>

            <p>{service.description}</p>

            <a href="/services">
              Explore service <span>→</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Services
