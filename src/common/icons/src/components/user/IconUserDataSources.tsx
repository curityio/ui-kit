import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconUserDataSources = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={props.width || `100%`}
    height={props.height || `100%`}
    stroke="currentColor"
    fill="none"
    {...props}
  >
    <ellipse cx={128} cy={76.2} fill="none" strokeMiterlimit={10} strokeWidth={10} rx={66.59} ry={22.2} />
    <path
      fill="none"
      strokeMiterlimit={10}
      strokeWidth={10}
      d="M194.59 128c0 12.28-29.6 22.2-66.59 22.2s-66.59-9.92-66.59-22.2"
    />
    <path
      fill="none"
      strokeMiterlimit={10}
      strokeWidth={10}
      d="M61.41 76.2v103.59c0 12.28 29.6 22.2 66.59 22.2s66.59-9.92 66.59-22.2V76.2"
    />
  </svg>
);
export default SvgIconUserDataSources;
