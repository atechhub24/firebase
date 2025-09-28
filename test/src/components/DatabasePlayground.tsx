import { useState, useEffect, useRef } from "react";
import { mutate, listen } from "@atechhub/firebase";
import { getApps } from "firebase/app";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Play,
  AlertCircle,
  CheckCircle,
  Database,
  Code,
} from "lucide-react";
import CodeBlock from "./CodeBlock";

type DatabaseAction =
  | "create"
  | "update"
  | "delete"
  | "createWithId"
  | "get"
  | "listen";

const DatabasePlayground: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<DatabaseAction>("get");
  const [path, setPath] = useState("playground/test");
  const [data, setData] = useState(
    '{\n  "message": "Hello World",\n  "timestamp": "2024-01-15T10:30:00.000Z"\n}'
  );
  const [actionBy, setActionBy] = useState("playground-user");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const actions = [
    {
      id: "get" as DatabaseAction,
      name: "Get Data",
      icon: Eye,
      description: "Retrieve data from a path",
      needsData: false,
      color: "blue",
    },
    {
      id: "create" as DatabaseAction,
      name: "Create Data",
      icon: Plus,
      description: "Create new data at a path",
      needsData: true,
      color: "green",
    },
    {
      id: "createWithId" as DatabaseAction,
      name: "Create with ID",
      icon: Plus,
      description: "Create data with auto-generated ID",
      needsData: true,
      color: "green",
    },
    {
      id: "update" as DatabaseAction,
      name: "Update Data",
      icon: Edit,
      description: "Update existing data",
      needsData: true,
      color: "yellow",
    },
    {
      id: "delete" as DatabaseAction,
      name: "Delete Data",
      icon: Trash2,
      description: "Delete data at a path",
      needsData: false,
      color: "red",
    },
    {
      id: "listen" as DatabaseAction,
      name: "Listen",
      icon: RefreshCw,
      description: "Basic real-time listening with callbacks",
      needsData: false,
      color: "purple",
    },
  ];

  // Cleanup listeners on component unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const executeAction = async () => {
    setError("");
    setResult(null);
    setLoading(true);

    try {
      // Check if Firebase is initialized
      const apps = getApps();
      if (apps.length === 0) {
        throw new Error(
          "Firebase not initialized. Please check your configuration and try again."
        );
      }

      // Handle real-time listening separately
      if (selectedAction === "listen") {
        if (isListening) {
          // Stop listening
          if (unsubscribeRef.current) {
            unsubscribeRef.current();
            unsubscribeRef.current = null;
          }
          setIsListening(false);
          setResult("Stopped listening to real-time changes");
        } else {
          // Start listening
          const unsubscribe = listen({
            path,
            onData: (data: any) => {
              setResult(
                `Real-time data updated: ${JSON.stringify(data, null, 2)}`
              );
            },
            onError: (error: Error) => {
              setError(`Real-time listener error: ${error.message}`);
              setIsListening(false);
            },
          });

          unsubscribeRef.current = unsubscribe;
          setIsListening(true);
          setResult("Started listening for real-time changes...");
        }
        setLoading(false);
        return;
      }

      let parsedData = {};

      if (actions.find((a) => a.id === selectedAction)?.needsData) {
        try {
          parsedData = JSON.parse(data);
        } catch {
          throw new Error("Invalid JSON data. Please check your JSON syntax.");
        }
      }

      const mutateOptions: any = {
        path,
        action: selectedAction,
        actionBy,
      };

      if (actions.find((a) => a.id === selectedAction)?.needsData) {
        mutateOptions.data = parsedData;
      }

      const response = await mutate(mutateOptions);
      setResult(response);
    } catch (err: any) {
      console.error("Database operation error:", err);

      // Provide more helpful error messages
      let errorMessage = err.message || "Operation failed";

      if (err.message?.includes("Firebase not initialized")) {
        errorMessage =
          "Firebase not initialized. Please refresh the page and re-enter your configuration.";
      } else if (err.message?.includes("permission-denied")) {
        errorMessage =
          "Permission denied. Please check your Firebase Security Rules.";
      } else if (err.message?.includes("network")) {
        errorMessage = "Network error. Please check your internet connection.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const generateCodeExample = () => {
    const actionConfig = actions.find((a) => a.id === selectedAction);

    if (selectedAction === "listen") {
      return `import { listen } from '@atechhub/firebase';

// Start listening for real-time changes
const unsubscribe = listen({
  path: '${path}',
  onData: (data) => {
    console.log('Real-time data:', data);
    // Handle real-time updates here
  },
  onError: (error) => {
    console.error('Listen error:', error);
  }
});

// Stop listening when done
// unsubscribe();`;
    }

    let codeExample = `import { mutate } from '@atechhub/firebase';\n\n`;

    if (actionConfig?.needsData) {
      codeExample += `const data = ${data};\n\n`;
    }

    codeExample += `const result = await mutate({\n`;
    codeExample += `  path: '${path}',\n`;
    codeExample += `  action: '${selectedAction}',\n`;

    if (actionConfig?.needsData) {
      codeExample += `  data: data,\n`;
    }

    codeExample += `  actionBy: '${actionBy}'\n`;
    codeExample += `});\n\n`;
    codeExample += `console.log('Result:', result);`;

    return codeExample;
  };

  return (
    <div className="database-playground-container">
      {/* Enhanced Action Selection */}
      <div className="database-operations-card">
        <div className="database-operations-header">
          <Database className="database-operations-icon" />
          <h3 className="database-operations-title">Database Operations</h3>
        </div>

        <div className="database-operations-grid">
          {actions.map((action) => {
            const Icon = action.icon;
            const isSelected = selectedAction === action.id;

            return (
              <button
                key={action.id}
                onClick={() => setSelectedAction(action.id)}
                className={`database-operation-button database-operation-button-${
                  action.color
                } ${isSelected ? "selected" : ""}`}
              >
                <div className="database-operation-button-content">
                  <Icon className="database-operation-icon" />
                  <span className="database-operation-name">{action.name}</span>
                </div>
                <p className="database-operation-description">
                  {action.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Enhanced Configuration and Code/Results */}
      <div className="database-config-results-grid">
        <div className="database-config-card">
          <h4 className="database-config-title">Configuration & Execute</h4>

          <div className="database-config-fields">
            <div className="database-config-field">
              <label className="database-config-label">Database Path</label>
              <input
                type="text"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                className="database-config-input"
                placeholder="e.g., users/123 or posts"
              />
              <p className="database-config-hint">
                Firebase Realtime Database path
              </p>
            </div>

            <div className="database-config-field">
              <label className="database-config-label">
                Action By (User ID)
              </label>
              <input
                type="text"
                value={actionBy}
                onChange={(e) => setActionBy(e.target.value)}
                className="database-config-input"
                placeholder="user-123"
              />
            </div>

            {actions.find((a) => a.id === selectedAction)?.needsData && (
              <div className="database-config-field">
                <label className="database-config-label">Data (JSON)</label>
                <textarea
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="database-config-input database-config-textarea"
                  rows={6}
                  placeholder='{"key": "value"}'
                />
                <p className="database-config-hint">
                  Valid JSON object to send
                </p>
              </div>
            )}
          </div>

          {/* Execute Button moved to Configuration section */}
          <div className="database-config-execute">
            <button
              onClick={executeAction}
              disabled={loading}
              className={`database-execute-button ${
                selectedAction === "delete"
                  ? "database-execute-button-danger"
                  : ""
              }`}
            >
              {loading ? (
                <>
                  <div className="database-loading-spinner" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="database-execute-icon" />
                  {selectedAction === "listen"
                    ? isListening
                      ? "Stop Listening"
                      : "Start Listening"
                    : `Execute ${
                        actions.find((a) => a.id === selectedAction)?.name
                      }`}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="database-results-card">
          <div className="database-results-header">
            <h4 className="database-results-title">Code & Output</h4>
            <button
              onClick={() => setShowCode(!showCode)}
              className="database-code-toggle"
            >
              <Code className="database-code-toggle-icon" />
              {showCode ? "Hide" : "Show"} Code
            </button>
          </div>

          {/* Code Section */}
          {showCode && (
            <div className="database-code-section">
              <CodeBlock
                code={generateCodeExample()}
                language="javascript"
                title="Generated Code"
              />
            </div>
          )}

          {/* Results Section */}
          <div className="database-output-section">
            {error && (
              <div className="database-alert database-alert-error">
                <AlertCircle className="database-alert-icon" />
                <div className="database-alert-content">{error}</div>
              </div>
            )}

            {result !== null && (
              <div className="database-alert database-alert-success">
                <CheckCircle className="database-alert-icon" />
                <div className="database-alert-content">
                  Operation completed successfully
                  <div className="database-result-container">
                    <div className="database-result-wrapper">
                      <div className="database-result-header">
                        <h5 className="database-result-title">Output:</h5>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(
                              typeof result === "string"
                                ? result
                                : JSON.stringify(result, null, 2)
                            )
                          }
                          className="database-result-copy"
                          title="Copy result"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="database-result-content">
                        <pre className="database-result-pre">
                          {typeof result === "string"
                            ? result || "(empty string)"
                            : result === null
                            ? "null"
                            : result === undefined
                            ? "undefined"
                            : JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Quick Examples */}
      <div className="database-examples-card">
        <h4 className="database-examples-title">Quick Examples</h4>

        <div className="database-examples-grid">
          <button
            onClick={() => {
              setSelectedAction("create");
              setPath("playground/users/user1");
              setData(
                '{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "age": 30\n}'
              );
            }}
            className="database-example-button database-example-button-green"
          >
            <div className="database-example-title database-example-title-green">
              Create User
            </div>
            <div className="database-example-description database-example-description-green">
              Create a user record with profile data
            </div>
          </button>

          <button
            onClick={() => {
              setSelectedAction("createWithId");
              setPath("playground/posts");
              setData(
                '{\n  "title": "My First Post",\n  "content": "Hello World!",\n  "published": true\n}'
              );
            }}
            className="database-example-button database-example-button-blue"
          >
            <div className="database-example-title database-example-title-blue">
              Create Post
            </div>
            <div className="database-example-description database-example-description-blue">
              Create a post with auto-generated ID
            </div>
          </button>

          <button
            onClick={() => {
              setSelectedAction("get");
              setPath("playground/users");
            }}
            className="database-example-button database-example-button-purple"
          >
            <div className="database-example-title database-example-title-purple">
              Get All Users
            </div>
            <div className="database-example-description database-example-description-purple">
              Retrieve all user records
            </div>
          </button>

          <button
            onClick={() => {
              setSelectedAction("update");
              setPath("playground/users/user1");
              setData(
                '{\n  "lastLogin": "2024-01-15T10:30:00.000Z",\n  "isActive": true\n}'
              );
            }}
            className="database-example-button database-example-button-yellow"
          >
            <div className="database-example-title database-example-title-yellow">
              Update User
            </div>
            <div className="database-example-description database-example-description-yellow">
              Update user login status
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatabasePlayground;
