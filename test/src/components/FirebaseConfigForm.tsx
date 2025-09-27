import { useState } from "react";
import { initializeApp, getApps, deleteApp } from "firebase/app";
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";

interface FirebaseConfigFormProps {
  onConfigSubmit: (config: any) => void;
}

const FirebaseConfigForm: React.FC<FirebaseConfigFormProps> = ({
  onConfigSubmit,
}) => {
  const [config, setConfig] = useState({
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
  });
  const [jsonInput, setJsonInput] = useState("");
  const [inputMode, setInputMode] = useState<"form" | "json">("json");
  const [showApiKey, setShowApiKey] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let firebaseConfig;

      if (inputMode === "json") {
        try {
          firebaseConfig = JSON.parse(jsonInput);
        } catch {
          throw new Error("Invalid JSON format");
        }
      } else {
        firebaseConfig = config;
      }

      // Validate required fields
      const requiredFields = ["apiKey", "authDomain", "projectId"];
      for (const field of requiredFields) {
        if (!firebaseConfig[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Clean up any existing Firebase apps
      const existingApps = getApps();
      for (const app of existingApps) {
        await deleteApp(app);
      }

      // Initialize Firebase as the default app
      const app = initializeApp(firebaseConfig);

      // Test basic connectivity (optional - can be removed if causing issues)
      console.log("Firebase initialized successfully:", app.name);

      // If successful, use the config
      onConfigSubmit(firebaseConfig);
    } catch (err: any) {
      setError(err.message || "Failed to initialize Firebase");
    } finally {
      setLoading(false);
    }
  };

  const handleJsonChange = (value: string) => {
    setJsonInput(value);
    try {
      if (value.trim()) {
        const parsed = JSON.parse(value);
        setConfig(parsed);
      }
    } catch {
      // Invalid JSON, ignore
    }
  };

  const exampleConfig = {
    apiKey: "AIzaSyC...",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456",
  };

  return (
    <div className="max-width-2xl mx-auto">
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Firebase Configuration
          </h2>
          <p className="text-gray-600">
            Enter your Firebase configuration to start testing the playground
            features. Don't worry, your config is only stored locally and never
            sent to any server.
          </p>
        </div>

        <div className="mb-4">
          <div className="flex space-x-2 mb-4">
            <button
              type="button"
              onClick={() => setInputMode("json")}
              className={`px-3 py-2 rounded text-sm font-medium ${
                inputMode === "json"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              JSON Input
            </button>
            <button
              type="button"
              onClick={() => setInputMode("form")}
              className={`px-3 py-2 rounded text-sm font-medium ${
                inputMode === "form"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Form Input
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <AlertCircle className="h-4 w-4 mr-2 inline" />
            {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit}>
          {inputMode === "json" ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Firebase Configuration (JSON)
              </label>
              <textarea
                value={jsonInput}
                onChange={(e) => handleJsonChange(e.target.value)}
                className="input textarea"
                rows={12}
                placeholder={JSON.stringify(exampleConfig, null, 2)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste your Firebase config object from the Firebase Console
              </p>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={config.apiKey}
                    onChange={(e) =>
                      setConfig({ ...config, apiKey: e.target.value })
                    }
                    className="input pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showApiKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auth Domain
                </label>
                <input
                  type="text"
                  value={config.authDomain}
                  onChange={(e) =>
                    setConfig({ ...config, authDomain: e.target.value })
                  }
                  className="input"
                  placeholder="your-project.firebaseapp.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Database URL
                </label>
                <input
                  type="url"
                  value={config.databaseURL}
                  onChange={(e) =>
                    setConfig({ ...config, databaseURL: e.target.value })
                  }
                  className="input"
                  placeholder="https://your-project-default-rtdb.firebaseio.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project ID
                </label>
                <input
                  type="text"
                  value={config.projectId}
                  onChange={(e) =>
                    setConfig({ ...config, projectId: e.target.value })
                  }
                  className="input"
                  placeholder="your-project-id"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Storage Bucket
                </label>
                <input
                  type="text"
                  value={config.storageBucket}
                  onChange={(e) =>
                    setConfig({ ...config, storageBucket: e.target.value })
                  }
                  className="input"
                  placeholder="your-project.appspot.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Messaging Sender ID
                </label>
                <input
                  type="text"
                  value={config.messagingSenderId}
                  onChange={(e) =>
                    setConfig({ ...config, messagingSenderId: e.target.value })
                  }
                  className="input"
                  placeholder="123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  App ID
                </label>
                <input
                  type="text"
                  value={config.appId}
                  onChange={(e) =>
                    setConfig({ ...config, appId: e.target.value })
                  }
                  className="input"
                  placeholder="1:123456789:web:abcdef123456"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <>
                <div className="loading-spinner mr-2" />
                Initializing Firebase...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Initialize Firebase & Start Playground
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Where to find your Firebase config:
          </h3>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Go to the Firebase Console</li>
            <li>Select your project</li>
            <li>Click on Project Settings (gear icon)</li>
            <li>Scroll down to "Your apps" section</li>
            <li>Copy the config object from your web app</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default FirebaseConfigForm;
