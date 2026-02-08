import { useState } from "react";
import { useDebounce } from "./useDebounce";

/**
 * Custom hook for debounced hover state
 * @param delay - The debounce delay in milliseconds (default: 100)
 * @returns Object with debounced hover state and event handlers
 */
export function useDebouncedHover(delay: number = 100) {
  const [isHovered, setIsHovered] = useState(false);
  const debouncedHovered = useDebounce(isHovered, delay);

  return {
    debouncedHovered,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };
}
