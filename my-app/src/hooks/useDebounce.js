/**
 * useDebounce.js — OriginEdge HRMS
 * Extracted from Filters.jsx — single source of truth.
 * Remove the inline version inside Filters.jsx once this is added.
 *
 * Place at: src/hooks/useDebounce.js
 *
 * Usage:
 *   import { useDebounce } from '../hooks';
 *   const debouncedSearch = useDebounce(searchValue, 500);
 */

import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}