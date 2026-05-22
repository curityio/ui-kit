import { FC, SVGProps } from 'react';
import classes from './spinner.module.css';

const SIZE = 48;
const RADIUS = SIZE / 8;

export const Spinner: FC<SVGProps<SVGSVGElement>> = props => (
  <div className="flex flex-center flex-column justify-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="svgTitle"
      focusable="false"
      width={SIZE}
      height={SIZE}
      data-testid="spinner"
      {...props}
    >
      <title id="svgTitle">Loading...</title>
      <circle cx={SIZE / 8} cy={SIZE / 2} r={RADIUS} className={classes.circle} />
      <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} className={`${classes.circle} ${classes.delay2}`} />
      <circle cx={(SIZE * 7) / 8} cy={SIZE / 2} r={RADIUS} className={`${classes.circle} ${classes.delay3}`} />
    </svg>
  </div>
);
