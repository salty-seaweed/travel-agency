import { useEffect, useCallback } from 'react';

interface KeyboardShortcutsProps {
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onCut?: () => void;
  onSave?: () => void;
  onEscape?: () => void;
  onEnter?: () => void;
  onTab?: () => void;
  onShiftTab?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onShiftArrowUp?: () => void;
  onShiftArrowDown?: () => void;
  onShiftArrowLeft?: () => void;
  onShiftArrowRight?: () => void;
  onCtrlA?: () => void;
  onCtrlC?: () => void;
  onCtrlV?: () => void;
  onCtrlX?: () => void;
  onCtrlZ?: () => void;
  onCtrlY?: () => void;
  onCtrlD?: () => void;
  onCtrlS?: () => void;
  enabled?: boolean;
}

export const useKeyboardShortcuts = ({
  onUndo,
  onRedo,
  onDelete,
  onDuplicate,
  onSelectAll,
  onDeselectAll,
  onCopy,
  onPaste,
  onCut,
  onSave,
  onEscape,
  onEnter,
  onTab,
  onShiftTab,
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
  onShiftArrowUp,
  onShiftArrowDown,
  onShiftArrowLeft,
  onShiftArrowRight,
  onCtrlA,
  onCtrlC,
  onCtrlV,
  onCtrlX,
  onCtrlZ,
  onCtrlY,
  onCtrlD,
  onCtrlS,
  enabled = true,
}: KeyboardShortcutsProps) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Check if user is typing in an input field
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      // Allow some shortcuts even when typing
      const allowedInInput = ['Escape', 'Tab', 'Enter'];
      if (!allowedInInput.includes(event.key)) {
        return;
      }
    }

    const { key, ctrlKey, shiftKey, metaKey, altKey } = event;

    // Prevent default for all shortcuts
    const preventDefault = () => {
      event.preventDefault();
      event.stopPropagation();
    };

    // Ctrl/Cmd + Z: Undo
    if ((ctrlKey || metaKey) && key === 'z' && !shiftKey) {
      if (onUndo) {
        preventDefault();
        onUndo();
      }
    }

    // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z: Redo
    if ((ctrlKey || metaKey) && (key === 'y' || (key === 'z' && shiftKey))) {
      if (onRedo) {
        preventDefault();
        onRedo();
      }
    }

    // Delete or Backspace: Delete
    if (key === 'Delete' || key === 'Backspace') {
      if (onDelete) {
        preventDefault();
        onDelete();
      }
    }

    // Ctrl/Cmd + D: Duplicate
    if ((ctrlKey || metaKey) && key === 'd') {
      if (onDuplicate) {
        preventDefault();
        onDuplicate();
      }
    }

    // Ctrl/Cmd + A: Select All
    if ((ctrlKey || metaKey) && key === 'a') {
      if (onSelectAll) {
        preventDefault();
        onSelectAll();
      }
    }

    // Escape: Deselect All
    if (key === 'Escape') {
      if (onDeselectAll) {
        preventDefault();
        onDeselectAll();
      }
    }

    // Ctrl/Cmd + C: Copy
    if ((ctrlKey || metaKey) && key === 'c') {
      if (onCopy) {
        preventDefault();
        onCopy();
      }
    }

    // Ctrl/Cmd + V: Paste
    if ((ctrlKey || metaKey) && key === 'v') {
      if (onPaste) {
        preventDefault();
        onPaste();
      }
    }

    // Ctrl/Cmd + X: Cut
    if ((ctrlKey || metaKey) && key === 'x') {
      if (onCut) {
        preventDefault();
        onCut();
      }
    }

    // Ctrl/Cmd + S: Save
    if ((ctrlKey || metaKey) && key === 's') {
      if (onSave) {
        preventDefault();
        onSave();
      }
    }

    // Enter: Enter
    if (key === 'Enter') {
      if (onEnter) {
        preventDefault();
        onEnter();
      }
    }

    // Tab: Tab
    if (key === 'Tab' && !shiftKey) {
      if (onTab) {
        preventDefault();
        onTab();
      }
    }

    // Shift + Tab: Shift Tab
    if (key === 'Tab' && shiftKey) {
      if (onShiftTab) {
        preventDefault();
        onShiftTab();
      }
    }

    // Arrow keys
    if (key === 'ArrowUp') {
      if (shiftKey && onShiftArrowUp) {
        preventDefault();
        onShiftArrowUp();
      } else if (onArrowUp) {
        preventDefault();
        onArrowUp();
      }
    }

    if (key === 'ArrowDown') {
      if (shiftKey && onShiftArrowDown) {
        preventDefault();
        onShiftArrowDown();
      } else if (onArrowDown) {
        preventDefault();
        onArrowDown();
      }
    }

    if (key === 'ArrowLeft') {
      if (shiftKey && onShiftArrowLeft) {
        preventDefault();
        onShiftArrowLeft();
      } else if (onArrowLeft) {
        preventDefault();
        onArrowLeft();
      }
    }

    if (key === 'ArrowRight') {
      if (shiftKey && onShiftArrowRight) {
        preventDefault();
        onShiftArrowRight();
      } else if (onArrowRight) {
        preventDefault();
        onArrowRight();
      }
    }
  }, [
    enabled,
    onUndo,
    onRedo,
    onDelete,
    onDuplicate,
    onSelectAll,
    onDeselectAll,
    onCopy,
    onPaste,
    onCut,
    onSave,
    onEscape,
    onEnter,
    onTab,
    onShiftTab,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onShiftArrowUp,
    onShiftArrowDown,
    onShiftArrowLeft,
    onShiftArrowRight,
    onCtrlA,
    onCtrlC,
    onCtrlV,
    onCtrlX,
    onCtrlZ,
    onCtrlY,
    onCtrlD,
    onCtrlS,
  ]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown, enabled]);

  return {
    enabled,
  };
};
