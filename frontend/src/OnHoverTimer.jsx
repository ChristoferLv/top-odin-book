import { useRef, useState, useCallback, useEffect } from "react";

function hoverTimer(delay = 600) {
  const [isOpen, setIsOpen] = useState(false);
  const hoverRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = useCallback((e) => {
    clearTimeout(timeoutRef.current);
    if (!isOpen)
      timeoutRef.current = setTimeout(() => { setIsOpen(true); hoverRef.current = e.target; }, delay);
  }, [delay]);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => { setIsOpen(false); hoverRef.current = null }, delay);
  }, []);


  useEffect(() => () => { clearTimeout(timeoutRef.current); hoverRef.current = null; }, []);

  return { isOpen, hoverRef, handleMouseEnter, handleMouseLeave };
}

export default hoverTimer;