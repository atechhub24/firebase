import { useState } from "react";
import { initializeApp, getApps, deleteApp } from "firebase/app";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Settings,
  Zap,
} from "lucide-react";

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
          // First try standard JSON parsing
          firebaseConfig = JSON.parse(jsonInput);
        } catch {
          try {
            // If JSON parsing fails, try JavaScript object parsing
            firebaseConfig = parseJavaScriptObject(jsonInput);
          } catch {
            throw new Error("Invalid JSON or JavaScript object format");
          }
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

  const parseJavaScriptObject = (input: string): any => {
    // Clean up the input to handle JavaScript object syntax
    let cleanInput = input.trim();

    // Remove 'const firebaseConfig = ' or similar variable declarations
    cleanInput = cleanInput.replace(/^(const|let|var)\s+\w+\s*=\s*/, "");

    // Remove trailing semicolon
    cleanInput = cleanInput.replace(/;?\s*$/, "");

    // Handle unquoted property names (JavaScript style)
    cleanInput = cleanInput.replace(
      /([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g,
      '$1"$2":'
    );

    // Handle single quotes to double quotes
    cleanInput = cleanInput.replace(/'/g, '"');

    // Try to parse as JSON
    return JSON.parse(cleanInput);
  };

  const handleJsonChange = (value: string) => {
    setJsonInput(value);
    try {
      if (value.trim()) {
        let parsed;
        try {
          // First try standard JSON parsing
          parsed = JSON.parse(value);
        } catch {
          // If JSON parsing fails, try JavaScript object parsing
          parsed = parseJavaScriptObject(value);
        }
        setConfig(parsed);
      }
    } catch {
      // Invalid format, ignore
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
    <div className="config-form-container">
      <div className="config-form-card">
        {/* Enhanced Header */}
        <div className="config-form-header">
          <div className="config-form-header-content">
            <div className="config-form-icon-wrapper">
              <Settings className="config-form-main-icon" />
            </div>
            <div className="config-form-title-section">
              <h2 className="config-form-title">Firebase Configuration</h2>
              <p className="config-form-subtitle">
                Enter your Firebase configuration to start testing the
                playground features. Your config is stored locally and never
                sent to any server.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Input Mode Selector */}
        <div className="config-form-mode-selector">
          <div className="config-form-tabs">
            <button
              type="button"
              onClick={() => setInputMode("json")}
              className={`config-form-tab ${
                inputMode === "json" ? "config-form-tab-active" : ""
              }`}
            >
              <Zap className="config-form-tab-icon" />
              <span>JSON Input</span>
            </button>
            <button
              type="button"
              onClick={() => setInputMode("form")}
              className={`config-form-tab ${
                inputMode === "form" ? "config-form-tab-active" : ""
              }`}
            >
              <Settings className="config-form-tab-icon" />
              <span>Form Input</span>
            </button>
          </div>
        </div>

        {/* Enhanced Error Display */}
        {error && (
          <div className="config-form-error">
            <div className="config-form-error-content">
              <AlertCircle className="config-form-error-icon" />
              <div className="config-form-error-text">
                <h4 className="config-form-error-title">Configuration Error</h4>
                <p className="config-form-error-message">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="config-form-form">
          {inputMode === "json" ? (
            <div className="config-form-json-section">
              <div className="config-form-field">
                <label className="config-form-label">
                  Firebase Configuration (JSON/JavaScript Object)
                </label>
                <div className="config-form-textarea-wrapper">
                  <textarea
                    value={jsonInput}
                    onChange={(e) => handleJsonChange(e.target.value)}
                    className="config-form-textarea"
                    rows={12}
                    placeholder={`// Supports both formats:

// JSON format:
${JSON.stringify(exampleConfig, null, 2)}

// JavaScript object format:
const firebaseConfig = {
  apiKey: 'AIzaSyC...',
  authDomain: 'your-project.firebaseapp.com',
  databaseURL: 'https://your-project-default-rtdb.firebaseio.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef123456'
};`}
                    required
                  />
                </div>
                <p className="config-form-field-hint">
                  Paste your Firebase config from the Firebase Console (supports
                  both JSON and JavaScript object formats)
                </p>
              </div>
            </div>
          ) : (
            <div className="config-form-fields-section">
              <div className="config-form-field">
                <label className="config-form-label">API Key</label>
                <div className="config-form-input-wrapper">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={config.apiKey}
                    onChange={(e) =>
                      setConfig({ ...config, apiKey: e.target.value })
                    }
                    className="config-form-input config-form-input-with-button"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="config-form-input-button"
                  >
                    {showApiKey ? (
                      <EyeOff className="config-form-input-button-icon" />
                    ) : (
                      <Eye className="config-form-input-button-icon" />
                    )}
                  </button>
                </div>
              </div>

              <div className="config-form-field">
                <label className="config-form-label">Auth Domain</label>
                <input
                  type="text"
                  value={config.authDomain}
                  onChange={(e) =>
                    setConfig({ ...config, authDomain: e.target.value })
                  }
                  className="config-form-input"
                  placeholder="your-project.firebaseapp.com"
                  required
                />
              </div>

              <div className="config-form-field">
                <label className="config-form-label">Database URL</label>
                <input
                  type="url"
                  value={config.databaseURL}
                  onChange={(e) =>
                    setConfig({ ...config, databaseURL: e.target.value })
                  }
                  className="config-form-input"
                  placeholder="https://your-project-default-rtdb.firebaseio.com"
                />
              </div>

              <div className="config-form-field">
                <label className="config-form-label">Project ID</label>
                <input
                  type="text"
                  value={config.projectId}
                  onChange={(e) =>
                    setConfig({ ...config, projectId: e.target.value })
                  }
                  className="config-form-input"
                  placeholder="your-project-id"
                  required
                />
              </div>

              <div className="config-form-field">
                <label className="config-form-label">Storage Bucket</label>
                <input
                  type="text"
                  value={config.storageBucket}
                  onChange={(e) =>
                    setConfig({ ...config, storageBucket: e.target.value })
                  }
                  className="config-form-input"
                  placeholder="your-project.appspot.com"
                />
              </div>

              <div className="config-form-field">
                <label className="config-form-label">Messaging Sender ID</label>
                <input
                  type="text"
                  value={config.messagingSenderId}
                  onChange={(e) =>
                    setConfig({ ...config, messagingSenderId: e.target.value })
                  }
                  className="config-form-input"
                  placeholder="123456789"
                />
              </div>

              <div className="config-form-field">
                <label className="config-form-label">App ID</label>
                <input
                  type="text"
                  value={config.appId}
                  onChange={(e) =>
                    setConfig({ ...config, appId: e.target.value })
                  }
                  className="config-form-input"
                  placeholder="1:123456789:web:abcdef123456"
                />
              </div>
            </div>
          )}

          {/* Enhanced Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`config-form-submit ${
              loading ? "config-form-submit-loading" : ""
            }`}
          >
            <div className="config-form-submit-content">
              {loading ? (
                <>
                  <div className="config-form-submit-spinner" />
                  <span>Initializing Firebase...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="config-form-submit-icon" />
                  <span>Initialize Firebase & Start Playground</span>
                </>
              )}
            </div>
          </button>
        </form>

        {/* Enhanced Help Section */}
        <div className="config-form-help">
          <div className="config-form-help-content">
            <h3 className="config-form-help-title">
              Where to find your Firebase config:
            </h3>
            <ol className="config-form-help-list">
              <li>Go to the Firebase Console</li>
              <li>Select your project</li>
              <li>Click on Project Settings (gear icon)</li>
              <li>Scroll down to "Your apps" section</li>
              <li>Copy the config object from your web app</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseConfigForm;
