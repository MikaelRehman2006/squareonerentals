import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * Perform navigation with a small delay to ensure state is settled
 * This helps prevent layout shifts and flickering during form submissions
 * 
 * @param router Next.js router instance
 * @param path Path to navigate to
 * @param options Navigation options
 * @param delay Delay in milliseconds (default: 100ms)
 */
export function stableNavigate(
  router: AppRouterInstance, 
  path: string, 
  options?: { 
    scroll?: boolean 
  }, 
  delay: number = 100
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      router.push(path, options);
      resolve();
    }, delay);
  });
}

/**
 * Reset form state and navigate with stability
 * 
 * @param router Next.js router instance
 * @param path Path to navigate to
 * @param setFormKey Function to reset form key
 * @param options Navigation options
 * @param delay Delay in milliseconds (default: 100ms)
 */
export async function resetAndNavigate(
  router: AppRouterInstance,
  path: string,
  setFormKey: (key: number) => void,
  options?: {
    scroll?: boolean
  },
  delay: number = 100
): Promise<void> {
  // Reset form key first
  setFormKey(Date.now());
  
  // Then navigate with a delay
  return stableNavigate(router, path, options, delay);
} 