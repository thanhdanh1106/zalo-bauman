import React, { useEffect, useRef, useState } from 'react';

type Props = {
  button: (state: { open: boolean }) => React.ReactNode;
  children: (helpers: { close: () => void }) => React.ReactNode;
};

const DropdownMenu = (props: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { button, children } = props;
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        close();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative" tabIndex={0}>
      <div className="cursor-pointer" onClick={() => setOpen(!open)}>
        {button({ open })}
      </div>
      {open ? (
        <div className="absolute bg-white/75  backdrop-blur-md  rounded-lg max-h-[280px] overflow-auto border border-slate-300 w-full top-[calc(100%+10px)] z-[50]">
          <div className="relative p-3 space-y-2 text-sm">
            {children({ close })}
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default DropdownMenu;


