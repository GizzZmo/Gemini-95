
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';

export const MyComputer: React.FC = () => {
    const { openApp } = useAppContext();
    const [cDriveOpen, setCDriveOpen] = useState(false);

    return (
        <div className="bg-white p-2 flex flex-col gap-2">
            {!cDriveOpen && (
                <div 
                    className="flex flex-col items-center cursor-pointer p-2 w-20"
                    onDoubleClick={() => setCDriveOpen(true)}
                >
                    <img src="https://storage.googleapis.com/gemini-95-icons/harddrive.png" alt="C:" className="w-8 h-8" />
                    <span className="text-xs mt-1">(C:)</span>
                </div>
            )}
            {cDriveOpen && (
                <div className="flex-grow flex flex-col">
                    <div 
                        className="drive-folder flex items-center gap-2 p-1 cursor-pointer hover:bg-blue-800 hover:text-white"
                        onDoubleClick={() => openApp('doom')}
                    >
                        <img src="https://storage.googleapis.com/gemini-95-icons/folder_options.png" alt="folder" className="w-4 h-4" />
                        <span>DOOM</span>
                    </div>
                    <div 
                        className="drive-folder flex items-center gap-2 p-1 cursor-pointer hover:bg-blue-800 hover:text-white"
                        onDoubleClick={() => openApp('imageViewer')}
                    >
                         <img src="https://storage.googleapis.com/gemini-95-icons/jpeg.png" alt="image" className="w-4 h-4" />
                         <span>dont_open.jpg</span>
                    </div>
                </div>
            )}
        </div>
    );
};
