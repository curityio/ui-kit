import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconToken = (props: SVGProps<SVGSVGElement>) => (
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
      d="m200.67 125.82 25.03-25.03-17.83-17.83c-10.08 6.36-23.56 5.2-32.35-3.59s-9.95-22.26-3.59-32.35L154.1 29.19 31.69 151.62c-3.91 3.91-3.91 10.32 0 14.23l57.36 57.36c3.91 3.91 10.32 3.91 14.23 0l108.99-108.99"
    />
    <circle cx={140.7} cy={85.93} r={4.57} fill={props.color || `currentColor`} />
    <circle cx={154.4} cy={99.63} r={4.57} fill={props.color || `currentColor`} />
    <circle cx={168.1} cy={113.33} r={4.57} fill={props.color || `currentColor`} />
  </svg>
);
export default SvgIconToken;
