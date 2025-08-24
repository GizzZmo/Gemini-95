
import React, { createContext, useState, useCallback, ReactNode } from 'react';
import type { AppId, AppInstance, AppContextType } from '../types';

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [openApps, setOpenApps] = useState<Map<AppId, AppInstance>>(new Map());
    const [activeApp, setActiveApp] = useState<AppId | null>(null);
    const [zIndexCounter, setZIndexCounter] = useState<number>(20);
    const [startMenuOpen, setStartMenuOpen] = useState<boolean>(false);

    const openApp = useCallback((id: AppId, data?: any) => {
        setStartMenuOpen(false);
        setOpenApps(prevApps => {
            const newApps = new Map(prevApps);
            const newZIndex = zIndexCounter + 1;
            setZIndexCounter(newZIndex);

            const existingApp = newApps.get(id);
            if (existingApp) {
                newApps.set(id, { ...existingApp, isMinimized: false, zIndex: newZIndex });
            } else {
                newApps.set(id, {
                    id,
                    isMinimized: false,
                    position: { x: Math.random() * 200 + 50, y: Math.random() * 150 + 50 },
                    zIndex: newZIndex,
                });
            }
            return newApps;
        });
        setActiveApp(id);
    }, [zIndexCounter]);

    const closeApp = useCallback((id: AppId) => {
        setOpenApps(prevApps => {
            const newApps = new Map(prevApps);
            newApps.delete(id);
            if (activeApp === id) {
                let nextActiveApp: AppId | null = null;
                let maxZ = -1;
                newApps.forEach((app: AppInstance) => {
                    if (!app.isMinimized && app.zIndex > maxZ) {
                        maxZ = app.zIndex;
                        nextActiveApp = app.id;
                    }
                });
                setActiveApp(nextActiveApp);
            }
            return newApps;
        });
    }, [activeApp]);
    
    const minimizeApp = useCallback((id: AppId) => {
        setOpenApps(prevApps => {
            const newApps = new Map(prevApps);
            const app = newApps.get(id);
            if (app) {
                newApps.set(id, { ...app, isMinimized: true });
            }
            return newApps;
        });
        if (activeApp === id) {
             let nextActiveApp: AppId | null = null;
             let maxZ = -1;
             openApps.forEach((app: AppInstance) => {
                 if (app.id !== id && !app.isMinimized && app.zIndex > maxZ) {
                     maxZ = app.zIndex;
                     nextActiveApp = app.id;
                 }
             });
             setActiveApp(nextActiveApp);
        }
    }, [activeApp, openApps]);

    const bringToFront = useCallback((id: AppId) => {
        if (activeApp === id) return;
        
        setOpenApps(prevApps => {
            const newApps = new Map(prevApps);
            const app = newApps.get(id);
            if (app) {
                const newZIndex = zIndexCounter + 1;
                setZIndexCounter(newZIndex);
                newApps.set(id, { ...app, isMinimized: false, zIndex: newZIndex });
            }
            return newApps;
        });
        setActiveApp(id);
    }, [activeApp, zIndexCounter]);

    const toggleStartMenu = useCallback(() => {
        setStartMenuOpen(prev => !prev);
    }, []);

    const closeStartMenu = useCallback(() => {
        setStartMenuOpen(false);
    }, []);

    const value = {
        openApps,
        activeApp,
        openApp,
        closeApp,
        minimizeApp,
        bringToFront,
        startMenuOpen,
        toggleStartMenu,
        closeStartMenu,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
