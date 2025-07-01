import React from "react";

interface LogoSvgProps {
  width?: number;
  height?: number;
}

export const LogoSvg: React.FC<LogoSvgProps> = ({
  width = 48,
  height = 28,
}) => (
  <svg
    fill="none"
    height={height}
    viewBox="0 0 48 28"
    width={width}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 28H4.54209L9.08903 5.26532H4.54694L0 28Z" fill="#1A535C" />
    <path
      d="M22.7251 5.26532L20.4541 16.6302L18.183 5.26532H13.6409L9.09399 28H13.6361L15.912 16.6205L18.183 27.9855V28H18.1879H22.7203H22.73L22.7251 27.9855L27.2672 5.26532H22.7251Z"
      fill="#1A535C"
    />
    <path
      d="M46.3579 0L40.0882 2.05753L42.1118 3.27555L34.0855 16.6495L36.3614 5.26514H31.8193L27.2772 27.9998H31.8145H31.8193L45.4504 5.27484L47.4934 6.50256L46.3579 0Z"
      fill="#1A535C"
    />
  </svg>
);
