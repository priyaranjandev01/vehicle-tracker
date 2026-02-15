import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

const STORAGE_ERROR_DEBOUNCE_MS = 30000;

/**
 * Listens for localStorage quota failures. Toast is shown at most once per 30s.
 * The app only fires this when save first fails due to quota (not on every later action).
 */
export function StorageErrorListener() {
  const { toast } = useToast();
  const lastShown = useRef<number>(0);

  useEffect(() => {
    const handle = () => {
      const now = Date.now();
      if (now - lastShown.current < STORAGE_ERROR_DEBOUNCE_MS) return;
      lastShown.current = now;

      toast({
        title: 'Storage full',
        description:
          'Could not save cases. Remove some photos or close old cases to free space.',
        variant: 'destructive',
      });
    };

    window.addEventListener('servicedesk-storage-error', handle);
    return () => window.removeEventListener('servicedesk-storage-error', handle);
  }, [toast]);

  return null;
}
