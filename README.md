# AM Motors - Automotive Accessories E-commerce

A modern, production-ready Next.js website for AM Motors, a local automotive accessories business specializing in premium floor mats, seat covers, and professional car care services.

## 🚀 Tech Stack

- **Next.js 16.7** (App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **React Context** for cart state management
- **Lucide Icons** for iconography

## 📁 Project Structure

```
am-motors/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Home page
│   ├── layout.tsx           # Root layout
│   ├── products/            # Product listing & details
│   ├── cart/                # Shopping cart
│   ├── checkout/            # Checkout flow
│   ├── booking/             # Service booking
│   ├── about/               # About page
│   ├── contact/             # Contact page
│   ├── faq/                 # FAQ page
│   └── policies/            # Privacy & Terms
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Header & Footer
│   ├── product-card.tsx     # Product display card
│   ├── category-card.tsx    # Category card
│   ├── cta-section.tsx      # Call-to-action sections
│   └── whatsapp-button.tsx  # WhatsApp integration
├── contexts/
│   └── cart-context.tsx     # Shopping cart state
├── data/
│   └── index.ts             # Mock products & categories
├── lib/
│   └── utils.ts             # Utility functions
└── types/
	└── index.ts             # TypeScript types
```

## 🎯 Features

### Public Pages
- ✅ Home page with hero, features, products, categories
- ✅ Product listing with category filters
- ✅ Product detail pages with image gallery
- ✅ Shopping cart with local storage persistence
- ✅ Checkout form (COD & Bank Transfer)
- ✅ Service booking system
- ✅ About, Contact, FAQ, and Policies pages

### Components
- ✅ Responsive navigation header
- ✅ Footer with business info and links
- ✅ Product cards with "Add to Cart"
- ✅ Category cards
- ✅ CTA sections
- ✅ Floating WhatsApp button
- ✅ Form inputs and validation

### Technical Features
- ✅ Server Components by default
- ✅ Client Components only where needed
- ✅ SEO-friendly metadata
- ✅ Mobile-first responsive design
- ✅ TypeScript type safety
- ✅ Cart state management with Context API
- ✅ Local storage persistence

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📝 Configuration

### Update Business Information

1. **WhatsApp Number**: Update in `components/layout/header.tsx` and `components/whatsapp-button.tsx`
2. **Contact Details**: Update in `components/layout/footer.tsx` and `app/contact/page.tsx`
3. **Business Info**: Update metadata in `app/layout.tsx`

### Add Products & Categories

Edit `data/index.ts` to add or modify products and categories. Update the Product and Category types in `types/index.ts` if needed.

## 🔄 Next Steps (Future Integration)

### Backend Integration
- [ ] Connect to a database (PostgreSQL, MongoDB)
- [ ] Create API routes for products, orders, bookings
- [ ] Implement order management system
- [ ] Add user authentication (optional)

### Admin Panel
- [ ] Create admin dashboard
- [ ] Product management (CRUD)
- [ ] Order tracking and management
- [ ] Customer inquiries management
- [ ] Analytics and reports

### Payment Integration
- [ ] Integrate payment gateway (Stripe, PayPal, local options)
- [ ] Add online payment processing
- [ ] Invoice generation

### Additional Features
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Order tracking
- [ ] Inventory management
- [ ] Search functionality with filters
- [ ] Product recommendations

## 🎨 Customization

### Colors
Edit `app/globals.css` to customize the color scheme. The theme uses CSS variables for easy theming.

### Fonts
The project uses Inter font. To change, update the font import in `app/layout.tsx`.

### Images
Replace placeholder images with real product photos. Consider using:
- Cloudinary or Uploadcare for image hosting
- Next.js Image component for optimization

## 📦 Dependencies

- `next` - React framework
- `react` & `react-dom` - UI library
- `typescript` - Type safety
- `tailwindcss` - Styling
- `clsx` & `tailwind-merge` - Class name utilities
- `class-variance-authority` - Component variants
- `lucide-react` - Icons
- `@radix-ui/react-slot` - Component composition

## 🤝 Contributing

This is a private business project. For modifications or improvements, please contact the development team.

## 📄 License

Proprietary - AM Motors © 2026
