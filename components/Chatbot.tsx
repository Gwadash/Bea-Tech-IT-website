
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, FunctionDeclaration, Type, GenerateContentResponse } from "@google/genai";
import { COMPANY_INFO_FOR_BOT } from '../constants.ts';
import { ChatBubbleOvalLeftEllipsisIcon, XMarkIcon, PaperAirplaneIcon, UserIcon, CalendarDaysIcon } from './Icons.tsx';

// Function to book the appointment after details are collected
const bookAppointmentFunctionDeclaration: FunctionDeclaration = {
  name: 'bookAppointment',
  parameters: {
    type: Type.OBJECT,
    description: 'Books a service or consultation appointment once all customer details have been collected from the form.',
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

// Function to trigger the UI to show the appointment form
const displayAppointmentFormFunctionDeclaration: FunctionDeclaration = {
  name: 'displayAppointmentForm',
  parameters: {
    type: Type.OBJECT,
    description: 'Displays a form in the UI for the user to enter their appointment details. Call this as the first step when the user expresses intent to book an appointment.',
    properties: {},
  },
};

interface Message {
    id: number;
    role: 'user' | 'model';
    text: string;
}

interface AppointmentDetails {
    name: string;
    contact: string;
    date: string;
    reason: string;
}

const AppointmentForm: React.FC<{ onSubmit: (details: AppointmentDetails) => void }> = ({ onSubmit }) => {
    const [details, setDetails] = useState<AppointmentDetails>({ name: '', contact: '', date: '', reason: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(details);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDetails(prev => ({...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="p-4 bg-white rounded-lg border border-slate-200 my-2 animate-pop-in">
            <h4 className="font-bold text-slate-800 mb-3 text-center">Appointment Details</h4>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required className="w-full p-2 border rounded-md" />
                <input type="text" name="contact" placeholder="Phone or Email" onChange={handleChange} required className="w-full p-2 border rounded-md" />
                <input type="text" name="date" placeholder="Preferred Date & Time" onChange={handleChange} required className="w-full p-2 border rounded-md" />
                <textarea name="reason" placeholder="Reason for appointment" onChange={handleChange} required className="w-full p-2 border rounded-md" rows={2}></textarea>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">Submit Details</button>
            </form>
        </div>
    );
};


const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [chat, setChat] = useState<Chat | null>(null);
    const [showAppointmentForm, setShowAppointmentForm] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const apiKey = process.env.API_KEY;

    useEffect(() => {
        if (isOpen && !chat) {
            if (!apiKey) {
                console.error("Gemini API Key is missing.");
                setMessages([{ id: Date.now(), role: 'model', text: "Sorry, the chat service is unavailable. The API key has not been configured correctly for this deployment." }]);
                return;
            }
            try {
                const ai = new GoogleGenAI({ apiKey });
                const chatInstance = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: COMPANY_INFO_FOR_BOT,
                        tools: [{ functionDeclarations: [bookAppointmentFunctionDeclaration, displayAppointmentFormFunctionDeclaration] }],
                    },
                });
                setChat(chatInstance);
                setMessages([{ id: Date.now(), role: 'model', text: 'Hello! How can I help you today? Feel free to ask any questions about Bea-Tech IT or book an appointment.' }]);
            } catch (error) {
                console.error("Failed to initialize Gemini:", error);
                setMessages([{ id: Date.now(), role: 'model', text: 'Sorry, the chat service is currently unavailable due to a configuration issue.' }]);
            }
        }
    }, [isOpen, chat, apiKey]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading, showAppointmentForm]);

    const handleSendMessage = async (messageText: string) => {
        if (!messageText.trim() || !chat || isLoading) return;

        const userMessage: Message = { id: Date.now(), role: 'user', text: messageText };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const response: GenerateContentResponse = await chat.sendMessage({ message: messageText });
            
            if (response.functionCalls && response.functionCalls.length > 0) {
                const fc = response.functionCalls[0];
                let functionResult;

                if (fc.name === 'displayAppointmentForm') {
                    setShowAppointmentForm(true);
                    functionResult = { status: 'SUCCESS', message: 'Displaying appointment form to the user.' };
                } else if (fc.name === 'bookAppointment') {
                     // Mock function execution for booking an appointment
                    functionResult = {
                        status: 'SUCCESS',
                        message: `Appointment details for ${fc.args.name} have been received. A team member will confirm shortly via ${fc.args.contact}.`
                    };
                }
                
                if (functionResult) {
                    // Send the function execution result back to the model
                     const response2 = await chat.sendMessage({
                        toolResponses: [{
                           id: fc.id,
                           name: fc.name,
                           response: functionResult,
                        }]
                    });
                    const botMessage: Message = { id: Date.now() + 1, role: 'model', text: response2.text };
                    setMessages(prev => [...prev, botMessage]);
                }
            } else {
                const botMessage: Message = { id: Date.now() + 1, role: 'model', text: response.text };
                setMessages(prev => [...prev, botMessage]);
            }
        } catch (error) {
            console.error('Error sending message to Gemini:', error);
            const errorMessage: Message = { id: Date.now() + 1, role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFormSubmit = (details: AppointmentDetails) => {
        setShowAppointmentForm(false);
        const message = `Please book an appointment with the following details: Name: ${details.name}, Contact: ${details.contact}, Date/Time: ${details.date}, Reason: ${details.reason}.`;
        handleSendMessage(message);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-110 z-50"
                aria-label="Toggle Chat"
            >
                {isOpen ? <XMarkIcon className="h-8 w-8" /> : <ChatBubbleOvalLeftEllipsisIcon className="h-8 w-8" />}
            </button>
            
            <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 w-[90vw] max-w-sm h-[65vh] max-h-[550px] origin-bottom sm:bottom-24 sm:left-auto sm:right-6 sm:translate-x-0 sm:w-full sm:h-[70vh] sm:max-h-[600px] sm:origin-bottom-right bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                <header className="bg-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center shadow-md flex-shrink-0">
                    <h3 className="text-lg font-bold">Bea-Tech Assistant</h3>
                    <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded-full">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </header>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {messages.map((msg) => (
                        <div key={msg.id} className="animate-pop-in flex items-end gap-2">
                          <div className={`flex items-end gap-2 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && (
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">B</div>
                            )}
                            <div className={`max-w-xs md:max-w-sm rounded-2xl p-3 text-sm ${
                                msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' :
                                'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                            }`}>
                                <p style={{whiteSpace: 'pre-wrap'}}>{msg.text}</p>
                            </div>
                             {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 flex-shrink-0">
                                    <UserIcon className="h-5 w-5" />
                                </div>
                            )}
                          </div>
                        </div>
                    ))}
                    {showAppointmentForm && <AppointmentForm onSubmit={handleFormSubmit} />}
                    {isLoading && (
                        <div className="flex items-end gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">B</div>
                            <div className="max-w-xs md:max-w-sm rounded-2xl p-3 bg-white text-slate-800 border border-slate-200 rounded-bl-none">
                                <div className="flex items-center space-x-1">
                                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-pulse"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-slate-200 bg-white rounded-b-2xl flex-shrink-0">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage(userInput)}
                            placeholder="Type your message..."
                            className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            disabled={isLoading || !chat || showAppointmentForm}
                        />
                        <button
                            onClick={() => handleSendMessage(userInput)}
                            disabled={isLoading || !userInput.trim() || !chat || showAppointmentForm}
                            className="bg-blue-600 text-white rounded-lg p-3 shadow-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-300"
                        >
                            <PaperAirplaneIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chatbot;