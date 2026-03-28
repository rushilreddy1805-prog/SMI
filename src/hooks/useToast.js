import { useState, useCallback } from "react";

/**
 * useToast — simple toast notification manager.
 * @returns {{ toasts, toast }}
 *
 * @example
 * const { toast } = useToast();
 * toast("Saved!", "success");
 * toast("Error occurred", "error");
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  return { toasts, toast };
}
