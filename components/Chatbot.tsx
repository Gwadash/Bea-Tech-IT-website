
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, FunctionDeclaration, Type, GenerateContentResponse, Part } from "@google/genai";
import { COMPANY_INFO_FOR_BOT } from '../constants.ts';
import { ChatBubbleOvalLeftEllipsisIcon, XMarkIcon, PaperAirplaneIcon, UserIcon } from './Icons.tsx';

// The function declaration for the tool the model can use.
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
    role: 'user' | 'model';
    text: string;
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [chat, setChat] = useState<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Effect to initialize the chatbot when it's opened.
    useEffect(() => {
        if (isOpen && !chat) {
            const apiKey = process.env.API_KEY;
            if (!apiKey) {
                console.error("API key not found. Please set the API_KEY environment variable.");
                setMessages([{ id: Date.now(), role: 'model', text: "Sorry, the chat service is unavailable. The API key has not been configured correctly for this deployment." }]);
                return;
            }

            try {
                const ai = new GoogleGenAI({ apiKey });
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
                setMessages([{ id: Date.now(), role: 'model', text: 'Sorry, the chat service is currently unavailable. This may be due to a configuration issue.' }]);
            }
        }
    }, [isOpen, chat]);

    // Effect to auto-scroll to the latest message.
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Handles sending a message from the user to the Gemini API.
    const handleSendMessage = async () => {
        if (!userInput.trim() || !chat || isLoading) return;

        const userMessage: Message = { id: Date.now(), role: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = userInput;
        setUserInput('');
        setIsLoading(true);

        try {
            const response: GenerateContentResponse = await chat.sendMessage({ message: currentInput });
            
            // Check if the model wants to call the 'bookAppointment' function.
            if (response.functionCalls && response.functionCalls.length > 0) {
                const fc = response.functionCalls[0];
                
                // This is a "mock" execution of the function.
                // In a real app, you'd call your booking system's API here.
                const result = {
                    status: 'SUCCESS',
                    message: `Thanks, ${fc.args.name}! Your appointment for a "${fc.args.reason}" on ${fc.args.date} has been requested. We will send a confirmation to ${fc.args.contact} shortly.`
                };
                
                // 1. Instantly show the confirmation message to the user for a responsive feel.
                const confirmationMessage: Message = { id: Date.now() + 1, role: 'model', text: result.message };
                setMessages(prev => [...prev, confirmationMessage]);

                // 2. Send the result of the function call back to the model.
                const functionResponsePart: Part = {
                    functionResponse: {
                        name: fc.name,
                        response: result,
                    }
                };
                const modelResponseAfterTool = await chat.sendMessage({ message: [functionResponsePart] });

                // Display the model's follow-up message.
                if (modelResponseAfterTool.text) {
                    const followUpMessage: Message = { id: Date.now() + 2, role: 'model', text: modelResponseAfterTool.text };
                    setMessages(prev => [...prev, followUpMessage]);
                }
            } else {
                // If it's a regular text response, just display it.
                const modelMessage: Message = { id: Date.now() + 1, role: 'model', text: response.text };
                setMessages(prev => [...prev, modelMessage]);
            }
        } catch (error) {
            console.error("Error sending message to Gemini:", error);
            const errorMessage: Message = { id: Date.now() + 1, role: 'model', text: "Sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Chatbot Toggle Button */}
            <div className="fixed bottom-5 right-5 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label={isOpen ? 'Close Chat' : 'Open Chat'}
                >
                    {isOpen ? (
                        <XMarkIcon className="h-8 w-8" />
                    ) : (
                        <ChatBubbleOvalLeftEllipsisIcon className="h-8 w-8" />
                    )}
                </button>
            </div>

            {/* Chatbot Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-5 w-full max-w-sm h-[70vh] max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-pop-in">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
                        <div className="flex items-center">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <h3 className="ml-3 text-lg font-semibold text-slate-800">Bea-Tech Assistant</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                           <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto bg-slate-100">
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role === 'model' && (
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                            B
                                        </div>
                                    )}
                                    <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none shadow-sm'}`}>
                                        <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                                    </div>
                                     {msg.role === 'user' && (
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                                            <UserIcon className="h-5 w-5 text-slate-500" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-end gap-2 justify-start">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">B</div>
                                    <div className="max-w-xs px-4 py-3 rounded-2xl bg-white text-slate-800 rounded-bl-none shadow-sm flex items-center space-x-2">
                                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Form */}
                    <div className="p-4 border-t border-slate-200 bg-white rounded-b-2xl">
                        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 w-full px-4 py-2 text-sm text-slate-800 bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                disabled={isLoading || !chat}
                            />
                            <button
                                type="submit"
                                className="p-3 bg-blue-600 text-white rounded-full disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                                disabled={isLoading || !userInput.trim() || !chat}
                                aria-label="Send message"
                            >
                                <PaperAirplaneIcon className="h-5 w-5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
