import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconGeneralArrowBack = (props: SVGProps<SVGSVGElement>) => (
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
      d="M48.84 122.68h158.58M122.79 48.17l-74.52 74.51 74.51 74.51"
    />
  </svg>
);
export default SvgIconGeneralArrowBack;
