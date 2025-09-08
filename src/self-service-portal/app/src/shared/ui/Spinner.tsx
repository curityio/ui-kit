import { FC, SVGProps } from 'react';

interface SpinnerProps extends SVGProps<SVGSVGElement> {
  mode?: 'default' | 'fullscreen';
}

export const Spinner: FC<SpinnerProps> = ({ height = 24, width = 24, mode = 'default', ...props }) => {
  const radius = Math.min(Number(width), Number(height)) / 8;

  const spinnerSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="svgTitle"
      focusable="false"
      width={width}
      height={height}
      {...props}
    >
      <title id="svgTitle">Loading</title>
      <style>
        {`
          @keyframes spinner-animation {
            93.75%, to {
              r: ${radius}px;
            }
            46.875% {
              r: ${radius * 0.1}px;
            }
          }
          .spinner-circle {
            animation: spinner-animation 0.8s linear infinite;
          }
        `}
      </style>
      <circle cx={Number(width) / 8} cy={Number(height) / 2} r={radius} className="spinner-circle" />
      <circle
        cx={Number(width) / 2}
        cy={Number(height) / 2}
        r={radius}
        className="spinner-circle"
        style={{ animationDelay: '-0.65s' }}
      />
      <circle
        cx={(Number(width) * 7) / 8}
        cy={Number(height) / 2}
        r={radius}
        className="spinner-circle"
        style={{ animationDelay: '-0.5s' }}
      />
    </svg>
  );

  if (mode === 'fullscreen') {
    return <div className="flex flex-center flex-column justify-center h100">{spinnerSvg}</div>;
  }

  return spinnerSvg;
};
