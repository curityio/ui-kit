import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconGeneralWarning = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={props.width || `100%`}
    height={props.height || `100%`}
    stroke="currentColor"
    fill="none"
    {...props}
  >
    <path
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={12}
      d="M128 43.97 30.97 212.03h194.06z"
    />
    <path
      fill={props.color || `currentColor`}
      d="M120.62 183.39c0-4.56 3.16-7.85 7.47-7.85 4.56 0 7.47 3.29 7.47 7.85s-2.91 7.85-7.47 7.85-7.47-3.42-7.47-7.85m3.16-18.11-1.77-60.77h12.15l-1.77 60.77z"
    />
  </svg>
);
export default SvgIconGeneralWarning;
