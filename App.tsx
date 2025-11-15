
import React from 'react';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import Services from './components/Services.tsx';
import Products from './components/Products.tsx';
import About from './components/About.tsx';
import Testimonials from './components/Testimonials.tsx';
import Contact from './components/Contact.tsx';
import Footer from './components/Footer.tsx';
import Chatbot from './components/Chatbot.tsx';

const App: React.FC = () => {
  return (
    <div className="bg-white text-slate-800 font-sans">
      <Header />
      <main>
        <Hero />
        <Services />
        <Products />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default App;
