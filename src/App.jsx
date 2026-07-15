import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import Benefits from './components/sections/Benefits'
import Modules from './components/sections/Modules'
import Battle from './components/sections/Battle'
import Progress from './components/sections/Progress'
import HowItWorks from './components/sections/HowItWorks'
import CallToAction from './components/sections/CallToAction'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Modules />
        <Battle />
        <Progress />
        <HowItWorks />
        <CallToAction />
      </main>
      <Footer />
    </>
  )
}
