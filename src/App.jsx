import { useCallback, useState } from "react";
import Preloader from "./components/Preloader.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Marquee from "./components/Marquee.jsx";
import Work from "./components/Work.jsx";
import Services from "./components/Services.jsx";
import Orbit from "./components/Orbit.jsx";
import Process from "./components/Process.jsx";
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  // "Get a quote" buttons call this: it scrolls to the form and pre-selects the service
  const [prefill, setPrefill] = useState(null);
  const toForm = useCallback((service, message) => {
    setPrefill({ service, message, nonce: Date.now() });
    document.getElementById("contact")?.scrollIntoView();
  }, []);

  return (
    <>
      <Preloader />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Work onQuote={toForm} />
        <Services onQuote={toForm} />
        <Orbit onQuote={toForm} />
        <Process />
        <About />
        <Contact prefill={prefill} />
      </main>
      <Footer />
    </>
  );
}
