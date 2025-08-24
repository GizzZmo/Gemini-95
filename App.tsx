
import React from 'react';
import { Desktop } from './components/Desktop';
import { Taskbar } from './components/Taskbar';
import { Window } from './components/Window';
import { APP_CONFIGS } from './constants';
import { useAppContext } from './hooks/useAppContext';

const App: React.FC = () => {
    const { openApps, activeApp, bringToFront, closeApp, minimizeApp } = useAppContext();

    return (
        <div id="desktop" className="w-screen h-screen bg-cover bg-center" style={{ backgroundColor: 'var(--bg-color)', backgroundImage: `url('https://storage.googleapis.com/gemini-95-icons/win95-bg.jpg')` }}>
            <Desktop />

            {Array.from(openApps.values()).map(app => {
                const config = APP_CONFIGS[app.id];
                if (!config) return null;
                const AppComponent = config.component;

                return (
                    <Window
                        key={app.id}
                        id={app.id}
                        title={config.title}
                        iconUrl={config.iconUrl}
                        initialPosition={app.position}
                        initialSize={config.initialSize}
                        isActive={activeApp === app.id}
                        isMinimized={app.isMinimized}
                        onClose={() => closeApp(app.id)}
                        onMinimize={() => minimizeApp(app.id)}
                        onFocus={() => bringToFront(app.id)}
                    >
                        <AppComponent />
                    </Window>
                );
            })}

            <Taskbar />
        </div>
    );
};

export default App;
