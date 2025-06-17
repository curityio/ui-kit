import { FC, SVGProps } from 'react';
import { useTranslation } from 'react-i18next';

export const Spinner: FC<SVGProps<SVGSVGElement>> = ({ height = 24, width = 24, ...props }) => {
  const { t } = useTranslation();

  const radius = Math.min(Number(width), Number(height)) / 8;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="svgTitle"
      focusable="false"
      width={width}
      height={height}
      {...props}
    >
      <title id="svgTitle">{t('Loading Self Service Portal')}...</title>
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
};
