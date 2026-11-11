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
      staleTime: 0, // Ensure tables and tabs always fetch the latest server data on mount/invalidation
      gcTime: 1000 * 60 * 30, // 30 minutes in memory cache for instant render
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
