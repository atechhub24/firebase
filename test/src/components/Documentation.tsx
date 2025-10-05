import { useCallback, useState } from "react";
import CodeBlock from "./CodeBlock";
import ConfigConverter from "./ConfigConverter";
import FrameworkSelector from "./FrameworkSelector";
import NextJsExample from "./NextJsExample";

const PackageManagerTabs: React.FC = () => {
  const [activePm, setActivePm] = useState<string>("npm");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const activeCommand =
        packageManagers.find((pm) => pm.id === activePm)?.command || "";
      await navigator.clipboard.writeText(activeCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const packageManagers = [
    {
      id: "npm",
      label: "npm",
      command: "npm install @atechhub/firebase firebase",
      icon: (
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original.svg"
          alt="npm"
          className="pm-icon npm-icon"
        />
      ),
    },
    {
      id: "yarn",
      label: "yarn",
      command: "yarn add @atechhub/firebase firebase",
      icon: (
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/yarn/yarn-original.svg"
          alt="yarn"
          className="pm-icon yarn-icon"
        />
      ),
    },
    {
      id: "pnpm",
      label: "pnpm",
      command: "pnpm add @atechhub/firebase firebase",
      icon: (
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pnpm/pnpm-original.svg"
          alt="pnpm"
          className="pm-icon pnpm-icon"
        />
      ),
    },
    {
      id: "bun",
      label: "bun",
      command: "bun add @atechhub/firebase firebase",
      icon: (
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bun/bun-original.svg"
          alt="bun"
          className="pm-icon bun-icon"
        />
      ),
    },
  ];

  const activeCommand =
    packageManagers.find((pm) => pm.id === activePm)?.command || "";

  return (
    <div className="terminal-container">
      {/* Terminal Header */}
      <div className="terminal-header">
        <div className="flex items-center space-x-3">
          <div className="terminal-dots">
            <div className="terminal-dot red"></div>
            <div className="terminal-dot yellow"></div>
            <div className="terminal-dot green"></div>
          </div>
          <div className="terminal-title">terminal</div>
        </div>
        <button onClick={handleCopy} className="copy-button">
          {copied ? (
            <>
              <svg
                className="w-3 h-3 inline mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                className="w-3 h-3 inline mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Package Manager Tabs */}
      <div className="package-manager-tabs">
        {packageManagers.map((pm) => (
          <button
            key={pm.id}
            onClick={() => setActivePm(pm.id)}
            className={`pm-tab ${activePm === pm.id ? "active" : ""}`}
          >
            {pm.icon}
            <span>{pm.label}</span>
          </button>
        ))}
      </div>

      {/* Terminal Content */}
      <div className="terminal-content">
        <div className="flex items-center">
          <span className="terminal-prompt">$</span>
          <span className="terminal-command">{activeCommand}</span>
        </div>
      </div>
    </div>
  );
};

// Move sections outside component to prevent re-creation
const documentationSections = [
  {
    id: "installation",
    title: "Installation",
    content: (
      <div className="space-y-4">
        <p>Install the package along with Firebase:</p>
        <PackageManagerTabs />
      </div>
    ),
  },
  {
    id: "quick-start",
    title: "Quick Start",
    content: (
      <div className="space-y-4">
        <p>Initialize Firebase and start using the utilities:</p>

        <div>
          <h4 className="text-lg font-semibold mb-2">1. Initialize Firebase</h4>
          <CodeBlock
            code={`import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

initializeApp(firebaseConfig);`}
            language="javascript"
          />
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">
            2. Use Database Operations
          </h4>
          <CodeBlock
            code={`import { mutate } from '@atechhub/firebase';

// Create data
await mutate({
  path: 'users/123',
  data: { name: 'John Doe', email: 'john@example.com' },
  action: 'create',
  actionBy: 'user123'
});

// Get data
const userData = await mutate({
  path: 'users/123',
  action: 'get'
});`}
            language="javascript"
          />
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">3. Upload Files</h4>
          <CodeBlock
            code={`import { file } from '@atechhub/firebase';

const result = await file.upload({
  file: selectedFile,
  path: 'uploads/avatar.jpg',
  onProgress: (progress) => console.log(\`\${progress}% uploaded\`)
});

console.log('File URL:', result.url);`}
            language="javascript"
          />
        </div>
      </div>
    ),
  },
  {
    id: "database-api",
    title: "Database API",
    content: (
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold mb-3">mutate(options)</h4>
          <p className="mb-3">
            A unified function for all database operations.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h5 className="font-semibold mb-2">Parameters:</h5>
            <ul className="space-y-1 text-sm">
              <li>
                <code className="code-inline">path</code> (string) - Database
                path
              </li>
              <li>
                <code className="code-inline">data</code> (object, optional) -
                Data to write
              </li>
              <li>
                <code className="code-inline">action</code> (string) - 'create',
                'update', 'delete', 'createWithId', 'get', 'onValue'
              </li>
              <li>
                <code className="code-inline">actionBy</code> (string, optional)
                - User identifier
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-semibold mb-2">Create Data</h5>
              <CodeBlock
                code={`await mutate({
  path: 'posts/post1',
  data: { 
    title: 'Hello World', 
    content: 'First post',
    published: true
  },
  action: 'create',
  actionBy: 'user123'
});`}
                language="javascript"
              />
            </div>

            <div>
              <h5 className="font-semibold mb-2">
                Create with Auto-Generated ID
              </h5>
              <CodeBlock
                code={`const newId = await mutate({
  path: 'posts',
  data: { 
    title: 'New Post', 
    content: 'Content here' 
  },
  action: 'createWithId',
  actionBy: 'user123'
});

console.log('New post ID:', newId);`}
                language="javascript"
              />
            </div>

            <div>
              <h5 className="font-semibold mb-2">Update Data</h5>
              <CodeBlock
                code={`await mutate({
  path: 'posts/post1',
  data: { 
    title: 'Updated Title',
    lastModified: new Date().toISOString()
  },
  action: 'update',
  actionBy: 'user123'
});`}
                language="javascript"
              />
            </div>

            <div>
              <h5 className="font-semibold mb-2">Get Data</h5>
              <CodeBlock
                code={`const data = await mutate({
  path: 'posts/post1',
  action: 'get'
});

console.log('Post data:', data);`}
                language="javascript"
              />
            </div>

            <div>
              <h5 className="font-semibold mb-2">Listen for Changes</h5>
              <CodeBlock
                code={`const unsubscribe = await mutate({
  path: 'posts',
  action: 'onValue'
});

// Remember to unsubscribe when component unmounts
// unsubscribe();`}
                language="javascript"
              />
            </div>

            <div>
              <h5 className="font-semibold mb-2">Delete Data</h5>
              <CodeBlock
                code={`await mutate({
  path: 'posts/post1',
  action: 'delete'
});`}
                language="javascript"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Utility Functions</h4>

          <div className="mb-4">
            <h5 className="font-semibold mb-2">removeUndefinedFields(obj)</h5>
            <p className="mb-2">
              Recursively removes undefined fields from objects/arrays.
            </p>
            <CodeBlock
              code={`import { removeUndefinedFields } from '@atechhub/firebase';

const cleanData = removeUndefinedFields({
  name: 'John',
  age: undefined,
  address: {
    street: '123 Main St',
    city: undefined
  }
});

// Result: { name: 'John', address: { street: '123 Main St' } }`}
              language="javascript"
            />
          </div>

          <div>
            <h5 className="font-semibold mb-2">generateSystemInfo(actionBy)</h5>
            <p className="mb-2">
              Generates system information for tracking operations.
            </p>
            <CodeBlock
              code={`import { generateSystemInfo } from '@atechhub/firebase';

const systemInfo = generateSystemInfo('user123');
console.log(systemInfo);

// Result:
// {
//   timestamp: "2024-01-15T10:30:00.000Z",
//   actionBy: "user123",
//   userAgent: "Mozilla/5.0...",
//   platform: "MacIntel",
//   language: "en-US",
//   screenResolution: "1920x1080",
//   browser: "Chrome"
// }`}
              language="javascript"
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "storage-api",
    title: "Storage API",
    content: (
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold mb-3">file.upload(options)</h4>
          <p className="mb-3">
            Upload files to Firebase Storage with progress tracking.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h5 className="font-semibold mb-2">Parameters:</h5>
            <ul className="space-y-1 text-sm">
              <li>
                <code className="code-inline">file</code> (File) - File to
                upload
              </li>
              <li>
                <code className="code-inline">path</code> (string) - Storage
                path
              </li>
              <li>
                <code className="code-inline">metadata</code> (object, optional)
                - Custom metadata
              </li>
              <li>
                <code className="code-inline">onProgress</code> (function,
                optional) - Progress callback
              </li>
              <li>
                <code className="code-inline">uploadedBy</code> (string,
                optional) - User identifier
              </li>
            </ul>
          </div>

          <CodeBlock
            code={`import { file } from '@atechhub/firebase';

const result = await file.upload({
  file: selectedFile,
  path: 'uploads/documents/report.pdf',
  metadata: { 
    category: 'document', 
    department: 'finance'
  },
  onProgress: (progress) => {
    console.log(\`Upload progress: \${progress}%\`);
    // Update your UI progress bar here
  },
  uploadedBy: 'user123'
});

console.log('Upload result:', result);
// {
//   url: "https://firebasestorage.googleapis.com/...",
//   path: "uploads/documents/report.pdf",
//   name: "report.pdf",
//   type: "application/pdf",
//   size: 1024000,
//   metadata: { category: 'document', ... }
// }`}
            language="javascript"
          />
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">file.delete(path)</h4>
          <p className="mb-3">Delete a file from Firebase Storage.</p>

          <CodeBlock
            code={`await file.delete('uploads/documents/old-report.pdf');
console.log('File deleted successfully');`}
            language="javascript"
          />
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">file.list(path)</h4>
          <p className="mb-3">List all files in a storage directory.</p>

          <CodeBlock
            code={`const files = await file.list('uploads/documents/');

console.log('Files in directory:', files);
// [
//   {
//     name: "report.pdf",
//     path: "uploads/documents/report.pdf",
//     url: "https://firebasestorage.googleapis.com/...",
//     contentType: "application/pdf",
//     size: 1024000,
//     timeCreated: "2024-01-15T10:30:00.000Z",
//     customMetadata: { category: 'document' }
//   },
//   ...
// ]`}
            language="javascript"
          />
        </div>
      </div>
    ),
  },
  {
    id: "rest-auth",
    title: "REST Auth",
    content: (
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold mb-3">
            REST Auth (Email/Password)
          </h4>
          <p className="mb-3">
            Add lightweight REST-based auth helpers for environments where you
            don't want to pull the full Firebase Auth SDK.
          </p>

          <div>
            <h5 className="font-semibold mb-2">Configure</h5>
            <CodeBlock
              code={`import { configureAuth } from "@atechhub/firebase";

configureAuth({
  authUrl: "https://identitytoolkit.googleapis.com/v1/accounts",
  apiKey: "your-firebase-web-api-key",
});
// Or via env vars:
// NEXT_PUBLIC_FIREBASE_AUTH_URL=https://identitytoolkit.googleapis.com/v1/accounts
// NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-web-api-key`}
              language="javascript"
            />
          </div>

          <div>
            <h5 className="font-semibold mb-2">Use</h5>
            <CodeBlock
              code={`import {
  createUser,
  changePassword,
  deleteUser,
  FirebaseAuthError,
} from "@atechhub/firebase";

// Register
const user = await createUser("user@example.com", "securePassword123");

// Change password
await changePassword(
  "user@example.com",
  "currentPassword123",
  "newSecurePassword456"
);

// Delete account
await deleteUser("user@example.com", "currentPassword123");`}
              language="javascript"
            />
          </div>

          <div>
            <h5 className="font-semibold mb-2">Error handling</h5>
            <CodeBlock
              code={`try {
  await createUser(email, password);
} catch (error) {
  if (error instanceof FirebaseAuthError) {
    // error.code may be 400/401/409/429 etc.
    console.error("Auth error:", error.message, error.code);
  }
}`}
              language="javascript"
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "sdk-auth",
    title: "SDK Auth",
    content: (
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold mb-3">
            SDK Auth (Email/Password)
          </h4>
          <p className="mb-3">
            Use Firebase Auth SDK with a clean, type-safe interface for
            email/password authentication.
          </p>

          <div>
            <h5 className="font-semibold mb-2">Setup</h5>
            <CodeBlock
              code={`import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Import our auth helper
import { firebaseAuth } from "@atechhub/firebase";`}
              language="javascript"
            />
          </div>

          <div>
            <h5 className="font-semibold mb-2">Usage</h5>
            <CodeBlock
              code={`import { firebaseAuth } from "@atechhub/firebase";

// 🔐 LOGIN - Sign in existing user
const userCredential = await firebaseAuth({
  action: "login",
  email: "user@example.com",
  password: "securePassword123",
});

// 📝 SIGNUP - Create new user
const newUserCredential = await firebaseAuth({
  action: "signup",
  email: "newuser@example.com",
  password: "securePassword123",
});

// 🚪 LOGOUT - Sign out current user
await firebaseAuth({
  action: "logout",
});

// 🔄 CHANGE PASSWORD - Update user password
await firebaseAuth({
  action: "changePassword",
  newPassword: "newSecurePassword456",
});`}
              language="javascript"
            />
          </div>

          <div>
            <h5 className="font-semibold mb-2">Error Handling</h5>
            <CodeBlock
              code={`try {
  await firebaseAuth({
    action: "login",
    email: "user@example.com",
    password: "wrongPassword",
  });
} catch (error) {
  if (error.code === "auth/user-not-found") {
    console.error("User does not exist");
  } else if (error.code === "auth/wrong-password") {
    console.error("Incorrect password");
  } else if (error.code === "auth/invalid-email") {
    console.error("Invalid email format");
  } else {
    console.error("Authentication error:", error.message);
  }
}`}
              language="javascript"
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "examples",
    title: "Complete Examples",
    content: (
      <div className="space-y-6">
        <NextJsExample />
      </div>
    ),
  },
  {
    id: "error-handling",
    title: "Error Handling",
    content: (
      <div className="space-y-4">
        <p>All functions throw errors that should be handled appropriately:</p>

        <CodeBlock
          code={`try {
  await mutate({
    path: 'posts/123',
    action: 'get'
  });
} catch (error) {
  if (error.message === 'Firebase not initialized') {
    console.error('Please initialize Firebase first');
    // Redirect to config page or show initialization form
  } else if (error.code === 'permission-denied') {
    console.error('Access denied - check Firebase rules');
  } else {
    console.error('Database error:', error);
  }
}`}
          language="javascript"
        />

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h5 className="font-semibold text-yellow-800 mb-2">Common Errors:</h5>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>
              <strong>Firebase not initialized:</strong> Call initializeApp()
              first
            </li>
            <li>
              <strong>Permission denied:</strong> Check your Firebase Security
              Rules
            </li>
            <li>
              <strong>Network errors:</strong> Check internet connection
            </li>
            <li>
              <strong>Invalid path:</strong> Ensure database path is valid
            </li>
            <li>
              <strong>Storage errors:</strong> Check file size limits and
              permissions
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "best-practices",
    title: "Best Practices",
    content: (
      <div className="space-y-4">
        <div className="grid gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="font-semibold text-green-800 mb-2">✅ Do:</h5>
            <ul className="text-sm text-green-700 space-y-1">
              <li>Always initialize Firebase before using utilities</li>
              <li>Handle errors appropriately in your application</li>
              <li>Use meaningful paths for better data organization</li>
              <li>Include actionBy parameter for audit trails</li>
              <li>Clean up listeners to prevent memory leaks</li>
              <li>Use appropriate file paths for storage organization</li>
              <li>Set proper metadata for uploaded files</li>
              <li>Validate data before sending to Firebase</li>
            </ul>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <h5 className="font-semibold text-red-800 mb-2">❌ Don't:</h5>
            <ul className="text-sm text-red-700 space-y-1">
              <li>Forget to handle Firebase initialization errors</li>
              <li>Leave real-time listeners running after component unmount</li>
              <li>Store sensitive data in Firebase without proper rules</li>
              <li>Use undefined values in data objects</li>
              <li>Upload files without progress tracking for large files</li>
              <li>Ignore file size limits in storage operations</li>
              <li>Use overly nested database structures</li>
            </ul>
          </div>
        </div>

        <div>
          <h5 className="font-semibold mb-2">React Integration Example:</h5>
          <CodeBlock
            code={`import { useEffect, useState } from 'react';
import { mutate } from '@atechhub/firebase';

function useFirebaseData(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;

    const setupListener = async () => {
      try {
        unsubscribe = await mutate({
          path,
          action: 'onValue'
        });
        
        // Note: In real implementation, you'd need to handle
        // the callback properly with onValue
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    setupListener();

    // Cleanup
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [path]);

  return { data, loading, error };
}

// Usage in component
function PostsList() {
  const { data: posts, loading, error } = useFirebaseData('posts');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {Object.entries(posts || {}).map(([id, post]) => (
        <div key={id}>{post.title}</div>
      ))}
    </div>
  );
}`}
            language="javascript"
          />
        </div>
      </div>
    ),
  },
  {
    id: "config-converter",
    title: "Config Converter",
    content: <ConfigConverter />,
  },
];

// Move tabs outside component to prevent re-creation
const documentationTabs = [
  { id: "installation", label: "Installation" },
  { id: "quick-start", label: "Quick Start" },
  { id: "database-api", label: "Database API" },
  { id: "storage-api", label: "Storage API" },
  { id: "rest-auth", label: "REST Auth" },
  { id: "sdk-auth", label: "SDK Auth" },
  { id: "config-converter", label: "Config Converter" },
  { id: "examples", label: "Examples" },
  { id: "error-handling", label: "Error Handling" },
  { id: "best-practices", label: "Best Practices" },
];

const Documentation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("installation");

  const handleExamplesHighlight = useCallback(() => {
    setActiveTab("examples");
  }, []);

  const activeSection = documentationSections.find(
    (section) => section.id === activeTab
  );

  return (
    <div className="max-width-6xl mx-auto">
      {/* Tab Navigation */}
      <div className="modern-tab-container mb-6 overflow-hidden">
        <nav className="flex overflow-x-auto documentation-scrollbar-hide">
          {documentationTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`documentation-tab-button relative whitespace-nowrap py-3 px-4 sm:py-4 sm:px-6 font-medium text-xs sm:text-sm transition-all duration-300 ease-in-out ${
                activeTab === tab.id
                  ? "text-blue-600 active"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {activeSection && (
          <div className="prose max-w-none">
            <div className="bg-white rounded-b-xl p-4 sm:p-8 relative">
              {/* Content fade-in effect */}
              <div className="documentation-animate-fadeIn">
                {activeSection.content}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Framework Selector Section - After All Tabs */}
      <div className="mt-6">
        <FrameworkSelector
          onFrameworkSelect={() => {}} // No longer needed
          onExamplesHighlight={handleExamplesHighlight}
        />
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl transition-all duration-300">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Ready to try it out?
        </h3>
        <p className="text-blue-700 mb-4">
          Switch to the Playground tab to test all features with your Firebase
          configuration.
        </p>
      </div>
    </div>
  );
};

export default Documentation;
