
import React, { useState, useRef, useEffect } from 'react';

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

const getYouTubeVideoId = (urlOrId: string) => {
    if (!urlOrId) return null;
    if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;
    const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11}).*/;
    const match = urlOrId.match(regExp);
    return (match && match[1]) ? match[1] : null;
};

const DEFAULT_YOUTUBE_VIDEO_ID = 'WXuK6gekU1Y';

export const MediaPlayer: React.FC = () => {
    const [url, setUrl] = useState('');
    const [statusMessage, setStatusMessage] = useState('Loading player...');
    const playerRef = useRef<any>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const createPlayer = (videoId: string) => {
        if (!window.YT || !playerContainerRef.current) {
            setStatusMessage('YouTube API not ready.');
            return;
        }
        if (playerRef.current) {
            playerRef.current.destroy();
        }
        
        playerRef.current = new window.YT.Player(playerContainerRef.current, {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: { 'playsinline': 1, 'autoplay': 1, 'controls': 0, 'modestbranding': 1, 'rel': 0, 'fs': 0 },
            events: {
                'onReady': () => setStatusMessage(''),
                'onError': () => setStatusMessage('Error playing video.'),
                'onStateChange': (event: any) => {
                   setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
                }
            }
        });
    };
    
    useEffect(() => {
        if (window.YT && window.YT.Player) {
            createPlayer(DEFAULT_YOUTUBE_VIDEO_ID);
        } else {
             // The API script is loaded in index.html, we just wait for it
            window.onYouTubeIframeAPIReady = () => {
                createPlayer(DEFAULT_YOUTUBE_VIDEO_ID);
            };
        }
        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLoad = () => {
        const videoId = getYouTubeVideoId(url);
        if (videoId) {
            setStatusMessage('Loading video...');
            createPlayer(videoId);
        } else {
            setStatusMessage('Invalid YouTube URL or Video ID.');
        }
    };
    
    const handlePlay = () => playerRef.current?.playVideo();
    const handlePause = () => playerRef.current?.pauseVideo();
    const handleStop = () => playerRef.current?.stopVideo();

    return (
        <div className="flex flex-col h-full bg-gray-300 p-0 overflow-hidden">
            <div className="flex p-2 gap-1" style={{backgroundColor: 'var(--window-bg)'}}>
                <input
                    type="text"
                    className="win95-text-input flex-grow"
                    placeholder="YouTube URL or Video ID"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button className="win95-button px-4" onClick={handleLoad}>Load</button>
            </div>
            <div className="flex-grow bg-black flex items-center justify-center">
                {statusMessage && <p className="text-white">{statusMessage}</p>}
                <div ref={playerContainerRef} className="w-full h-full"></div>
            </div>
            <div className="flex justify-center p-2 gap-2" style={{backgroundColor: 'var(--window-bg)'}}>
                <button className="win95-button px-2" onClick={handlePlay} disabled={isPlaying}>▶️ Play</button>
                <button className="win95-button px-2" onClick={handlePause} disabled={!isPlaying}>⏸️ Pause</button>
                <button className="win95-button px-2" onClick={handleStop}>⏹️ Stop</button>
            </div>
        </div>
    );
};
