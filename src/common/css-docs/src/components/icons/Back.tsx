interface BackProps {
  width?: string;
  height?: string;
}

export const Back: React.FC<BackProps> = ({ width = '100%', height = '100%' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-arrow-left"
  >
    <path d="m12 19-7-7 7-7M19 12H5" />
  </svg>
);
