import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconAuthenticatorEmail = (props: SVGProps<SVGSVGElement>) => (
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
      d="M60 64h136a16 16 0 0 1 16 16v96a16 16 0 0 1-16 16H60a16 16 0 0 1-16-16V80a16 16 0 0 1 16-16zM60 72a8 8 0 0 0-8 8v96a8 8 0 0 0 8 8h136a8 8 0 0 0 8-8V80a8 8 0 0 0-8-8z"
    />
    <path
      fill={props.color || `currentColor`}
      d="M52.19 74.39l3.62-4.78 74 56-3.62 4.78zM200.19 69.61l3.62 4.78-74 56-3.62-4.78z"
    />
  </svg>
);
export default SvgIconAuthenticatorEmail;
