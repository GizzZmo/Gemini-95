
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { StartMenu } from './StartMenu';
import { APP_CONFIGS } from '../constants';

export const Taskbar: React.FC = () => {
    const { openApps, activeApp, bringToFront, toggleStartMenu, startMenuOpen } = useAppContext();

    return (
        <div 
            className="absolute bottom-0 left-0 right-0 h-9 bg-gray-300 flex items-center p-1 border-t-2 border-white"
            style={{ backgroundColor: 'var(--taskbar-bg)', borderTopColor: 'var(--window-border-light)'}}
        >
            {startMenuOpen && <StartMenu />}
            <button
                className="win95-button h-full flex items-center font-bold text-sm px-2 mr-2"
                onClick={(e) => { e.stopPropagation(); toggleStartMenu(); }}
            >
                <img src="https://storage.googleapis.com/gemini-95-icons/start-button-win95.png" alt="Start" className="h-6 mr-1" />
                Start
            </button>
            
            <div className="flex-grow h-full flex items-center gap-1">
                {Array.from(openApps.values()).map(app => {
                    const config = APP_CONFIGS[app.id];
                    const isActive = activeApp === app.id && !app.isMinimized;
                    return (
                        <button
                            key={app.id}
                            onClick={() => bringToFront(app.id)}
                            className={`h-full flex items-center text-sm px-2 max-w-40 truncate ${isActive ? 'win95-button-active' : 'win95-button'}`}
                            style={isActive ? {
                                borderTop: '1px solid var(--button-dark)',
                                borderLeft: '1px solid var(--button-dark)',
                                borderRight: '1px solid var(--button-light)',
                                borderBottom: '1px solid var(--button-light)',
                                boxShadow: 'none'
                            } : {}}
                        >
                            <img src={config.iconUrl} alt={config.title} className="w-4 h-4 mr-2" />
                            {config.title}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
