interface MenuProps {
  width?: string;
  height?: string;
}

export const Menu: React.FC<MenuProps> = ({ width = '100%', height = '100%' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-more-vertical"
  >
    <circle cx={12} cy={12} r={1} />
    <circle cx={12} cy={5} r={1} />
    <circle cx={12} cy={19} r={1} />
  </svg>
);
