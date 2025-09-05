import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconGeneralChevron = (props: SVGProps<SVGSVGElement>) => (
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
      d="m53.73 94.58 81.06 81.06 81.06-81.06"
    />
  </svg>
);
export default SvgIconGeneralChevron;
