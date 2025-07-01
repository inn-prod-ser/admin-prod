import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const ArrowRightSvg: React.FC<IconProps> = (props) => (
  <svg
    fill="none"
    height="14"
    viewBox="0 0 14 14"
    width="14"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10.4381 6.17637L5.82637 1.5646L6.9999 0.411663L13.5881 6.9999L6.9999 13.5881L5.82637 12.4352L10.4381 7.82343L0.411665 7.82343L0.411665 6.17637L10.4381 6.17637Z"
      fill="#1A535C"
    />
  </svg>
);
