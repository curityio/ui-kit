import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconGeneralEdit = (props: SVGProps<SVGSVGElement>) => (
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
      strokeMiterlimit={10}
      strokeWidth={15.14}
      d="m207.86 66.81-14.27-14.27c-3.94-3.94-9.11-5.91-14.27-5.91s-10.33 1.97-14.27 5.91L78.4 139.18c-3.94 3.94-15.99 19.19-16 24.35l-10.09 44.55 44.54-10.09s20.42-12.06 24.36-16l86.65-86.64c7.88-7.88 7.88-20.66 0-28.54ZM161.52 77.46l19.66 19.66"
    />
  </svg>
);
export default SvgIconGeneralEdit;
