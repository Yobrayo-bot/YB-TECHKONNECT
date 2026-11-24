
import Navbar from '../components/Navbar'
import CallToAction from '../components/CallToAction'
import Footer from '../components/Footer'

function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="about-page">

        <section className="about-hero">
          <p className="section-label">
            ABOUT YB TECHKONNECT
          </p>

          <h1>
            Connecting Technology.
            <span> Empowering People.</span>
          </h1>

          <p>
            YB TECHKONNECT is a technology services
            platform designed to connect people and
            businesses with skilled technology
            professionals and practical digital solutions.
          </p>
        </section>

        <section className="about-mission">

          <div>
            <p className="section-label">OUR MISSION</p>

            <h2>
              Making Technology Solutions Accessible
            </h2>

            <p>
              Our mission is to simplify access to
              reliable technology services by connecting
              customers with professionals who can
              address their technology needs.
            </p>
          </div>

          <div>
            <p className="section-label">OUR VISION</p>

            <h2>
              A Connected Technology Community
            </h2>

            <p>
              Our vision is to build a trusted platform
              where technology professionals and
              customers can connect, collaborate and
              create meaningful solutions.
            </p>
          </div>

        </section>

      </main>

      <CallToAction />
      <Footer />
    </>
  )
}

export default AboutPage
