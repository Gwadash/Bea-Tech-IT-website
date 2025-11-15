import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ variant = 'light' }) => {
  const mainTextColor = variant === 'light' ? 'text-slate-800' : 'text-slate-100';
  const mutedTextColor = variant === 'light' ? 'text-slate-500' : 'text-slate-400';
  const mutedBorderColor = variant === 'light' ? 'border-slate-500' : 'border-slate-400';
  
  return (
    <div className="flex flex-col items-start leading-none cursor-pointer">
      <div className="flex items-center">
        <span className={`text-3xl font-bold ${mainTextColor} tracking-tighter`}>BEA</span>
        <div className="flex items-center -mx-0.5">
          <svg width="18" height="33" viewBox="0 0 18 33" className="fill-current text-blue-400">
            <path d="M0 0 L18 16.5 L0 33 Z" />
          </svg>
          <svg width="18" height="33" viewBox="0 0 18 33" className="fill-current text-blue-500 -ml-1.5">
            <path d="M0 0 L18 16.5 L0 33 Z" />
          </svg>
          <svg width="18" height="33" viewBox="0 0 18 33" className="fill-current text-blue-600 -ml-1.5">
            <path d="M0 0 L18 16.5 L0 33 Z" />
          </svg>
        </div>
        <span className={`text-3xl font-bold ${mainTextColor} tracking-tighter`}>TECH</span>
      </div>
      <div className="flex items-end -mt-2 ml-0.5">
        <span className="text-xl font-serif text-blue-600 font-bold">
          next level
        </span>
        <span className={`text-xl font-light ${mutedTextColor} border ${mutedBorderColor} px-1 ml-2 tracking-widest leading-tight`}>
          IT
        </span>
      </div>
    </div>
  );
};

export default Logo;
