"use client";

import React from "react";
import "./loader.css"; // We'll create this CSS file next

interface CombinedLoaderProps {
  fullScreen?: boolean;
}

const CombinedLoader: React.FC<CombinedLoaderProps> = ({
  fullScreen = false,
}) => {
  return (
    <div className={`loader-container ${fullScreen ? "fullscreen" : ""}`}>
      <div className="loader-combo">
        <div className="loader-hexagon"></div>
        <div className="loader-circle"></div>
      </div>
    </div>
  );
};

export default CombinedLoader;
