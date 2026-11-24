
const benefits = [
  {
    id: 1,
    number: '01',
    title: 'Skilled Professionals',
    description:
      'Connect with capable technology professionals who understand your needs and deliver quality technical solutions.',
    category: 'EXPERTISE'
  },
  {
    id: 2,
    number: '02',
    title: 'Practical Solutions',
    description:
      'We focus on solving real technical problems through effective, reliable and result-oriented solutions.',
    category: 'PROBLEM SOLVING'
  },
  {
    id: 3,
    number: '03',
    title: 'Customer Focus',
    description:
      'Every project begins with understanding your requirements and finding the right solution for your goals.',
    category: 'CLIENT EXPERIENCE'
  },
  {
    id: 4,
    number: '04',
    title: 'One Trusted Platform',
    description:
      'Access multiple technology services through one convenient platform designed to connect clients with experts.',
    category: 'CONVENIENCE'
  }
]

function WhyChooseUs() {
  return (
    <section className="why-section">
      <div className="why-heading">
        <p className="section-label">
          WHY YB TECHKONNECT
        </p>

        <h2>
          More than technology.
          <span> A trusted partnership.</span>
        </h2>

        <p className="section-description">
          We bring together technical expertise, practical
          solutions and a customer-focused approach to make
          technology work better for everyone.
        </p>
      </div>

      <div className="benefits-grid">
        {benefits.map((benefit) => (
          <article
            className="benefit-card"
            key={benefit.id}
          >
            <div className="benefit-top">
              <span>{benefit.category}</span>
              <span>{benefit.number}</span>
            </div>

            <h3>{benefit.title}</h3>

            <p>{benefit.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default WhyChooseUs
