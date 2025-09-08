import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconGeneralTrash = (props: SVGProps<SVGSVGElement>) => (
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
      d="M36.8 65.78h186M202.13 65.78v144.66c0 11.41-9.25 20.67-20.67 20.67H78.13c-11.41 0-20.67-9.25-20.67-20.67V65.78m31.01 0V45.11c0-11.41 9.25-20.67 20.67-20.67h41.33c11.41 0 20.67 9.25 20.67 20.67v20.67M109.13 117.45v62M150.47 117.45v62"
    />
  </svg>
);
export default SvgIconGeneralTrash;
