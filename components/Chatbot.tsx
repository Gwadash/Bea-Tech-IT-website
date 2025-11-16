
import React, { useState, useEffect, useRef } from 'react';
import { ChatBubbleOvalLeftEllipsisIcon, XMarkIcon, PaperAirplaneIcon, UserIcon } from './Icons.tsx';

// Define types to represent the conversation structure for the Gemini API
type Role = 'user' | 'model';
interface TextPart { text: string; }
interface FunctionCallPart { functionCall: { name: string; args: any; }; }
interface FunctionResponsePart { functionResponse: { name: string; response: any; }; }
type Part = TextPart | FunctionCallPart | FunctionResponsePart;

interface Content {
    role: Role;
    parts: Part[];
}

interface DisplayMessage {
    id: number;
    role: 'user' | 'model';
    text: string;
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState<Content[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Effect to initialize the chatbot with a welcome message
    useEffect(() => {
        if (isOpen && history.length === 0) {
            setHistory([{ role: 'model', parts: [{ text: 'Hello! How can I help you today? Feel free to ask any questions about Bea-Tech IT or book an appointment.' }] }]);
        }
    }, [isOpen, history.length]);

    // Effect to auto-scroll to the latest message.
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isLoading]);

    // Handles sending a message by calling our secure serverless function
    const handleSendMessage = async () => {
        if (!userInput.trim() || isLoading) return;

        const userMessage: Content = { role: 'user', parts: [{ text: userInput }] };
        const currentHistory = [...history, userMessage];
        
        setHistory(currentHistory);
        const currentInput = userInput;
        setUserInput('');
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: currentHistory }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'The server returned an error.');
            }
            
            const data = await res.json() as { content: Content };
            const modelResponseContent = data.content;

            const functionCallPart = modelResponseContent.parts.find(part => 'functionCall' in part) as FunctionCallPart | undefined;

            if (functionCallPart?.functionCall) {
                const fc = functionCallPart.functionCall;
                
                // This is a "mock" execution of the function.
                const result = {
                    status: 'SUCCESS',
                    message: `Thanks, ${fc.args.name}! Your appointment for a "${fc.args.reason}" on ${fc.args.date} has been requested. We will send a confirmation to ${fc.args.contact} shortly.`
                };
                
                // 1. Instantly show the confirmation message to the user for a responsive feel.
                const confirmationMessage: Content = { role: 'model', parts: [{ text: result.message }] };
                setHistory(prev => [...prev, confirmationMessage]);

                // 2. Send the result back to the model for a follow-up.
                const functionResponse: Content = {
                    role: 'user', // In the Gemini API, function responses are sent with the 'user' role.
                    parts: [{
                        functionResponse: { name: fc.name, response: result }
                    }]
                };
                const historyForFollowUp = [...currentHistory, modelResponseContent, functionResponse];

                const followUpRes = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ history: historyForFollowUp }),
                });
                
                if (!followUpRes.ok) throw new Error('The server returned an error on follow-up.');
                
                const followUpData = await followUpRes.json() as { content: Content };
                const followUpTextPart = followUpData.content.parts.find(part => 'text' in part) as TextPart | undefined;

                if (followUpTextPart?.text) {
                     setHistory(prev => [...prev, {role: 'model', parts: [{text: followUpTextPart.text}]}]);
                }

            } else {
                // If it's a regular text response, just display it.
                setHistory(prev => [...prev, modelResponseContent]);
            }

        } catch (e) {
            console.error("Error sending message:", e);
            const message = e instanceof Error ? e.message : "An unknown error occurred.";
            setError("Sorry, I encountered an error. " + message);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Convert history into a flat list of messages for rendering
    const displayMessages: DisplayMessage[] = history.map((content, index) => {
        const textPart = content.parts.find(part => 'text' in part) as TextPart | undefined;
        return {
            id: index,
            role: content.role,
            text: textPart?.text || '',
        };
    }).filter(msg => msg.text); // Only render messages that have text

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
                            {displayMessages.map((msg) => (
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
                            {error && (
                                <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                                    {error}
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
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="p-3 bg-blue-600 text-white rounded-full disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                                disabled={isLoading || !userInput.trim()}
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
