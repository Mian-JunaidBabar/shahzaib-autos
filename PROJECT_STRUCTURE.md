# AM Motors - Complete Project Structure

```
am-motors/
│
├── 📁 app/                           # Next.js App Router - All pages live here
│   ├── 📁 about/
│   │   └── page.tsx                 # About AM Motors page
│   ├── 📁 booking/
│   │   ├── layout.tsx               # Metadata for booking
│   │   └── page.tsx                 # Service booking form
│   ├── 📁 cart/
│   │   ├── layout.tsx               # Metadata for cart
│   │   └── page.tsx                 # Shopping cart page
│   ├── 📁 checkout/
│   │   ├── layout.tsx               # Metadata for checkout
│   │   └── page.tsx                 # Checkout form (COD/Bank)
│   ├── 📁 contact/
│   │   └── page.tsx                 # Contact information & map
│   ├── 📁 faq/
│   │   ├── layout.tsx               # Metadata for FAQ
│   │   └── page.tsx                 # FAQ accordion
│   ├── 📁 policies/
│   │   └── page.tsx                 # Privacy & Terms
│   ├── 📁 products/
│   │   ├── 📁 [slug]/
│   │   │   ├── layout.tsx           # Dynamic metadata
│   │   │   └── page.tsx             # Product detail page
│   │   ├── layout.tsx               # Products metadata
│   │   └── page.tsx                 # Product listing with filters
│   ├── favicon.ico                  # Site favicon
│   ├── globals.css                  # Global styles & Tailwind
│   ├── layout.tsx                   # Root layout (Header/Footer)
│   ├── not-found.tsx                # Custom 404 page
│   └── page.tsx                     # Home page
│
├── 📁 components/                    # Reusable React components
│   ├── 📁 layout/
│   │   ├── footer.tsx               # Site footer with links & info
│   │   └── header.tsx               # Navigation header with cart
│   ├── 📁 ui/                       # shadcn/ui components
│   │   ├── badge.tsx                # Badge component
│   │   ├── button.tsx               # Button with variants
│   │   ├── card.tsx                 # Card container
│   │   ├── input.tsx                # Form input
│   │   └── textarea.tsx             # Textarea input
│   ├── category-card.tsx            # Category display card
│   ├── cta-section.tsx              # Call-to-action sections
│   ├── product-card.tsx             # Product card with "Add to Cart"
│   └── whatsapp-button.tsx          # WhatsApp buttons (floating & inline)
│
├── 📁 contexts/                      # React Context for state management
│   └── cart-context.tsx             # Shopping cart state & actions
│
├── 📁 data/                          # Static/Mock data
│   └── index.ts                     # Products, categories, FAQs
│
├── 📁 lib/                           # Utility functions
│   └── utils.ts                     # cn(), formatPrice(), etc.
│
├── 📁 public/                        # Static assets (served as-is)
│   ├── next.svg                     # Next.js logo
│   └── vercel.svg                   # Vercel logo
│   └── (add your images here)       # Product photos, logos, etc.
│
├── 📁 types/                         # TypeScript type definitions
│   └── index.ts                     # Product, Category, Cart, etc.
│
├── 📁 .next/                         # Build output (auto-generated)
├── 📁 node_modules/                  # Dependencies (auto-generated)
│
├── .gitignore                       # Git ignore rules
├── DEPLOYMENT.md                    # 📘 Deployment instructions
├── eslint.config.mjs                # ESLint configuration
├── IMPLEMENTATION.md                # 📘 Full implementation details
├── next-env.d.ts                    # Next.js TypeScript declarations
├── next.config.ts                   # Next.js configuration
├── package.json                     # Dependencies & scripts
├── package-lock.json                # Locked dependency versions
├── postcss.config.mjs               # PostCSS configuration
├── QUICK_START.md                   # 📘 Quick start guide
├── README.md                        # 📘 Main documentation
├── tailwind.config.ts               # Tailwind CSS configuration
└── tsconfig.json                    # TypeScript configuration
```

---

## 📄 File Descriptions

### Core Application Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with Header, Footer, CartProvider |
| `app/page.tsx` | Home page with hero, features, products |
| `app/globals.css` | Global styles, Tailwind imports, CSS variables |

### Page Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Home page |
| `/products` | `app/products/page.tsx` | Product listing |
| `/products/[slug]` | `app/products/[slug]/page.tsx` | Product detail |
| `/cart` | `app/cart/page.tsx` | Shopping cart |
| `/checkout` | `app/checkout/page.tsx` | Checkout form |
| `/booking` | `app/booking/page.tsx` | Service booking |
| `/about` | `app/about/page.tsx` | About page |
| `/contact` | `app/contact/page.tsx` | Contact page |
| `/faq` | `app/faq/page.tsx` | FAQ page |
| `/policies` | `app/policies/page.tsx` | Privacy & Terms |

