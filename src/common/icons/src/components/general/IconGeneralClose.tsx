import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconGeneralClose = (props: SVGProps<SVGSVGElement>) => (
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
      strokeWidth={14}
      d="M179.48 68.93 67.35 181.06M179.48 181.06 67.35 68.93"
    />
  </svg>
);
export default SvgIconGeneralClose;
