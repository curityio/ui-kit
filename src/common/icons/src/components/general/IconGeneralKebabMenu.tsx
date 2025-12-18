import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconGeneralKebabMenu = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={props.width || `100%`}
    height={props.height || `100%`}
    stroke="currentColor"
    fill="none"
    {...props}
  >
    <circle cx={128} cy={62} r={18.55} fill={props.color || `currentColor`} />
    <circle cx={128} cy={128} r={18.55} fill={props.color || `currentColor`} />
    <circle cx={128} cy={194} r={18.55} fill={props.color || `currentColor`} />
  </svg>
);
export default SvgIconGeneralKebabMenu;
