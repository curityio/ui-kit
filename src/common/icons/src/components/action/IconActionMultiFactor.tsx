import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconActionMultiFactor = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={props.width || `100%`}
    height={props.height || `100%`}
    stroke="currentColor"
    fill="none"
    {...props}
  >
    <circle cx={159.7} cy={157.44} r={5.44} fill={props.color || `currentColor`} />
    <circle cx={176.32} cy={157.44} r={5.44} fill={props.color || `currentColor`} />
    <circle cx={192.94} cy={157.44} r={5.44} fill={props.color || `currentColor`} />
    <path
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={10.07}
      d="M199.99 120.34h-47.33c-9.28 0-16.82 7.18-16.82 16v37.53c0 8.79 7.55 15.95 16.82 15.95h27.44c.86 0 1.35-.02 1.45-.05.14.08.29.2.52.37 1.25.93 14.04 9.65 15.5 10.64l4.87 3.32v-14.45c8.12-1.13 14.38-7.77 14.38-15.78v-37.53c0-8.82-7.55-16-16.82-16ZM176.32 117.59V95.98c0-4.62-3.78-8.41-8.41-8.41H81.75c-4.62 0-8.41 3.78-8.41 8.41v18.74"
    />
    <circle
      cx={124.84}
      cy={42.37}
      r={16.89}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={10.07}
    />
    <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={10.07} d="M124.84 59.26v25.39" />
    <rect
      width={62.14}
      height={100.57}
      x={42.57}
      y={116.45}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={10.07}
      rx={3.65}
      ry={3.65}
    />
    <circle cx={73.35} cy={200.04} r={5.35} fill={props.color || `currentColor`} />
  </svg>
);
export default SvgIconActionMultiFactor;
