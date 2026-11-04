import { useEffect } from 'react';

/**
 * Standardized hook to handle closing modals via the keyboard 'Escape' (Esc) key.
 * Ensures accidental clicks outside the modal do not dismiss windows or lose form data.
 *
 * @param onClose Callback executed when the Escape key is pressed
 * @param enabled Whether the listener is active (defaults to true; set to false if modal is closed or submitting)
 */
export function useModalEscape(onClose: () => void, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onClose]);
}

