import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconGeneralEyeHide = (props: SVGProps<SVGSVGElement>) => (
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
      d="M44.48 124.51s29.7-59.41 81.68-59.41 81.68 59.41 81.68 59.41-29.7 59.41-81.68 59.41-81.68-59.41-81.68-59.41"
    />
    <circle
      cx={126.17}
      cy={124.51}
      r={22.28}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={14}
    />
    <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={14} d="m56.2 54.54 139.94 139.94" />
  </svg>
);
export default SvgIconGeneralEyeHide;
