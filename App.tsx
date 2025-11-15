
import React from 'react';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import Services from './components/Services.tsx';
import FeaturedProduct from './components/FeaturedProduct.tsx';
import About from './components/About.tsx';
import Testimonials from './components/Testimonials.tsx';
import Contact from './components/Contact.tsx';
import Footer from './components/Footer.tsx';

const App: React.FC = () => {
  return (
    <div className="bg-white text-slate-800 font-sans">
      <Header />
      <main>
        <Hero />
        <Services />
        <FeaturedProduct />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;