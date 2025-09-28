import React, { useState } from "react";
import { removeUndefinedFields, generateSystemInfo } from "@atechhub/firebase";
import { Code, Play, RefreshCw, Settings, User } from "lucide-react";
import CodeBlock from "./CodeBlock";

type UtilityAction = "removeUndefined" | "generateSystemInfo";

const UtilityPlayground: React.FC = () => {
  const [selectedAction, setSelectedAction] =
    useState<UtilityAction>("removeUndefined");
  const [inputData, setInputData] = useState(`{
  "name": "John Doe",
  "email": "john@example.com",
  "age": undefined,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": undefined,
    "country": "USA"
  },
  "hobbies": ["reading", undefined, "swimming"],
  "metadata": undefined
}`);
  const [actionBy, setActionBy] = useState("playground-user");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const actions = [
    {
      id: "removeUndefined" as UtilityAction,
      name: "Remove Undefined Fields",
      icon: RefreshCw,
      description: "Clean objects by removing undefined fields recursively",
      color: "blue",
    },
    {
      id: "generateSystemInfo" as UtilityAction,
      name: "Generate System Info",
      icon: Settings,
      description: "Generate system information for tracking operations",
      color: "green",
    },
  ];

  const executeRemoveUndefined = () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Parse the input data
      const parsedData = eval(`(${inputData})`);

      // Apply removeUndefinedFields
      const cleanedData = removeUndefinedFields(parsedData);

      setResult({
        original: parsedData,
        cleaned: cleanedData,
        removedFields: findRemovedFields(parsedData, cleanedData),
      });
    } catch (err: any) {
      setError(err.message || "Failed to process data");
    } finally {
      setLoading(false);
    }
  };

  const executeGenerateSystemInfo = () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const systemInfo = generateSystemInfo(actionBy);
      setResult(systemInfo);
    } catch (err: any) {
      setError(err.message || "Failed to generate system info");
    } finally {
      setLoading(false);
    }
  };

  const findRemovedFields = (
    original: any,
    cleaned: any,
    path = ""
  ): string[] => {
    const removed: string[] = [];

    if (Array.isArray(original)) {
      original.forEach((item, index) => {
        if (item === undefined) {
          removed.push(`${path}[${index}]`);
        } else if (typeof item === "object" && item !== null) {
          const cleanedItem = cleaned[index];
          if (cleanedItem) {
            removed.push(
              ...findRemovedFields(item, cleanedItem, `${path}[${index}]`)
            );
          }
        }
      });
    } else if (original && typeof original === "object") {
      Object.entries(original).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        if (value === undefined) {
          removed.push(currentPath);
        } else if (
          typeof value === "object" &&
          value !== null &&
          cleaned[key]
        ) {
          removed.push(...findRemovedFields(value, cleaned[key], currentPath));
        }
      });
    }

    return removed;
  };

  const executeAction = () => {
    switch (selectedAction) {
      case "removeUndefined":
        executeRemoveUndefined();
        break;
      case "generateSystemInfo":
        executeGenerateSystemInfo();
        break;
    }
  };

  const getCodeExample = () => {
    switch (selectedAction) {
      case "removeUndefined":
        return `import { removeUndefinedFields } from '@atechhub/firebase';

const dataWithUndefined = ${inputData};

const cleanedData = removeUndefinedFields(dataWithUndefined);
console.log('Cleaned data:', cleanedData);`;

      case "generateSystemInfo":
        return `import { generateSystemInfo } from '@atechhub/firebase';

const systemInfo = generateSystemInfo('${actionBy}');
console.log('System info:', systemInfo);`;

      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => setSelectedAction(action.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                selectedAction === action.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    action.color === "blue"
                      ? "bg-blue-100 text-blue-600"
                      : action.color === "green"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{action.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Code className="w-5 h-5 mr-2 text-blue-600" />
          {selectedAction === "removeUndefined"
            ? "Input Data"
            : "Configuration"}
        </h3>

        {selectedAction === "removeUndefined" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Object with undefined fields (JavaScript object syntax)
              </label>
              <textarea
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter JavaScript object with undefined fields..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Use JavaScript object syntax. undefined values will be removed.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Action By (User Identifier)
              </label>
              <input
                type="text"
                value={actionBy}
                onChange={(e) => setActionBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter user identifier..."
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be included in the generated system information.
              </p>
            </div>
          </div>
        )}

        {/* Execute Button */}
        <div className="flex items-center space-x-4 mt-6">
          <button
            onClick={executeAction}
            disabled={loading}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 transform hover:scale-105"
            } text-white`}
          >
            <Play className="w-4 h-4" />
            <span>
              {loading
                ? "Processing..."
                : selectedAction === "removeUndefined"
                ? "Clean Data"
                : "Generate Info"}
            </span>
          </button>

          <button
            onClick={() => setShowCode(!showCode)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Code className="w-4 h-4" />
            <span>{showCode ? "Hide" : "Show"} Code</span>
          </button>
        </div>
      </div>

      {/* Code Example */}
      {showCode && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Code Example
            </h3>
          </div>
          <div className="p-6">
            <CodeBlock code={getCodeExample()} language="javascript" />
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="text-red-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-red-800">Error</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Result</h3>
          </div>
          <div className="p-6">
            {selectedAction === "removeUndefined" ? (
              <div className="space-y-6">
                {/* Original Data */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Original Data:
                  </h4>
                  <CodeBlock
                    code={JSON.stringify(result.original, null, 2)}
                    language="json"
                  />
                </div>

                {/* Cleaned Data */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Cleaned Data:
                  </h4>
                  <CodeBlock
                    code={JSON.stringify(result.cleaned, null, 2)}
                    language="json"
                  />
                </div>

                {/* Removed Fields */}
                {result.removedFields.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Removed Fields:
                    </h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <ul className="space-y-1">
                        {result.removedFields.map(
                          (field: string, index: number) => (
                            <li key={index} className="text-sm text-yellow-800">
                              <code className="bg-yellow-100 px-2 py-1 rounded text-xs">
                                {field}
                              </code>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Generated System Information:
                </h4>
                <CodeBlock
                  code={JSON.stringify(result, null, 2)}
                  language="json"
                />

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-blue-800 mb-2">
                      Browser Information
                    </h5>
                    <div className="space-y-1 text-sm text-blue-700">
                      <p>
                        <strong>Browser:</strong> {result.browser}
                      </p>
                      <p>
                        <strong>Platform:</strong> {result.platform}
                      </p>
                      <p>
                        <strong>Language:</strong> {result.language}
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-green-800 mb-2">
                      Session Information
                    </h5>
                    <div className="space-y-1 text-sm text-green-700">
                      <p>
                        <strong>Action By:</strong> {result.actionBy}
                      </p>
                      <p>
                        <strong>Timestamp:</strong>{" "}
                        {new Date(result.timestamp).toLocaleString()}
                      </p>
                      <p>
                        <strong>Screen:</strong> {result.screenResolution}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UtilityPlayground;
