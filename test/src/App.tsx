import { useState } from "react";
import FirebaseConfigForm from "./components/FirebaseConfigForm";
import PlaygroundDashboard from "./components/PlaygroundDashboard";
import Documentation from "./components/Documentation";
import "./App.css";

function App() {
  const [firebaseConfig, setFirebaseConfig] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"docs" | "playground">("docs");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                @atechhub/firebase
              </h1>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                v0.0.1
              </span>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab("docs")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "docs"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Documentation
              </button>
              <button
                onClick={() => setActiveTab("playground")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "playground"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Playground
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "docs" && <Documentation />}
        {activeTab === "playground" && (
          <>
            {!firebaseConfig ? (
              <FirebaseConfigForm onConfigSubmit={setFirebaseConfig} />
            ) : (
              <PlaygroundDashboard
                firebaseConfig={firebaseConfig}
                onConfigReset={() => setFirebaseConfig(null)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
