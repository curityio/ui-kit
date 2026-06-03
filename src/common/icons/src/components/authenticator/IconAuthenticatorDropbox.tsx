import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconAuthenticatorDropbox = (props: SVGProps<SVGSVGElement>) => (
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
      fill="#007ee5"
      d="M91.69 76.7 44.3 107.69l32.75 26.3 47.78-29.57zM44.3 160.29l47.39 31 33.14-27.73-47.78-29.57zM124.83 163.56l33.14 27.73 47.39-31-32.76-26.3z"
    />
    <path
      fill="#007ee5"
      d="M205.36 107.69 157.97 76.7l-33.14 27.72 47.77 29.57zM124.91 169.52 91.44 197.2l-14.43-9.31v10.44l47.82 28.53 47.82-28.53v-10.44l-14.35 9.31z"
    />
  </svg>
);
export default SvgIconAuthenticatorDropbox;
