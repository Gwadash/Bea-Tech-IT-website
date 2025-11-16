import { GoogleGenAI, FunctionDeclaration, Type, Content, GenerateContentResponse } from "@google/genai";

// The contents of `constants.ts` are copied here to make the serverless function self-contained.
// This is a common pattern as Vercel builds API routes as isolated units.

const SERVICES_INFO = [
    { name: 'Hardware & Software', description: 'We supply you with the latest hardware and software, from high-performance components to essential business applications.' },
    { name: 'Expert Computer Repairs', description: 'Our skilled tech team can diagnose and fix any issue, getting your PC back to peak performance quickly and reliably.' },
    { name: 'Network Solutions', description: 'From home WiFi setups to business network infrastructure and accessories, we ensure you stay connected.' },
    { name: 'CCTV Security Systems', description: 'Protect your property with our professional CCTV systems, featuring reliable power supply units for ultimate confidence.' },
];
const PRODUCTS_INFO = ['Pre-Built Desktops', 'Upgrade Kits', 'Desktop Components', 'Laptops', 'Software', 'Peripherals', 'Cables and Adapters', 'And Much More...'];
const TESTIMONIALS_INFO = [
    { quote: "Bea-Tech provided an incredibly fast and professional repair service for my work computer. They explained the issue clearly and had it running better than before. Highly recommended!", name: "John D." },
    { quote: "I bought a custom gaming PC from them and the performance is insane. The team was super helpful in picking the right components for my budget. A fantastic experience from start to finish.", name: "Sarah L." },
    { quote: "The networking support we received was top-notch. They sorted out our office's connectivity issues and provided great accessories. Very knowledgeable and friendly staff.", name: "Mike P." }
];
const CONTACT_DETAILS = {
    address: "36 Schumann St, Vanderbijlpark S. W. 5, Vanderbijlpark, 1911", phone: "016 023 0298", email: "Bianca@bea-tech.co.za", website: "www.bea-tech.co.za",
    hours: [{ day: "Monday - Friday", time: "08:00 - 17:00" }, { day: "Saturday", time: "09:00 - 13:00" }, { day: "Sunday & Public Holidays", time: "Closed" },],
    plusCode: "7RGH+MF Vanderbijlpark",
};
const COMPANY_INFO_FOR_BOT = `
You are a friendly and professional customer service assistant for Bea-Tech IT. Your goal is to answer questions about the company and help users book appointments. Only answer questions related to Bea-Tech IT. If asked about something else, politely decline.
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
${SERVICES_INFO.map(s => `- ${s.name}: ${s.description}`).join('\n')}
**Products Offered:** We offer a wide range of products including:
${PRODUCTS_INFO.map(p => `- ${p}`).join('\n')}
**Company Attributes:** We are proud to be a women-owned business. We offer in-store shopping.
**Customer Testimonials (for context on our quality):**
${TESTIMONIALS_INFO.map(t => `- "${t.quote}" - ${t.name}`).join('\n')}
When a user wants to book an appointment, use the 'bookAppointment' function. Make sure to get their name, contact info, desired date and time, and the reason for the appointment.
`;
const bookAppointmentFunctionDeclaration: FunctionDeclaration = {
    name: 'bookAppointment',
    parameters: {
        type: Type.OBJECT,
        description: 'Books a service or consultation appointment for a customer.',
        properties: {
            name: { type: Type.STRING, description: 'The full name of the customer.' },
            contact: { type: Type.STRING, description: 'The customer\'s phone number or email address.' },
            date: { type: Type.STRING, description: 'The requested date for the appointment, e.g., "tomorrow" or "2024-08-15".' },
            time: { type: Type.STRING, description: 'The requested time for the appointment, e.g., "morning" or "2 PM".' },
            reason: { type: Type.STRING, description: 'A brief description of the service needed, e.g., "laptop repair" or "network setup consultation".' },
        },
        required: ['name', 'contact', 'date', 'reason'],
    },
};

// This API key is securely accessed from Vercel's environment variables on the server.
const apiKey = process.env.API_KEY;

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }
    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'API key not configured on server' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const { history } = await req.json() as { history: Content[] };

        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: history,
            config: {
                systemInstruction: COMPANY_INFO_FOR_BOT,
                tools: [{ functionDeclarations: [bookAppointmentFunctionDeclaration] }],
            },
        });
        
        return new Response(JSON.stringify({ response: result }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error in /api/chat:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return new Response(JSON.stringify({ error: 'Internal Server Error', details: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}