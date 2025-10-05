import React, { useState } from "react";
import CodeBlock from "./CodeBlock";

const ConfigConverter: React.FC = () => {
  const [inputConfig, setInputConfig] = useState(`const firebaseConfig = {
  apiKey: "AI********w",
  authDomain: "********.firebaseapp.com",
  databaseURL: "https://********-default-rtdb.firebaseio.com",
  projectId: "********",
  storageBucket: "********.firebasestorage.app",
  messagingSenderId: "********",
  appId: "1:********"
};`);

  const [outputEnv, setOutputEnv] = useState("");
  const [copied, setCopied] = useState(false);

  const convertToEnv = () => {
    try {
      // Extract values from the JavaScript config object
      const apiKeyMatch = inputConfig.match(/apiKey:\s*["']([^"']+)["']/);
      const authDomainMatch = inputConfig.match(
        /authDomain:\s*["']([^"']+)["']/
      );
      const databaseURLMatch = inputConfig.match(
        /databaseURL:\s*["']([^"']+)["']/
      );
      const projectIdMatch = inputConfig.match(/projectId:\s*["']([^"']+)["']/);
      const storageBucketMatch = inputConfig.match(
        /storageBucket:\s*["']([^"']+)["']/
      );
      const messagingSenderIdMatch = inputConfig.match(
        /messagingSenderId:\s*["']([^"']+)["']/
      );
      const appIdMatch = inputConfig.match(/appId:\s*["']([^"']+)["']/);

      const envFormat = `NEXT_PUBLIC_FIREBASE_API_KEY="${
        apiKeyMatch ? apiKeyMatch[1] : ""
      }"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="${authDomainMatch ? authDomainMatch[1] : ""}"
NEXT_PUBLIC_FIREBASE_DATABASE_URL="${
        databaseURLMatch ? databaseURLMatch[1] : ""
      }"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="${projectIdMatch ? projectIdMatch[1] : ""}"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="${
        storageBucketMatch ? storageBucketMatch[1] : ""
      }"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="${
        messagingSenderIdMatch ? messagingSenderIdMatch[1] : ""
      }"
NEXT_PUBLIC_FIREBASE_APP_ID="${appIdMatch ? appIdMatch[1] : ""}"
NEXT_PUBLIC_FIREBASE_AUTH_URL="https://identitytoolkit.googleapis.com/v1/accounts"`;

      setOutputEnv(envFormat);
    } catch (error) {
      setOutputEnv("Error: Please check your Firebase config format");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputEnv);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleClear = () => {
    setInputConfig("");
    setOutputEnv("");
  };

  return (
    <div className="config-converter-container">
      <div className="config-converter-header">
        <h3 className="config-converter-title">
          Firebase Config to .env Converter
        </h3>
        <p className="config-converter-description">
          Paste your Firebase config object and convert it to .env format for
          Next.js projects
        </p>
      </div>

      <div className="config-converter-grid">
        {/* Input Section */}
        <div className="config-converter-input-section">
          <div className="config-converter-section-header">
            <h4 className="config-converter-section-title">
              Input: Firebase Config
            </h4>
            <div className="config-converter-actions">
              <button
                onClick={convertToEnv}
                className="config-converter-button config-converter-button-primary"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Convert
              </button>
              <button
                onClick={handleClear}
                className="config-converter-button config-converter-button-secondary"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Clear
              </button>
            </div>
          </div>
          <textarea
            value={inputConfig}
            onChange={(e) => setInputConfig(e.target.value)}
            className="config-converter-textarea"
            placeholder="Paste your Firebase config object here..."
            rows={12}
          />
        </div>

        {/* Output Section */}
        <div className="config-converter-output-section">
          <div className="config-converter-section-header">
            <h4 className="config-converter-section-title">
              Output: .env Format
            </h4>
            <div className="config-converter-actions">
              <button
                onClick={handleCopy}
                className="config-converter-button config-converter-button-primary"
                disabled={!outputEnv}
              >
                {copied ? (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
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
                      className="w-4 h-4 mr-2"
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
          </div>
          <div className="config-converter-code-output">
            {outputEnv ? (
              <CodeBlock code={outputEnv} language="bash" title=".env.local" />
            ) : (
              <div className="config-converter-placeholder">
                <div className="config-converter-placeholder-content">
                  <svg
                    className="w-8 h-8 text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-gray-500 text-sm">
                    Converted .env format will appear here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="config-converter-info">
        <div className="config-converter-info-header">
          <svg
            className="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h4 className="config-converter-info-title">Usage Instructions</h4>
        </div>
        <ul className="config-converter-info-list">
          <li>Paste your Firebase config object in the input area</li>
          <li>Click "Convert" to generate the .env format</li>
          <li>
            Copy the output and save it as <code>.env.local</code> in your
            Next.js project
          </li>
          <li>
            Make sure to add <code>.env.local</code> to your{" "}
            <code>.gitignore</code> file
          </li>
          <li>
            Restart your Next.js development server after adding the environment
            variables
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ConfigConverter;
