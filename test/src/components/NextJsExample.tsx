import React from "react";
import CodeBlock from "./CodeBlock";

// Constants
const NEXTJS_ICON_URL =
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original-wordmark.svg";

const ENV_CONTENT = `# Firebase API keys
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_DATABASE_URL=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
NEXT_PUBLIC_FIREBASE_AUTH_URL="https://identitytoolkit.googleapis.com/v1/accounts"`;

const ENV_TS_CONTENT = `import { z } from "zod";

// Define the schema for environment variables
const envSchema = z.object({
  // Firebase Configuration
  NEXT_PUBLIC_FIREBASE_API_KEY: z
    .string()
    .min(1, "Firebase API Key is required"),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z
    .string()
    .min(1, "Firebase Auth Domain is required"),
  NEXT_PUBLIC_FIREBASE_DATABASE_URL: z
    .string()
    .min(1, "Firebase Database URL is required"),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z
    .string()
    .min(1, "Firebase Project ID is required"),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z
    .string()
    .min(1, "Firebase Storage Bucket is required"),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z
    .string()
    .min(1, "Firebase Messaging Sender ID is required"),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, "Firebase App ID is required"),
  NEXT_PUBLIC_FIREBASE_AUTH_URL: z
    .string()
    .url("Firebase Auth URL must be a valid URL"),
});

// Validate and parse environment variables
function validateEnv() {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_FIREBASE_DATABASE_URL:
        process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID:
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
        process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      NEXT_PUBLIC_FIREBASE_AUTH_URL: process.env.NEXT_PUBLIC_FIREBASE_AUTH_URL,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(
        (err) => \`\${err.path.join(".")}: \${err.message}\`
      );
      throw new Error(
        "Invalid environment variables:\\n" +
          missingVars.join("\\n") +
          "\\n\\nPlease check your .env.local file."
      );
    }
    throw error;
  }
}

// Export type-safe environment variables
export const env = validateEnv();

// Export types for use in other files
export type Env = z.infer<typeof envSchema>;

// Firebase configuration object
export const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase Auth API configuration
export const firebaseAuthConfig = {
  authUrl: env.NEXT_PUBLIC_FIREBASE_AUTH_URL,
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
};`;

// Components
const InfoIcon: React.FC = () => (
  <svg className="nextjs-info-icon" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
      clipRule="evenodd"
    />
  </svg>
);

const GuideHeader: React.FC = () => (
  <div className="nextjs-guide-header">
    <img src={NEXTJS_ICON_URL} alt="Next.js" className="nextjs-guide-icon" />
    <div className="nextjs-guide-title">
      <h3>Next.js Integration Guide</h3>
      <p>
        Complete step-by-step integration of @atechhub/firebase with Next.js
      </p>
    </div>
  </div>
);

const InfoBox: React.FC = () => (
  <div className="nextjs-info-box">
    <InfoIcon />
    <div className="nextjs-info-content">
      <h5>Important Note</h5>
      <p>
        Fill in your actual Firebase configuration values from your Firebase
        project settings. The{" "}
        <code className="code-inline">NEXT_PUBLIC_FIREBASE_AUTH_URL</code> is
        pre-configured for Firebase Auth REST API.
      </p>
    </div>
  </div>
);

const LoadingDots: React.FC = () => (
  <div className="nextjs-loading-dots">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="nextjs-loading-dot" />
    ))}
  </div>
);

const MoreStepsPlaceholder: React.FC = () => (
  <div className="nextjs-more-steps">
    <LoadingDots />
    <p>More steps coming soon...</p>
  </div>
);

const EnvironmentStep: React.FC = () => (
  <div className="nextjs-step">
    <div className="nextjs-step-number">1</div>
    <div className="nextjs-step-content">
      <h4 className="nextjs-step-title">Create Environment Configuration</h4>
      <p className="nextjs-step-description">
        Create a <code className="code-inline">.env.local</code> file in the
        root of your Next.js project
      </p>
      <CodeBlock code={ENV_CONTENT} language="bash" title=".env.local" />
      <InfoBox />
    </div>
  </div>
);

const TypeSafeEnvStep: React.FC = () => (
  <div className="nextjs-step">
    <div className="nextjs-step-number">2</div>
    <div className="nextjs-step-content">
      <h4 className="nextjs-step-title">
        Create Type-Safe Environment Configuration
      </h4>
      <p className="nextjs-step-description">
        Create a <code className="code-inline">lib/env.ts</code> file for
        type-safe environment variable validation using Zod
      </p>
      <CodeBlock
        code={ENV_TS_CONTENT}
        language="typescript"
        title="lib/env.ts"
      />
      <div className="nextjs-info-box">
        <InfoIcon />
        <div className="nextjs-info-content">
          <h5>Benefits of Type-Safe Environment</h5>
          <ul>
            <li>Runtime validation of environment variables</li>
            <li>TypeScript intellisense and type safety</li>
            <li>Clear error messages for missing/invalid variables</li>
            <li>Centralized Firebase configuration</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const NextJsExample: React.FC = () => (
  <div className="nextjs-guide">
    <GuideHeader />
    <div className="nextjs-guide-content">
      <div className="nextjs-guide-steps">
        <EnvironmentStep />
        <TypeSafeEnvStep />
        <MoreStepsPlaceholder />
      </div>
    </div>
  </div>
);

export default NextJsExample;
