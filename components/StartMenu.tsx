
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { APP_CONFIGS, START_MENU_APPS } from '../constants';
import type { AppId } from '../types';

export const StartMenu: React.FC = () => {
    const { openApp } = useAppContext();

    const handleItemClick = (appId: AppId) => {
        openApp(appId);
    };

    return (
        <div
            className="absolute left-0 bottom-9 w-48 p-0.5 flex flex-col"
            style={{
                backgroundColor: 'var(--window-bg)',
                borderTop: '2px solid var(--window-border-light)',
                borderLeft: '2px solid var(--window-border-light)',
                borderRight: '2px solid var(--window-border-dark)',
                borderBottom: '2px solid var(--window-border-dark)',
                zIndex: 100
            }}
        >
            {START_MENU_APPS.map(appId => {
                const config = APP_CONFIGS[appId];
                return (
                    <div
                        key={appId}
                        className="flex items-center p-1 m-px cursor-pointer hover:bg-blue-800 hover:text-white"
                        style={{'--highlight-bg': '#000080', '--highlight-text': '#ffffff'}}
                        onClick={() => handleItemClick(appId)}
                    >
                        <img src={config.iconUrl} alt={config.title} className="w-5 h-5 mr-2" />
                        <span>{config.title}</span>
                    </div>
                );
            })}
        </div>
    );
};
