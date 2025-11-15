
import React from 'react';
import { TESTIMONIALS } from '../constants.ts';
import { StarIcon } from './Icons.tsx';

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-slate-100 scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            What Our Customers Are Saying
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            With a 5-star rating from our happy customers, we are proud to be a trusted IT partner in the community.
          </p>
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <div key={testimonial.name} className="bg-white p-8 rounded-xl shadow-md flex flex-col">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <StarIcon key={i} className="h-5 w-5" />)}
              </div>
              <blockquote className="mt-4 text-slate-600 flex-grow">
                <p>"{testimonial.quote}"</p>
              </blockquote>
              <footer className="mt-6">
                <p className="font-semibold text-slate-900">{testimonial.name}</p>
                <p className="text-slate-500">{testimonial.title}</p>
              </footer>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
