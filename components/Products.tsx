import React from 'react';
import { CheckCircleIcon } from './Icons.tsx';
import { PRODUCTS } from '../constants.ts';

const productHighlights = [
    'Universal AC input / full range',
    'Multichannel power supply box for CCTV',
    'Built-in short circuit, over-voltage & overload protection',
    'PTC fuse technology for automatic protection and reset'
];

const Products: React.FC = () => {
    return (
        <section id="products" className="py-20 bg-slate-100 scroll-mt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Our Product Range
                        </h2>
                        <p className="mt-6 text-lg text-slate-600">
                           We offer a wide selection of high-quality components and systems to meet all your IT needs.
                        </p>
                         <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
                            {PRODUCTS.map((product, index) => (
                                <div key={index} className="flex items-start">
                                    <CheckCircleIcon className="flex-shrink-0 h-6 w-6 text-blue-500 mt-1" />
                                    <span className="ml-3 text-slate-700 font-medium">{product}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <h3 className="text-base font-semibold text-blue-600 uppercase tracking-wider">Product Highlight</h3>
                        <h4 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                            PCS-300-18 PD Power 18CH PSU
                        </h4>
                        <p className="mt-4 text-slate-600">
                           Ensure your CCTV systems, DVRs, and baluns stay safe with our reliable 12V 25A PTC Supply Units. Each circuit is individually protected by a hardwired, self-resetting fuse for maximum security and minimum downtime.
                        </p>
                        <div className="mt-6">
                            <ul className="space-y-2">
                                {productHighlights.map((highlight, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircleIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                                        <span className="ml-3 text-sm text-slate-600">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                         <div className="mt-6 flex items-center justify-center">
                            <img 
                                src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                                alt="Professional multi-channel CCTV Power Supply Unit" 
                                className="rounded-lg shadow-md object-cover w-full max-w-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Products;