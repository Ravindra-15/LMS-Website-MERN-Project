import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="loader-wrapper">
      <div className="loader">
        <div className="book">
          <ul>
            {[...Array(6)].map((_, index) => (
              <li key={index} style={{ animationDelay: `${index * 0.3}s` }}>
                <div className="page-content">
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <span>Loading...</span>
      </div>

      <style>{`
        .loader-wrapper {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #1c212e;
          font-family: "Roboto", Arial, sans-serif;
        }

        .loader {
          --background: linear-gradient(135deg, #23C4F8, #275EFE);
          --shadow: rgba(39, 94, 254, 0.28);
          --text: #6C7486;
          width: 150px;
          height: 100px;
          position: relative;
        }

        .loader::before,
        .loader::after {
          content: "";
          position: absolute;
          bottom: 4px;
          width: 80px;
          top: 75%;
          box-shadow: 0 12px 10px var(--shadow);
          transform: rotate(-6deg);
        }

        .loader::after {
          right: 4px;
          transform: rotate(6deg);
        }

        .loader::before {
          left: 4px;
        }

        .book {
          width: 100%;
          height: 100%;
          border-radius: 10px;
          position: relative;
          z-index: 1;
          perspective: 600px;
          background-image: var(--background);
          box-shadow: 0 3px 5px var(--shadow);
          border: 2px solid #23C4F8;
          overflow: visible;
        }

        .book ul {
          margin: 0;
          padding: 0;
          list-style: none;
          position: relative;
          overflow: visible;
        }

        .book li {
          position: absolute;
          top: 5px;
          left: 5px;
          width: 70px;
          height: 90px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          transform-origin: 100% 50%;
          opacity: 0;
          transform: rotateY(180deg);
          animation: flipPage 3s ease infinite;
          overflow: hidden;
        }

        .book li:nth-child(even) {
          background: rgba(255, 255, 255, 0.7);
        }

        .page-content {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          padding: 10px;
        }

        .line {
          height: 2px;
          background: #ddd;
          border-radius: 1px;
        }

        .book li:first-child {
          transform: rotateY(0deg);
          opacity: 1;
        }

        .loader span {
          display: block;
          margin-top: 15px;
          text-align: center;
          color: var(--text);
          font-size: 14px;
        }

        @keyframes flipPage {
          0% {
            transform: rotateY(180deg);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          35% {
            opacity: 0;
          }
          50% {
            transform: rotateY(0deg);
          }
          100% {
            opacity: 0;
            transform: rotateY(0deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
