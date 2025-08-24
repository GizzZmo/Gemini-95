
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { APP_CONFIGS } from '../constants';
import type { AppId } from '../types';

interface DesktopIconProps {
    appId: AppId;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ appId }) => {
    const { openApp } = useAppContext();
    const config = APP_CONFIGS[appId];

    if (!config) return null;

    const handleDoubleClick = () => {
        openApp(appId);
    };

    return (
        <div
            className="flex flex-col items-center text-center w-24 p-2 m-1 text-white cursor-pointer"
            onDoubleClick={handleDoubleClick}
        >
            <img src={config.iconUrl} alt={config.title} className="w-8 h-8 pointer-events-none" />
            <span className="mt-1 text-xs pointer-events-none">{config.title}</span>
        </div>
    );
};
