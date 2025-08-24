
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { APP_CONFIGS } from '../constants';

export const ImageViewer: React.FC = () => {
    // In a real app, the image source would be passed as a prop or through context
    // For this simulation, we'll hardcode the "secret" image.
    const imgSrc = 'https://storage.googleapis.com/gemini-95-icons/%40ammaar%2B%40olacombe.png';
    
    // This is just to update the window title dynamically if needed, not fully implemented here.
    const { activeApp } = useAppContext();
    const config = activeApp ? APP_CONFIGS[activeApp] : null;

    if (config) {
        config.title = "dont_open.jpg"
    }
    
    return (
        <div className="w-full h-full flex items-center justify-center bg-gray-400 p-0">
            <img src={imgSrc} alt="Secret" className="max-w-full max-h-full object-contain" />
        </div>
    );
};
