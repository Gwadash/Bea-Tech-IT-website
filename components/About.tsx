
import React from 'react';

const About: React.FC = () => {
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
    <section id="about" className="py-20 bg-white scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-left">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    Passionate About Technology, Dedicated To You
                </h2>
                <p className="mt-6 text-xl text-slate-600">
                    At Bea-Tech IT, we are more than just a computer company. We are a team of dedicated technology enthusiasts committed to providing exceptional service and reliable solutions. Our mission is to fix and better your computer and network, ensuring you have the tools to succeed in a digital world. We pride ourselves on our expertise, friendly support, and building lasting relationships with our clients in Vanderbijlpark and beyond.
                </p>
                <div className="mt-8">
                    <a href="#contact" onClick={handleSmoothScroll} className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300">
                        Meet The Team
                    </a>
                </div>
            </div>
            <div className="flex items-center justify-center lg:order-last order-first">
                <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="The Bea-Tech IT team collaborating in a modern office"
                    className="rounded-xl shadow-2xl object-cover w-full h-full max-h-[500px]"
                />
            </div>
        </div>
      </div>
    </section>
  );
};

export default About;