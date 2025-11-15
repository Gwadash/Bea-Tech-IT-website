
import React, { useState, useEffect, useRef } from 'react';
import { useCountUp } from './hooks/useCountUp.ts';
import { BriefcaseIcon, StarIcon, UsersIcon } from './Icons.tsx';

const useOnScreen = (options: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return [ref, isVisible] as const;
};

const StatCard: React.FC<{ icon: React.FC<React.SVGProps<SVGSVGElement>>; end: number; label: string; isVisible: boolean; suffix?: string; prefix?: string; decimals?: number }> = ({ icon: Icon, end, label, isVisible, suffix = '', prefix = '', decimals = 0 }) => {
    const count = useCountUp(end, 2000, isVisible, decimals);
    return (
        <div className="flex flex-col items-center text-center">
            <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500 mb-2" />
            <p className="text-3xl sm:text-4xl font-bold text-slate-900">{prefix}{count}{suffix}</p>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        </div>
    );
};

const About: React.FC = () => {
  const [sectionRef, isVisible] = useOnScreen({ threshold: 0.2 });
  
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
      <div ref={sectionRef} className={`container mx-auto px-4 sm:px-6 lg:px-8 ${isVisible ? 'is-visible' : ''}`}>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="text-left animate-on-scroll slide-left">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    Passionate About Technology, Dedicated To You
                </h2>
                <p className="mt-6 text-lg md:text-xl text-slate-600">
                    Our founder’s 10 years in the IT industry inspired the decision to launch this business, driven by a mission to deliver unparalleled service and client satisfaction in the Vaal Triangle. At Bea-Tech IT, we are more than just a computer company. We are a team of dedicated technology enthusiasts committed to providing exceptional service and reliable solutions. Our mission is to fix and better your computer and network, ensuring you have the tools to succeed in a digital world. We pride ourselves on our expertise, friendly support, and building lasting relationships with our clients in Vanderbijlpark and beyond.
                </p>
                <div className="mt-8">
                    <a href="#contact" onClick={handleSmoothScroll} className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300">
                        Get In Touch
                    </a>
                </div>
            </div>
            <div className="flex items-center justify-center lg:order-last order-first animate-on-scroll slide-right">
                <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto-format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="The Bea-Tech IT team collaborating in a modern office"
                    className="rounded-xl shadow-2xl object-cover w-full h-full max-h-[500px]"
                />
            </div>
        </div>
        <div className="mt-24 bg-slate-50 p-6 md:p-8 rounded-xl animate-on-scroll slide-up" style={{ transitionDelay: '200ms' }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <StatCard icon={BriefcaseIcon} end={10} isVisible={isVisible} suffix="+" label="Years of Experience" />
                <StatCard icon={StarIcon} end={5} isVisible={isVisible} suffix=".0" decimals={1} label="Customer Rating" />
                <StatCard icon={UsersIcon} end={500} isVisible={isVisible} suffix="+" label="Satisfied Clients" />
            </div>
        </div>
      </div>
    </section>
  );
};

export default About;
