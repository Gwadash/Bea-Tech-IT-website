
import React from 'react';
import { CONTACT_DETAILS } from '../constants.ts';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon, ClockIcon, StarIcon, WomanIcon, PlusCircleIcon, BuildingStorefrontIcon } from './Icons.tsx';

const attributeIcons: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    "Identifies as women-owned": WomanIcon,
    "In-store shopping": BuildingStorefrontIcon,
};

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-white scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Get In Touch
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Have a question or need expert help? We're here for you. Reach out today and let's get started.
          </p>
          <div className="mt-6 flex items-center justify-center space-x-2">
            <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <StarIcon key={i} className="h-6 w-6" />)}
            </div>
            <p className="text-slate-600 font-semibold">
                {CONTACT_DETAILS.rating} <span className="font-normal">({CONTACT_DETAILS.reviewsCount} reviews)</span>
            </p>
          </div>
        </div>
        <div className="mt-16 grid lg:grid-cols-2 gap-12">
            <div className="bg-slate-50 p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Contact Information</h3>
                <div className="space-y-4">
                    <div className="flex items-start">
                        <MapPinIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                        <p className="ml-4 text-slate-600">{CONTACT_DETAILS.address}</p>
                    </div>
                    <div className="flex items-start">
                        <PlusCircleIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                        <p className="ml-4 text-slate-600">{CONTACT_DETAILS.plusCode}</p>
                    </div>
                    <div className="flex items-start">
                        <PhoneIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                        <a href={`tel:${CONTACT_DETAILS.phone.replace(/\s/g, '')}`} className="ml-4 text-slate-600 hover:text-blue-600">{CONTACT_DETAILS.phone}</a>
                    </div>
                    <div className="flex items-start">
                        <EnvelopeIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                        <a href={`mailto:${CONTACT_DETAILS.email}`} className="ml-4 text-slate-600 hover:text-blue-600">{CONTACT_DETAILS.email}</a>
                    </div>
                     <div className="flex items-start">
                        <GlobeAltIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                        <a href={`http://${CONTACT_DETAILS.website}`} target="_blank" rel="noopener noreferrer" className="ml-4 text-slate-600 hover:text-blue-600">{CONTACT_DETAILS.website}</a>
                    </div>
                    {CONTACT_DETAILS.attributes.map((attr) => {
                        const Icon = attributeIcons[attr];
                        return (
                            <div key={attr} className="flex items-start">
                                {Icon && <Icon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />}
                                <p className="ml-4 text-slate-600">{attr}</p>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-8 pt-6 border-t border-slate-200">
                    <h4 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                        <ClockIcon className="h-6 w-6 text-blue-600 mr-3" />
                        Business Hours
                    </h4>
                    <div className="space-y-2 text-slate-600">
                        {CONTACT_DETAILS.hours.map(hour => (
                            <div key={hour.day} className="flex justify-between">
                                <span>{hour.day}</span>
                                <span className="font-medium">{hour.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg h-80 lg:h-full">
                <img 
                    src="https://images.unsplash.com/photo-1580894908361-967195033215?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="A modern server rack with glowing blue lights representing Bea-Tech's robust infrastructure solutions"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;