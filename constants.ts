
import type { AppConfig, AppId } from './types';
import { MyComputer } from './apps/MyComputer';
import { AiBrowser } from './apps/AiBrowser';
import { Notepad } from './apps/Notepad';
import { Minesweeper } from './apps/Minesweeper';
import { MediaPlayer } from './apps/MediaPlayer';
import { Paint } from './apps/Paint';
import { GeminiChat } from './apps/GeminiChat';
import { ImageViewer } from './apps/ImageViewer';
import { Doom } from './apps/Doom';

export const APP_CONFIGS: Record<AppId, AppConfig> = {
    myComputer: {
        id: 'myComputer',
        title: 'My Gemtop',
        iconUrl: 'https://storage.googleapis.com/gemini-95-icons/mycomputer.png',
        component: MyComputer,
        initialSize: { width: 300, height: 200 },
    },
    aiBrowser: {
        id: 'aiBrowser',
        title: 'AI Browser',
        iconUrl: 'https://storage.googleapis.com/gemini-95-icons/chrome-icon-2.png',
        component: AiBrowser,
        initialSize: { width: 600, height: 400 },
    },
    notepad: {
        id: 'notepad',
        title: 'GemNotes',
        iconUrl: 'https://storage.googleapis.com/gemini-95-icons/GemNotes.png',
        component: Notepad,
        initialSize: { width: 400, height: 300 },
    },
    minesweeper: {
        id: 'minesweeper',
        title: 'GemSweeper',
        iconUrl: 'https://storage.googleapis.com/gemini-95-icons/gemsweeper.png',
        component: Minesweeper,
        initialSize: { width: 250, height: 350 },
    },
    mediaPlayer: {
        id: 'mediaPlayer',
        title: 'GemPlayer',
        iconUrl: 'https://storage.googleapis.com/gemini-95-icons/ytmediaplayer.png',
        component: MediaPlayer,
        initialSize: { width: 560, height: 400 },
    },
    paint: {
        id: 'paint',
        title: 'GemPaint',
        iconUrl: 'https://storage.googleapis.com/gemini-95-icons/gempaint.png',
        component: Paint,
        initialSize: { width: 500, height: 400 },
    },
    geminiChat: {
        id: 'geminiChat',
        title: 'Gemini Chat',
        iconUrl: 'https://storage.googleapis.com/gemini-95-icons/GeminiChatRetro.png',
        component: GeminiChat,
        initialSize: { width: 400, height: 400 },
    },
    imageViewer: {
        id: 'imageViewer',
        title: 'Image Viewer',
        iconUrl: 'https://win98icons.alexmeub.com/icons/png/display_properties-4.png',
        component: ImageViewer,
        initialSize: { width: 300, height: 300 },
    },
    doom: {
        id: 'doom',
        title: 'DOOM II',
        iconUrl: 'https://64.media.tumblr.com/1d89dfa76381e5c14210a2149c83790d/7a15f84c681c1cf9-c1/s540x810/86985984be99d5591e0cbc0dea6f05ffa3136dac.png',
        component: Doom,
        initialSize: { width: 640, height: 480 },
    }
};

export const DESKTOP_APPS: AppId[] = ['myComputer', 'aiBrowser', 'notepad', 'minesweeper', 'mediaPlayer', 'paint', 'geminiChat'];
export const START_MENU_APPS: AppId[] = ['aiBrowser', 'notepad', 'paint', 'minesweeper', 'geminiChat', 'mediaPlayer'];
