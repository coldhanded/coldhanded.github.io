export type AppearanceConfig = {
  colors: {
    background: string;
    homeBackground: string;
    foreground: string;
    link: string;
    linkHover: string;
    linkHoverBackground: string;
    particleHome: string;
    particleHomeGlow: string;
    particlePage: string;
    particlePageGlow: string;
    particleVolume: string;
    particleVolumeGlow: string;
  };
  fonts: {
    asciiFamily: string;
    asciiUrl: string;
    asciiFormat: string;
  };
  sizing: {
    textSize: string;
    cjkSize: string;
    cjkLinkSize: string;
    textCell: string;
    homeSize: string;
  };
};

export const appearanceConfig: AppearanceConfig = {
  colors: {
    background: "#1c1c1c",
    homeBackground: "#1c1c1c",
    foreground: "#fefefe",
    link: "#93ffd7",
    linkHover: "#c7ffe9",
    linkHoverBackground: "#153329",
    particleHome: "#6f8f84",
    particleHomeGlow: "#3a4a45",
    particlePage: "#6f8f84",
    particlePageGlow: "#3a4a45",
    particleVolume: "#6f8f84",
    particleVolumeGlow: "#3a4a45"
  },
  fonts: {
    asciiFamily: "gohu",
    asciiUrl: "/fonts/gohu-subset.woff",
    asciiFormat: "woff"
  },
  sizing: {
    textSize: "14px",
    cjkSize: "13px",
    cjkLinkSize: "15px",
    textCell: "8px",
    homeSize: "14px"
  }
};
