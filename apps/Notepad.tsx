
import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';

export const Notepad: React.FC = () => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateStory = async () => {
        setIsLoading(true);
        const originalText = text;
        setText(prev => prev + "\n\nGenerating story... Please wait...\n");
        try {
            const story = await GeminiService.generateStory();
            setText(originalText + "\n\n" + story);
        } catch (error) {
            setText(originalText + `\n\nError: ${(error as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white p-0">
            <textarea
                className="w-full h-full font-mono text-sm p-1 border-none resize-none focus:outline-none"
                placeholder="Start typing here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <div className="p-1 flex justify-end" style={{backgroundColor: 'var(--window-bg)', borderTop: '2px solid var(--window-border-dark)'}}>
                <button className="win95-button px-4" onClick={handleGenerateStory} disabled={isLoading}>
                    {isLoading ? 'Working...' : 'Generate Story'}
                </button>
            </div>
        </div>
    );
};
