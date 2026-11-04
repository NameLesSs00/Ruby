/**
 * Centralized API Error Extraction Utility for Ruby Swimming Academy
 * Parses diverse backend error response shapes (ASP.NET Core ProblemDetails,
 * ModelState errors, custom domain error objects, and raw strings)
 * without masking or translating raw technical backend messages.
 */

export interface ApiErrorResponse {
  error?: string;
  message?: string;
  title?: string;
  detail?: string;
  errors?: Record<string, string[] | string>;
  data?: string;
}

export function extractApiError(err: unknown, fallback?: string): string {
  if (!err) return fallback || 'حدث خطأ غير متوقع';

  const axiosErr = err as {
    response?: {
      data?: ApiErrorResponse | string;
      status?: number;
    };
    message?: string;
  };

  const data = axiosErr.response?.data;

  // 1. Raw string response body
  if (typeof data === 'string' && data.trim()) {
    return data.trim();
  }

  // 2. Structured JSON response body
  if (data && typeof data === 'object') {
    // 2a. data.error (used by Warehouse Transactions, Auth, etc.)
    if (typeof data.error === 'string' && data.error.trim()) {
      return data.error.trim();
    }

    // 2b. data.message (standard message field)
    if (typeof data.message === 'string' && data.message.trim()) {
      return data.message.trim();
    }

    // 2c. data.errors (ASP.NET Core ModelState validation dictionary)
    if (data.errors && typeof data.errors === 'object') {
      const messages = Object.entries(data.errors)
        .flatMap(([, val]) => (Array.isArray(val) ? val : [val]))
        .filter((msg): msg is string => typeof msg === 'string' && msg.trim().length > 0);

      if (messages.length > 0) {
        return messages.join(' — ');
      }
    }

    // 2d. data.detail (RFC 7807 ProblemDetails detail)
    if (typeof data.detail === 'string' && data.detail.trim()) {
      return data.detail.trim();
    }

    // 2e. data.title (RFC 7807 ProblemDetails title)
    if (typeof data.title === 'string' && data.title.trim()) {
      return data.title.trim();
    }
  }

  // 3. Network or connection errors
  if (axiosErr.message) {
    const lower = axiosErr.message.toLowerCase();
    if (lower === 'network error') {
      return 'تعذر الاتصال بالخادم، يرجى التحقق من اتصال الإنترنت';
    }
    if (lower.includes('timeout')) {
      return 'انتهت مهلة الاتصال بالخادم، يرجى إعادة المحاولة';
    }
  }

  // 4. HTTP Status fallback
  if (axiosErr.response?.status) {
    const status = axiosErr.response.status;
    if (status === 401) return 'انتهت صلاحية الجلسة، يرجى إعادة تسجيل الدخول';
    if (status === 403) return 'ليس لديك الصلاحية لتنفيذ هذا الإجراء';
    if (status === 404) return 'البيانات المطلوبة غير موجودة';
    if (status === 500) return 'حدث خطأ في الخادم الداخلي (500)';
  }

  return fallback || 'فشل تنفيذ العملية';
}

