
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import type { AppId } from '../types';
import { useAppContext } from '../hooks/useAppContext';

interface WindowProps {
    id: AppId;
    title: string;
    iconUrl: string;
    children: ReactNode;
    initialSize: { width: number; height: number };
    initialPosition: { x: number; y: number };
    isActive: boolean;
    isMinimized: boolean;
    onClose: () => void;
    onMinimize: () => void;
    onFocus: () => void;
}

export const Window: React.FC<WindowProps> = ({ id, title, iconUrl, children, initialSize, initialPosition, isActive, isMinimized, onClose, onMinimize, onFocus }) => {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const windowRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest('.window-control-button')) {
            return;
        }
        onFocus();
        setIsDragging(true);
        dragStartPos.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
        // Prevent text selection while dragging
        e.preventDefault();
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            let newX = e.clientX - dragStartPos.current.x;
            let newY = e.clientY - dragStartPos.current.y;

            // Constrain to viewport
            const taskbarHeight = 36;
            const maxX = window.innerWidth - (windowRef.current?.offsetWidth ?? 0);
            const maxY = window.innerHeight - (windowRef.current?.offsetHeight ?? 0) - taskbarHeight;
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));

            setPosition({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const { zIndex } = useAppContext().openApps.get(id) || { zIndex: 20 };

    return (
        <div
            ref={windowRef}
            className="absolute flex flex-col"
            style={{
                width: `${initialSize.width}px`,
                height: `${initialSize.height}px`,
                top: `${position.y}px`,
                left: `${position.x}px`,
                display: isMinimized ? 'none' : 'flex',
                zIndex,
                borderTop: '2px solid var(--window-border-light)',
                borderLeft: '2px solid var(--window-border-light)',
                borderRight: '2px solid var(--window-border-dark)',
                borderBottom: '2px solid var(--window-border-dark)',
                boxShadow: '2px 2px 0 0 #000000',
                backgroundColor: 'var(--window-bg)',
            }}
            onMouseDown={onFocus}
        >
            <div
                className={`flex justify-between items-center p-0.5 text-white font-bold text-sm h-5 cursor-grab ${isActive ? 'active' : ''}`}
                style={{ background: isActive ? 'var(--titlebar-active-bg)' : 'var(--titlebar-bg)' }}
                onMouseDown={handleMouseDown}
            >
                <div className="flex items-center">
                    <img src={iconUrl} alt={title} className="w-4 h-4 mr-1" />
                    <span>{title}</span>
                </div>
                <div className="flex">
                    <button className="win95-button window-control-button w-4 h-4 flex items-center justify-center font-mono" onClick={onMinimize}>_</button>
                    <button className="win95-button window-control-button w-4 h-4 flex items-center justify-center font-mono ml-0.5" onClick={onClose}>X</button>
                </div>
            </div>
            <div className="window-content">
                {children}
            </div>
        </div>
    );
};
