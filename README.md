# Shahzaib Autos — Production-ready Next.js App

This repository contains the production-ready Next.js application for Shahzaib Autos — an e-commerce and service booking platform.

## Purpose
The project powers online product listings, service bookings, admin dashboards, and order management. It uses Next.js App Router, Prisma (Postgres), Supabase for authentication, and Cloudinary for image handling.

## Quick Start (Development)

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Production Build

Build and start production locally:

```bash
npm run build
npm run start
```

For deployment instructions and environment variables see `DEPLOYMENT.md` and `.env.example`.

## Key Technologies

- Next.js (App Router)
- React 19
- TypeScript
- Prisma (Postgres)
- Supabase (Auth)
- Cloudinary (images)
- Tailwind CSS

## Developer & Agency

- Developer: **Junaid Babar** — https://github.com/mian-junaidbabar
- Agency: **Deep Dev Solution**

## Contributing

If you'd like to contribute, please open issues or PRs. For major changes, open an issue first to discuss what you would like to change.

## Security & Secrets

- Do not commit `.env` files or any secrets to the repository. Use environment variables configured in your deployment platform (Vercel, Railway, Render, etc.).
- See `DEPLOYMENT.md` for a full list of required environment variables.

## License

This project is private. Contact the maintainer for licensing details.
