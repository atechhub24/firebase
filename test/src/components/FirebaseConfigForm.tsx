import { useState } from "react";
import { initializeApp, getApps, deleteApp } from "firebase/app";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Settings,
  Zap,
  Database,
  Shield,
  Cloud,
  Key,
  Globe,
  MessageSquare,
  Smartphone,
} from "lucide-react";

// Custom styles for enhanced animations and modern design
const configStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
  
  .animate-slideIn {
    animation: slideIn 0.2s ease-out;
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .animate-shimmer {
    animation: shimmer 2s linear infinite;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200px 100%;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .config-input-focus {
    transition: all 0.3s ease;
  }
  
  .config-input-focus:focus {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.15);
  }

  .config-tab-button {
    position: relative;
    overflow: hidden;
  }
  
  .config-tab-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  .config-tab-button:hover::before {
    left: 100%;
  }

  .gradient-border {
    background: linear-gradient(white, white) padding-box,
                linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4) border-box;
    border: 2px solid transparent;
  }

  .glass-effect {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.9);
  }
`;

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
    <div className="firebase-config-container">
      {/* Inject custom styles */}
      <style dangerouslySetInnerHTML={{ __html: configStyles }} />

      <div className="firebase-config-wrapper">
        {/* Enhanced Header Section */}
        <div className="firebase-config-header">
          <div className="firebase-config-header-content">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg"
              alt="Firebase"
              className="firebase-config-header-icon"
            />
            <div className="firebase-config-header-text">
              <h1 className="firebase-config-title">Firebase Configuration</h1>
              <p className="firebase-config-description">
                Enter your Firebase configuration to unlock the full potential
                of our playground features. Your config is stored locally and
                never transmitted to external servers.
              </p>
            </div>
          </div>
        </div>

        {/* Main Configuration Card */}
        <div className="firebase-config-card">
          {/* Enhanced Tab Navigation */}
          <div className="firebase-config-tabs-container">
            <nav className="firebase-config-tabs-nav">
              <button
                type="button"
                onClick={() => setInputMode("json")}
                className={`firebase-config-tab ${
                  inputMode === "json" ? "firebase-config-tab-active" : ""
                }`}
              >
                <div className="firebase-config-tab-content">
                  <Zap className="firebase-config-tab-icon" />
                  <span>JSON Input</span>
                  <div className="firebase-config-tab-badge">Recommended</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setInputMode("form")}
                className={`firebase-config-tab ${
                  inputMode === "form" ? "firebase-config-tab-active" : ""
                }`}
              >
                <div className="firebase-config-tab-content">
                  <Settings className="firebase-config-tab-icon" />
                  <span>Form Input</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Enhanced Error Display */}
          {error && (
            <div className="firebase-config-error-wrapper">
              <div className="firebase-config-error">
                <div className="firebase-config-error-content">
                  <div className="firebase-config-error-icon-wrapper">
                    <AlertCircle className="firebase-config-error-icon" />
                  </div>
                  <div className="firebase-config-error-text">
                    <h4 className="firebase-config-error-title">
                      Configuration Error
                    </h4>
                    <p className="firebase-config-error-message">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="firebase-config-form">
            {inputMode === "json" ? (
              <div className="firebase-config-json-section">
                <div className="firebase-config-field">
                  <label className="firebase-config-label">
                    Firebase Configuration (JSON/JavaScript Object)
                  </label>
                  <div className="firebase-config-textarea-wrapper">
                    <textarea
                      value={jsonInput}
                      onChange={(e) => handleJsonChange(e.target.value)}
                      className="firebase-config-textarea"
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
                  <p className="firebase-config-field-hint">
                    <Shield className="firebase-config-hint-icon" />
                    <span>
                      Paste your Firebase config from the Firebase Console
                      (supports both JSON and JavaScript object formats)
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="firebase-config-form-section">
                <div className="firebase-config-fields-grid">
                  {/* API Key Field */}
                  <div className="firebase-config-field-full">
                    <label className="firebase-config-field-label">
                      <Key className="firebase-config-field-icon firebase-config-field-icon-blue" />
                      <span>API Key</span>
                      <span className="firebase-config-field-required">*</span>
                    </label>
                    <div className="firebase-config-input-wrapper">
                      <input
                        type={showApiKey ? "text" : "password"}
                        value={config.apiKey}
                        onChange={(e) =>
                          setConfig({ ...config, apiKey: e.target.value })
                        }
                        className="firebase-config-input firebase-config-input-with-button"
                        placeholder="AIzaSyC..."
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="firebase-config-input-button"
                      >
                        {showApiKey ? (
                          <EyeOff className="firebase-config-input-button-icon" />
                        ) : (
                          <Eye className="firebase-config-input-button-icon" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Auth Domain Field */}
                  <div>
                    <label className="firebase-config-field-label">
                      <Globe className="firebase-config-field-icon firebase-config-field-icon-green" />
                      <span>Auth Domain</span>
                      <span className="firebase-config-field-required">*</span>
                    </label>
                    <input
                      type="text"
                      value={config.authDomain}
                      onChange={(e) =>
                        setConfig({ ...config, authDomain: e.target.value })
                      }
                      className="firebase-config-input"
                      placeholder="your-project.firebaseapp.com"
                      required
                    />
                  </div>

                  {/* Database URL Field */}
                  <div>
                    <label className="firebase-config-field-label">
                      <Database className="firebase-config-field-icon firebase-config-field-icon-purple" />
                      <span>Database URL</span>
                    </label>
                    <input
                      type="url"
                      value={config.databaseURL}
                      onChange={(e) =>
                        setConfig({ ...config, databaseURL: e.target.value })
                      }
                      className="firebase-config-input"
                      placeholder="https://your-project-default-rtdb.firebaseio.com"
                    />
                  </div>

                  {/* Project ID Field */}
                  <div>
                    <label className="firebase-config-field-label">
                      <Settings className="firebase-config-field-icon firebase-config-field-icon-orange" />
                      <span>Project ID</span>
                      <span className="firebase-config-field-required">*</span>
                    </label>
                    <input
                      type="text"
                      value={config.projectId}
                      onChange={(e) =>
                        setConfig({ ...config, projectId: e.target.value })
                      }
                      className="firebase-config-input"
                      placeholder="your-project-id"
                      required
                    />
                  </div>

                  {/* Storage Bucket Field */}
                  <div>
                    <label className="firebase-config-field-label">
                      <Cloud className="firebase-config-field-icon firebase-config-field-icon-cyan" />
                      <span>Storage Bucket</span>
                    </label>
                    <input
                      type="text"
                      value={config.storageBucket}
                      onChange={(e) =>
                        setConfig({ ...config, storageBucket: e.target.value })
                      }
                      className="firebase-config-input"
                      placeholder="your-project.appspot.com"
                    />
                  </div>

                  {/* Messaging Sender ID Field */}
                  <div>
                    <label className="firebase-config-field-label">
                      <MessageSquare className="firebase-config-field-icon firebase-config-field-icon-indigo" />
                      <span>Messaging Sender ID</span>
                    </label>
                    <input
                      type="text"
                      value={config.messagingSenderId}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          messagingSenderId: e.target.value,
                        })
                      }
                      className="firebase-config-input"
                      placeholder="123456789"
                    />
                  </div>

                  {/* App ID Field */}
                  <div>
                    <label className="firebase-config-field-label">
                      <Smartphone className="firebase-config-field-icon firebase-config-field-icon-pink" />
                      <span>App ID</span>
                    </label>
                    <input
                      type="text"
                      value={config.appId}
                      onChange={(e) =>
                        setConfig({ ...config, appId: e.target.value })
                      }
                      className="firebase-config-input"
                      placeholder="1:123456789:web:abcdef123456"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Submit Button */}
            <div className="firebase-config-submit-section">
              <button
                type="submit"
                disabled={loading}
                className={`firebase-config-submit ${
                  loading ? "firebase-config-submit-loading" : ""
                }`}
              >
                <div className="firebase-config-submit-content">
                  {loading ? (
                    <>
                      <div className="firebase-config-submit-spinner" />
                      <span>Initializing Firebase...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="firebase-config-submit-icon" />
                      <span>Initialize Firebase & Start Playground</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>
        </div>

        {/* Enhanced Help Section */}
        <div className="firebase-config-help">
          <div className="firebase-config-help-wrapper">
            <h3 className="firebase-config-help-title">
              🔍 Where to find your Firebase config
            </h3>
            <div className="firebase-config-help-grid">
              {[
                { step: 1, text: "Go to Firebase Console", icon: Globe },
                { step: 2, text: "Select your project", icon: Settings },
                { step: 3, text: "Click Project Settings", icon: Settings },
                { step: 4, text: "Find 'Your apps' section", icon: Smartphone },
                { step: 5, text: "Copy the config object", icon: CheckCircle },
              ].map(({ step, text, icon: Icon }) => (
                <div key={step} className="firebase-config-help-step">
                  <div className="firebase-config-help-step-icon-wrapper">
                    <Icon className="firebase-config-help-step-icon" />
                  </div>
                  <div className="firebase-config-help-step-number">
                    Step {step}
                  </div>
                  <div className="firebase-config-help-step-text">{text}</div>
                </div>
              ))}
            </div>
            <div className="firebase-config-help-footer">
              <p>
                Need help? Check the{" "}
                <a
                  href="https://firebase.google.com/docs/web/setup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="firebase-config-help-link"
                >
                  Firebase documentation
                </a>{" "}
                for detailed setup instructions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseConfigForm;
