/*
 * Copyright (C) 2024 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

interface CurityProps {
  width?: string;
  height?: string;
}

export const Curity: React.FC<CurityProps> = ({ width = '100%', height = '100%' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 165.17 107.96" width={width} height={height}>
    <path
      fill="#626c87"
      d="M148.27 68.46l-1.67 1.67c-9.41 9.41-21.25 14.82-32.48 14.82-17.81 0-30.74-13-30.74-30.91s12.61-30.89 29.99-30.89c10.07 0 21.99 4.69 30.36 11.94l1.68 1.46 16.66-17.41-1.88-1.6C147.42 6.57 129.24 0 111.6 0 92.16 0 75.7 8.84 65.92 22.82H35.21l-1.8 15.12h25.22c-.81 2.73-1.37 5.57-1.75 8.49H19.16l-1.8 15.11h39.53c.37 2.92.93 5.77 1.72 8.48H1.8L0 85.14h65.79c9.79 14.09 26.46 22.82 46.56 22.82 25.24 0 42.83-12.91 51.07-20.6l1.75-1.64-16.9-17.26z"
    ></path>
    <path fill="#626c87" d="M14.88 46.43L3.76 46.43 1.96 61.54 13.09 61.54 14.88 46.43z"></path>
  </svg>
);
