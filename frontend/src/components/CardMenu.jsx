import { useState, useEffect, useRef } from 'react';

const CardMenu = ({ items }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="p-2 rounded-lg bg-indigo-800/90 hover:bg-indigo-700 text-cyan-100 border border-cyan-500/40 hover:border-cyan-400/60 backdrop-blur-sm transition-colors shadow-md"
        aria-label="More options"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1 w-36 bg-indigo-900/95 backdrop-blur-md rounded-lg shadow-xl border border-cyan-500/30 py-1 z-50"
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
      )}
    </div>
  );
};

export default CardMenu;
