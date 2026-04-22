import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconAuthenticatorUser = (props: SVGProps<SVGSVGElement>) => (
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
      fill={props.color || `currentColor`}
      d="M128 125.84c-24.6 0-44.61-20.01-44.61-44.61S103.4 36.62 128 36.62s44.61 20.01 44.61 44.61-20.01 44.61-44.61 44.61m0-79.22c-19.08 0-34.61 15.52-34.61 34.61s15.52 34.61 34.61 34.61 34.61-15.52 34.61-34.61S147.09 46.62 128 46.62M198.61 207.38c-2.76 0-5-2.24-5-5 0-32.31-29.43-58.59-65.61-58.59s-65.61 26.28-65.61 58.59c0 2.76-2.24 5-5 5s-5-2.24-5-5c0-37.82 33.92-68.59 75.61-68.59s75.61 30.77 75.61 68.59c0 2.76-2.24 5-5 5"
    />
  </svg>
);
export default SvgIconAuthenticatorUser;
