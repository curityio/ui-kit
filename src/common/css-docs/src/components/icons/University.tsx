interface UniversityProps {
  width?: string;
  height?: string;
}

export const University: React.FC<UniversityProps> = ({ width = '100%', height = '100%' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.25}
    className="lucide lucide-school"
    viewBox="0 0 24 24"
  >
    <path d="m4 6 8-4 8 4M18 10l4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2" />
    <path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4M18 5v17M6 5v17" />
    <circle cx={12} cy={9} r={2} />
  </svg>
);
