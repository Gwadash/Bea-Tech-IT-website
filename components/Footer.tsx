
import React, { useState, useEffect, useRef } from 'react';
import Logo from './Logo.tsx';
import { NAV_LINKS, CONTACT_DETAILS } from '../constants.ts';

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


const Footer: React.FC = () => {
  const [footerRef, isVisible] = useOnScreen({ threshold: 0.1 });

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
    <footer ref={footerRef} className={`bg-slate-800 text-slate-300 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
                <a href="#home" onClick={handleSmoothScroll} aria-label="Bea-Tech Home">
                    <Logo variant="dark" />
                </a>
                <p className="text-slate-400">Your trusted partner for next level IT solutions in Vanderbijlpark.</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-sm font-semibold text-slate-100 tracking-wider uppercase">Quick Links</h3>
                    <ul className="mt-4 space-y-2">
                        {NAV_LINKS.map(link => (
                            <li key={link.name}>
                                <a href={link.href} onClick={handleSmoothScroll} className="text-base text-slate-400 hover:text-white">{link.name}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-slate-100 tracking-wider uppercase">Contact</h3>
                    <ul className="mt-4 space-y-2 text-slate-400">
                        <li>{CONTACT_DETAILS.phone}</li>
                        <li>{CONTACT_DETAILS.email}</li>
                        <li>{CONTACT_DETAILS.address}</li>
                    </ul>
                </div>
            </div>
        </div>
        <div className="mt-12 border-t border-slate-700 pt-8 text-center text-slate-400">
          <p className="mb-4 text-sm">Bea-Tech is proud to be a women-owned business.</p>
          <p>&copy; {new Date().getFullYear()} Bea-Tech IT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;