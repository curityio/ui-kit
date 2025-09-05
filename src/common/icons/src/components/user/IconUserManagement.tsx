import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconUserManagement = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={props.width || `100%`}
    height={props.height || `100%`}
    stroke="currentColor"
    fill="none"
    {...props}
  >
    <circle cx={128} cy={87.23} r={39.61} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={12} />
    <path
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={12}
      d="M57.39 208.38c0-35.12 31.61-63.59 70.61-63.59s70.61 28.47 70.61 63.59"
    />
  </svg>
);
export default SvgIconUserManagement;
