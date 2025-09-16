# Troubleshooting Guide

Common issues and solutions when using the @atechhub/firebase playground.

## 🔥 Firebase Initialization Issues

### Error: "Firebase: No Firebase App '[DEFAULT]' has been created"

**Cause**: Firebase hasn't been properly initialized or the initialization failed.

**Solutions**:

1. **Refresh and re-enter config**: Close the browser tab, reopen, and re-enter your Firebase configuration
2. **Check config format**: Ensure your Firebase config is valid JSON
3. **Verify required fields**: Make sure you have `apiKey`, `authDomain`, and `projectId` at minimum

### Error: "Firebase not initialized. Please check your configuration"

**Cause**: The Firebase app was not created successfully.

**Solutions**:

1. **Double-check your Firebase config**: Ensure all fields are correct
2. **Try the form input method**: If JSON input fails, try the individual form fields
3. **Check browser console**: Look for additional error details in the developer console

## 🗄️ Database Issues

### Error: "Permission denied"

**Cause**: Firebase Security Rules are blocking the operation.

**Solutions**:

1. **Check your Firebase Security Rules**:
   ```javascript
   // For testing only - NOT for production!
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
2. **Verify authentication**: Some rules require user authentication
3. **Check the path**: Ensure you're accessing the correct database path

### Error: "Invalid JSON data"

**Cause**: The data you're trying to send contains invalid JSON.

**Solutions**:

1. **Validate JSON syntax**: Use a JSON validator or the browser console
2. **Remove undefined values**: Use the `removeUndefinedFields` utility
3. **Check for trailing commas**: JSON doesn't allow trailing commas

### Database path not found

**Solutions**:

1. **Create the path first**: Use a "create" operation to establish the path
2. **Check path format**: Use forward slashes, e.g., `users/123/profile`
3. **Verify database URL**: Ensure your `databaseURL` in config is correct

## 📁 Storage Issues

### Error: "storage/unauthorized"

**Cause**: Firebase Storage rules are blocking the operation.

**Solutions**:

1. **Update Storage Rules**:
   ```javascript
   // For testing only - NOT for production!
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if true;
       }
     }
   }
   ```
2. **Check authentication requirements**: Some rules require user auth

### Error: "storage/object-not-found"

**Cause**: The file or directory doesn't exist.

**Solutions**:

1. **Check file path**: Ensure the exact path exists
2. **Upload a file first**: Create the directory structure by uploading
3. **Use correct path format**: e.g., `uploads/documents/file.pdf`

### File upload fails

**Solutions**:

1. **Check file size**: Firebase has size limits
2. **Verify file type**: Some file types might be blocked
3. **Check storage bucket**: Ensure `storageBucket` in config is correct

## 🌐 Network Issues

### Error: "Network error" or timeouts

**Solutions**:

1. **Check internet connection**: Ensure you're online
2. **Try different network**: Switch to different WiFi or mobile data
3. **Check Firebase status**: Visit [Firebase Status Page](https://status.firebase.google.com/)
4. **Disable VPN**: Some VPNs can interfere with Firebase

## 🔧 Configuration Issues

### Invalid Firebase configuration

**Common mistakes**:

1. **Missing quotes**: Ensure all string values are quoted in JSON
2. **Wrong project ID**: Double-check your Firebase project ID
3. **Incorrect URLs**: Verify `authDomain` and `databaseURL` match your project

### Example valid configuration:

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

## 🛡️ Security Rules for Testing

### Realtime Database (FOR TESTING ONLY):

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### Storage (FOR TESTING ONLY):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **WARNING**: These rules allow anyone to read/write your data. Only use for testing!

## 🔍 Debugging Tips

### Enable detailed logging:

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for error messages and warnings
4. Check Network tab for failed requests

### Common console errors and solutions:

| Error Message                              | Solution                                       |
| ------------------------------------------ | ---------------------------------------------- |
| `Firebase: Error (auth/api-key-not-valid)` | Check your API key in config                   |
| `Firebase: Error (app/duplicate-app)`      | Refresh the page to clear duplicate apps       |
| `CORS error`                               | Check if your domain is authorized in Firebase |
| `Permission denied`                        | Update Firebase Security Rules                 |

## 📞 Getting Help

If you're still having issues:

1. **Check the browser console** for detailed error messages
2. **Verify your Firebase project settings** in the Firebase Console
3. **Test with a simple operation** like getting data from root path `/`
4. **Try with a fresh Firebase project** to isolate configuration issues

## 🔗 Useful Links

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firebase Status Page](https://status.firebase.google.com/)
