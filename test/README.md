# @atechhub/firebase - Interactive Playground & Documentation

This directory contains the interactive playground and comprehensive documentation for the `@atechhub/firebase` package.

## 🎮 Interactive Playground

A full-featured web application to test all package features with your Firebase configuration.

### Features

- **📊 Firebase Configuration Setup** - Secure local-only config input
- **🗄️ Database Playground** - Test all CRUD operations with live results
- **📁 Storage Playground** - Upload, list, and delete files with progress tracking
- **📝 Code Examples** - Ready-to-use patterns for common scenarios
- **📖 Complete Documentation** - API reference, examples, and best practices

### Quick Start

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

3. **Open in Browser**
   - Navigate to `http://localhost:5173`
   - Enter your Firebase configuration
   - Start testing!

### Firebase Configuration

The playground requires your Firebase project configuration. You can input it in two ways:

#### Option 1: JSON Input (Recommended)

Paste your complete Firebase config object:

```json
{
  "apiKey": "AIzaSyC...",
  "authDomain": "your-project.firebaseapp.com",
  "databaseURL": "https://your-project-default-rtdb.firebaseio.com",
  "projectId": "your-project-id",
  "storageBucket": "your-project.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:123456789:web:abcdef123456"
}
```

#### Option 2: Form Input

Fill out individual fields in the form interface.

### Getting Your Firebase Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on Project Settings (gear icon)
4. Scroll to "Your apps" section
5. Copy the config object from your web app

## 📖 Documentation

### Complete API Documentation

- **Location**: `docs/README.md`
- **Contents**: Full API reference, examples, error handling, best practices

### Key Documentation Sections

1. **Installation & Setup** - Get started quickly
2. **Database API** - Complete `mutate()` function reference
3. **Storage API** - File operations with `file` object
4. **Utility Functions** - Data cleaning and system info
5. **Complete Examples** - Real-world usage patterns
6. **Error Handling** - Comprehensive error management
7. **Best Practices** - Production-ready patterns

## 🎯 Playground Features

### Database Operations

- ✅ Create data at specific paths
- ✅ Create data with auto-generated IDs
- ✅ Read data from any path
- ✅ Update existing data
- ✅ Delete data
- ✅ Real-time listeners (onValue)
- ✅ Live code generation
- ✅ Quick example templates

### Storage Operations

- ✅ File upload with progress tracking
- ✅ List files in directories
- ✅ Delete files
- ✅ Custom metadata support
- ✅ Multiple file handling
- ✅ File type detection
- ✅ Size formatting

### Code Examples

- ✅ Basic CRUD operations
- ✅ File upload with progress
- ✅ Data cleaning utilities
- ✅ Real-time listeners
- ✅ Batch operations
- ✅ Advanced patterns with error handling
- ✅ Copy-to-clipboard functionality
- ✅ Category filtering

## 🛠️ Development

### Project Structure

```
test/
├── src/
│   ├── components/
│   │   ├── App.tsx                    # Main application
│   │   ├── FirebaseConfigForm.tsx     # Config input form
│   │   ├── PlaygroundDashboard.tsx    # Main playground interface
│   │   ├── Documentation.tsx          # Interactive documentation
│   │   ├── DatabasePlayground.tsx     # Database operations testing
│   │   ├── StoragePlayground.tsx      # File operations testing
│   │   ├── CodeExamples.tsx           # Code examples and patterns
│   │   └── CodeBlock.tsx              # Syntax-highlighted code display
│   ├── App.css                        # Utility CSS classes
│   └── main.tsx                       # App entry point
├── docs/
│   └── README.md                      # Complete documentation
├── public/
├── package.json                       # Dependencies
└── vite.config.ts                     # Vite configuration
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Lucide React** - Icons
- **Custom CSS** - Tailwind-like utility classes

## 🔒 Security Notes

- **Local Only**: Your Firebase configuration is stored only in your browser's memory
- **No Server**: No data is sent to any external servers
- **Secure Testing**: Safe environment to test with real Firebase projects

## 🎨 UI Features

- **Modern Design** - Clean, professional interface
- **Responsive Layout** - Works on desktop and mobile
- **Dark Code Blocks** - Syntax-highlighted code display
- **Interactive Forms** - Real-time validation and feedback
- **Progress Indicators** - Visual feedback for operations
- **Error Handling** - User-friendly error messages
- **Copy to Clipboard** - Easy code copying
- **Tabbed Interface** - Organized feature sections

## 📝 Usage Tips

1. **Start with Documentation** - Review the API before testing
2. **Use Small Data** - Test with small datasets first
3. **Check Firebase Rules** - Ensure your rules allow the operations
4. **Monitor Console** - Check browser console for detailed logs
5. **Test Incrementally** - Start simple, then try complex operations
6. **Copy Examples** - Use the code examples as starting points

## 🤝 Contributing

To contribute to the playground:

1. Make your changes
2. Test thoroughly with different Firebase configurations
3. Update documentation if needed
4. Submit a pull request

---

**Happy Testing! 🚀**
