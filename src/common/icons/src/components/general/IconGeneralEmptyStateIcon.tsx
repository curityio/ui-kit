import { SVGProps } from 'react';

interface SvgIconGeneralEmptyStateIconProps extends SVGProps<SVGSVGElement> {
  ariaLabel?: string;
}

const SvgIconGeneralEmptyStateIcon = ({
  width = '100%',
  height = '100%',
  ariaLabel = 'Empty state icon',
  ...props
}: SvgIconGeneralEmptyStateIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 375.38 250.76"
    width={width}
    height={height}
    role="img"
    aria-label={ariaLabel}
    {...props}
  >
    <g opacity="0.1">
      <rect
        width="218"
        height="35.67"
        x="101.22"
        y="0.55"
        fill="none"
        stroke="#cacaca"
        strokeMiterlimit="10"
        strokeWidth="1.09"
        rx="6"
        ry="6"
      ></rect>
      <circle cx="134.47" cy="18.38" r="7" fill="#cacaca"></circle>
      <rect width="137" height="11" x="155.97" y="12.88" fill="#cacaca" rx="5.5" ry="5.5"></rect>
    </g>
    <g opacity="0.1">
      <rect
        width="218"
        height="35.67"
        x="105.22"
        y="214.55"
        fill="none"
        stroke="#cacaca"
        strokeMiterlimit="10"
        strokeWidth="1.09"
        rx="6"
        ry="6"
      ></rect>
      <circle cx="138.47" cy="232.38" r="7" fill="#cacaca"></circle>
      <rect width="137" height="11" x="159.97" y="226.88" fill="#cacaca" rx="5.5" ry="5.5"></rect>
    </g>
    <g opacity="0.25">
      <rect
        width="264.86"
        height="43.33"
        x="49.79"
        y="50.21"
        fill="none"
        stroke="#cacaca"
        strokeMiterlimit="10"
        strokeWidth="1.32"
        rx="6"
        ry="6"
      ></rect>
      <circle cx="90.18" cy="71.88" r="8.5" fill="#cacaca"></circle>
      <rect width="166.45" height="13.36" x="116.31" y="65.2" fill="#cacaca" rx="5.5" ry="5.5"></rect>
    </g>
    <g opacity="0.25">
      <rect
        width="264.86"
        height="43.33"
        x="64.79"
        y="157.21"
        fill="none"
        stroke="#cacaca"
        strokeMiterlimit="10"
        strokeWidth="1.32"
        rx="6"
        ry="6"
      ></rect>
      <circle cx="105.18" cy="178.88" r="8.5" fill="#cacaca"></circle>
      <rect width="166.45" height="13.36" x="131.31" y="172.2" fill="#cacaca" rx="5.5" ry="5.5"></rect>
    </g>
    <g opacity="0.5">
      <rect
        width="373.8"
        height="43.33"
        x="0.79"
        y="103.71"
        fill="none"
        stroke="#cacaca"
        strokeMiterlimit="10"
        strokeWidth="1.57"
        rx="6"
        ry="6"
      ></rect>
      <circle cx="41.18" cy="125.38" r="8.5" fill="#cacaca"></circle>
      <rect width="166.45" height="13.36" x="67.31" y="118.7" fill="#cacaca" rx="5.5" ry="5.5"></rect>
    </g>
  </svg>
);

export default SvgIconGeneralEmptyStateIcon;
