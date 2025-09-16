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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Firebase Playground
          </h1>
          <p className="text-gray-600">
            Test all @atechhub/firebase features with your Firebase project
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            Project:{" "}
            <span className="font-medium">{firebaseConfig.projectId}</span>
          </div>
          <button
            onClick={onConfigReset}
            className="btn btn-secondary"
            title="Change Firebase Configuration"
          >
            <Settings className="h-4 w-4 mr-2" />
            Config
          </button>
        </div>
      </div>

      {/* Firebase Status */}
      <div
        className={`card ${
          isFirebaseReady
            ? "bg-green-50 border-green-200"
            : "bg-yellow-50 border-yellow-200"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`w-3 h-3 rounded-full ${
              isFirebaseReady ? "bg-green-500 animate-pulse" : "bg-yellow-500"
            }`}
          />
          <div>
            <p
              className={`font-medium ${
                isFirebaseReady ? "text-green-800" : "text-yellow-800"
              }`}
            >
              {isFirebaseReady
                ? "Firebase Connected"
                : "Firebase Initializing..."}
            </p>
            <p
              className={`text-sm ${
                isFirebaseReady ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {isFirebaseReady
                ? "Ready to test database and storage operations"
                : "Please wait while Firebase initializes"}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon
                  className={`mr-2 h-5 w-5 ${
                    activeTab === tab.id
                      ? "text-blue-500"
                      : "text-gray-400 group-hover:text-gray-500"
                  }`}
                />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Description */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-800 text-sm">
          {tabs.find((tab) => tab.id === activeTab)?.description}
        </p>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {isFirebaseReady ? (
          <>
            {activeTab === "database" && <DatabasePlayground />}
            {activeTab === "storage" && <StoragePlayground />}
            {activeTab === "examples" && <CodeExamples />}
          </>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="loading-spinner mx-auto mb-4" />
              <p className="text-gray-600">Initializing Firebase...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaygroundDashboard;
