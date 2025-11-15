
import React from 'react';

const Hero: React.FC = () => {
  const handleSmoothScroll = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    if (!href) return;
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative text-white overflow-hidden scroll-mt-20 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}>
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="min-h-[60vh] md:min-h-[70vh] flex items-center justify-center text-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter">
              Your <span className="text-blue-400">Next Level</span> IT Partner
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
              We supply the latest hardware, software, and accessories. Our expert tech team is here to fix, maintain, and elevate your computer and network performance.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <a
                href="#services"
                onClick={handleSmoothScroll}
                className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300"
              >
                Our Services
              </a>
              <a
                href="#contact"
                onClick={handleSmoothScroll}
                className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-slate-50 ring-2 ring-inset ring-white transition-transform transform hover:scale-105 duration-300"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;