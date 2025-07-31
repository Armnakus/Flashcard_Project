# Deployment Instructions

## 📋 Prerequisites

1. Make sure you have a GitHub repository named `Flashcard_Project`
2. Enable GitHub Pages in your repository settings
3. Install dependencies: `npm install`

## 🚀 Deployment Methods

### Method 1: Automatic Deployment (Recommended)

The project is configured with GitHub Actions for automatic deployment:

1. Push your code to the `main` or `master` branch
2. GitHub Actions will automatically build and deploy your site
3. Your site will be available at: `https://Armnakus.github.io/Flashcard_Project`

### Method 2: Manual Deployment

```bash
# Option A: Use the deploy script
./deploy.sh

# Option B: Manual commands
npm run build
npm run deploy
```

## ⚙️ Configuration

The following files have been configured for deployment:

- `package.json`: Added homepage URL and deploy scripts
- `vite.config.ts`: Added base path for GitHub Pages
- `.github/workflows/deploy.yml`: GitHub Actions workflow
- `deploy.sh`: Manual deployment script

## 🔧 GitHub Repository Setup

1. Create a new repository on GitHub named `Flashcard_Project`
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Armnakus/Flashcard_Project.git
git push -u origin main
```

3. Enable GitHub Pages:
   - Go to repository Settings
   - Scroll to Pages section
   - Select "Deploy from a branch"
   - Choose `gh-pages` branch
   - Click Save

## 🌐 Access Your Site

After deployment, your site will be available at:
**https://Armnakus.github.io/Flashcard_Project**

## 🐛 Troubleshooting

### Common Issues:

1. **404 Error**: Make sure the base path in `vite.config.ts` matches your repository name
2. **Build Fails**: Check that all dependencies are installed with `npm install`
3. **GitHub Pages Not Working**: Ensure GitHub Pages is enabled in repository settings

### Debug Commands:

```bash
# Test local build
npm run build
npm run preview

# Check for errors
npm run lint
```

## 📝 Notes

- The site uses GitHub Pages with the `gh-pages` branch
- Automatic deployment triggers on push to main/master branch
- Manual deployment can be done with `npm run deploy`
- The production build includes proper base path configuration