import { QueryClient, MutationCache, type QueryKey } from '@tanstack/react-query';
import { showToast } from './sonner';

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    // Global safety net: any mutation that declares meta.invalidate (either a single QueryKey
    // or an array of QueryKeys) has those keys invalidated automatically after success.
    onSuccess: async (_data, _variables, _context, mutation) => {
      const inv = mutation.meta?.invalidate;
      if (inv) {
        if (Array.isArray(inv) && inv.length > 0 && Array.isArray(inv[0])) {
          // Array of QueryKeys: [['clients'], ['cash-transactions']]
          await Promise.all(
            (inv as QueryKey[]).map((key) => queryClient.invalidateQueries({ queryKey: key }))
          );
        } else if (Array.isArray(inv)) {
          // Single QueryKey: ['clients']
          await queryClient.invalidateQueries({ queryKey: inv as QueryKey });
        }
      }
    },
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
      refetchOnMount: 'always', // Always pull fresh data when a screen/tab mounts
      gcTime: 1000 * 60 * 30, // 30 minutes in memory cache for instant render
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
