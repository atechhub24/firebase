import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import CodeBlock from "./CodeBlock";

const Documentation: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "quick-start",
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const sections = [
    {
      id: "installation",
      title: "Installation",
      content: (
        <div className="space-y-4">
          <p>Install the package along with Firebase:</p>
          <CodeBlock
            code={`npm install @atechhub/firebase firebase
# or
yarn add @atechhub/firebase firebase
# or
pnpm add @atechhub/firebase firebase`}
            language="bash"
          />
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
            <h4 className="text-lg font-semibold mb-2">
              1. Initialize Firebase
            </h4>
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
                  <code className="code-inline">action</code> (string) -
                  'create', 'update', 'delete', 'createWithId', 'get', 'onValue'
                </li>
                <li>
                  <code className="code-inline">actionBy</code> (string,
                  optional) - User identifier
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
              <h5 className="font-semibold mb-2">
                generateSystemInfo(actionBy)
              </h5>
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
                  <code className="code-inline">metadata</code> (object,
                  optional) - Custom metadata
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
      id: "examples",
      title: "Complete Examples",
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold mb-3">Blog Manager Example</h4>
            <CodeBlock
              code={`import { mutate, file } from '@atechhub/firebase';

class BlogManager {
  // Create a new blog post
  async createPost(postData, userId) {
    const postId = await mutate({
      path: 'posts',
      data: {
        title: postData.title,
        content: postData.content,
        author: userId,
        published: false,
        createdAt: new Date().toISOString()
      },
      action: 'createWithId',
      actionBy: userId
    });
    
    return postId;
  }

  // Update existing post
  async updatePost(postId, updates, userId) {
    await mutate({
      path: \`posts/\${postId}\`,
      data: {
        ...updates,
        lastModified: new Date().toISOString()
      },
      action: 'update',
      actionBy: userId
    });
  }

  // Get all posts
  async getAllPosts() {
    return await mutate({
      path: 'posts',
      action: 'get'
    });
  }

  // Upload post image
  async uploadPostImage(file, postId, userId) {
    const result = await file.upload({
      file: file,
      path: \`posts/\${postId}/images/\${file.name}\`,
      metadata: {
        postId: postId,
        type: 'post-image'
      },
      uploadedBy: userId,
      onProgress: (progress) => {
        console.log(\`Image upload: \${progress}%\`);
      }
    });

    // Update post with image URL
    await this.updatePost(postId, {
      imageUrl: result.url,
      imagePath: result.path
    }, userId);

    return result;
  }

  // Delete post and its images
  async deletePost(postId, userId) {
    const postData = await mutate({
      path: \`posts/\${postId}\`,
      action: 'get'
    });

    // Delete associated images
    if (postData.imagePath) {
      await file.delete(postData.imagePath);
    }

    // Delete the post
    await mutate({
      path: \`posts/\${postId}\`,
      action: 'delete'
    });
  }
}

// Usage
const blogManager = new BlogManager();

// Create a post
const postId = await blogManager.createPost({
  title: 'My First Post',
  content: 'Hello world!'
}, 'user123');

// Upload an image
await blogManager.uploadPostImage(imageFile, postId, 'user123');`}
              language="javascript"
            />
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">File Manager Example</h4>
            <CodeBlock
              code={`import { file } from '@atechhub/firebase';

class FileManager {
  async uploadMultipleFiles(files, userId) {
    const uploads = files.map(file => 
      file.upload({
        file: file,
        path: \`uploads/\${userId}/\${Date.now()}_\${file.name}\`,
        uploadedBy: userId,
        onProgress: (progress) => {
          console.log(\`\${file.name}: \${progress}%\`);
        }
      })
    );

    return Promise.all(uploads);
  }

  async getUserFiles(userId) {
    return await file.list(\`uploads/\${userId}/\`);
  }

  async deleteUserFile(filePath) {
    await file.delete(filePath);
  }

  async organizeFilesByType(userId) {
    const files = await this.getUserFiles(userId);
    
    const organized = {
      images: [],
      documents: [],
      others: []
    };

    files.forEach(file => {
      if (file.contentType?.startsWith('image/')) {
        organized.images.push(file);
      } else if (file.contentType?.includes('pdf') || 
                 file.contentType?.includes('document')) {
        organized.documents.push(file);
      } else {
        organized.others.push(file);
      }
    });

    return organized;
  }
}

// Usage
const fileManager = new FileManager();

// Upload multiple files
const results = await fileManager.uploadMultipleFiles(
  [file1, file2, file3], 
  'user123'
);

// Get organized files
const organizedFiles = await fileManager.organizeFilesByType('user123');`}
              language="javascript"
            />
          </div>
        </div>
      ),
    },
    {
      id: "error-handling",
      title: "Error Handling",
      content: (
        <div className="space-y-4">
          <p>
            All functions throw errors that should be handled appropriately:
          </p>

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
            <h5 className="font-semibold text-yellow-800 mb-2">
              Common Errors:
            </h5>
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
                <li>
                  Leave real-time listeners running after component unmount
                </li>
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
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          @atechhub/firebase Documentation
        </h1>
        <p className="text-lg text-gray-600">
          A comprehensive Firebase utility package that simplifies Firebase
          operations for React applications.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => {
          const isExpanded = expandedSections.includes(section.id);

          return (
            <div key={section.id} className="card">
              <button
                onClick={() => toggleSection(section.id)}
                className="flex items-center justify-between w-full text-left"
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  {section.title}
                </h2>
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
              </button>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
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
