
import React from 'react';
import { DesktopIcon } from './DesktopIcon';
import { DESKTOP_APPS } from '../constants';
import { useAppContext } from '../hooks/useAppContext';

export const Desktop: React.FC = () => {
    const { closeStartMenu } = useAppContext();
    return (
        <div className="absolute top-0 left-0 w-full h-full p-2" onClick={closeStartMenu}>
            <div className="flex flex-col flex-wrap h-full content-start">
                {DESKTOP_APPS.map(appId => (
                    <DesktopIcon key={appId} appId={appId} />
                ))}
            </div>
        </div>
    );
};
