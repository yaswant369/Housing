# Tailwind CSS v4 Setup Guide

This document provides a comprehensive guide to setting up Tailwind CSS v4 in your project and resolving common diagnostic issues.

## Configuration Files

### 1. PostCSS Configuration (`postcss.config.js`)
```javascript
// PostCSS configuration for Tailwind CSS v4
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### 2. Vite Configuration (`vite.config.js`)
```javascript
// Vite config with Tailwind CSS v4 support
export default {
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
}
```

### 3. Tailwind Configuration (`tailwind.config.js`)
```javascript
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    // Your custom theme configuration
  },
  plugins: [],
}
```

### 4. CSS Custom Data (`tailwind.css.json`)
```json
{
  "atDirectives": [
    {
      "name": "@tailwind",
      "description": "Use the `@tailwind` directive to insert Tailwind's `base`, `components`, and `utilities` styles into your CSS."
    },
    {
      "name": "@screen",
      "description": "Use the `@screen` directive to create media queries that reference your breakpoints by name instead of duplicating their values in your own CSS."
    },
    {
      "name": "@layer",
      "description": "Use the `@layer` directive to tell Tailwind which \"bucket\" a set of custom styles belong to."
    }
  ]
}
```

### 5. VSCode Settings (`.vscode/settings.json`)
```json
{
  "css.validate": true,
  "css.customData": [
    "./tailwind.css.json"
  ],
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "html": "html",
    "jsx": "javascript"
  },
  "editor.formatOnSave": true,
  "files.associations": {
    "*.css": "css"
  }
}
```

### 6. VSCode Extensions (`.vscode/extensions.json`)
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-json"
  ]
}
```

## Troubleshooting

### If you still see "Unknown at rule" errors:

1. **Restart VSCode completely**
   - Close all VSCode windows
   - Reopen the project
   - The CSS language server needs to reload with the new configuration

2. **Install the Tailwind CSS IntelliSense extension**
   - Install "bradlc.vscode-tailwindcss" from VSCode marketplace
   - This extension provides the best Tailwind CSS support

3. **Check file associations**
   - Ensure CSS files are properly associated
   - VSCode should recognize `.css` files as CSS

4. **Verify configuration**
   - Ensure all configuration files are in the correct locations
   - Check that the paths in `settings.json` are correct

### Common Issues and Solutions

#### Issue: `@tailwind` directives not recognized
- **Solution**: Ensure PostCSS config exists and VSCode is restarted
- **Check**: PostCSS config should use `@tailwindcss/postcss` for v4

#### Issue: `@screen` directives not recognized
- **Solution**: CSS custom data file should resolve this
- **Alternative**: Install Tailwind CSS IntelliSense extension

#### Issue: Build errors with Tailwind
- **Solution**: Check that all dependencies are installed
- **Command**: `npm install` in the frontend directory

#### Issue: Vendor prefix warnings
- **Solution**: Already fixed in `index.css` with standard properties
- **Check**: Ensure line-clamp has both webkit and standard properties

## Installation Commands

If you need to install dependencies:
```bash
cd frontend
npm install
```

To start the development server:
```bash
npm run dev
```

## Build for Production
```bash
npm run build
```

## Expected Results

After applying these configurations:
- ✅ No "Unknown at rule @tailwind" errors
- ✅ No "Unknown at rule @screen" errors  
- ✅ No vendor prefix warnings for line-clamp
- ✅ Tailwind CSS classes are properly highlighted
- ✅ IntelliSense works for Tailwind utilities
- ✅ Build process works without errors

## File Structure

```
frontend/
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tailwind.css.json          # CSS custom data for VSCode
├── vite.config.js             # Vite configuration
├── .vscode/
│   ├── settings.json          # VSCode settings
│   └── extensions.json        # Recommended extensions
└── src/
    └── index.css              # Main CSS file with Tailwind directives
```

## Support

If issues persist after following this guide:
1. Ensure VSCode is completely restarted
2. Verify all configuration files are present and correctly formatted
3. Check that Tailwind CSS v4.1.12 is installed (`npm list tailwindcss`)
4. Consider installing additional VSCode extensions for better Tailwind support