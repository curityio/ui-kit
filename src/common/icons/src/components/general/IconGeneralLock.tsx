import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconGeneralLock = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={props.width || `100%`}
    height={props.height || `100%`}
    stroke="currentColor"
    fill="none"
    {...props}
  >
    <rect
      width={107.53}
      height={65.71}
      x={74.24}
      y={122.03}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={14}
      rx={11.95}
      ry={11.95}
    />
    <path
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={14}
      d="M98.13 122.03v-23.9c0-16.5 13.37-29.87 29.87-29.87s29.87 13.37 29.87 29.87v23.9"
    />
  </svg>
);
export default SvgIconGeneralLock;
