import React, { useState } from "react";

const NextJsExample: React.FC = () => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, stepNumber: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepNumber);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const envContent = `# Firebase API keys
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_DATABASE_URL=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
NEXT_PUBLIC_FIREBASE_AUTH_URL="https://identitytoolkit.googleapis.com/v1/accounts"`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original-wordmark.svg"
              alt="Next.js"
              className="w-12 h-12"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Next.js Integration Guide
            </h3>
            <p className="text-sm text-gray-600">
              Complete step-by-step integration of @atechhub/firebase with
              Next.js
            </p>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="p-6">
        <div className="space-y-8">
          {/* Step 1: Environment Setup */}
          <div className="relative">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  1
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Create Environment Configuration
                </h4>
                <p className="text-gray-600 mb-4">
                  Create a <code className="code-inline">.env.local</code> file
                  in the root of your Next.js project
                </p>

                {/* Code Block */}
                <div className="terminal-container">
                  <div className="terminal-header">
                    <div className="terminal-dots">
                      <div className="terminal-dot red"></div>
                      <div className="terminal-dot yellow"></div>
                      <div className="terminal-dot green"></div>
                    </div>
                    <div className="terminal-title">.env.local</div>
                    <button
                      onClick={() => copyToClipboard(envContent, 1)}
                      className="copy-button"
                    >
                      {copiedStep === 1 ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="terminal-content">
                    <pre className="text-base leading-relaxed">
                      <div className="text-green-400 font-medium mb-2">
                        # Firebase API keys
                      </div>
                      <div className="space-y-1">
                        <div>
                          <span className="text-blue-300 font-medium">
                            NEXT_PUBLIC_FIREBASE_API_KEY
                          </span>
                          =<span className="text-yellow-300">""</span>
                        </div>
                        <div>
                          <span className="text-blue-300 font-medium">
                            NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
                          </span>
                          =<span className="text-yellow-300">""</span>
                        </div>
                        <div>
                          <span className="text-blue-300 font-medium">
                            NEXT_PUBLIC_FIREBASE_DATABASE_URL
                          </span>
                          =<span className="text-yellow-300">""</span>
                        </div>
                        <div>
                          <span className="text-blue-300 font-medium">
                            NEXT_PUBLIC_FIREBASE_PROJECT_ID
                          </span>
                          =<span className="text-yellow-300">""</span>
                        </div>
                        <div>
                          <span className="text-blue-300 font-medium">
                            NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
                          </span>
                          =<span className="text-yellow-300">""</span>
                        </div>
                        <div>
                          <span className="text-blue-300 font-medium">
                            NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
                          </span>
                          =<span className="text-yellow-300">""</span>
                        </div>
                        <div>
                          <span className="text-blue-300 font-medium">
                            NEXT_PUBLIC_FIREBASE_APP_ID
                          </span>
                          =<span className="text-yellow-300">""</span>
                        </div>
                        <div>
                          <span className="text-blue-300 font-medium">
                            NEXT_PUBLIC_FIREBASE_AUTH_URL
                          </span>
                          =
                          <span className="text-yellow-300">
                            "https://identitytoolkit.googleapis.com/v1/accounts"
                          </span>
                        </div>
                      </div>
                    </pre>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-blue-600 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-900 mb-1">
                        Important Note
                      </h5>
                      <p className="text-sm text-blue-800">
                        Fill in your actual Firebase configuration values from
                        your Firebase project settings. The{" "}
                        <code className="code-inline">
                          NEXT_PUBLIC_FIREBASE_AUTH_URL
                        </code>{" "}
                        is pre-configured for Firebase Auth REST API.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Placeholder for more steps */}
          <div className="border-t border-gray-200 pt-6">
            <div className="text-center text-gray-500">
              <div className="inline-flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
              <p className="mt-2 text-sm">More steps coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextJsExample;
