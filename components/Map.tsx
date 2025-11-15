
import React, { useState, useEffect, useRef } from 'react';

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

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, options]);

  return [ref, isVisible] as const;
};

const Map: React.FC = () => {
  const [sectionRef, isVisible] = useOnScreen({ threshold: 0.1 });
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3596.1643449339023!2d27.82613137593644!3d-26.64457497682397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e945a6a72e85873%3A0x33b95a89d7014693!2s36%20Schumann%20St%2C%20Vanderbijlpark%20S.%20W.%205%2C%20Vanderbijlpark%2C%201911%2C%20South%20Africa!5e0!3m2!1sen!2sus!4v1716305141258!5m2!1sen!2sus";

  return (
    <section id="location" className="py-20 bg-slate-100">
      <div ref={sectionRef} className={`container mx-auto px-4 sm:px-6 lg:px-8 ${isVisible ? 'is-visible' : ''}`}>
        <div className="text-center max-w-3xl mx-auto animate-on-scroll slide-up">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Our Location
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Visit us in-store for personalized service and to see our range of products.
          </p>
        </div>
        <div className="mt-12 rounded-xl shadow-2xl overflow-hidden animate-on-scroll slide-up" style={{ transitionDelay: `150ms` }}>
          <iframe
            src={mapUrl}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bea-Tech IT Location on Google Maps"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Map;
