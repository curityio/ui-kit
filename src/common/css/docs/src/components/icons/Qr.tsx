interface QrProps {
  width?: string;
  height?: string;
}

export const Qr: React.FC<QrProps> = ({ width = '100%', height = '100%' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="lucide lucide-qr-code"
    viewBox="0 0 24 24"
  >
    <rect width="5" height="5" x="3" y="3" rx="1"></rect>
    <rect width="5" height="5" x="16" y="3" rx="1"></rect>
    <rect width="5" height="5" x="3" y="16" rx="1"></rect>
    <path d="M21 16h-3a2 2 0 00-2 2v3M21 21v.01M12 7v3a2 2 0 01-2 2H7M3 12h.01M12 3h.01M12 16v.01M16 12h1M21 12v.01M12 21v-1"></path>
  </svg>
);
