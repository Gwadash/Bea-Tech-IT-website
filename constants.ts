
import { WrenchScrewdriverIcon, ComputerDesktopIcon, ServerStackIcon, VideoCameraIcon } from './components/Icons.tsx';

export const NAV_LINKS = [
  { name: 'Services', href: '#services' },
  { name: 'Products', href: '#products' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

export const SERVICES = [
  {
    name: 'Hardware & Software',
    description: 'We supply you with the latest hardware and software, from high-performance components to essential business applications.',
    icon: ComputerDesktopIcon,
  },
  {
    name: 'Expert Computer Repairs',
    description: 'Our skilled tech team can diagnose and fix any issue, getting your PC back to peak performance quickly and reliably.',
    icon: WrenchScrewdriverIcon,
  },
  {
    name: 'Network Solutions',
    description: 'From home WiFi setups to business network infrastructure and accessories, we ensure you stay connected.',
    icon: ServerStackIcon,
  },
  {
    name: 'CCTV Security Systems',
    description: 'Protect your property with our professional CCTV systems, featuring reliable power supply units for ultimate confidence.',
    icon: VideoCameraIcon,
  },
];

export const PRODUCTS = [
    'Pre-Built Desktops',
    'Upgrade Kits',
    'Desktop Components',
    'Laptops',
    'Software',
    'Peripherals',
    'Cables and Adapters',
    'And Much More...',
];


export const TESTIMONIALS = [
    {
        quote: "Bea-Tech provided an incredibly fast and professional repair service for my work computer. They explained the issue clearly and had it running better than before. Highly recommended!",
        name: "John D.",
        title: "Local Business Owner"
    },
    {
        quote: "I bought a custom gaming PC from them and the performance is insane. The team was super helpful in picking the right components for my budget. A fantastic experience from start to finish.",
        name: "Sarah L.",
        title: "Gaming Enthusiast"
    },
    {
        quote: "The networking support we received was top-notch. They sorted out our office's connectivity issues and provided great accessories. Very knowledgeable and friendly staff.",
        name: "Mike P.",
        title: "Office Manager"
    }
];

export const CONTACT_DETAILS = {
  address: "36 Schumann St, Vanderbijlpark S. W. 5, Vanderbijlpark, 1911",
  phone: "016 023 0298",
  email: "Bianca@bea-tech.co.za",
  website: "www.bea-tech.co.za",
  hours: [
    { day: "Monday - Friday", time: "08:00 - 17:00" },
    { day: "Saturday", time: "09:00 - 13:00" },
    { day: "Sunday & Public Holidays", time: "Closed" },
  ],
  rating: "5.0",
  reviewsCount: 5,
  plusCode: "7RGH+MF Vanderbijlpark",
  attributes: ["Identifies as women-owned", "In-store shopping"],
};

export const COMPANY_INFO_FOR_BOT = `
You are a friendly and professional customer service assistant for Bea-Tech IT.
Your goal is to answer questions about the company and help users book appointments.
Only answer questions related to Bea-Tech IT. If asked about something else, politely decline.

Here is all the information about Bea-Tech IT:

**Company Name:** Bea-Tech IT
**Location:** ${CONTACT_DETAILS.address} (${CONTACT_DETAILS.plusCode})
**Contact Info:**
- Phone: ${CONTACT_DETAILS.phone}
- Email: ${CONTACT_DETAILS.email}
- Website: ${CONTACT_DETAILS.website}

**Business Hours:**
${CONTACT_DETAILS.hours.map(h => `- ${h.day}: ${h.time}`).join('\n')}

**Services Offered:**
${SERVICES.map(s => `- ${s.name}: ${s.description}`).join('\n')}

**Products Offered:**
We offer a wide range of products including:
${PRODUCTS.map(p => `- ${p}`).join('\n')}

**Company Attributes:**
- We are proud to be a women-owned business.
- We offer in-store shopping.

**Customer Testimonials (for context on our quality):**
${TESTIMONIALS.map(t => `- "${t.quote}" - ${t.name}`).join('\n')}

**Appointment Booking:**
- When a user wants to book an appointment, first call the 'displayAppointmentForm' function to show them the booking form.
- After the user submits the form, they will provide you with all their details in a single message.
- Once you have their name, contact info, desired date, and reason, use the 'bookAppointment' function to process their request.
`;