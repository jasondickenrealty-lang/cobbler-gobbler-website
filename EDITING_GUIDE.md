# 📝 EDITING YOUR WEBSITE - QUICK GUIDE

## 📸 ADDING IMAGES

### Step 1: Add Your Images
Put your image files here:
```
c:\Users\jason\OneDrive\Desktop\cobbler-gobbler\website\public\images\
```

Example files:
- `hero.jpg` - Main homepage image
- `storefront.jpg` - Store photo
- `ice-cream-1.jpg` - Menu item photos
- `logo.png` - Your logo

### Step 2: Use Images in Pages

**Homepage Hero Image** - Edit `src/app/page.tsx`:
```tsx
<Image 
  src="/images/hero.jpg" 
  alt="Cobbler Gobbler Ice Cream"
  width={1200}
  height={600}
  className="rounded-lg"
/>
```

**Menu Item Image** - Edit `src/app/menu/page.tsx`:
```tsx
<div className="flex gap-4">
  <Image 
    src="/images/vanilla-ice-cream.jpg" 
    alt="Vanilla ice cream"
    width={200}
    height={200}
    className="rounded-lg"
  />
  <div>
    <h3>Vanilla Bean</h3>
    <p>Classic Madagascar vanilla</p>
  </div>
</div>
```

---

## 🎨 COMMON EDITS

### 1. CHANGE MENU ITEMS
**File:** `src/app/menu/page.tsx`

Find this section (around line 5):
```tsx
const menuItems = [
  {
    category: 'Ice Cream',
    items: [
      { name: 'Vanilla Bean', description: 'Classic Madagascar vanilla', price: '$4.50' },
      { name: 'Chocolate Fudge', description: 'Rich dark chocolate', price: '$4.50' },
      // ADD MORE ITEMS HERE
    ],
  },
];
```

**Add a new item:**
```tsx
{ name: 'Cookie Dough', description: 'Chocolate chip cookie pieces', price: '$5.50' },
```

---

### 2. UPDATE BUSINESS INFORMATION
**File:** `src/app/location/page.tsx`

**Change Address** (around line 18):
```tsx
<p>123 Main Street</p>              ← YOUR STREET
<p>Sweetville, ST 12345</p>         ← YOUR CITY/ZIP
<p>📞 (555) 123-4567</p>            ← YOUR PHONE
<p>✉️ info@cobblergobbler.com</p>  ← YOUR EMAIL
```

**Change Hours** (around line 35):
```tsx
<div className="flex justify-between">
  <span>Monday - Thursday</span>
  <span>11am - 9pm</span>           ← YOUR HOURS
</div>
```

---

### 3. EDIT HOMEPAGE TEXT
**File:** `src/app/page.tsx`

**Main Heading** (around line 13):
```tsx
<h1 className="text-5xl font-bold mb-4">
  Welcome to Cobbler Gobbler           ← CHANGE THIS
</h1>
<p className="text-xl mb-8">
  Homemade Ice Cream & Delicious Desserts  ← CHANGE THIS
</p>
```

**Features Section** (around line 30):
```tsx
<h3>Fresh Daily</h3>
<p>Made fresh every day with premium ingredients</p>  ← CHANGE THIS
```

---

### 4. UPDATE ABOUT PAGE
**File:** `src/app/about/page.tsx`

**Your Story** (around line 15):
```tsx
<p className="text-gray-700 leading-relaxed">
  Cobbler Gobbler Ice Cream Shop has been serving the community since 2010.
  ← WRITE YOUR STORY HERE
</p>
```

---

### 5. CHANGE COLORS
**File:** `tailwind.config.ts`

```tsx
colors: {
  primary: '#8B4513',    // Brown - Main brand color
  secondary: '#FFB6C1',  // Pink - Accent color
  accent: '#FFA07A',     // Peach - Call-to-action buttons
},
```

**Popular color options:**
- Blue: `#3B82F6`
- Purple: `#9333EA`
- Green: `#10B981`
- Red: `#EF4444`

---

### 6. ADD YOUR LOGO
**File:** `src/components/Navbar.tsx` (around line 16)

```tsx
<Link href="/" className="text-2xl font-bold">
  <Image src="/images/logo.png" alt="Logo" width={120} height={40} />
</Link>
```

---

## 🚀 PUBLISH CHANGES

After editing files:

```powershell
cd c:\Users\jason\OneDrive\Desktop\cobbler-gobbler\website

# 1. See what changed
git status

# 2. Add all changes
git add .

# 3. Save with a message
git commit -m "Updated menu and added photos"

# 4. Push to live site
git push
```

**Wait 2 minutes** - Your changes will be live at:
https://cobbler-gobbler-website-q19i.vercel.app/

---

## 📁 FILE LOCATIONS

| What to Edit | File Location |
|--------------|---------------|
| Homepage | `src/app/page.tsx` |
| Menu items | `src/app/menu/page.tsx` |
| About page | `src/app/about/page.tsx` |
| Hours & location | `src/app/location/page.tsx` |
| Navigation bar | `src/components/Navbar.tsx` |
| Footer | `src/components/Footer.tsx` |
| Colors/styles | `tailwind.config.ts` |
| Images | `public/images/` |

---

## 💡 TIPS

1. **Test Locally First**
   ```powershell
   npm run dev
   ```
   Visit: http://localhost:3000

2. **Use Free Stock Photos**
   - Unsplash: https://unsplash.com
   - Pexels: https://pexels.com
   - Search: "ice cream" "dessert" "storefront"

3. **Optimize Images**
   - Use JPG for photos (smaller file size)
   - Use PNG for logos (transparent background)
   - Recommended size: 1200px wide or less

4. **Common Image Sizes**
   - Hero image: 1920x1080px
   - Menu item: 400x400px
   - Logo: 300x100px

---

## 🆘 NEED HELP?

**Preview changes before pushing:**
```powershell
npm run dev
```
Then visit: http://localhost:3000

**Undo last commit:**
```powershell
git reset --soft HEAD~1
```

**Check deployment status:**
Visit: https://vercel.com/dashboard

---

## 🎯 QUICK EXAMPLES

### Add Store Photo to About Page

1. Put photo in: `public/images/storefront.jpg`
2. Edit `src/app/about/page.tsx`:

```tsx
<div className="mb-8">
  <Image 
    src="/images/storefront.jpg" 
    alt="Cobbler Gobbler Store"
    width={800}
    height={500}
    className="rounded-lg shadow-lg"
  />
</div>
```

3. Save, commit, push!

---

**Your website is ready to customize! 🎨**
