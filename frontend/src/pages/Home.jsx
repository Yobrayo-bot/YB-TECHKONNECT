import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Services from '../components/Services'
import WhyChooseUs from '../components/WhyChooseUs'
import PlatformStats from '../components/PlatformStats'
import CallToAction from '../components/CallToAction'
import Footer from '../components/Footer'

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <WhyChooseUs />
      <PlatformStats />
      <CallToAction />
      <Footer />
    </>
  )
}

export default Home