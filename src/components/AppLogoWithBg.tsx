
import React from "react";

interface AppLogoWithBgProps {
  size?: number; // px
  shadow?: boolean;
  className?: string;
}

const LOGO_SRC = "/lovable-uploads/491dda36-0dcd-40f4-8360-3b186030816d.png";

const AppLogoWithBg: React.FC<AppLogoWithBgProps> = ({
  size = 56, // default to 56px
  shadow = true,
  className = "",
}) => (
  <span
    className={`inline-flex items-center justify-center ${shadow ? "shadow-lg" : ""} ${className}`}
    style={{
      width: size,
      height: size,
      minWidth: size,
      minHeight: size,
    }}
  >
    <img
      src={LOGO_SRC}
      alt="InRent logo"
      style={{
        width: size,
        height: size,
        objectFit: "contain",
      }}
      loading="lazy"
    />
  </span>
);

export default AppLogoWithBg;
