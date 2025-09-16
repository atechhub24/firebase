# @atechhub/firebase Documentation

A comprehensive Firebase utility package that simplifies Firebase operations for React applications.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [Realtime Database](#realtime-database)
  - [Storage](#storage)
- [Examples](#examples)
- [Playground](#playground)
- [Contributing](#contributing)

## Installation

```bash
npm install @atechhub/firebase firebase
# or
yarn add @atechhub/firebase firebase
# or
pnpm add @atechhub/firebase firebase
```

## Quick Start

### 1. Initialize Firebase

First, initialize Firebase in your application:

```javascript
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
};

initializeApp(firebaseConfig);
```

### 2. Use the Utilities

```javascript
import { mutate, file } from "@atechhub/firebase";

// Database operations
await mutate({
  path: "users/123",
  data: { name: "John Doe", email: "john@example.com" },
  action: "create",
  actionBy: "user123",
});

// File upload
const result = await file.upload({
  file: selectedFile,
  path: "uploads/avatar.jpg",
  onProgress: (progress) => console.log(`${progress}% uploaded`),
});
```

## API Reference

### Realtime Database

#### `mutate(options)`

A unified function for all database operations.

**Parameters:**

- `path` (string): Database path
- `data` (object, optional): Data to write
- `action` (string): Operation type - 'create', 'update', 'delete', 'createWithId', 'get', 'onValue'
- `actionBy` (string, optional): User identifier (default: 'anonymous')

**Returns:** Promise that resolves to the operation result

**Examples:**

```javascript
// Create data
await mutate({
  path: "posts/post1",
  data: { title: "Hello World", content: "First post" },
  action: "create",
  actionBy: "user123",
});

// Create with auto-generated ID
const newId = await mutate({
  path: "posts",
  data: { title: "New Post", content: "Content here" },
  action: "createWithId",
  actionBy: "user123",
});

// Update data
await mutate({
  path: "posts/post1",
  data: { title: "Updated Title" },
  action: "update",
  actionBy: "user123",
});

// Get data
const data = await mutate({
  path: "posts/post1",
  action: "get",
});

// Listen for changes
const unsubscribe = await mutate({
  path: "posts",
  action: "onValue",
});

// Delete data
await mutate({
  path: "posts/post1",
  action: "delete",
});
```

#### `removeUndefinedFields(obj)`

Recursively removes undefined fields from objects/arrays.

**Parameters:**

- `obj` (any): Object to clean

**Returns:** Cleaned object without undefined fields

#### `generateSystemInfo(actionBy)`

Generates system information for tracking operations.

**Parameters:**

- `actionBy` (string): User identifier

**Returns:** Object with system information (timestamp, browser, platform, etc.)

### Storage

#### `file.upload(options)`

Upload files to Firebase Storage with progress tracking.

**Parameters:**

- `file` (File): File to upload
- `path` (string): Storage path
- `metadata` (object, optional): Custom metadata
- `onProgress` (function, optional): Progress callback
- `uploadedBy` (string, optional): User identifier

**Returns:** Promise resolving to upload result

**Example:**

```javascript
const result = await file.upload({
  file: selectedFile,
  path: "uploads/documents/file.pdf",
  metadata: { category: "document", public: "true" },
  onProgress: (progress) => {
    console.log(`Upload progress: ${progress}%`);
  },
  uploadedBy: "user123",
});

console.log("File uploaded:", result.url);
```

#### `file.delete(path)`

Delete a file from Firebase Storage.

**Parameters:**

- `path` (string): Storage path of file to delete

**Returns:** Promise

**Example:**

```javascript
await file.delete("uploads/documents/file.pdf");
```

#### `file.list(path)`

List all files in a storage directory.

**Parameters:**

- `path` (string): Storage directory path

**Returns:** Promise resolving to array of file information

**Example:**

```javascript
const files = await file.list("uploads/documents/");
console.log("Files:", files);
```

## Examples

### Complete CRUD Example

```javascript
import { mutate, file } from "@atechhub/firebase";

class BlogManager {
  // Create a new blog post
  async createPost(postData, userId) {
    const postId = await mutate({
      path: "posts",
      data: {
        title: postData.title,
        content: postData.content,
        author: userId,
        published: false,
      },
      action: "createWithId",
      actionBy: userId,
    });

    return postId;
  }

  // Update existing post
  async updatePost(postId, updates, userId) {
    await mutate({
      path: `posts/${postId}`,
      data: updates,
      action: "update",
      actionBy: userId,
    });
  }

  // Get all posts
  async getAllPosts() {
    return await mutate({
      path: "posts",
      action: "get",
    });
  }

  // Listen for post changes
  subscribeToPost(postId, callback) {
    return mutate({
      path: `posts/${postId}`,
      action: "onValue",
    }).then((unsubscribe) => {
      // Handle the subscription
      return unsubscribe;
    });
  }

  // Upload post image
  async uploadPostImage(file, postId, userId) {
    const result = await file.upload({
      file: file,
      path: `posts/${postId}/images/${file.name}`,
      metadata: {
        postId: postId,
        type: "post-image",
      },
      uploadedBy: userId,
      onProgress: (progress) => {
        console.log(`Image upload: ${progress}%`);
      },
    });

    // Update post with image URL
    await this.updatePost(
      postId,
      {
        imageUrl: result.url,
        imagePath: result.path,
      },
      userId
    );

    return result;
  }

  // Delete post and its images
  async deletePost(postId, userId) {
    // Get post data first to find images
    const postData = await mutate({
      path: `posts/${postId}`,
      action: "get",
    });

    // Delete associated images
    if (postData.imagePath) {
      await file.delete(postData.imagePath);
    }

    // Delete the post
    await mutate({
      path: `posts/${postId}`,
      action: "delete",
    });
  }
}
```

### File Management Example

```javascript
import { file } from "@atechhub/firebase";

class FileManager {
  async uploadMultipleFiles(files, userId) {
    const uploads = files.map((file) =>
      file.upload({
        file: file,
        path: `uploads/${userId}/${Date.now()}_${file.name}`,
        uploadedBy: userId,
        onProgress: (progress) => {
          console.log(`${file.name}: ${progress}%`);
        },
      })
    );

    return Promise.all(uploads);
  }

  async getUserFiles(userId) {
    return await file.list(`uploads/${userId}/`);
  }

  async deleteUserFile(filePath) {
    await file.delete(filePath);
  }
}
```

## Error Handling

All functions throw errors that should be handled:

```javascript
try {
  await mutate({
    path: "posts/123",
    action: "get",
  });
} catch (error) {
  if (error.message === "Firebase not initialized") {
    console.error("Please initialize Firebase first");
  } else {
    console.error("Database error:", error);
  }
}
```

## Best Practices

1. **Always initialize Firebase** before using any utilities
2. **Handle errors** appropriately in your application
3. **Use meaningful paths** for better data organization
4. **Include actionBy** parameter for audit trails
5. **Clean up listeners** to prevent memory leaks
6. **Use appropriate file paths** for storage organization
7. **Set proper metadata** for uploaded files

## Playground

Visit the [interactive playground](./playground.html) to test all features with your Firebase configuration.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
