import { useState, useEffect, useRef } from 'react';
import Portal from './Portal';

const MENU_WIDTH = 144;

const CardMenu = ({ items }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, openUp: false });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const updatePosition = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = items.length * 40 + 8;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < menuHeight && rect.top > menuHeight;

    setPosition({
      top: openUp ? rect.top - menuHeight - 4 : rect.bottom + 4,
      left: Math.max(8, Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8)),
      openUp,
    });
  };

  useEffect(() => {
    if (!open) return;

    updatePosition();

    const handleClickOutside = (e) => {
      if (
        buttonRef.current?.contains(e.target) ||
        dropdownRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleReposition = () => updatePosition();

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [open, items.length]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="p-2 rounded-lg bg-indigo-800/90 hover:bg-indigo-700 text-cyan-100 border border-cyan-500/40 hover:border-cyan-400/60 backdrop-blur-sm transition-colors shadow-md"
        aria-label="More options"
        aria-expanded={open}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>

      {open && (
        <Portal>
          <div
            ref={dropdownRef}
            style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
            className="fixed bg-indigo-900/95 backdrop-blur-md rounded-lg shadow-xl border border-cyan-500/30 py-1 z-[200]"
            onClick={(e) => e.stopPropagation()}
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  item.onClick();
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  item.danger
                    ? 'text-red-300 hover:bg-red-900/40'
                    : 'text-cyan-100 hover:bg-indigo-800/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </Portal>
      )}
    </>
  );
};

export default CardMenu;
