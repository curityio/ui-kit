import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconAuthenticatorDuo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={props.width || `100%`}
    height={props.height || `100%`}
    stroke="currentColor"
    fill="none"
    {...props}
  >
    <path fill={props.color || `currentColor`} d="M63.77 159.5h-30.8v-29.02H94.5c-.92 16.18-14.33 29.02-30.74 29.02" />
    <path
      fill={props.color || `currentColor`}
      d="M63.77 159.5h-30.8v-29.02H94.5c-.92 16.18-14.33 29.02-30.74 29.02M63.77 97.91h-30.8v29.02H94.5c-.92-16.18-14.33-29.02-30.74-29.02M97.4 97.91v30.79c0 16.41 12.84 29.82 29.02 30.74V97.9H97.4M192.62 159.5c-16.4 0-29.81-12.83-30.74-29.02h61.48c-.92 16.18-14.33 29.02-30.74 29.02"
    />
    <path
      fill={props.color || `currentColor`}
      d="M192.62 159.5c-16.4 0-29.81-12.83-30.74-29.02h61.48c-.92 16.18-14.33 29.02-30.74 29.02M192.62 97.91c-16.4 0-29.81 12.84-30.74 29.02h61.48c-.92-16.18-14.33-29.02-30.74-29.02M158.93 159.44h-28.96V97.91h29.02v30.79c0 .6-.02 1.19-.06 1.78z"
    />
    <path fill={props.color || `currentColor`} d="M158.93 159.44h-28.96V97.91h29.02v30.79c0 .6-.02 1.19-.06 1.78z" />
  </svg>
);
export default SvgIconAuthenticatorDuo;
