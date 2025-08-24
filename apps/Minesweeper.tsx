
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GeminiService } from '../services/geminiService';

const GRID_SIZE = { rows: 9, cols: 9 };
const MINE_COUNT = 10;

type CellState = {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    adjacentMines: number;
};

type GameStatus = 'playing' | 'won' | 'lost';

const MinesweeperCell: React.FC<{ cell: CellState; onClick: () => void; onContextMenu: (e: React.MouseEvent) => void }> = ({ cell, onClick, onContextMenu }) => {
    const getCellContent = () => {
        if (cell.isFlagged) return '🚩';
        if (!cell.isRevealed) return '';
        if (cell.isMine) return '💣';
        if (cell.adjacentMines > 0) return cell.adjacentMines;
        return '';
    };

    const getCellClass = () => {
        let classes = 'w-5 h-5 flex items-center justify-center font-bold font-mono text-base ';
        if (!cell.isRevealed && !cell.isFlagged) {
            classes += 'win95-button cursor-pointer';
        } else {
            classes += 'border border-gray-500';
            if(cell.isMine && cell.isRevealed) classes += ' bg-red-500';
        }
        return classes;
    };
    
    const colors = ["", "text-blue-700", "text-green-700", "text-red-700", "text-purple-700", "text-yellow-700", "text-cyan-700", "text-black", "text-gray-500"];

    return (
        <div className={getCellClass()} onClick={onClick} onContextMenu={onContextMenu}>
            <span className={colors[cell.adjacentMines]}>{getCellContent()}</span>
        </div>
    );
};

