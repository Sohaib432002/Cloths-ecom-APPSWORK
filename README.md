# SHOP.CO

SHOP.CO is a production-ready fashion e-commerce storefront for menswear, womenswear, kids, and accessories. Customers can browse a 1,050-piece catalog, save items, check out with coupon support, and get outfit recommendations from an in-house stylist powered by Llama 3.1 8B Instruct on Hugging Face Inference.

The project is built as a single Next.js 16 application so the storefront and API deploy together on Vercel.

## Features

- Catalog search, filters, pagination, product details, related items, and reviews
- Cart and wishlist with size/color line items and persistent local storage
- JWT authentication with httpOnly cookies, signup, login, password reset, and profile updates
- Guest-friendly checkout with Cash on Delivery, card, and PayPal selection
- Working coupon codes: `WELCOME20`, `SHOP10`, `STYLE25`, `FREESHIP`
- Newsletter and contact APIs with validation and rate limiting
- Native **AI Personal Stylist** that maps a shopper's occasion onto live catalog products
- Responsive storefront with skip-to-content, labeled controls, and Vercel-ready image optimization

## Technology stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4
- Zod validation, Jose JWT sessions, bcryptjs password hashing
- Hugging Face Inference (`meta-llama/Llama-3.1-8B-Instruct`)
- Catalog data served from server-only modules through REST route handlers

## Installation

```bash
git clone https://github.com/Sohaib432002/Cloths-ecom-APPSWORK.git
cd Cloths-ecom-APPSWORK
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo account:

- Email: `demo@shop.co`
- Password: `ShopCo123!`

## Environment variables

| Name | Required | Description |
| --- | --- | --- |
| `AUTH_SECRET` | Yes in production | 32+ character secret used to sign session cookies |
| `HF_TOKEN` | Recommended | Hugging Face access token for the stylist |
| `HF_MODEL` | No | Defaults to `meta-llama/Llama-3.1-8B-Instruct` |
| `NEXT_PUBLIC_APP_URL` | Recommended | Public site URL used in auth reset links |

Create a Hugging Face token at [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens). The stylist still returns catalog matches if the token is missing.

## Deployment

### Frontend and API on Vercel

1. Import the GitHub repository in Vercel.
2. Set `AUTH_SECRET`, `HF_TOKEN`, `HF_MODEL`, and `NEXT_PUBLIC_APP_URL`.
3. Deploy. Vercel detects Next.js automatically.

The Hugging Face integration uses the official Inference API from Next.js route handlers. No separate backend host is required.

## API documentation

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Service health and Hugging Face status |
| `GET` | `/api/products` | Paginated catalog with filters (`search`, `category`, `type`, `style`, `color`, `size`, `sale`, `arrival`, `minPrice`, `maxPrice`, `page`, `limit`, `sort`) |
| `GET` | `/api/products/[slug]` | Product, related items, and reviews |
| `GET` | `/api/collections` | Home new arrivals and top sellers |
| `POST` | `/api/auth/signup` | Create an account |
| `POST` | `/api/auth/login` | Sign in |
| `POST` | `/api/auth/logout` | Clear the session cookie |
| `GET` | `/api/auth/me` | Current user |
| `PATCH` | `/api/auth/me` | Update profile or password |
| `POST` | `/api/auth/forgot-password` | Create a reset link |
| `POST` | `/api/auth/reset-password` | Set a new password |
| `POST` | `/api/auth/verify-email` | Verify an email token |
| `POST` | `/api/orders` | Validate cart, coupons, and create an order |
| `GET/POST` | `/api/coupons` | List or validate coupons |
| `POST` | `/api/newsletter` | Subscribe |
| `POST` | `/api/contact` | Send a contact message |
| `POST` | `/api/stylist` | AI outfit recommendation |

Example stylist request:

```bash
curl -X POST http://localhost:3000/api/stylist \
  -H "Content-Type: application/json" \
  -d '{"message":"Black tie dinner next Friday, keep it under $400"}'
```

## Screenshots

Run the app locally and visit:

- `/` seasonal homepage and stylist entry
- `/Store` filtered catalog
- `/stylist` full-page concierge
- `/ProductDetails/[slug]` product page with inline styling advice

## Future improvements

- Persist users and orders in Postgres or a managed database
- Add transactional email for verification, resets, and shipping updates
- Connect a real payment processor for card and PayPal capture
- Precompute catalog embeddings for faster semantic matching
- Replace placeholder photography with studio product assets
