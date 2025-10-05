import React, { useState } from "react";

interface FrameworkSelectorProps {
  onFrameworkSelect: (framework: string) => void;
  onExamplesHighlight: () => void;
}

const FrameworkSelector: React.FC<FrameworkSelectorProps> = ({
  onFrameworkSelect,
  onExamplesHighlight,
}) => {
  const [selectedFramework, setSelectedFramework] = useState<string>("nextjs");

  const frameworks = [
    {
      id: "nextjs",
      name: "Next.js",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
      available: true,
      description: "Full-stack React framework",
    },
    {
      id: "react",
      name: "React",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
      available: false,
      description: "UI library for building interfaces",
    },
    {
      id: "svelte",
      name: "Svelte",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/svelte/svelte-original.svg",
      available: false,
      description: "Compile-time optimized framework",
    },
  ];

  const handleFrameworkClick = (framework: any) => {
    if (framework.available) {
      setSelectedFramework(framework.id);
      onFrameworkSelect(framework.id);
      onExamplesHighlight();
    }
  };

  return (
    <div className="framework-selector-container">
      <div className="framework-selector-header">
        <h2 className="framework-selector-title">
          Getting Started with Your Framework
        </h2>
        <p className="framework-selector-subtitle">
          Choose your preferred framework to see tailored examples and setup
          guides
        </p>
      </div>

      <div className="framework-grid">
        {frameworks.map((framework) => (
          <div
            key={framework.id}
            className={`framework-card ${
              framework.available
                ? "framework-card-available"
                : "framework-card-disabled"
            } ${
              selectedFramework === framework.id && framework.available
                ? "framework-card-selected"
                : ""
            }`}
            onClick={() => handleFrameworkClick(framework)}
          >
            <div className="framework-logo-container">
              <img
                src={framework.logo}
                alt={`${framework.name} logo`}
                className={`framework-logo ${
                  framework.available
                    ? "framework-logo-active"
                    : "framework-logo-disabled"
                } ${
                  selectedFramework === framework.id && framework.available
                    ? "framework-logo-selected"
                    : ""
                }`}
              />
              {framework.available && <div className="framework-glow"></div>}
            </div>

            <div className="framework-info">
              <h3 className="framework-name">{framework.name}</h3>
              <p className="framework-description">{framework.description}</p>

              {framework.available ? (
                <div className="framework-status available">
                  <span className="framework-status-text">Available</span>
                </div>
              ) : (
                <div className="framework-status coming-soon">
                  <span className="framework-status-text">Coming Soon</span>
                </div>
              )}
            </div>

            {!framework.available && (
              <div className="framework-overlay">
                <div className="framework-lock-icon">🔒</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedFramework === "nextjs" && (
        <div className="framework-selected-info">
          <div className="framework-selected-content">
            <div className="framework-selected-icon">✨</div>
            <div>
              <h4 className="framework-selected-title">Next.js Selected!</h4>
              <p className="framework-selected-description">
                Check out the Examples tab for Next.js specific implementation
                guides and code snippets.
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .framework-selector-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 0;
        }

        .framework-selector-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .framework-selector-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .framework-selector-subtitle {
          color: #6b7280;
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .framework-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .framework-card {
          position: relative;
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
          cursor: pointer;
          overflow: hidden;
        }

        .framework-card-available {
          border-color: #d1d5db;
        }

        .framework-card-available:hover {
          border-color: #3b82f6;
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .framework-card-selected {
          border-color: #3b82f6;
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.1),
            0 10px 10px -5px rgba(59, 130, 246, 0.04);
        }

        .framework-card-disabled {
          border-color: #e5e7eb;
          background: #f9fafb;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .framework-logo-container {
          position: relative;
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .framework-logo {
          width: 80px;
          height: 80px;
          transition: all 0.3s ease;
        }

        .framework-logo-active {
          filter: none;
        }

        .framework-logo-selected {
          transform: scale(1.1);
          filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.3));
        }

        .framework-logo-disabled {
          filter: grayscale(100%) brightness(0.7);
        }

        .framework-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          background: radial-gradient(
            circle,
            rgba(59, 130, 246, 0.2) 0%,
            transparent 70%
          );
          border-radius: 50%;
          animation: pulse 2s infinite;
          pointer-events: none;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        .framework-info {
          text-align: center;
        }

        .framework-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .framework-description {
          color: #6b7280;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .framework-status {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .framework-status.available {
          background: #dcfce7;
          color: #166534;
        }

        .framework-status.coming-soon {
          background: #fef3c7;
          color: #92400e;
        }

        .framework-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(249, 250, 251, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 1rem;
        }

        .framework-lock-icon {
          font-size: 2rem;
          opacity: 0.5;
        }

        .framework-selected-info {
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          border: 1px solid #bfdbfe;
          border-radius: 1rem;
          padding: 1.5rem;
          margin-top: 2rem;
          animation: slideIn 0.5s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .framework-selected-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .framework-selected-icon {
          font-size: 2rem;
        }

        .framework-selected-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e40af;
          margin-bottom: 0.25rem;
        }

        .framework-selected-description {
          color: #3730a3;
          font-size: 0.9rem;
        }

        @media (max-width: 640px) {
          .framework-selector-title {
            font-size: 1.5rem;
          }

          .framework-grid {
            grid-template-columns: 1fr;
          }

          .framework-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FrameworkSelector;
