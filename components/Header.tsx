
import React, { useState } from 'react';
import { NAV_LINKS } from '../constants.ts';
import Logo from './Logo.tsx';
import { Bars3Icon, XMarkIcon } from './Icons.tsx';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#home" onClick={handleSmoothScroll} className="flex-shrink-0" aria-label="Bea-Tech Home">
            <Logo />
          </a>
          <nav className="hidden md:flex md:space-x-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={handleSmoothScroll}
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors duration-300"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-blue-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-200">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  handleSmoothScroll(e);
                  setIsMenuOpen(false);
                }}
                className="text-slate-600 hover:text-blue-600 hover:bg-slate-100 block px-3 py-2 rounded-md text-base font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
