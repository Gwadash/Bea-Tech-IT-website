
import React, { useState, useEffect, useRef } from 'react';
import { TESTIMONIALS } from '../constants.ts';
import { StarIcon } from './Icons.tsx';

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

const Testimonials: React.FC = () => {
  const [sectionRef, isVisible] = useOnScreen({ threshold: 0.1 });

  return (
    <section id="testimonials" className="py-20 bg-slate-100 scroll-mt-20">
      <div ref={sectionRef} className={`container mx-auto px-4 sm:px-6 lg:px-8 ${isVisible ? 'is-visible' : ''}`}>
        <div className="text-center max-w-3xl mx-auto animate-on-scroll slide-up">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            What Our Customers Are Saying
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            With a 5-star rating from our happy customers, we are proud to be a trusted IT partner in the community.
          </p>
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <div 
              key={testimonial.name}
              className="bg-white p-8 rounded-xl shadow-md flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-105 animate-on-scroll slide-up"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
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