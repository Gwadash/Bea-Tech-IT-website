
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, FunctionDeclaration, Type, GenerateContentResponse } from "@google/genai";
import { COMPANY_INFO_FOR_BOT } from '../constants.ts';
import { ChatBubbleOvalLeftEllipsisIcon, XMarkIcon, PaperAirplaneIcon, UserIcon, CalendarDaysIcon } from './Icons.tsx';

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

interface Message {
    id: number;
    role: 'user' | 'model' | 'system';
    text: string;
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [userInfo, setUserInfo] = useState<{name: string, contact: string} | null>(null);
    const [chat, setChat] = useState<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !chat) {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                const chatInstance = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: COMPANY_INFO_FOR_BOT,
                        tools: [{ functionDeclarations: [bookAppointmentFunctionDeclaration] }],
                    },
                });
                setChat(chatInstance);
                setMessages([{ id: Date.now(), role: 'model', text: 'Hello! How can I help you today? Feel free to ask any questions about Bea-Tech IT or book an appointment.' }]);
            } catch (error) {
                console.error("Failed to initialize Gemini:", error);
                setMessages([{ id: Date.now(), role: 'model', text: 'Sorry, the chat service is currently unavailable.' }]);
            }
        }
    }, [isOpen, chat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleUserInfoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get('name') as string;
        const contact = formData.get('contact') as string;
        if (name && contact) {
            setUserInfo({ name, contact });
        }
    };
    
    const handleSendMessage = async () => {
        if (!userInput.trim() || !chat) return;

        const userMessage: Message = { id: Date.now(), role: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const response: GenerateContentResponse = await chat.sendMessage({ message: userInput });
            
            if (response.functionCalls && response.functionCalls.length > 0) {
                const fc = response.functionCalls[0];
                const { name, date, time, reason } = fc.args;
                const systemMessage: Message = {
                    id: Date.now() + 1,
                    role: 'system',
                    text: `Appointment booked for ${name} on ${date} at ${time} for: "${reason}". Our team will contact you shortly to confirm.`,
                };
                setMessages(prev => [...prev, systemMessage]);
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

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-110"
                aria-label="Toggle Chat"
            >
                {isOpen ? <XMarkIcon className="h-8 w-8" /> : <ChatBubbleOvalLeftEllipsisIcon className="h-8 w-8" />}
            </button>
            
            <div className={`fixed bottom-24 right-6 w-full max-w-sm h-[70vh] max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col origin-bottom-right transition-all duration-300 ease-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                <header className="bg-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center shadow-md flex-shrink-0">
                    <h3 className="text-lg font-bold">Bea-Tech Assistant</h3>
                    <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded-full">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </header>
                
                {!userInfo ? (
                     <div className="flex flex-col justify-center items-center h-full p-6 text-center">
                        <h4 className="text-xl font-semibold text-slate-800">Welcome!</h4>
                        <p className="text-slate-600 mt-2 mb-6">Please enter your details to start the chat.</p>
                        <form onSubmit={handleUserInfoSubmit} className="w-full space-y-4">
                            <input type="text" name="name" placeholder="Your Name" required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                            <input type="text" name="contact" placeholder="Email or Phone" required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300">
                                Start Chat
                            </button>
                        </form>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                            {messages.map((msg) => (
                                <div key={msg.id} className="animate-pop-in flex items-end gap-2">
                                  <div className={`flex items-end gap-2 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role === 'model' && (
                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">B</div>
                                    )}
                                     {msg.role === 'system' && (
                                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white flex-shrink-0">
                                            <CalendarDaysIcon className="h-5 w-5" />
                                        </div>
                                    )}
                                    <div className={`max-w-xs md:max-w-sm rounded-2xl p-3 text-sm ${
                                        msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' :
                                        msg.role === 'system' ? 'bg-green-100 text-green-800 border border-green-200' :
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
                                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                                    placeholder="Type your message..."
                                    className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isLoading || !userInput.trim()}
                                    className="bg-blue-600 text-white rounded-lg p-3 shadow-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-300"
                                >
                                    <PaperAirplaneIcon className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Chatbot;