### Component Categories

#### Layout Components
- `header.tsx` - Navigation with cart counter
- `footer.tsx` - Business info and links

#### Feature Components
- `product-card.tsx` - Product display with "Add to Cart"
- `category-card.tsx` - Category browsing
- `cta-section.tsx` - Marketing CTAs
- `whatsapp-button.tsx` - WhatsApp integration

#### UI Components (shadcn/ui)
- `button.tsx` - Customizable button
- `card.tsx` - Container component
- `input.tsx` - Form input
- `textarea.tsx` - Multi-line input
- `badge.tsx` - Labels and tags

### Data & Configuration

| File | Purpose |
|------|---------|
| `data/index.ts` | Products, categories, FAQs |
| `types/index.ts` | TypeScript interfaces |
| `lib/utils.ts` | Helper functions |
| `contexts/cart-context.tsx` | Cart state management |

### Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js settings |
| `tailwind.config.ts` | Tailwind theme & colors |
| `tsconfig.json` | TypeScript compiler options |
| `package.json` | Dependencies & scripts |

---

## 🎯 Key Directories Explained

### `/app` Directory
- **Purpose**: All pages and routes
- **Structure**: File-based routing
- **Special Files**:
  - `layout.tsx` - Shared layout
  - `page.tsx` - Page component
  - `not-found.tsx` - 404 page

### `/components` Directory
- **Purpose**: Reusable React components
- **Organization**:
  - `/layout` - Layout-specific
  - `/ui` - Base UI components
  - Root - Feature components

### `/public` Directory
- **Purpose**: Static assets
- **Usage**: Direct URL access
- **Examples**: `/logo.png` → `public/logo.png`

### `/data` Directory
- **Purpose**: Mock/static data
- **Note**: Replace with API calls when backend is ready

---

## 📝 File Naming Conventions

### Pages
- `page.tsx` - Main page component
- `layout.tsx` - Layout wrapper
- `not-found.tsx` - 404 page

### Components
- `kebab-case.tsx` - Component files
- PascalCase for component names
- Clear, descriptive names

### Folders
- `lowercase` for routes
- `[slug]` for dynamic routes
- `(group)` for route groups (if needed)

---

## 🔄 Data Flow

```
User Action
    ↓
Component (UI)
    ↓
Context (State) ← → Local Storage
    ↓
Update UI
```

### Cart Flow Example:
1. User clicks "Add to Cart" on `ProductCard`
2. `cart-context.tsx` updates state
3. State saved to localStorage
4. Header cart counter updates
5. Cart page reflects changes

---

## 🎨 Styling Architecture

### Layers
1. **Tailwind Base** - Reset & defaults
2. **CSS Variables** - Theme colors
3. **Tailwind Utilities** - Atomic classes
4. **Component Classes** - shadcn/ui variants

### Color System
```css
Primary: Blue (automotive theme)
Secondary: Gray (backgrounds)
Accent: Highlights & badges
Success: Green (WhatsApp, confirmations)
Destructive: Red (errors, out of stock)
```

---

## 📦 Package Structure

### Dependencies Categories
- **Framework**: next, react, react-dom
- **Language**: typescript
- **Styling**: tailwindcss, clsx
- **UI**: @radix-ui, lucide-react
- **Utilities**: class-variance-authority, tailwind-merge

---

## 🚀 Build Output

After `npm run build`:
```
.next/
├── server/          # Server-side code
├── static/          # Static assets
└── cache/           # Build cache
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview & setup |
| `QUICK_START.md` | Fast start guide |
| `IMPLEMENTATION.md` | Technical details |
| `DEPLOYMENT.md` | Deployment guide |
| This file | Structure reference |

---

## 🔍 Finding Things

### Need to edit...
- **Products**: `data/index.ts`
- **Business info**: `components/layout/footer.tsx`
- **Navigation**: `components/layout/header.tsx`
- **Home page**: `app/page.tsx`
- **Colors**: `app/globals.css`
- **Cart logic**: `contexts/cart-context.tsx`

### Need to add...
- **New page**: Create `app/page-name/page.tsx`
- **New component**: Create `components/component-name.tsx`
- **New product**: Add to `data/index.ts`
- **Images**: Add to `public/`

---

**Quick Navigation**: Use VS Code's file search (Ctrl+P) to quickly find any file!