export const Minesweeper: React.FC = () => {
    const [board, setBoard] = useState<CellState[][]>([]);
    const [status, setStatus] = useState<GameStatus>('playing');
    const [timer, setTimer] = useState(0);
    const [firstClick, setFirstClick] = useState(true);
    const [hint, setHint] = useState("Let's play! Click a square.");
    const [loadingHint, setLoadingHint] = useState(false);
    const timerIntervalRef = useRef<number | null>(null);

    const createBoard = useCallback((firstClickPos?: { r: number; c: number }) => {
        let newBoard: CellState[][] = Array.from({ length: GRID_SIZE.rows }, () =>
            Array.from({ length: GRID_SIZE.cols }, () => ({
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0,
            }))
        );

        if (firstClickPos) {
            let minesPlaced = 0;
            while (minesPlaced < MINE_COUNT) {
                const r = Math.floor(Math.random() * GRID_SIZE.rows);
                const c = Math.floor(Math.random() * GRID_SIZE.cols);
                if (!newBoard[r][c].isMine && !(r === firstClickPos.r && c === firstClickPos.c)) {
                    newBoard[r][c].isMine = true;
                    minesPlaced++;
                }
            }

            for (let r = 0; r < GRID_SIZE.rows; r++) {
                for (let c = 0; c < GRID_SIZE.cols; c++) {
                    if (newBoard[r][c].isMine) continue;
                    let count = 0;
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            const nr = r + dr;
                            const nc = c + dc;
                            if (nr >= 0 && nr < GRID_SIZE.rows && nc >= 0 && nc < GRID_SIZE.cols && newBoard[nr][nc].isMine) {
                                count++;
                            }
                        }
                    }
                    newBoard[r][c].adjacentMines = count;
                }
            }
        }
        setBoard(newBoard);
    }, []);

    const resetGame = useCallback(() => {
        setStatus('playing');
        setTimer(0);
        setFirstClick(true);
        setHint("Let's play! Click a square.");
        createBoard();
    }, [createBoard]);

    useEffect(() => {
        resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // Clear any existing timer
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }

        if (status === 'playing' && !firstClick) {
            timerIntervalRef.current = window.setInterval(() => {
                setTimer(t => t + 1);
            }, 1000);
        }

        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
        };
    }, [status, firstClick]);

    const revealCells = (board: CellState[][], r: number, c: number): CellState[][] => {
        if (r < 0 || r >= GRID_SIZE.rows || c < 0 || c >= GRID_SIZE.cols || board[r][c].isRevealed || board[r][c].isFlagged) {
            return board;
        }

        board[r][c].isRevealed = true;

        if (board[r][c].adjacentMines === 0) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                   board = revealCells(board, r + dr, c + dc);
                }
            }
        }
        return board;
    };
    
    const checkWinCondition = (currentBoard: CellState[][]) => {
        let revealedCount = 0;
        currentBoard.flat().forEach(cell => {
            if (cell.isRevealed && !cell.isMine) revealedCount++;
        });
        if (revealedCount === (GRID_SIZE.rows * GRID_SIZE.cols) - MINE_COUNT) {
            setStatus('won');
        }
    };

    const handleClick = (r: number, c: number) => {
        if (status !== 'playing' || board[r][c].isRevealed || board[r][c].isFlagged) return;
        
        if (firstClick) {
            setFirstClick(false);
            // Create board with first click position and immediately process the click
            let newBoard: CellState[][] = Array.from({ length: GRID_SIZE.rows }, () =>
                Array.from({ length: GRID_SIZE.cols }, () => ({
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    adjacentMines: 0,
                }))
            );

            // Place mines avoiding the first click position
            let minesPlaced = 0;
            while (minesPlaced < MINE_COUNT) {
                const mineR = Math.floor(Math.random() * GRID_SIZE.rows);
                const mineC = Math.floor(Math.random() * GRID_SIZE.cols);
                if (!newBoard[mineR][mineC].isMine && !(mineR === r && mineC === c)) {
                    newBoard[mineR][mineC].isMine = true;
                    minesPlaced++;
                }
            }

            // Calculate adjacent mine counts
            for (let row = 0; row < GRID_SIZE.rows; row++) {
                for (let col = 0; col < GRID_SIZE.cols; col++) {
                    if (newBoard[row][col].isMine) continue;
                    let count = 0;
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            const nr = row + dr;
                            const nc = col + dc;
                            if (nr >= 0 && nr < GRID_SIZE.rows && nc >= 0 && nc < GRID_SIZE.cols && newBoard[nr][nc].isMine) {
                                count++;
                            }
                        }
                    }
                    newBoard[row][col].adjacentMines = count;
                }
            }

            // Reveal the clicked cell and cascade
            const finalBoard = revealCells(newBoard, r, c);
            setBoard(finalBoard);
            checkWinCondition(finalBoard);
            return;
        }

        let currentBoard = [...board.map(row => [...row])];

        if (board[r][c].isMine) {
            setStatus('lost');
            // reveal all mines
            const newBoard = board.map(row => row.map(cell => ({ ...cell, isRevealed: cell.isMine ? true : cell.isRevealed })));
            setBoard(newBoard);
            return;
        }

        const newBoard = revealCells(currentBoard, r, c);
        setBoard(newBoard);
        checkWinCondition(newBoard);
    };

    const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
        e.preventDefault();
        if (status !== 'playing' || board[r][c].isRevealed) return;
        
        const newBoard = [...board.map(row => [...row])];
        newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;
        setBoard(newBoard);
    };

    const getBoardStateAsText = () => {
        return board.map(row => 
            row.map(cell => {
                if (cell.isFlagged) return 'F';
                if (!cell.isRevealed) return 'H';
                return cell.adjacentMines;
            }).join(' ')
        ).join('\n');
    };

    const fetchHint = async () => {
        if (status !== 'playing' || firstClick) return;
        setLoadingHint(true);
        setHint("Thinking...");
        try {
            const boardState = getBoardStateAsText();
            const hintText = await GeminiService.getMinesweeperHint(boardState);
            setHint(hintText);
        } catch (error) {
            setHint("Error getting hint.");
        } finally {
            setLoadingHint(false);
        }
    };
    
    const flagsPlaced = board.flat().filter(c => c.isFlagged).length;
    
    const getFace = () => {
        if (status === 'won') return '😎';
        if (status === 'lost') return '😵';
        return '🙂';
    };

    return (
        <div className="flex flex-col items-center gap-2 p-2 bg-gray-300">
            <div className="flex justify-between items-center w-full p-1 border-2 border-gray-500 border-t-gray-400 border-l-gray-400">
                <div className="bg-black text-red-500 font-mono text-xl p-1">🚩 {MINE_COUNT - flagsPlaced}</div>
                <button className="win95-button text-2xl" onClick={resetGame}>{getFace()}</button>
                <div className="bg-black text-red-500 font-mono text-xl p-1">⏱️ {timer}</div>
            </div>
            <div className="grid gap-px bg-gray-500 p-1 border-2 border-gray-500 border-t-gray-400 border-l-gray-400" style={{gridTemplateColumns: `repeat(${GRID_SIZE.cols}, 1fr)`}}>
                {board.map((row, r) =>
                    row.map((cell, c) => (
                        <MinesweeperCell
                            key={`${r}-${c}`}
                            cell={cell}
                            onClick={() => handleClick(r, c)}
                            onContextMenu={(e) => handleRightClick(e, r, c)}
                        />
                    ))
                )}
            </div>
            <div className="flex flex-col items-center gap-2 mt-2 w-full">
                <button className="win95-button px-4" onClick={fetchHint} disabled={loadingHint || status !== 'playing'}>💡 Hint</button>
                <span className="text-center text-sm italic w-full truncate">{hint}</span>
            </div>
        </div>
    );
};
