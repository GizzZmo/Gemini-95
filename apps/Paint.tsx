
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GeminiService } from '../services/geminiService';

const COLORS = ['black', 'red', 'blue', 'green', 'white'];
const SIZES = [2, 5, 10];

export const Paint: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('black');
    const [size, setSize] = useState(2);
    const [critique, setCritique] = useState("I see you've opened GemPaint...");
    const [assistantVisible, setAssistantVisible] = useState(true);

    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        if (canvas && context) {
            const parent = canvas.parentElement;
            if (parent) {
                const { width, height } = parent.getBoundingClientRect();
                if (canvas.width !== width || canvas.height !== height) {
                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    canvas.width = width;
                    canvas.height = height;
                    context.putImageData(imageData, 0, 0);
                    // Re-apply settings
                    context.strokeStyle = color;
                    context.lineWidth = size;
                    context.lineCap = 'round';
                    context.lineJoin = 'round';
                }
            }
        }
    }, [color, size]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            if(context) {
                context.lineCap = 'round';
                context.lineJoin = 'round';
                context.strokeStyle = color;
                context.lineWidth = size;
                contextRef.current = context;
            }
        }
        
        const observer = new ResizeObserver(resizeCanvas);
        if (canvasRef.current?.parentElement) {
            observer.observe(canvasRef.current.parentElement);
        }

        return () => {
            observer.disconnect();
        };

    }, [color, size, resizeCanvas]);

    useEffect(() => {
        const critiqueInterval = setInterval(async () => {
            const canvas = canvasRef.current;
            if (!canvas || !document.body.contains(canvas)) {
                 clearInterval(critiqueInterval);
                 return;
            }
            
            try {
                setCritique("Analyzing your masterpiece...");
                const base64Image = canvas.toDataURL('image/png').split(',')[1];
                const newCritique = await GeminiService.critiqueDrawing(base64Image);
                setCritique(newCritique);
            } catch (error) {
                setCritique("My circuits are buzzing. Try drawing something.");
            }
        }, 15000);

        return () => clearInterval(critiqueInterval);
    }, []);

    const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current?.beginPath();
        contextRef.current?.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const finishDrawing = () => {
        contextRef.current?.closePath();
        setIsDrawing(false);
    };

    const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current?.lineTo(offsetX, offsetY);
        contextRef.current?.stroke();
    };
    
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        if (canvas && context) {
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
    };
    
    return (
        <div className="flex flex-col h-full bg-gray-300 p-0 relative">
            <div className="p-2 flex items-center gap-2" style={{backgroundColor: 'var(--window-bg)', borderBottom: '2px solid var(--window-border-dark)'}}>
                {SIZES.map(s => (
                    <button key={s} onClick={() => setSize(s)} className={`win95-button p-1 ${size === s ? 'border-inset' : ''}`}>{s}px</button>
                ))}
                <span className="mx-2">|</span>
                {COLORS.map(c => (
                    <button key={c} onClick={() => setColor(c)} className={`w-6 h-6 border-2 ${color === c ? 'border-blue-500' : 'border-black'}`} style={{backgroundColor: c}}></button>
                ))}
                <span className="mx-2">|</span>
                <button className="win95-button px-4" onClick={clearCanvas}>Clear</button>
            </div>
            <div className="flex-grow bg-white">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseUp={finishDrawing}
                    onMouseMove={draw}
                    onMouseLeave={finishDrawing}
                    className="w-full h-full"
                />
            </div>
            {assistantVisible && (
                 <div className="absolute bottom-2 right-2 flex flex-col items-end pointer-events-none">
                    <div className="bg-white border-2 border-black p-2 rounded-lg mb-2 max-w-xs pointer-events-auto shadow-lg" style={{borderRadius: '12px 12px 0 12px'}}>
                        <p className="text-sm">{critique}</p>
                    </div>
                    <img src="https://storage.googleapis.com/gemini-95-icons/Clippy-Smug.png" alt="Assistant" className="w-16 h-auto pointer-events-auto" />
                </div>
            )}
        </div>
    );
};
