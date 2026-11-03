# Véora

Véora is a fashion storefront for women, men, accessories and footwear, built as a single Next.js 16 application (storefront and API together) on top of a SQLite database.

## Features

- Catalog with search, filters (category, type, style, colour, size, price), sorting, pagination, product pages, related items and reviews
- Customer reviews saved to the database, with the product rating updated on every new review
- Cart, wishlist (synced to the account when signed in), and coupon codes validated on the server
- Checkout that re-prices every line from the database, checks and decrements stock, and stores the order
- Accounts: signup, login, logout, profile and password change, password reset and email verification links
- Order history per account (guests keep the orders they placed in the browser)
- Newsletter and contact forms stored in the database, with rate limiting
- AI personal stylist (Hugging Face Llama 3.1 when `HF_TOKEN` is set, catalog matching otherwise)
- Responsive layout for desktop, tablet and mobile

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, SQLite through `@libsql/client`, Zod, Jose (JWT cookie sessions), bcryptjs.

## Getting started

```bash
git clone https://github.com/Sohaib432002/Cloths-ecom-APPSWORK.git
cd Cloths-ecom-APPSWORK
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. The database is created and seeded automatically on first request. To do it explicitly:

```bash
npm run db:setup   # create tables and seed (does nothing if already seeded)
npm run db:reset   # delete data/veora.db and rebuild it (stop the dev server first on Windows)
```

Demo account: `demo@veora.com` / `Veora123!`

## Database

`lib/db/schema.ts` defines the schema; `lib/db/seed.ts` fills it. Tables:

| Table | Purpose |
| --- | --- |
| `users`, `auth_tokens` | Accounts and one-time reset / verification tokens |
| `categories`, `products` | Catalog (1,062 products across Women, Men, Kids, Unisex, Accessories, Footwear) |
| `product_images`, `product_colors`, `product_sizes`, `product_features` | Product child tables |
| `reviews` | Customer reviews (FK to product and optionally user) |
| `coupons` | Coupon codes (`WELCOME20`, `SHOP10`, `STYLE25`, `FREESHIP`) |
| `orders`, `order_items` | Placed orders and their lines (price snapshot per line) |
| `wishlist_items` | Saved items per signed-in user |
| `newsletter_subscribers`, `contact_messages` | Form submissions |

The seed imports the original catalog data (`db/products.seed.js`, `db/reviews.seed.js`) and adds a Véora footwear and accessories line. The product ratings and review counts in that imported data are catalog data, not live statistics; new reviews are added on top of them.

### Where the data lives

| Setup | Database | Persistent? |
| --- | --- | --- |
| Local | `data/veora.db` (SQLite file) | Yes |
| Vercel without extra config | pre-seeded copy in `/tmp` | **No** — resets when the serverless instance recycles |
| Vercel / any host with `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` | Turso (hosted SQLite, free tier) | Yes |
| Node server or VPS with `DATABASE_PATH` | file on disk | Yes |

`GET /api/health` reports the engine and whether it is persistent.

## Environment variables

See `.env.example`. `AUTH_SECRET` (32+ characters) is required in production.

## Deployment

```bash
npm run build   # seeds data/veora.db, then runs next build
npm start
```

On Vercel, import the repository and set `AUTH_SECRET` (plus the Turso variables if you want accounts, orders and reviews to persist).

## API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Service and database status |
| `GET` | `/api/products` | Catalog query (`search`, `category`, `type`, `style`, `color`, `size`, `sale`, `arrival`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`) |
| `GET` | `/api/products/[slug]` | Product, related items, reviews |
| `GET` | `/api/collections` | New arrivals, best sellers, featured |
| `GET/POST` | `/api/reviews` | List / add a product review |
| `GET/POST` | `/api/coupons` | List coupons / validate a code |
| `GET/POST` | `/api/orders` | Own orders (signed in) / place an order |
| `GET` | `/api/orders/[id]` | One of your own orders |
| `GET/PUT` | `/api/wishlist` | Read / replace the signed-in user's wishlist |
| `POST` | `/api/auth/signup`, `login`, `logout`, `forgot-password`, `reset-password`, `verify-email` | Authentication |
| `GET/PATCH` | `/api/auth/me` | Current user / update profile or password |
| `POST` | `/api/newsletter`, `/api/contact` | Forms |
| `POST` | `/api/stylist` | Outfit recommendations |

Email delivery is not configured, so password-reset and verification links are returned in the API response instead of being emailed.
