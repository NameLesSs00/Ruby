import { QueryClient, MutationCache } from '@tanstack/react-query';
import { showToast } from './sonner';

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      // Safety net: only trigger global toast if the specific mutation did not declare an onError handler
      if (!mutation.options.onError) {
        showToast.apiError(error, 'حدث خطأ أثناء تنفيذ العملية');
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
