
import React from "react";

interface AppLogoWithBgProps {
  size?: number; // px
  shadow?: boolean;
  className?: string;
}

const LOGO_SRC = "/lovable-uploads/ff5803ec-2385-43a8-aebc-d33664bd076d.png";

const AppLogoWithBg: React.FC<AppLogoWithBgProps> = ({
  size = 56, // default to 56px
  shadow = true,
  className = "",
}) => (
  <span
    className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-green-300 to-white ${shadow ? "shadow-lg" : ""} ${className}`}
    style={{
      width: size,
      height: size,
      minWidth: size,
      minHeight: size,
    }}
  >
    <img
      src={LOGO_SRC}
      alt="Rentable logo"
      style={{
        width: size * 0.8,
        height: size * 0.8,
        objectFit: "contain",
        borderRadius: "0.5rem", // subtle rounding on inner logo
      }}
      loading="lazy"
    />
  </span>
);

export default AppLogoWithBg;
