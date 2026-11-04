import { toast } from 'sonner';
import { extractApiError } from './api-error';

export { extractApiError };

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, { description });
  },
  error: (message: string, description?: string) => {
    toast.error(message, { description });
  },
  /**
   * Displays an API error notification.
   * Extracts raw backend error without masking/translating, and surfaces it clearly.
   * If a fallback action message is provided, it is shown as the context header,
   * while the exact backend error message is displayed as the description.
   */
  apiError: (error: unknown, fallbackMessage?: string) => {
    const backendMsg = extractApiError(error);

    if (fallbackMessage && backendMsg && backendMsg !== fallbackMessage) {
      toast.error(fallbackMessage, {
        description: backendMsg,
        duration: 7000,
      });
    } else {
      toast.error(backendMsg || fallbackMessage || 'فشل تنفيذ العملية', {
        duration: 7000,
      });
    }
  },
  info: (message: string, description?: string) => {
    toast.info(message, { description });
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, { description });
  },
};
