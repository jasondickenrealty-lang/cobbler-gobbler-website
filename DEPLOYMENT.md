# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Firebase CLI installed: `npm install -g firebase-tools`
- Vercel account
- Firebase project credentials

## Step-by-Step Deployment

### Step 1: Install Dependencies

```powershell
cd c:\Users\jason\OneDrive\Desktop\cobbler-gobbler\website
npm install
```

### Step 2: Configure Environment Variables

```powershell
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your Firebase credentials
code .env.local
```

Add your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cobbler-gobbler-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cobbler-gobbler-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cobbler-gobbler-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Step 3: Deploy Firestore Security Rules

```powershell
# Login to Firebase (if not already)
firebase login

# Deploy security rules
firebase deploy --only firestore:rules --project your-project-id
```

### Step 4: Test Locally

```powershell
npm run dev
```

Visit http://localhost:3000 and verify:
- ✅ Public pages load correctly
- ✅ Employee login redirects work
- ✅ Cannot access employee pages without login

### Step 5: Create Test Employee User

Use Firebase Console:
1. Go to Authentication
2. Add user: `test@cobblergobbler.com`
3. Go to Firestore
4. Create document in `users` collection:
   - Document ID: [the user's UID]
   - Fields:
     ```json
     {
       "role": "employee",
       "active": true,
       "email": "test@cobblergobbler.com"
     }
     ```

### Step 6: Deploy to Vercel

```powershell
# Install Vercel CLI
npm i -g vercel

# Deploy (follow prompts)
vercel
```

During setup:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **cobbler-gobbler-website**
- In which directory? **./**
- Override settings? **N**

### Step 7: Add Environment Variables to Vercel

Option 1: Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable from `.env.local`

Option 2: Vercel CLI
```powershell
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# Paste value when prompted
# Select Production, Preview, Development (all)
# Repeat for each variable
```

### Step 8: Production Deployment

```powershell
# Deploy to production
vercel --prod
```

### Step 9: Verify Production

Visit your Vercel URL and test:
- ✅ All public pages load
- ✅ Login works
- ✅ Protected routes are secure
- ✅ Data loads from Firestore

## Quick Commands Reference

```powershell
# Development
npm run dev

# Build
npm run build

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy to Vercel preview
vercel

# Deploy to Vercel production
vercel --prod

# View logs
vercel logs
```

## Troubleshooting

### Firebase Connection Issues
- Verify `.env.local` has correct values
- Check Firebase project is active
- Ensure billing is enabled (free tier works)

### Vercel Build Failures
```powershell
# Test build locally
npm run build
```

### Authentication Not Working
- Verify environment variables in Vercel
- Check Firestore rules are deployed
- Ensure user document exists in Firestore

### Pages Not Loading
- Clear browser cache
- Check Vercel deployment logs
- Verify all files were deployed

## Production Checklist

- [ ] Environment variables configured in Vercel
- [ ] Firestore security rules deployed
- [ ] Test user created and verified
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] Protected routes redirect properly
- [ ] Data loads from Firestore collections
- [ ] Mobile responsive design verified
- [ ] SSL certificate active (automatic with Vercel)

## Updating the Site

```powershell
# Make changes
# Test locally
npm run dev

# Commit changes
git add .
git commit -m "Update description"
git push

# Vercel auto-deploys on git push if connected
# Or manually deploy:
vercel --prod
```

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Wait for DNS propagation (up to 48 hours)

## Monitoring

- Vercel Dashboard: https://vercel.com/dashboard
- Firebase Console: https://console.firebase.google.com
- Analytics: Enable in Vercel Pro plan

## Backup

```powershell
# Backup Firestore
firebase firestore:export gs://your-bucket-name/backup-folder

# Backup code
git push origin main
```

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Firebase Docs: https://firebase.google.com/docs
