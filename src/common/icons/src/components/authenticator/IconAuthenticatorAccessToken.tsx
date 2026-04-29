import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconAuthenticatorAccessToken = (props: SVGProps<SVGSVGElement>) => (
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
      d="M100.04 222.03c-3.87 0-7.5-1.5-10.22-4.22L38.2 166.18c-2.72-2.72-4.22-6.35-4.22-10.22s1.5-7.5 4.22-10.22L148.39 35.55a5.4 5.4 0 0 1 7.64 0l16.04 16.04c1.79 1.78 2.1 4.57.75 6.7-4.54 7.19-3.52 16.41 2.48 22.41s15.22 7.02 22.41 2.48a5.39 5.39 0 0 1 6.7.75l16.04 16.04a5.4 5.4 0 0 1 0 7.64l-12.09 12.09-.01.01-98.09 98.09c-2.72 2.72-6.35 4.22-10.22 4.22ZM152.2 47.01 45.83 153.38c-.68.68-1.06 1.6-1.06 2.58s.38 1.9 1.06 2.58l51.63 51.63c.68.68 1.6 1.06 2.58 1.06s1.9-.38 2.58-1.06L208.99 103.8l-9.41-9.41c-10.77 4.73-23.38 2.5-31.92-6.05-8.54-8.54-10.78-21.15-6.05-31.92z"
    />
    <circle cx={140.13} cy={90.43} r={4.11} fill={props.color || `currentColor`} />
    <circle cx={152.46} cy={102.76} r={4.11} fill={props.color || `currentColor`} />
    <circle cx={164.79} cy={115.09} r={4.11} fill={props.color || `currentColor`} />
  </svg>
);
export default SvgIconAuthenticatorAccessToken;
