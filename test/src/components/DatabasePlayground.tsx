import { useState } from "react";
import { mutate } from "@atechhub/firebase";
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
  | "onValue";

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
      id: "onValue" as DatabaseAction,
      name: "Listen",
      icon: RefreshCw,
      description: "Listen for real-time changes",
      needsData: false,
      color: "purple",
    },
  ];

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

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      green: "bg-green-100 text-green-800 border-green-200",
      yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
      red: "bg-red-100 text-red-800 border-red-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Action Selection */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Database Operations
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {actions.map((action) => {
            const Icon = action.icon;
            const isSelected = selectedAction === action.id;

            return (
              <button
                key={action.id}
                onClick={() => setSelectedAction(action.id)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? getColorClasses(action.color)
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Icon className="h-4 w-4" />
                  <span className="font-medium text-sm">{action.name}</span>
                </div>
                <p className="text-xs opacity-75">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h4 className="font-semibold text-gray-900 mb-4">Configuration</h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Database Path
              </label>
              <input
                type="text"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                className="input"
                placeholder="e.g., users/123 or posts"
              />
              <p className="text-xs text-gray-500 mt-1">
                Firebase Realtime Database path
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Action By (User ID)
              </label>
              <input
                type="text"
                value={actionBy}
                onChange={(e) => setActionBy(e.target.value)}
                className="input"
                placeholder="user-123"
              />
            </div>

            {actions.find((a) => a.id === selectedAction)?.needsData && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data (JSON)
                </label>
                <textarea
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="input textarea"
                  rows={6}
                  placeholder='{"key": "value"}'
                />
                <p className="text-xs text-gray-500 mt-1">
                  Valid JSON object to send
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Execute & Results</h4>
            <button
              onClick={() => setShowCode(!showCode)}
              className="btn btn-secondary text-xs"
            >
              <Code className="h-3 w-3 mr-1" />
              {showCode ? "Hide" : "Show"} Code
            </button>
          </div>

          <button
            onClick={executeAction}
            disabled={loading}
            className={`btn w-full mb-4 ${
              selectedAction === "delete" ? "btn-danger" : "btn-primary"
            }`}
          >
            {loading ? (
              <>
                <div className="loading-spinner mr-2" />
                Executing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Execute {actions.find((a) => a.id === selectedAction)?.name}
              </>
            )}
          </button>

          {showCode && (
            <div className="mb-4">
              <CodeBlock
                code={generateCodeExample()}
                language="javascript"
                title="Generated Code"
              />
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <AlertCircle className="h-4 w-4 mr-2 inline" />
              {error}
            </div>
          )}

          {result !== null && (
            <div className="alert alert-success">
              <CheckCircle className="h-4 w-4 mr-2 inline" />
              Operation completed successfully
              <div className="mt-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-semibold text-gray-700">
                      Result:
                    </h5>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          typeof result === "string"
                            ? result
                            : JSON.stringify(result, null, 2)
                        )
                      }
                      className="text-xs text-blue-600 hover:text-blue-800"
                      title="Copy result"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="bg-white border rounded p-3 max-h-64 overflow-y-auto">
                    <pre className="text-sm text-gray-900 whitespace-pre-wrap break-words">
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
          )}
        </div>
      </div>

      {/* Quick Examples */}
      <div className="card">
        <h4 className="font-semibold text-gray-900 mb-4">Quick Examples</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              setSelectedAction("create");
              setPath("playground/users/user1");
              setData(
                '{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "age": 30\n}'
              );
            }}
            className="p-3 bg-green-50 border border-green-200 rounded-lg text-left hover:bg-green-100 transition-colors"
          >
            <div className="font-medium text-green-800 mb-1">Create User</div>
            <div className="text-sm text-green-600">
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
            className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-left hover:bg-blue-100 transition-colors"
          >
            <div className="font-medium text-blue-800 mb-1">Create Post</div>
            <div className="text-sm text-blue-600">
              Create a post with auto-generated ID
            </div>
          </button>

          <button
            onClick={() => {
              setSelectedAction("get");
              setPath("playground/users");
            }}
            className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-left hover:bg-purple-100 transition-colors"
          >
            <div className="font-medium text-purple-800 mb-1">
              Get All Users
            </div>
            <div className="text-sm text-purple-600">
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
            className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-left hover:bg-yellow-100 transition-colors"
          >
            <div className="font-medium text-yellow-800 mb-1">Update User</div>
            <div className="text-sm text-yellow-600">
              Update user login status
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatabasePlayground;
