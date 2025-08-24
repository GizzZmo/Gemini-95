
import React, { useState, useRef } from 'react';
import { GeminiService } from '../services/geminiService';

export const AiBrowser: React.FC = () => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentContent, setCurrentContent] = useState('<h1>Welcome to the AI Browser!</h1><p>Enter a domain (e.g., google.com) and click \'Go\' to generate a retro-style website.</p>');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleNavigate = async () => {
        if (!url) return;
        setIsLoading(true);
        setCurrentContent('');

        if (audioRef.current) {
            audioRef.current.play().catch(e => console.error("Audio play failed", e));
        }

        try {
            const htmlContent = await GeminiService.generateWebsiteHtml(url);
            setCurrentContent(htmlContent);
        } catch (error) {
            console.error(error);
            setCurrentContent(`<p style="color:red">Failed to generate website: ${(error as Error).message}</p>`);
        } finally {
            setIsLoading(false);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }
    };
    
    return (
        <div className="flex flex-col h-full bg-gray-300 p-0 overflow-hidden">
            <audio ref={audioRef} src="https://www.soundjay.com/communication/dial-up-modem-01.mp3" loop />
            <div className="flex items-center p-1 gap-1 border-b-2 border-gray-500" style={{backgroundColor: 'var(--window-bg)'}}>
                <input
                    type="text"
                    className="win95-text-input flex-grow font-mono"
                    placeholder="Enter domain..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNavigate()}
                />
                <button className="win95-button px-4" onClick={handleNavigate} disabled={isLoading}>Go</button>
            </div>
            <div className="flex-grow relative bg-white">
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-300 flex flex-col justify-center items-center z-10">
                        <img src="https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/000/948/341/datas/original.gif" alt="Connecting..." />
                        <p className="font-mono text-lg mt-2">Connecting to {url}...</p>
                    </div>
                )}
                <iframe
                    srcDoc={currentContent}
                    className="w-full h-full border-none"
                    sandbox="allow-scripts"
                    title="AI Browser Content"
                />
            </div>
        </div>
    );
};
