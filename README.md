# Cobbler Gobbler Ice Cream Shop Website

Production-ready Next.js website with Firebase integration.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Firebase (Auth & Firestore)
- Vercel (Deployment)

## Quick Start

### 1. Install Dependencies

```bash
cd website
npm install
```

### 2. Configure Firebase

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Deploy Firestore Security Rules

```bash
firebase deploy --only firestore:rules
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
website/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── layout.tsx         # Root layout with AuthProvider
│   │   ├── page.tsx           # Homepage
│   │   ├── menu/              # Menu page
│   │   ├── about/             # About page
│   │   ├── location/          # Hours & Location page
│   │   └── employee/          # Employee portal
│   │       ├── login/         # Login page
│   │       ├── dashboard/     # Employee dashboard
│   │       ├── schedule/      # Schedule page
│   │       └── announcements/ # Announcements page
│   ├── components/            # React components
│   │   ├── Navbar.tsx        # Public navigation
│   │   ├── EmployeeNavbar.tsx # Employee navigation
│   │   ├── Footer.tsx        # Footer component
│   │   └── ProtectedRoute.tsx # Route protection
│   ├── contexts/              # React contexts
│   │   └── AuthContext.tsx   # Firebase auth context
│   └── lib/                   # Utilities
│       └── firebase.ts       # Firebase configuration
├── public/                    # Static assets
├── firestore.rules           # Firestore security rules
└── package.json
```

## Firestore Collections

### users
```typescript
{
  role: 'owner' | 'manager' | 'employee',
  active: boolean,
  email: string
}
```

### schedules
```typescript
{
  employeeId: string,
  date: string,
  startTime: string,
  endTime: string,
  position: string
}
```

### announcements
```typescript
{
  title: string,
  message: string,
  createdAt: string,
  priority: 'low' | 'medium' | 'high',
  createdBy: string
}
```

## Creating Test Users

Use Firebase Console or Firebase Admin SDK to create users:

```javascript
// Example: Create in Firestore after creating auth user
await setDoc(doc(db, 'users', userId), {
  role: 'employee',
  active: true,
  email: 'employee@cobblergobbler.com'
});
```

## Deployment to Vercel

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Deploy

```bash
cd website
vercel
```

### 3. Add Environment Variables

In Vercel Dashboard:
1. Go to Project Settings
2. Select "Environment Variables"
3. Add all NEXT_PUBLIC_FIREBASE_* variables
4. Redeploy

### 4. Production Deployment

```bash
vercel --prod
```

## Features

### Public Pages
- Homepage with hero and features
- Menu with categories
- About page
- Hours & Location page

### Employee Portal
- Firebase Authentication
- Role-based access control
- Protected routes
- Dashboard with user info
- Schedule management
- Announcements system

## Security

- Firestore security rules enforce authentication
- Role-based access control
- Active user verification
- Protected routes redirect to login

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Support

For issues or questions, contact the development team.
