import React from "react";
import CodeBlock from "./CodeBlock";

const NextJsExample: React.FC = () => {
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
    <div className="nextjs-guide">
      {/* Header */}
      <div className="nextjs-guide-header">
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original-wordmark.svg"
          alt="Next.js"
          className="nextjs-guide-icon"
        />
        <div className="nextjs-guide-title">
          <h3>Next.js Integration Guide</h3>
          <p>
            Complete step-by-step integration of @atechhub/firebase with Next.js
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="nextjs-guide-content">
        <div className="nextjs-guide-steps">
          {/* Step 1: Environment Setup */}
          <div className="nextjs-step">
            <div className="nextjs-step-number">1</div>
            <div className="nextjs-step-content">
              <h4 className="nextjs-step-title">
                Create Environment Configuration
              </h4>
              <p className="nextjs-step-description">
                Create a <code className="code-inline">.env.local</code> file in
                the root of your Next.js project
              </p>

              {/* Code Block */}
              <CodeBlock code={envContent} language="bash" title=".env.local" />

              <div className="nextjs-info-box">
                <svg
                  className="nextjs-info-icon"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="nextjs-info-content">
                  <h5>Important Note</h5>
                  <p>
                    Fill in your actual Firebase configuration values from your
                    Firebase project settings. The{" "}
                    <code className="code-inline">
                      NEXT_PUBLIC_FIREBASE_AUTH_URL
                    </code>{" "}
                    is pre-configured for Firebase Auth REST API.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Placeholder for more steps */}
          <div className="nextjs-more-steps">
            <div className="nextjs-loading-dots">
              <div className="nextjs-loading-dot"></div>
              <div className="nextjs-loading-dot"></div>
              <div className="nextjs-loading-dot"></div>
            </div>
            <p>More steps coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextJsExample;
