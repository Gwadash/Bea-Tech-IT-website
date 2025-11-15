
import React from 'react';
import { SERVICES } from '../constants.ts';

const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-white scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Comprehensive IT Solutions
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            From essential repairs to complete system setups, we provide the expertise you need to stay ahead.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => (
            <div key={service.name} className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white">
                  <service.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-slate-900">{service.name}</h3>
                <p className="mt-2 text-base text-slate-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
