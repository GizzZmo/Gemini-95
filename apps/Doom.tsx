
import React, { useState } from 'react';

export const Doom: React.FC = () => {
    const [gameStarted, setGameStarted] = useState(false);

    if (!gameStarted) {
        return (
            <div 
                className="w-full h-full flex items-center justify-center bg-black text-white cursor-pointer"
                onClick={() => setGameStarted(true)}
            >
                <p className="text-center p-4">Click here to start the game.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full p-0">
            <iframe
                src="https://js-dos.com/games/doom.exe.html"
                className="w-full h-full border-none"
                title="DOOM"
                allowFullScreen
            />
        </div>
    );
};
