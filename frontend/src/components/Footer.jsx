
function Footer() {
  return (
    <footer className="footer">

      <div className="footer-content">

        <div className="footer-brand">
          <h2>YB <span>TECHKONNECT</span></h2>

          <p>
            Connecting people with reliable technology
            solutions and skilled professionals.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
        </div>

        <div className="footer-contact">
          <h3>Get In Touch</h3>

          <p>Let's build something great together.</p>
          <a href="/contact">Contact Our Team</a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} YB TECHKONNECT.
          All rights reserved.
        </p>
      </div>

    </footer>
  )
}

export default Footer
