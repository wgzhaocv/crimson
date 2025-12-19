import { SVGProps } from "react";

export const LogoIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="512"
      height="512"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M360 120 C 310 70, 180 70, 130 120 C 70 180, 70 332, 130 392 C 180 442, 310 442, 360 392"
        stroke="currentColor"
        strokeWidth="60"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="360" cy="256" r="40" fill="currentColor" /> //
      改为继承当前文本颜色
    </svg>
  );
};
