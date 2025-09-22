# 🔥 @atechhub/firebase

**The Ultimate Firebase Utilities Package** - Supercharge your Firebase development with powerful, ready-to-use utilities for Realtime Database and Storage operations.

[![npm version](https://badge.fury.io/js/@atechhub%2Ffirebase.svg)](https://badge.fury.io/js/@atechhub%2Ffirebase)
[![Downloads](https://img.shields.io/npm/dt/@atechhub/firebase.svg)](https://www.npmjs.com/package/@atechhub/firebase)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Why Choose @atechhub/firebase?

- 🚀 **Production Ready** - Battle-tested utilities used in real applications
- 🎯 **Zero Config** - Works with your existing Firebase setup
- 📝 **TypeScript First** - Full type safety and IntelliSense support
- 🔧 **Developer Friendly** - Intuitive API with comprehensive error handling
- 📊 **Smart Tracking** - Built-in metadata and system info for all operations
- 🛡️ **Data Safety** - Automatic undefined field removal and validation

## 🚀 Quick Start

### Installation

```bash
npm install @atechhub/firebase
# or
pnpm add @atechhub/firebase
# or
bun add @atechhub/firebase
```

### Setup

```typescript
// Initialize Firebase (your existing setup)
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

// Import and use our utilities
import { mutate, file } from "@atechhub/firebase";
```

## 🔐 REST Auth (Email/Password)

Add lightweight REST-based auth helpers for environments where you don't want to pull the full Firebase Auth SDK.

### Configure

```typescript
import { configureAuth } from "@atechhub/firebase";

configureAuth({
  authUrl: "https://identitytoolkit.googleapis.com/v1/accounts",
  apiKey: "your-firebase-web-api-key",
});
// Or via env vars:
// NEXT_PUBLIC_FIREBASE_AUTH_URL=https://identitytoolkit.googleapis.com/v1/accounts
// NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-web-api-key
```

### Use

```typescript
import {
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
await deleteUser("user@example.com", "currentPassword123");
```

### Error handling

```typescript
try {
  await createUser(email, password);
} catch (error) {
  if (error instanceof FirebaseAuthError) {
    // error.code may be 400/401/409/429 etc.
    console.error("Auth error:", error.message, error.code);
  }
}
```

### Types

```typescript
import type {
  SignupResponse,
  UpdateResponse,
  DeleteResponse,
  FirebaseAuthConfig,
} from "@atechhub/firebase";
```

## 🔑 SDK Auth (Email/Password)

Use Firebase Auth SDK with a clean, type-safe interface for email/password authentication.

### Setup

```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Import our auth helper
import { firebaseAuth } from "@atechhub/firebase";
```

### Usage

```typescript
import { firebaseAuth } from "@atechhub/firebase";

// 🔐 LOGIN - Sign in existing user
const userCredential = await firebaseAuth({
  action: "login",
  email: "user@example.com",
  password: "securePassword123",
});

console.log("User signed in:", userCredential.user.uid);

// 📝 SIGNUP - Create new user
const newUserCredential = await firebaseAuth({
  action: "signup",
  email: "newuser@example.com",
  password: "securePassword123",
});

console.log("User created:", newUserCredential.user.uid);

// 🚪 LOGOUT - Sign out current user
await firebaseAuth({
  action: "logout",
});

// 🔄 CHANGE PASSWORD - Update user password
await firebaseAuth({
  action: "changePassword",
  newPassword: "newSecurePassword456",
});
```

### Error Handling

```typescript
try {
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
}
```

### React Hook Example

```typescript
import { useState } from "react";
import { firebaseAuth } from "@atechhub/firebase";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await firebaseAuth({
        action: "login",
        email,
        password,
      });
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const signup = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await firebaseAuth({
        action: "signup",
        email,
        password,
      });
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      await firebaseAuth({ action: "logout" });
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const changePassword = async (newPassword: string) => {
    setLoading(true);
    setError(null);

    try {
      await firebaseAuth({
        action: "changePassword",
        newPassword,
      });
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return {
    login,
    signup,
    logout,
    changePassword,
    loading,
    error,
  };
};
```

### Types

```typescript
import type {
  LoginAction,
  SignupAction,
  LogoutAction,
  ChangePasswordAction,
  AuthActionPayload,
} from "@atechhub/firebase";
```

## 📊 Realtime Database Operations

### The Power of `mutate()` Function

One function, infinite possibilities. Handle all your database operations with a single, powerful method:

```typescript
import { mutate } from "@atechhub/firebase";

// 📝 CREATE - Add new data
await mutate({
  action: "create",
  path: "users/user123",
  data: {
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
  },
  actionBy: "admin-panel",
});

// 📝 CREATE WITH AUTO-ID - Let Firebase generate unique IDs
const newUserId = await mutate({
  action: "createWithId",
  path: "users",
  data: {
    name: "Jane Smith",
    email: "jane@example.com",
  },
});

// ✏️ UPDATE - Modify existing data
await mutate({
  action: "update",
  path: "users/user123",
  data: {
    lastLogin: new Date().toISOString(),
    status: "active",
  },
  actionBy: "user-login",
});

// 📖 READ - Fetch data
const userData = await mutate({
  action: "get",
  path: "users/user123",
});

// 🗑️ DELETE - Remove data
await mutate({
  action: "delete",
  path: "users/user123",
  actionBy: "admin-cleanup",
});

// 👁️ REAL-TIME LISTENING - Subscribe to changes
const unsubscribe = await mutate({
  action: "onValue",
  path: "users",
  actionBy: "dashboard",
});
```

### 🎯 Smart Features

**Automatic System Tracking** - Every operation includes:

```typescript
{
  timestamp: "2024-01-15T10:30:00.000Z",
  actionBy: "your-identifier",
  userAgent: "Mozilla/5.0...",
  platform: "MacIntel",
  language: "en-US",
  screenResolution: "1920x1080",
  browser: "Chrome"
}
```

**Data Sanitization** - Automatically removes undefined fields:

```typescript
const messyData = {
  name: "John",
  age: undefined, // ❌ Will be removed
  email: "john@example.com",
  profile: {
    bio: undefined, // ❌ Will be removed
    avatar: "url",
  },
};

// Clean data is automatically saved ✨
await mutate({
  action: "create",
  path: "users/clean",
  data: messyData, // Only defined fields will be saved
});
```

## 📁 Storage Operations

### File Upload with Progress Tracking

```typescript
import { file } from "@atechhub/firebase";

// 📤 UPLOAD with progress tracking
const result = await file.upload({
  file: selectedFile,
  path: "uploads/documents/contract.pdf",
  metadata: {
    department: "legal",
    confidential: "true",
  },
  onProgress: (progress) => {
    console.log(`Upload: ${progress}% complete`);
    // Update your progress bar here
  },
  uploadedBy: "user123",
});

console.log(result);
// Returns:
// {
//   url: "https://firebasestorage.googleapis.com/...",
//   path: "uploads/documents/contract.pdf",
//   name: "contract.pdf",
//   type: "application/pdf",
//   size: 1024000,
//   metadata: {
//     department: "legal",
//     confidential: "true",
//     uploadedBy: "user123",
//     uploadedAt: "2024-01-15T10:30:00.000Z"
//   }
// }
```

### File Management

```typescript
// 📋 LIST files with metadata
const files = await file.list("uploads/images/");

files.forEach((file) => {
  console.log({
    name: file.name,
    url: file.url,
    size: file.size,
    uploadedAt: file.customMetadata?.uploadedAt,
    uploadedBy: file.customMetadata?.uploadedBy,
  });
});

// 🗑️ DELETE files
await file.delete("uploads/old-file.jpg");
```

## 🎨 Real-World Use Cases

### 1. User Management System

```typescript
// User registration with tracking
const userId = await mutate({
  action: "createWithId",
  path: "users",
  data: {
    email: "user@example.com",
    displayName: "John Doe",
    role: "user",
    preferences: {
      theme: "dark",
      notifications: true,
    },
  },
  actionBy: "registration-form",
});

// Update user profile
await mutate({
  action: "update",
  path: `users/${userId}`,
  data: {
    lastActive: new Date().toISOString(),
    profileComplete: true,
  },
  actionBy: "profile-update",
});
```

### 2. Document Management

```typescript
// Upload document with metadata
const uploadResult = await file.upload({
  file: document,
  path: `documents/${userId}/reports/annual-report.pdf`,
  metadata: {
    category: "reports",
    year: "2024",
    department: "finance",
    confidential: "true",
  },
  uploadedBy: userId,
});

// Save document reference in database
await mutate({
  action: "create",
  path: `users/${userId}/documents/${Date.now()}`,
  data: {
    fileName: uploadResult.name,
    fileUrl: uploadResult.url,
    fileSize: uploadResult.size,
    category: "reports",
    tags: ["annual", "finance", "2024"],
  },
  actionBy: "document-upload",
});
```

### 3. Real-time Chat System

```typescript
// Send message
await mutate({
  action: "createWithId",
  path: "chats/room123/messages",
  data: {
    text: "Hello everyone!",
    senderId: "user456",
    timestamp: new Date().toISOString(),
    type: "text",
  },
  actionBy: "chat-send",
});

// Listen for new messages
const unsubscribe = await mutate({
  action: "onValue",
  path: "chats/room123/messages",
  actionBy: "chat-listener",
});
```

### 4. E-commerce Inventory

```typescript
// Add product
await mutate({
  action: "create",
  path: "products/prod123",
  data: {
    name: "Wireless Headphones",
    price: 99.99,
    stock: 50,
    category: "electronics",
    images: ["url1", "url2"],
    specifications: {
      battery: "20 hours",
      connectivity: "Bluetooth 5.0",
    },
  },
  actionBy: "inventory-manager",
});

// Update stock after purchase
await mutate({
  action: "update",
  path: "products/prod123",
  data: {
    stock: 49,
    lastSold: new Date().toISOString(),
  },
  actionBy: "checkout-system",
});
```

## 🛠️ Advanced Features

### Error Handling

```typescript
try {
  const result = await mutate({
    action: "get",
    path: "users/nonexistent",
  });
} catch (error) {
  if (error.message === "Firebase not initialized") {
    // Handle initialization error
  }
  // Handle other errors
}
```

### Batch Operations

```typescript
// Multiple operations in sequence
const operations = [
  { action: "create", path: "users/1", data: { name: "User 1" } },
  { action: "create", path: "users/2", data: { name: "User 2" } },
  { action: "create", path: "users/3", data: { name: "User 3" } },
];

for (const op of operations) {
  await mutate(op);
}
```

## 📋 API Reference

### `mutate(options)`

| Parameter  | Type     | Required | Description                                                                |
| ---------- | -------- | -------- | -------------------------------------------------------------------------- |
| `action`   | `string` | ✅       | `"create"`, `"createWithId"`, `"update"`, `"delete"`, `"get"`, `"onValue"` |
| `path`     | `string` | ✅       | Database path (e.g., `"users/123"`)                                        |
| `data`     | `object` | ⚠️       | Data to write (required for create/update)                                 |
| `actionBy` | `string` | ❌       | Identifier for tracking (default: `"anonymous"`)                           |

### `file.upload(options)`

| Parameter    | Type       | Required | Description           |
| ------------ | ---------- | -------- | --------------------- |
| `file`       | `File`     | ✅       | File object to upload |
| `path`       | `string`   | ✅       | Storage path          |
| `metadata`   | `object`   | ❌       | Custom metadata       |
| `onProgress` | `function` | ❌       | Progress callback     |
| `uploadedBy` | `string`   | ❌       | Uploader identifier   |

### `file.list(path)` & `file.delete(path)`

Simple methods for listing and deleting files.

## 🤝 Contributing

We welcome contributions!
