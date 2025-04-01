"use client";

import React from "react";

interface AppLoaderProps {
  fullScreen?: boolean;
}

export default function AppLoader({ fullScreen = false }: AppLoaderProps) {
  if (!fullScreen) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="loader-container relative">
          {/* Comic book caption */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-yellow-400 border-[3px] border-black px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0)] z-10">
            <span className="text-xs font-bold text-black uppercase font-boldonse">
              Loading...
            </span>
          </div>

          <div className="hexagon-loader"></div>
          <div className="progress-loader"></div>

          {/* Comic style decoration dots */}
          <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 border-2 border-black rounded-full z-20"></div>
          <div className="absolute -bottom-2 -left-2 h-4 w-4 bg-blue-500 border-2 border-black rounded-full z-20"></div>
        </div>
        <style jsx>{`
          .loader-container {
            position: relative;
            width: 90px;
            height: 90px;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s infinite ease-in-out;
          }

          /* Hexagon Loader (Outer) */
          .hexagon-loader {
            display: inline-grid;
            width: 90px;
            aspect-ratio: 1;
            clip-path: polygon(
              100% 50%,
              85.36% 85.36%,
              50% 100%,
              14.64% 85.36%,
              0% 50%,
              14.64% 14.64%,
              50% 0%,
              85.36% 14.64%
            );
            background: rgba(87, 73, 81, 0.7);
            animation: rotate 6s infinite linear;
            position: absolute;
            border: 3px solid black;
          }

          .hexagon-loader:before,
          .hexagon-loader:after {
            content: "";
            grid-area: 1/1;
            clip-path: polygon(
              100% 50%,
              81.17% 89.09%,
              38.87% 98.75%,
              4.95% 71.69%,
              4.95% 28.31%,
              38.87% 1.25%,
              81.17% 10.91%
            );
            margin: 10%;
            animation: inherit;
            animation-duration: 10s;
          }

          .hexagon-loader:before {
            background: rgba(131, 152, 142, 0.8);
          }

          .hexagon-loader:after {
            background: rgba(188, 222, 165, 0.9);
            clip-path: polygon(
              100% 50%,
              75% 93.3%,
              25% 93.3%,
              0% 50%,
              25% 6.7%,
              75% 6.7%
            );
            margin: 20%;
            animation-duration: 3s;
            animation-direction: reverse;
          }

          /* Progress Loader (Inner) */
          .progress-loader {
            width: 40px;
            aspect-ratio: 1;
            border-radius: 50%;
            position: absolute;
            -webkit-mask: linear-gradient(0deg, #000 55%, #0000 0) bottom/100%
              18.18%;
            background: linear-gradient(#6366f1 0 0) bottom/100% 0% no-repeat
              #e0e7ff;
            animation: progress 2s infinite steps(7);
            box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
            z-index: 1;
            border: 2px solid black;
          }

          /* Animation Keyframes */
          @keyframes rotate {
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes progress {
            100% {
              background-size: 100% 115%;
            }
          }

          @keyframes pulse {
            0% {
              transform: scale(0.95);
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(0.95);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
      <div className="relative">
        {/* Comic-style frame */}
        <div className="absolute -inset-6 bg-white border-[4px] border-black rounded-xl z-0 shadow-[8px_8px_0px_0px_rgba(0,0,0)]"></div>

        {/* Comic book speech bubble */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-20">
          <div className="relative">
            <div className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-lg border-[3px] border-black transform rotate-2 shadow-[3px_3px_0px_0px_rgba(0,0,0)] font-boldonse">
              <span className="text-lg uppercase">Loading!</span>
            </div>
            <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 rotate-45 w-5 h-5 bg-yellow-400 border-r-[3px] border-b-[3px] border-black"></div>
            <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 border-2 border-black rounded-full"></div>
            <div className="absolute -bottom-1 -left-4 h-3 w-3 bg-blue-500 border-2 border-black rounded-full"></div>
          </div>
        </div>

        {/* Loader container with decoration */}
        <div className="loader-container relative">
          <div className="hexagon-loader"></div>
          <div className="progress-loader"></div>

          {/* Comic style decoration dots */}
          <div className="absolute -top-3 -right-3 h-6 w-6 bg-green-500 border-[3px] border-black rounded-full z-20"></div>
          <div className="absolute -bottom-3 -left-3 h-6 w-6 bg-blue-500 border-[3px] border-black rounded-full z-20"></div>
        </div>

        {/* Comic book caption at bottom */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-blue-400 border-[3px] border-black px-4 py-1 rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0)] z-10">
          <span className="text-sm font-bold text-black uppercase font-space">
            Please wait
          </span>
        </div>

        {/* Halftone pattern for comic effect */}
        <div
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.7) 1px, transparent 1px)`,
            backgroundSize: "6px 6px",
          }}
        ></div>
      </div>
      <style jsx>{`
        .loader-container {
          position: relative;
          width: 90px;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s infinite ease-in-out;
        }

        /* Hexagon Loader (Outer) */
        .hexagon-loader {
          display: inline-grid;
          width: 90px;
          aspect-ratio: 1;
          clip-path: polygon(
            100% 50%,
            85.36% 85.36%,
            50% 100%,
            14.64% 85.36%,
            0% 50%,
            14.64% 14.64%,
            50% 0%,
            85.36% 14.64%
          );
          background: rgba(87, 73, 81, 0.7);
          animation: rotate 6s infinite linear;
          position: absolute;
          border: 3px solid black;
        }

        .hexagon-loader:before,
        .hexagon-loader:after {
          content: "";
          grid-area: 1/1;
          clip-path: polygon(
            100% 50%,
            81.17% 89.09%,
            38.87% 98.75%,
            4.95% 71.69%,
            4.95% 28.31%,
            38.87% 1.25%,
            81.17% 10.91%
          );
          margin: 10%;
          animation: inherit;
          animation-duration: 10s;
        }

        .hexagon-loader:before {
          background: rgba(131, 152, 142, 0.8);
        }

        .hexagon-loader:after {
          background: rgba(188, 222, 165, 0.9);
          clip-path: polygon(
            100% 50%,
            75% 93.3%,
            25% 93.3%,
            0% 50%,
            25% 6.7%,
            75% 6.7%
          );
          margin: 20%;
          animation-duration: 3s;
          animation-direction: reverse;
        }

        /* Progress Loader (Inner) */
        .progress-loader {
          width: 40px;
          aspect-ratio: 1;
          border-radius: 50%;
          position: absolute;
          -webkit-mask: linear-gradient(0deg, #000 55%, #0000 0) bottom/100%
            18.18%;
          background: linear-gradient(#6366f1 0 0) bottom/100% 0% no-repeat
            #e0e7ff;
          animation: progress 2s infinite steps(7);
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
          z-index: 1;
          border: 2px solid black;
        }

        /* Animation Keyframes */
        @keyframes rotate {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes progress {
          100% {
            background-size: 100% 115%;
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(0.95);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(0.95);
          }
        }
      `}</style>
    </div>
  );
}
