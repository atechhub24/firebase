import { file } from "@atechhub/firebase";
import { getApps } from "firebase/app";
import {
  AlertCircle,
  CheckCircle,
  Code,
  Eye,
  File,
  FileText,
  HardDrive,
  Image,
  List,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import CodeBlock from "./CodeBlock";

type StorageAction = "upload" | "list" | "delete";

interface FileItem {
  name: string;
  path: string;
  url?: string;
  contentType?: string;
  size?: number;
  timeCreated?: string;
  customMetadata?: Record<string, any>;
  error?: string;
}

const StoragePlayground: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<StorageAction>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [storagePath, setStoragePath] = useState("playground/uploads");
  const [uploadedBy, setUploadedBy] = useState("playground-user");
  const [metadata, setMetadata] = useState(
    '{\n  "category": "test",\n  "description": "Uploaded from playground"\n}'
  );
  const [listPath, setListPath] = useState("playground/");
  const [deletePath, setDeletePath] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const actions = [
    {
      id: "upload" as StorageAction,
      name: "Upload File",
      icon: Upload,
      description: "Upload files to Firebase Storage",
      color: "green",
    },
    {
      id: "list" as StorageAction,
      name: "List Files",
      icon: List,
      description: "List all files in a directory",
      color: "blue",
    },
    {
      id: "delete" as StorageAction,
      name: "Delete File",
      icon: Trash2,
      description: "Delete a file from storage",
      color: "red",
    },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-generate path with filename
      const timestamp = Date.now();
      setStoragePath(`playground/uploads/${timestamp}_${file.name}`);
    }
  };

  const executeUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    setError("");
    setResult(null);
    setLoading(true);
    setUploadProgress(0);

    try {
      // Check if Firebase is initialized
      const apps = getApps();
      if (apps.length === 0) {
        throw new Error(
          "Firebase not initialized. Please check your configuration and try again."
        );
      }

      let parsedMetadata = {};
      try {
        parsedMetadata = JSON.parse(metadata);
      } catch {
        throw new Error(
          "Invalid JSON metadata. Please check your JSON syntax."
        );
      }

      const uploadResult = await file.upload({
        file: selectedFile,
        path: storagePath,
        metadata: parsedMetadata,
        onProgress: (progress) => {
          setUploadProgress(progress);
        },
        uploadedBy,
      });

      setResult(uploadResult);
      setUploadProgress(100);
    } catch (err: any) {
      console.error("Upload error:", err);

      let errorMessage = err.message || "Upload failed";

      if (err.message?.includes("Firebase not initialized")) {
        errorMessage =
          "Firebase not initialized. Please refresh the page and re-enter your configuration.";
      } else if (err.message?.includes("permission-denied")) {
        errorMessage =
          "Permission denied. Please check your Firebase Storage Rules.";
      } else if (err.message?.includes("storage/unauthorized")) {
        errorMessage =
          "Unauthorized access to storage. Please check your Firebase Storage Rules.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const executeList = async () => {
    setError("");
    setFileList([]);
    setLoading(true);

    try {
      // Check if Firebase is initialized
      const apps = getApps();
      if (apps.length === 0) {
        throw new Error(
          "Firebase not initialized. Please check your configuration and try again."
        );
      }

      const files = await file.list(listPath);
      setFileList(files);
    } catch (err: any) {
      console.error("List files error:", err);

      let errorMessage = err.message || "Failed to list files";

      if (err.message?.includes("Firebase not initialized")) {
        errorMessage =
          "Firebase not initialized. Please refresh the page and re-enter your configuration.";
      } else if (err.message?.includes("storage/object-not-found")) {
        errorMessage = "Directory not found. Please check the path.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async () => {
    if (!deletePath) {
      setError("Please enter a file path to delete");
      return;
    }

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

      await file.delete(deletePath);
      setResult({ message: "File deleted successfully", path: deletePath });
    } catch (err: any) {
      console.error("Delete file error:", err);

      let errorMessage = err.message || "Delete failed";

      if (err.message?.includes("Firebase not initialized")) {
        errorMessage =
          "Firebase not initialized. Please refresh the page and re-enter your configuration.";
      } else if (err.message?.includes("storage/object-not-found")) {
        errorMessage = "File not found. Please check the file path.";
      } else if (err.message?.includes("permission-denied")) {
        errorMessage =
          "Permission denied. Please check your Firebase Storage Rules.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const executeAction = () => {
    switch (selectedAction) {
      case "upload":
        executeUpload();
        break;
      case "list":
        executeList();
        break;
      case "delete":
        executeDelete();
        break;
    }
  };

  const generateCodeExample = () => {
    let codeExample = `import { file } from '@atechhub/firebase';\n\n`;

    switch (selectedAction) {
      case "upload":
        codeExample += `const selectedFile = // Your File object\n`;
        codeExample += `const metadata = ${metadata};\n\n`;
        codeExample += `const result = await file.upload({\n`;
        codeExample += `  file: selectedFile,\n`;
        codeExample += `  path: '${storagePath}',\n`;
        codeExample += `  metadata: metadata,\n`;
        codeExample += `  onProgress: (progress) => {\n`;
        codeExample += `    console.log(\`Upload progress: \${progress}%\`);\n`;
        codeExample += `  },\n`;
        codeExample += `  uploadedBy: '${uploadedBy}'\n`;
        codeExample += `});\n\n`;
        codeExample += `console.log('Upload result:', result);`;
        break;
      case "list":
        codeExample += `const files = await file.list('${listPath}');\n`;
        codeExample += `console.log('Files:', files);`;
        break;
      case "delete":
        codeExample += `await file.delete('${deletePath}');\n`;
        codeExample += `console.log('File deleted successfully');`;
        break;
    }

    return codeExample;
  };

  const getFileIcon = (contentType?: string) => {
    if (!contentType) return File;

    if (contentType.startsWith("image/")) return Image;
    if (contentType.includes("pdf") || contentType.includes("document"))
      return FileText;
    return File;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";

    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      green: "bg-green-100 text-green-800 border-green-200",
      red: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Action Selection */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <HardDrive className="h-5 w-5 mr-2" />
          Storage Operations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
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
            {selectedAction === "upload" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select File
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {selectedFile && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                      <p>
                        <strong>File:</strong> {selectedFile.name}
                      </p>
                      <p>
                        <strong>Size:</strong>{" "}
                        {formatFileSize(selectedFile.size)}
                      </p>
                      <p>
                        <strong>Type:</strong> {selectedFile.type || "Unknown"}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Storage Path
                  </label>
                  <input
                    type="text"
                    value={storagePath}
                    onChange={(e) => setStoragePath(e.target.value)}
                    className="input"
                    placeholder="playground/uploads/filename.ext"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Full path where the file will be stored
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Uploaded By
                  </label>
                  <input
                    type="text"
                    value={uploadedBy}
                    onChange={(e) => setUploadedBy(e.target.value)}
                    className="input"
                    placeholder="user-123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Metadata (JSON)
                  </label>
                  <textarea
                    value={metadata}
                    onChange={(e) => setMetadata(e.target.value)}
                    className="input textarea"
                    rows={4}
                    placeholder='{"category": "image", "public": "true"}'
                  />
                </div>

                {loading && uploadProgress > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Upload Progress</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {selectedAction === "list" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Directory Path
                </label>
                <input
                  type="text"
                  value={listPath}
                  onChange={(e) => setListPath(e.target.value)}
                  className="input"
                  placeholder="playground/"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Directory path to list files from
                </p>
              </div>
            )}

            {selectedAction === "delete" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File Path to Delete
                </label>
                <input
                  type="text"
                  value={deletePath}
                  onChange={(e) => setDeletePath(e.target.value)}
                  className="input"
                  placeholder="playground/uploads/filename.ext"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Full path of the file to delete
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
                Processing...
              </>
            ) : (
              <>
                {selectedAction === "upload" && (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {selectedAction === "list" && <List className="h-4 w-4 mr-2" />}
                {selectedAction === "delete" && (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                {actions.find((a) => a.id === selectedAction)?.name}
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

          {result && selectedAction !== "list" && (
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
                          JSON.stringify(result, null, 2)
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
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* File List Results */}
      {selectedAction === "list" && fileList.length > 0 && (
        <div className="card">
          <h4 className="font-semibold text-gray-900 mb-4">
            Files in {listPath} ({fileList.length} files)
          </h4>

          <div className="space-y-3">
            {fileList.map((file, index) => {
              const FileIcon = getFileIcon(file.contentType);

              return (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <FileIcon className="h-8 w-8 text-gray-400 flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      {file.url && (
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                          title="View file"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {file.path}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span>{formatFileSize(file.size)}</span>
                      {file.contentType && <span>{file.contentType}</span>}
                      {file.timeCreated && (
                        <span>
                          {new Date(file.timeCreated).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedAction("delete");
                      setDeletePath(file.path);
                    }}
                    className="btn btn-secondary text-xs"
                    title="Delete this file"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Examples */}
      <div className="card">
        <h4 className="font-semibold text-gray-900 mb-4">Quick Examples</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              setSelectedAction("upload");
              setStoragePath("playground/images/sample.jpg");
              setMetadata(
                '{\n  "category": "image",\n  "public": "true",\n  "description": "Sample image"\n}'
              );
            }}
            className="p-3 bg-green-50 border border-green-200 rounded-lg text-left hover:bg-green-100 transition-colors"
          >
            <div className="font-medium text-green-800 mb-1">Upload Image</div>
            <div className="text-sm text-green-600">
              Upload an image with metadata
            </div>
          </button>

          <button
            onClick={() => {
              setSelectedAction("list");
              setListPath("playground/images/");
            }}
            className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-left hover:bg-blue-100 transition-colors"
          >
            <div className="font-medium text-blue-800 mb-1">List Images</div>
            <div className="text-sm text-blue-600">
              List all files in images directory
            </div>
          </button>

          <button
            onClick={() => {
              setSelectedAction("upload");
              setStoragePath("playground/documents/report.pdf");
              setMetadata(
                '{\n  "category": "document",\n  "department": "finance",\n  "confidential": "false"\n}'
              );
            }}
            className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-left hover:bg-purple-100 transition-colors"
          >
            <div className="font-medium text-purple-800 mb-1">
              Upload Document
            </div>
            <div className="text-sm text-purple-600">Upload a PDF document</div>
          </button>

          <button
            onClick={() => {
              setSelectedAction("list");
              setListPath("playground/");
            }}
            className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-left hover:bg-yellow-100 transition-colors"
          >
            <div className="font-medium text-yellow-800 mb-1">
              List All Files
            </div>
            <div className="text-sm text-yellow-600">
              List all playground files
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoragePlayground;
