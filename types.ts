
import React from 'react';

export type AppId = 'myComputer' | 'aiBrowser' | 'notepad' | 'minesweeper' | 'mediaPlayer' | 'paint' | 'geminiChat' | 'imageViewer' | 'doom';

export interface AppConfig {
    id: AppId;
    title: string;
    iconUrl: string;
    component: React.FC;
    initialSize: { width: number; height: number };
}

export interface AppInstance {
    id: AppId;
    isMinimized: boolean;
    position: { x: number; y: number };
    zIndex: number;
}

export interface AppContextType {
    openApps: Map<AppId, AppInstance>;
    activeApp: AppId | null;
    openApp: (id: AppId, data?: any) => void;
    closeApp: (id: AppId) => void;
    minimizeApp: (id: AppId) => void;
    bringToFront: (id: AppId) => void;
    startMenuOpen: boolean;
    toggleStartMenu: () => void;
    closeStartMenu: () => void;
}
