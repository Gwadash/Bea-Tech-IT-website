
import React from 'react';
import { CheckCircleIcon } from './Icons.tsx';

const productHighlights = [
    'Universal AC input / full range',
    'Multichannel power supply box for CCTV',
    'Built-in short circuit, over-voltage & overload protection',
    'PTC fuse technology for automatic protection and reset'
];

const FeaturedProduct: React.FC = () => {
    return (
        <section id="products" className="py-20 bg-slate-100 scroll-mt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-left">
                        <h3 className="text-base font-semibold text-blue-600 uppercase tracking-wider">Featured Product</h3>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Power Up Your CCTV System With Confidence
                        </h2>
                        <p className="mt-6 text-lg text-slate-600">
                            With our PCS-300-18 PD Power 18CH PSU 12V 25A PTC Supply Units, each circuit is individually protected by a hardwired fuse, ensuring your cameras, DVRs, and baluns stay safe and secure.
                        </p>
                        <p className="mt-4 text-lg text-slate-600">
                            Thanks to PTC fuse technology, each power feed is automatically protected and resets itself once the load or short circuit is removed. Say goodbye to replacing fuses—enjoy less downtime and more protection!
                        </p>
                        <div className="mt-8">
                            <h4 className="text-xl font-semibold text-slate-800">Product Highlights:</h4>
                            <ul className="mt-4 space-y-3">
                                {productHighlights.map((highlight, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircleIcon className="flex-shrink-0 h-6 w-6 text-green-500" />
                                        <span className="ml-3 text-slate-600">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <img 
                            src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                            alt="Professional multi-channel CCTV Power Supply Unit" 
                            className="rounded-xl shadow-2xl object-cover w-full max-w-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FeaturedProduct;