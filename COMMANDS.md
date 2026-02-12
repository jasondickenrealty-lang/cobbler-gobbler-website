# TERMINAL COMMANDS - Copy & Paste Ready

## Initial Setup

```powershell
# Navigate to project
cd c:\Users\jason\OneDrive\Desktop\cobbler-gobbler\website

# Install dependencies
npm install

# Create environment file
copy .env.example .env.local

# Edit environment file (add your Firebase config)
code .env.local
```

## Firebase Setup

```powershell
# Login to Firebase
firebase login

# Deploy Firestore security rules
firebase deploy --only firestore:rules
```

## Local Development

```powershell
# Start development server
npm run dev

# Build for production (test)
npm run build

# Start production build locally
npm run start
```

## Deployment to Vercel

```powershell
# Install Vercel CLI globally
npm install -g vercel

# First deployment (follow prompts)
vercel

# Deploy to production
vercel --prod

# Add environment variables (repeat for each)
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
```

## Git Setup (Optional but Recommended)

```powershell
# Initialize git in website folder
cd c:\Users\jason\OneDrive\Desktop\cobbler-gobbler\website
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Cobbler Gobbler website"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/cobbler-gobbler-website.git

# Push
git push -u origin main
```

## Update Deployment

```powershell
# Pull latest changes
git pull

# Install any new dependencies
npm install

# Deploy
vercel --prod
```

## Useful Commands

```powershell
# View Vercel logs
vercel logs

# List Vercel deployments
vercel list

# Remove a deployment
vercel remove [deployment-url]

# View environment variables
vercel env ls

# Firebase emulator (for testing)
firebase emulators:start
```

## Troubleshooting Commands

```powershell
# Clear Next.js cache
Remove-Item -Recurse -Force .next

# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install

# Check Node version (should be 18+)
node --version

# Check npm version
npm --version

# Test Firebase connection
firebase projects:list
```

## VS Code Terminal Setup

```powershell
# Open project in VS Code
cd c:\Users\jason\OneDrive\Desktop\cobbler-gobbler\website
code .
```

Then use the integrated terminal (Ctrl + `) and run:

```powershell
npm run dev
```

---

## COMPLETE SETUP FROM SCRATCH

Run these commands in order:

```powershell
# 1. Navigate to website folder
cd c:\Users\jason\OneDrive\Desktop\cobbler-gobbler\website

# 2. Install dependencies
npm install

# 3. Create environment file
copy .env.example .env.local

# 4. Edit .env.local with your Firebase config
# (Do this step manually in VS Code or your editor)

# 5. Test locally
npm run dev
# Visit http://localhost:3000

# 6. Deploy Firestore rules
firebase deploy --only firestore:rules

# 7. Deploy to Vercel
vercel

# 8. Add environment variables in Vercel dashboard or CLI

# 9. Production deployment
vercel --prod

# Done! Visit your Vercel URL
```
