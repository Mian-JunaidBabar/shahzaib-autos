# Deployment Guide - AM Motors

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

Vercel is made by the creators of Next.js and offers the best integration.

#### Steps:
1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - AM Motors website"
   git branch -M main
   git remote add origin https://github.com/yourusername/am-motors.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Deploy"
   - Done! Your site is live in ~2 minutes

3. **Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., ammotors.pk)
   - Update DNS records as instructed

#### Vercel Features:
- ✅ Automatic deployments on git push
- ✅ Preview deployments for pull requests
- ✅ Free SSL certificate
- ✅ Global CDN
- ✅ Analytics included
- ✅ 100% Next.js compatible

**Cost**: Free for hobby projects

---

### Option 2: Netlify

Great alternative with similar features to Vercel.

#### Steps:
1. Push code to GitHub (same as above)
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import existing project"
4. Select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Click "Deploy"

**Cost**: Free tier available

---

### Option 3: Traditional VPS/Shared Hosting

For hosting on your own server or shared hosting.

#### Requirements:
- Node.js 18+ installed
- PM2 or similar process manager
- Nginx or Apache (optional, for reverse proxy)

#### Steps:

1. **Build the project locally**
   ```bash
   npm run build
   ```

2. **Transfer files to server**
   ```bash
   # Upload these folders/files:
   - .next/
   - public/
   - node_modules/ (or run npm install on server)
   - package.json
   - next.config.ts
   ```

3. **Install dependencies on server**
   ```bash
   npm install --production
   ```

4. **Start with PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "am-motors" -- start
   pm2 save
   pm2 startup
   ```

5. **Setup Nginx (optional)**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

**Cost**: Varies by hosting provider

---

### Option 4: Docker Deployment

For containerized deployments.

#### Create Dockerfile:
```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

#### Build and run:
```bash
docker build -t am-motors .
docker run -p 3000:3000 am-motors
```

---

## 🔧 Pre-Deployment Checklist

### Required Updates
- [ ] Update WhatsApp number from placeholder
- [ ] Update contact email and phone
- [ ] Update business address
- [ ] Add real product data
- [ ] Upload product images
- [ ] Add company logo
- [ ] Update Privacy Policy
- [ ] Test all forms

### Technical Checks
- [ ] Run `npm run build` successfully
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Verify all links work
- [ ] Check image loading
- [ ] Test cart functionality
- [ ] Validate SEO metadata
- [ ] Check console for errors

### Security
- [ ] Remove console.log statements
- [ ] Set up environment variables
- [ ] Configure CORS if needed
- [ ] Add rate limiting (if backend exists)
- [ ] Set up monitoring/analytics

---

## 🌐 Environment Variables

Create `.env.local` for local development and add these to your deployment platform:

```bash
# WhatsApp & Contact
NEXT_PUBLIC_WHATSAPP_NUMBER=923001234567
NEXT_PUBLIC_BUSINESS_EMAIL=info@ammotors.pk
NEXT_PUBLIC_BUSINESS_PHONE=+923001234567

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional: When you add backend
DATABASE_URL=postgresql://...
API_SECRET_KEY=your-secret-key
```

### Setting Environment Variables:

**Vercel:**
- Project Settings → Environment Variables
- Add each variable with name and value

**Netlify:**
- Site Settings → Environment Variables
- Add each variable

**Traditional Server:**
- Create `.env.production` file on server
- Add variables (don't commit to git!)

---

## 📊 Post-Deployment

### 1. Add Analytics
```bash
npm install @vercel/analytics
```

In `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

// In the return statement:
<Analytics />
```

### 2. Setup Monitoring
- Vercel Analytics (built-in)
- Google Analytics
- Sentry for error tracking

### 3. SEO Setup
- Submit sitemap to Google Search Console
- Add robots.txt
- Verify meta tags
- Test with Google's Rich Results Test

### 4. Performance
- Test with Lighthouse
- Optimize images further
- Enable caching
- Consider CDN for static assets

---

## 🐛 Troubleshooting Deployment Issues

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Images Not Loading
- Ensure images are in `public/` folder
- Check image paths (case-sensitive)
- Verify next/image configuration

### 404 on Refresh (SPA mode)
- Not an issue with Next.js
- Ensure hosting supports Next.js routing
- Vercel/Netlify handle this automatically

### Environment Variables Not Working
- Prefix with `NEXT_PUBLIC_` for client-side access
- Restart development server after adding
- Re-deploy after changing on hosting platform

---

## 📞 Support

### Vercel
- Documentation: https://vercel.com/docs
- Support: dashboard.vercel.com/support

### Netlify
- Documentation: https://docs.netlify.com
- Support: answers.netlify.com

### Next.js
- Documentation: https://nextjs.org/docs
- Community: github.com/vercel/next.js/discussions

---

## 🔄 Continuous Deployment

### Automatic Deployments
Once connected to GitHub:
1. Make changes locally
2. Commit and push
3. Deployment happens automatically
4. Preview URL provided for testing
5. Merge to main for production deployment

### Deployment Workflow
```bash
# Development
git checkout -b feature/new-products
# Make changes
git add .
git commit -m "Add new products"
git push origin feature/new-products
# Preview deployment created automatically

# Production
git checkout main
git merge feature/new-products
git push origin main
# Production deployment starts automatically
```

---

## 💰 Cost Estimates

| Platform | Free Tier | Paid Tier | Best For |
|----------|-----------|-----------|----------|
| Vercel | 100GB bandwidth | $20/mo+ | Most recommended |
| Netlify | 100GB bandwidth | $19/mo+ | Great alternative |
| DigitalOcean | - | $5/mo+ | Full control |
| AWS/Azure | Complex | Varies | Enterprise |

**Recommendation for AM Motors**: Start with Vercel free tier, upgrade if needed.

---

**Ready to Deploy?** Follow Option 1 (Vercel) for the quickest and easiest deployment!
