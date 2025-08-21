import { useState, useCallback, useRef } from 'react';

interface DroppedItem {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: any;
  content: string;
  props: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  locked: boolean;
  visible: boolean;
  customStyles?: Record<string, any>;
  data?: Record<string, any>;
}

interface HistoryState {
  content: DroppedItem[];
  timestamp: number;
}

export const useDragDropHistory = (initialContent: DroppedItem[] = []) => {
  const [history, setHistory] = useState<HistoryState[]>([
    { content: initialContent, timestamp: Date.now() }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxHistorySize = useRef(50); // Maximum number of history states to keep

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const pushToHistory = useCallback((newContent: DroppedItem[]) => {
    const newState: HistoryState = {
      content: JSON.parse(JSON.stringify(newContent)), // Deep clone
      timestamp: Date.now()
    };

    setHistory(prevHistory => {
      // Remove any states after current index (when we're not at the end)
      const trimmedHistory = prevHistory.slice(0, currentIndex + 1);
      
      // Add new state
      const updatedHistory = [...trimmedHistory, newState];
      
      // Limit history size
      if (updatedHistory.length > maxHistorySize.current) {
        return updatedHistory.slice(-maxHistorySize.current);
      }
      
      return updatedHistory;
    });

    setCurrentIndex(prevIndex => {
      const newIndex = Math.min(prevIndex + 1, maxHistorySize.current - 1);
      return newIndex;
    });
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  }, [canRedo]);

  const clearHistory = useCallback(() => {
    const currentState = history[currentIndex];
    setHistory([currentState]);
    setCurrentIndex(0);
  }, [history, currentIndex]);

  const getCurrentContent = useCallback(() => {
    return history[currentIndex]?.content || [];
  }, [history, currentIndex]);

  const getHistoryInfo = useCallback(() => {
    return {
      totalStates: history.length,
      currentIndex,
      canUndo,
      canRedo,
      maxSize: maxHistorySize.current
    };
  }, [history.length, currentIndex, canUndo, canRedo]);

  return {
    history,
    currentIndex,
    canUndo,
    canRedo,
    pushToHistory,
    undo,
    redo,
    clearHistory,
    getCurrentContent,
    getHistoryInfo
  };
};
