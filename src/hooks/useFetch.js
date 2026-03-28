import { useState, useEffect } from "react";

/**
 * useFetch — generic hook that calls an async function on mount.
 *
 * @param {Function} asyncFn  - The async function to call
 * @param {Array}    deps     - Dependency array (re-runs when changed)
 * @returns {{ data, loading, error, refetch }}
 *
 * @example
 * const { data: students, loading, error } = useFetch(fetchStudents, []);
 */
export function useFetch(asyncFn, deps = []) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const run = () => {
    setLoading(true);
    setError(null);
    asyncFn()
      .then((result) => { setData(result); setLoading(false); })
      .catch((err)   => { setError(err.message); setLoading(false); });
  };

  useEffect(run, deps);

  return { data, loading, error, refetch: run };
}
