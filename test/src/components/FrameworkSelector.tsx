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
                <div className="framework-coming-soon-text">Coming Soon</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrameworkSelector;
