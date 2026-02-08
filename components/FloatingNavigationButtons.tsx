"use client";

import { motion } from "motion/react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useDebouncedHover } from "@/hooks/useDebouncedHover";

export function FloatingNavigationButtons() {
  // Shared debounced hover state for both buttons with 2-second delay
  const {
    debouncedHovered: isExpanded,
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave,
  } = useDebouncedHover(2000);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="fixed bottom-8 right-8 flex flex-col gap-3 z-40"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        animate={{
          width: isExpanded ? 120 : 48,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex items-center justify-center h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow hover:bg-primary/90"
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-5 h-5 flex-shrink-0" />
        <motion.span
          initial={false}
          animate={{
            opacity: isExpanded ? 1 : 0,
            width: isExpanded ? "auto" : 0,
            marginLeft: isExpanded ? 8 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="whitespace-nowrap overflow-hidden font-medium text-sm"
        >
          To Top
        </motion.span>
      </motion.button>

      {/* Scroll to Bottom Button */}
      <motion.button
        onClick={scrollToBottom}
        animate={{
          width: isExpanded ? 120 : 48,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex items-center justify-center h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow hover:bg-primary/90"
        aria-label="Scroll to bottom"
      >
        <ChevronDown className="w-5 h-5 flex-shrink-0" />
        <motion.span
          initial={false}
          animate={{
            opacity: isExpanded ? 1 : 0,
            width: isExpanded ? "auto" : 0,
            marginLeft: isExpanded ? 8 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="whitespace-nowrap overflow-hidden font-medium text-sm"
        >
          To Bottom
        </motion.span>
      </motion.button>
    </div>
  );
}
