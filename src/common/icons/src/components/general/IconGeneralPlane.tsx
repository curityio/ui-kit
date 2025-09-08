import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconGeneralPlane = (props: SVGProps<SVGSVGElement>) => (
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
      d="m63.8 63.04 20.14 60.42-20.14 60.42 127.56-60.42zM83.94 123.47h107.42"
    />
  </svg>
);
export default SvgIconGeneralPlane;
