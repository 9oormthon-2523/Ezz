import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type ClientPortalInterface = {
  children: React.ReactNode;
  show?: boolean;
  onClose?: () => void;
};

const ClientPortal = ({ children, show, onClose }: ClientPortalInterface) => {
  const ref = useRef<Element | null>(null);

  useEffect(() => {
    ref.current = document.getElementById('portal');

    // esc 키 누르면 닫기
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return show && ref.current
    ? createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100]"
          onClick={onClose}
        >
          <div className="bg-white p-6 rounded-md shadow-md" onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </div>,
        ref.current,
      )
    : null;
};

export default ClientPortal;
