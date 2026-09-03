import AboutUs from '../sections/AboutUs'
import Awards from '../sections/Awards'
import FAQ from '../sections/FAQ'
import Footer from '../sections/Footer'
import Header from '../sections/Header'
import Hero from '../sections/Hero'
import Testimonials from '../sections/Testimonials'
import Treatments from '../sections/Treatments'
import WhyChoose from '../sections/WhyChoose'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AboutUs />
        <WhyChoose />
        <Treatments />
        <Awards />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
