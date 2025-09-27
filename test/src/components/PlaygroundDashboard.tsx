import { getApps } from "firebase/app";
import { Code, Database, HardDrive, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import CodeExamples from "./CodeExamples";
import DatabasePlayground from "./DatabasePlayground";
import StoragePlayground from "./StoragePlayground";

interface PlaygroundDashboardProps {
  firebaseConfig: any;
  onConfigReset: () => void;
}

type ActiveTab = "database" | "storage" | "examples";

const PlaygroundDashboard: React.FC<PlaygroundDashboardProps> = ({
  firebaseConfig,
  onConfigReset,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("database");
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  useEffect(() => {
    // Check if Firebase is properly initialized
    const apps = getApps();
    setIsFirebaseReady(apps.length > 0);
  }, [firebaseConfig]);

  const tabs = [
    {
      id: "database" as ActiveTab,
      name: "Database",
      icon: Database,
      description: "Test CRUD operations with Firebase Realtime Database",
    },
    {
      id: "storage" as ActiveTab,
      name: "Storage",
      icon: HardDrive,
      description: "Test file upload, download, and management",
    },
    {
      id: "examples" as ActiveTab,
      name: "Code Examples",
      icon: Code,
      description: "Live code examples and snippets",
    },
  ];

  return (
    <div className="playground-container">
      {/* Enhanced Header */}
      <div className="playground-header">
        <div className="playground-header-content">
          <div className="playground-title-section">
            <div className="playground-icon-wrapper">
              <Code className="playground-main-icon" />
            </div>
            <div>
              <h1 className="playground-title">Firebase Playground</h1>
              <p className="playground-subtitle">
                Test all @atechhub/firebase features with your Firebase project
              </p>
            </div>
          </div>

          <div className="playground-header-actions">
            <div className="playground-project-info">
              <span className="playground-project-label">Project:</span>
              <span className="playground-project-name">
                {firebaseConfig.projectId}
              </span>
            </div>
            <button
              onClick={onConfigReset}
              className="playground-config-btn"
              title="Change Firebase Configuration"
            >
              <Settings className="playground-config-icon" />
              <span>Config</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Firebase Status */}
      <div
        className={`playground-status ${
          isFirebaseReady
            ? "playground-status-ready"
            : "playground-status-loading"
        }`}
      >
        <div className="playground-status-content">
          <div className="playground-status-indicator">
            <div
              className={`playground-status-dot ${
                isFirebaseReady
                  ? "playground-status-dot-ready"
                  : "playground-status-dot-loading"
              }`}
            />
            <div className="playground-status-rings">
              <div className="playground-status-ring" />
              <div className="playground-status-ring" />
            </div>
          </div>
          <div className="playground-status-text">
            <h3 className="playground-status-title">
              {isFirebaseReady
                ? "Firebase Connected"
                : "Firebase Initializing..."}
            </h3>
            <p className="playground-status-description">
              {isFirebaseReady
                ? "Ready to test database and storage operations"
                : "Please wait while Firebase initializes"}
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="playground-tabs-container">
        <nav className="playground-tabs-nav">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`playground-tab ${
                  activeTab === tab.id ? "playground-tab-active" : ""
                }`}
              >
                <Icon className="playground-tab-icon" />
                <span className="playground-tab-text">{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Enhanced Tab Description */}
      <div className="playground-tab-description">
        <div className="playground-tab-description-content">
          <p className="playground-tab-description-text">
            {tabs.find((tab) => tab.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Enhanced Tab Content */}
      <div className="playground-content">
        {isFirebaseReady ? (
          <div className="playground-content-ready">
            {activeTab === "database" && <DatabasePlayground />}
            {activeTab === "storage" && <StoragePlayground />}
            {activeTab === "examples" && <CodeExamples />}
          </div>
        ) : (
          <div className="playground-loading">
            <div className="playground-loading-content">
              <div className="playground-loading-spinner" />
              <h3 className="playground-loading-title">
                Initializing Firebase...
              </h3>
              <p className="playground-loading-text">
                Setting up your Firebase connection
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaygroundDashboard;
