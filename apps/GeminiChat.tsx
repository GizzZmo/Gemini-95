
import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';

interface Message {
    sender: 'user' | 'gemini' | 'system';
    text: string;
}

export const GeminiChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([{ sender: 'system', text: 'Initializing AI...' }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatHistoryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [messages]);
    
    useEffect(() => {
        setMessages([{ sender: 'gemini', text: "Hello! How can I help you today?" }]);
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        
        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // A real chat implementation would pass history. This is simplified to match original logic.
            const history: any[] = messages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));
            const responseText = await GeminiService.getChatResponse(input, history);
            const geminiMessage: Message = { sender: 'gemini', text: responseText };
            setMessages(prev => [...prev, geminiMessage]);
        } catch (error) {
            const errorMessage: Message = { sender: 'system', text: `Error: ${(error as Error).message}` };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-300 p-2 gap-2">
            <div ref={chatHistoryRef} className="flex-grow border bg-white p-2 overflow-y-auto win95-text-input">
                {messages.map((msg, index) => (
                    <p key={index} className={
                        msg.sender === 'user' ? 'text-red-800' :
                        msg.sender === 'gemini' ? 'text-blue-800' : 'text-gray-500 italic'
                    }>
                        <strong>{msg.sender === 'user' ? 'You' : msg.sender === 'gemini' ? 'Gemini' : 'System'}:</strong> {msg.text}
                    </p>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    className="win95-text-input flex-grow"
                    placeholder="Ask Gemini anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isLoading}
                />
                <button className="win95-button px-4" onClick={handleSend} disabled={isLoading}>
                    {isLoading ? '...' : 'Send'}
                </button>
            </div>
        </div>
    );
};
