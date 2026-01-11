# AM Motors - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install & Run
```bash
npm install
npm run dev
```
Visit: http://localhost:3000

### Step 2: Update Your Information
1. **Business Contact** → `components/layout/footer.tsx` and `app/contact/page.tsx`
2. **WhatsApp Number** → Search for `923001234567` and replace
3. **Logo** → Add to `public/logo.png` and update header

### Step 3: Add Your Products
Edit `data/index.ts`:
```typescript
{
  id: "9",
  name: "Your Product Name",
  slug: "your-product-name",
  description: "Product description",
  price: 5000,
  category: "floor-mats", // or your category
  image: "/products/your-image.jpg",
  images: ["/products/your-image.jpg"],
  inStock: true,
}
```

## 📁 Key Files to Edit

| File | Purpose |
|------|---------|
| `data/index.ts` | Add/edit products & categories |
| `components/layout/footer.tsx` | Business info in footer |
| `app/contact/page.tsx` | Contact details |
| `app/about/page.tsx` | About page content |
| `components/layout/header.tsx` | Navigation & WhatsApp |

## 🎨 Customization

### Change Colors
Edit `app/globals.css`:
```css
:root {
  --primary: 221 83% 53%; /* Change this HSL value */
}
```

### Change Logo
1. Add logo to `public/logo.png`
2. Update in `components/layout/header.tsx`:
```tsx
<Image src="/logo.png" alt="AM Motors" width={40} height={40} />
```

### Add Categories
In `data/index.ts`, add to `categories` array:
```typescript
{
  id: "7",
  name: "New Category",
  slug: "new-category",
  description: "Description",
  image: "/categories/image.jpg",
  productCount: 0,
}
```

## 📸 Adding Product Images

### Option 1: Local Images
1. Add images to `public/products/`
2. Reference: `/products/image.jpg`

### Option 2: External URLs
Use full URLs in product data:
```typescript
image: "https://yourdomain.com/image.jpg"
```

### Recommended Image Sizes
- Product images: 800x800px
- Category images: 1200x800px
- Thumbnails: Auto-optimized by Next.js

## 🔧 Common Tasks

### Add a New Page
1. Create `app/your-page/page.tsx`
2. Add link in `components/layout/header.tsx`
3. Add link in `components/layout/footer.tsx`

### Modify Cart Behavior
Edit `contexts/cart-context.tsx`

### Change Homepage Sections
Edit `app/page.tsx`

### Update SEO
Edit metadata in each page's layout or page file:
```typescript
export const metadata = {
  title: "Your Title",
  description: "Your description",
}
```

## 🐛 Troubleshooting

### Development server won't start
```bash
rm -rf .next
npm install
npm run dev
```

### TypeScript errors
```bash
npm run build
# Fix reported errors
```

### Images not loading
- Check file paths (case-sensitive)
- Ensure images are in `public/` folder
- Use next/image component

### Cart not persisting
- Check browser localStorage
- Ensure JavaScript is enabled
- Clear browser cache

## 📦 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)
1. Push to GitHub
2. Import on vercel.com
3. Deploy automatically

### Deploy to Other Platforms
- Build output: `.next` folder
- Required: Node.js 18+
- Environment: Production

## 🔐 Environment Variables

Create `.env.local` for sensitive data:
```
NEXT_PUBLIC_WHATSAPP_NUMBER=923001234567
NEXT_PUBLIC_BUSINESS_EMAIL=info@ammotors.pk
```

Access in code:
```typescript
process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
```

## 📞 Need Help?

1. Check `README.md` for full documentation
2. See `IMPLEMENTATION.md` for technical details
3. Review Next.js docs: https://nextjs.org/docs
4. Contact development team

## ✅ Pre-Launch Checklist

- [ ] All business information updated
- [ ] Real products added with images
- [ ] WhatsApp number working
- [ ] Contact details correct
- [ ] Test on mobile devices
- [ ] All links working
- [ ] Forms submitting (even if no backend)
- [ ] SEO metadata set
- [ ] Favicon added
- [ ] Privacy policy reviewed

---

**Quick Reference**: This is a Next.js 14 App Router project with TypeScript and Tailwind CSS. All pages are in the `app/` folder, components in `components/`, and data in `data/`.
