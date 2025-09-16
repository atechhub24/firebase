import { useState } from "react";
import {
  Code,
  Copy,
  Check,
  Play,
  Book,
  Zap,
  Database,
  HardDrive,
} from "lucide-react";
import CodeBlock from "./CodeBlock";

interface Example {
  id: string;
  title: string;
  description: string;
  category: "database" | "storage" | "utilities" | "advanced";
  code: string;
  explanation: string;
}

const CodeExamples: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  const categories = [
    { id: "all", name: "All Examples", icon: Code },
    { id: "database", name: "Database", icon: Database },
    { id: "storage", name: "Storage", icon: HardDrive },
    { id: "utilities", name: "Utilities", icon: Zap },
    { id: "advanced", name: "Advanced", icon: Book },
  ];

  const examples: Example[] = [
    {
      id: "basic-crud",
      title: "Basic CRUD Operations",
      description:
        "Essential database operations - Create, Read, Update, Delete",
      category: "database",
      code: `import { mutate } from "@atechhub/firebase";

// Create a user
const userId = await mutate({
  path: "users",
  data: {
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    preferences: {
      theme: "dark",
      notifications: true
    }
  },
  action: "createWithId",
  actionBy: "admin"
});

console.log("Created user with ID:", userId);

// Read user data
const userData = await mutate({
  path: \`users/\${userId}\`,
  action: "get"
});

console.log("User data:", userData);

// Update user
await mutate({
  path: \`users/\${userId}\`,
  data: {
    age: 31,
    lastLogin: new Date().toISOString()
  },
  action: "update",
  actionBy: "system"
});

// Delete user
await mutate({
  path: \`users/\${userId}\`,
  action: "delete"
});`,
      explanation:
        "This example shows the four basic database operations. Each operation includes metadata like timestamps and user tracking automatically.",
    },
    {
      id: "file-upload-progress",
      title: "File Upload with Progress",
      description: "Upload files with real-time progress tracking",
      category: "storage",
      code: `import { file } from "@atechhub/firebase";

const uploadFileWithProgress = async (selectedFile, userId) => {
  try {
    const result = await file.upload({
      file: selectedFile,
      path: \`users/\${userId}/profile/\${selectedFile.name}\`,
      metadata: {
        uploadedBy: userId,
        category: "profile",
        originalName: selectedFile.name,
        uploadDate: new Date().toISOString()
      },
      onProgress: (progress) => {
        // Update your UI progress bar
        console.log(\`Upload progress: \${progress.toFixed(1)}%\`);
        
        // Example: Update a progress bar element
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
          progressBar.style.width = \`\${progress}%\`;
        }
      },
      uploadedBy: userId
    });

    console.log("File uploaded successfully:");
    console.log("URL:", result.url);
    console.log("Path:", result.path);
    console.log("Size:", result.size);
    
    return result;
  } catch (error) {
    console.error("Upload failed:", error.message);
    throw error;
  }
};

// Usage
const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    await uploadFileWithProgress(file, 'user123');
  }
});`,
      explanation:
        "This example demonstrates file upload with progress tracking. The onProgress callback allows you to update your UI in real-time.",
    },
    {
      id: "data-cleaning",
      title: "Data Cleaning Utilities",
      description: "Clean and validate data before Firebase operations",
      category: "utilities",
      code: `import { removeUndefinedFields, generateSystemInfo } from "@atechhub/firebase";

// Example data with undefined values
const rawUserData = {
  name: "Alice Smith",
  email: "alice@example.com",
  age: undefined,
  address: {
    street: "123 Main St",
    city: "New York",
    zipCode: undefined,
    country: "USA"
  },
  preferences: {
    theme: "light",
    language: undefined,
    notifications: {
      email: true,
      push: undefined,
      sms: false
    }
  },
  tags: ["developer", undefined, "javascript", undefined]
};

// Clean the data
const cleanedData = removeUndefinedFields(rawUserData);
console.log("Cleaned data:", cleanedData);

// Generate system information
const systemInfo = generateSystemInfo("alice123");
console.log("System info:", systemInfo);

// Combine for a complete record
const completeRecord = {
  ...cleanedData,
  metadata: {
    createdAt: new Date().toISOString(),
    systemInfo: systemInfo,
    dataVersion: "1.0"
  }
};

// Now safe to send to Firebase
await mutate({
  path: "users/alice123",
  data: completeRecord,
  action: "create",
  actionBy: "alice123"
});`,
      explanation:
        "Use utility functions to clean data and add system information. This ensures your Firebase data is consistent and trackable.",
    },
    {
      id: "real-time-listener",
      title: "Real-time Data Listener",
      description: "Listen for real-time changes in your data",
      category: "database",
      code: `import { mutate } from "@atechhub/firebase";

class ChatManager {
  constructor(chatId) {
    this.chatId = chatId;
    this.unsubscribe = null;
    this.messageHandlers = new Set();
  }

  // Start listening for new messages
  async startListening() {
    try {
      this.unsubscribe = await mutate({
        path: \`chats/\${this.chatId}/messages\`,
        action: "onValue"
      });

      console.log("Started listening for messages");
    } catch (error) {
      console.error("Failed to start listening:", error);
    }
  }

  // Stop listening
  stopListening() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
      console.log("Stopped listening for messages");
    }
  }

  // Send a message
  async sendMessage(message, userId) {
    const messageData = {
      text: message,
      senderId: userId,
      timestamp: new Date().toISOString(),
      edited: false,
      reactions: {}
    };

    const messageId = await mutate({
      path: \`chats/\${this.chatId}/messages\`,
      data: messageData,
      action: "createWithId",
      actionBy: userId
    });

    return messageId;
  }

  // Get chat history
  async getChatHistory() {
    return await mutate({
      path: \`chats/\${this.chatId}/messages\`,
      action: "get"
    });
  }
}

// Usage
const chatManager = new ChatManager("chat123");

// Start listening
await chatManager.startListening();

// Send a message
await chatManager.sendMessage("Hello everyone!", "user123");

// Clean up when component unmounts
// chatManager.stopListening();`,
      explanation:
        "Real-time listeners keep your app synchronized with database changes. Always remember to clean up listeners to prevent memory leaks.",
    },
    {
      id: "batch-operations",
      title: "Batch File Operations",
      description: "Handle multiple files efficiently",
      category: "storage",
      code: `import { file } from "@atechhub/firebase";

class FileManager {
  constructor(userId) {
    this.userId = userId;
    this.basePath = \`users/\${userId}/files\`;
  }

  // Upload multiple files with progress tracking
  async uploadMultipleFiles(files, category = "general") {
    const uploadPromises = Array.from(files).map((fileItem, index) => {
      return this.uploadSingleFile(fileItem, category, index);
    });

    try {
      const results = await Promise.allSettled(uploadPromises);
      
      const successful = results
        .filter(result => result.status === "fulfilled")
        .map(result => result.value);
      
      const failed = results
        .filter(result => result.status === "rejected")
        .map(result => result.reason);

      console.log(\`Uploaded \${successful.length} files successfully\`);
      if (failed.length > 0) {
        console.log(\`Failed to upload \${failed.length} files:\`, failed);
      }

      return { successful, failed };
    } catch (error) {
      console.error("Batch upload error:", error);
      throw error;
    }
  }

  async uploadSingleFile(fileItem, category, index) {
    const timestamp = Date.now();
    const fileName = \`\${timestamp}_\${index}_\${fileItem.name}\`;
    const filePath = \`\${this.basePath}/\${category}/\${fileName}\`;

    return await file.upload({
      file: fileItem,
      path: filePath,
      metadata: {
        category,
        originalName: fileItem.name,
        uploadIndex: index,
        fileType: fileItem.type,
        fileSize: fileItem.size
      },
      onProgress: (progress) => {
        console.log(\`File \${index + 1}: \${progress.toFixed(1)}%\`);
      },
      uploadedBy: this.userId
    });
  }

  // Get all files by category
  async getFilesByCategory(category) {
    const files = await file.list(\`\${this.basePath}/\${category}/\`);
    return files.sort((a, b) => 
      new Date(b.timeCreated) - new Date(a.timeCreated)
    );
  }

  // Delete multiple files
  async deleteFiles(filePaths) {
    const deletePromises = filePaths.map(path => 
      file.delete(path).catch(error => ({ error, path }))
    );

    const results = await Promise.allSettled(deletePromises);
    
    const successful = results
      .filter(result => result.status === "fulfilled" && !result.value?.error)
      .length;
    
    const failed = results
      .filter(result => result.status === "rejected" || result.value?.error)
      .map(result => result.value?.path || "unknown");

    return { successful, failed };
  }
}

// Usage
const fileManager = new FileManager("user123");

// Upload multiple files
const fileInput = document.getElementById("multiple-files");
const files = fileInput.files;

const { successful, failed } = await fileManager.uploadMultipleFiles(
  files, 
  "documents"
);

console.log("Upload results:", { successful, failed });`,
      explanation:
        "Batch operations help you handle multiple files efficiently. Use Promise.allSettled to handle partial failures gracefully.",
    },
    {
      id: "advanced-patterns",
      title: "Advanced Usage Patterns",
      description: "Complex scenarios with error handling and optimization",
      category: "advanced",
      code: `import { mutate, file, removeUndefinedFields } from "@atechhub/firebase";

class BlogPostManager {
  constructor(userId) {
    this.userId = userId;
    this.retryAttempts = 3;
    this.retryDelay = 1000;
  }

  // Create a blog post with image upload and error handling
  async createBlogPost(postData, imageFile = null) {
    const transaction = new BlogTransaction();

    try {
      // Step 1: Validate and clean data
      const cleanedData = removeUndefinedFields({
        title: postData.title?.trim(),
        content: postData.content?.trim(),
        tags: postData.tags?.filter(tag => tag?.trim()),
        published: postData.published || false,
        category: postData.category,
        excerpt: postData.excerpt?.trim()
      });

      if (!cleanedData.title || !cleanedData.content) {
        throw new Error("Title and content are required");
      }

      // Step 2: Create the post
      const postId = await this.retryOperation(async () => {
        return await mutate({
          path: "posts",
          data: {
            ...cleanedData,
            authorId: this.userId,
            wordCount: cleanedData.content.split(" ").length,
            readingTime: Math.ceil(cleanedData.content.split(" ").length / 200)
          },
          action: "createWithId",
          actionBy: this.userId
        });
      });

      transaction.addCleanup(() => this.deletePost(postId));

      // Step 3: Upload featured image if provided
      let imageUrl = null;
      if (imageFile) {
        const imageResult = await this.retryOperation(async () => {
          return await file.upload({
            file: imageFile,
            path: \`posts/\${postId}/featured-image.\${imageFile.name.split('.').pop()}\`,
            metadata: {
              postId,
              imageType: "featured",
              altText: postData.imageAlt || cleanedData.title
            },
            uploadedBy: this.userId
          });
        });

        imageUrl = imageResult.url;
        transaction.addCleanup(() => file.delete(imageResult.path));

        // Update post with image URL
        await this.retryOperation(async () => {
          return await mutate({
            path: \`posts/\${postId}\`,
            data: { 
              featuredImage: imageUrl,
              featuredImagePath: imageResult.path
            },
            action: "update",
            actionBy: this.userId
          });
        });
      }

      // Step 4: Update user's post count
      await this.incrementUserPostCount();

      transaction.commit();
      
      return {
        postId,
        imageUrl,
        success: true,
        message: "Blog post created successfully"
      };

    } catch (error) {
      console.error("Failed to create blog post:", error);
      await transaction.rollback();
      
      return {
        success: false,
        error: error.message,
        message: "Failed to create blog post"
      };
    }
  }

  // Retry mechanism for flaky operations
  async retryOperation(operation, attempts = this.retryAttempts) {
    for (let i = 0; i < attempts; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === attempts - 1) throw error;
        
        console.warn(\`Operation failed, retrying... (\${i + 1}/\${attempts})\`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (i + 1)));
      }
    }
  }

  async incrementUserPostCount() {
    const currentCount = await mutate({
      path: \`users/\${this.userId}/stats/postCount\`,
      action: "get"
    }) || 0;

    await mutate({
      path: \`users/\${this.userId}/stats\`,
      data: { postCount: currentCount + 1 },
      action: "update",
      actionBy: this.userId
    });
  }

  async deletePost(postId) {
    try {
      // Get post data to find associated files
      const postData = await mutate({
        path: \`posts/\${postId}\`,
        action: "get"
      });

      // Delete associated image if exists
      if (postData?.featuredImagePath) {
        await file.delete(postData.featuredImagePath);
      }

      // Delete the post
      await mutate({
        path: \`posts/\${postId}\`,
        action: "delete"
      });

      return true;
    } catch (error) {
      console.error("Failed to delete post:", error);
      return false;
    }
  }
}

// Simple transaction helper
class BlogTransaction {
  constructor() {
    this.cleanupOperations = [];
    this.committed = false;
  }

  addCleanup(operation) {
    this.cleanupOperations.push(operation);
  }

  commit() {
    this.committed = true;
    this.cleanupOperations = [];
  }

  async rollback() {
    if (this.committed) return;

    for (const cleanup of this.cleanupOperations.reverse()) {
      try {
        await cleanup();
      } catch (error) {
        console.error("Cleanup operation failed:", error);
      }
    }
  }
}

// Usage
const blogManager = new BlogPostManager("user123");

const result = await blogManager.createBlogPost({
  title: "My First Blog Post",
  content: "This is the content of my blog post...",
  tags: ["javascript", "firebase", "tutorial"],
  category: "tech",
  published: true
}, imageFile);

if (result.success) {
  console.log("Post created:", result.postId);
} else {
  console.error("Failed:", result.error);
}`,
      explanation:
        "This advanced example shows error handling, retry mechanisms, transaction-like patterns, and cleanup operations for robust applications.",
    },
  ];

  const filteredExamples =
    selectedCategory === "all"
      ? examples
      : examples.filter((example) => example.category === selectedCategory);

  const copyExample = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedExample(id);
      setTimeout(() => setCopiedExample(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Code className="h-5 w-5 mr-2" />
          Code Examples & Patterns
        </h3>

        <p className="text-gray-600 mb-4">
          Ready-to-use code examples for common Firebase operations. Copy and
          adapt these patterns for your projects.
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-6">
        {filteredExamples.map((example) => (
          <div key={example.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {example.title}
                </h4>
                <p className="text-gray-600 text-sm mb-2">
                  {example.description}
                </p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    example.category === "database"
                      ? "bg-blue-100 text-blue-800"
                      : example.category === "storage"
                      ? "bg-green-100 text-green-800"
                      : example.category === "utilities"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {example.category}
                </span>
              </div>

              <button
                onClick={() => copyExample(example.code, example.id)}
                className="btn btn-secondary text-sm"
                title="Copy entire example"
              >
                {copiedExample === example.id ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </>
                )}
              </button>
            </div>

            <CodeBlock code={example.code} language="javascript" />

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h5 className="text-sm font-medium text-blue-800 mb-1">
                💡 Explanation
              </h5>
              <p className="text-sm text-blue-700">{example.explanation}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredExamples.length === 0 && (
        <div className="card text-center py-8">
          <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No examples found
          </h3>
          <p className="text-gray-600">
            Try selecting a different category to see more examples.
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="card bg-yellow-50 border-yellow-200">
        <h4 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          Pro Tips
        </h4>
        <ul className="space-y-2 text-sm text-yellow-700">
          <li>• Always handle errors appropriately in production code</li>
          <li>• Use meaningful paths and consistent naming conventions</li>
          <li>• Clean up real-time listeners to prevent memory leaks</li>
          <li>• Include actionBy parameter for audit trails</li>
          <li>• Test with your actual Firebase rules and permissions</li>
          <li>• Consider implementing retry logic for critical operations</li>
        </ul>
      </div>
    </div>
  );
};

export default CodeExamples;
