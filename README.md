# Tasty Treasures

A cinematic, editorial e-commerce experience for **Tasty Treasures** — freeze-dried fruit,
dehydrated vegetable chips and single-ingredient superfood powders.

Built with **Next.js 15 (App Router)**, React 19, TypeScript, Tailwind CSS and Framer Motion.
Orders are **requests**, not online payments: customers submit a request and the studio confirms
by WhatsApp, phone or cash on delivery. The admin studio also handles **Delhivery** waybills,
**Cloudinary** image uploads and **MongoDB Atlas** persistence.

---

## Stack

| Layer       | Service / tool                                      |
| ----------- | --------------------------------------------------- |
| Framework   | Next.js 15, React 19, TypeScript, Tailwind CSS      |
| Hosting     | [Vercel](https://vercel.com)                        |
| Source      | [GitHub](https://github.com)                        |
| Database    | [MongoDB Atlas](https://www.mongodb.com/atlas)      |
| Images      | [Cloudinary](https://cloudinary.com)                |
| Courier     | [Delhivery](https://www.delhivery.com)               |
| Automation  | Vercel Cron (`/api/cron/sync-shipments`)            |

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Create your local environment
cp .env.example .env.local

# 3. Run the development server
npm run dev
```

Open <http://localhost:3000>. The admin studio lives at <http://localhost:3000/admin>.

Without `MONGODB_URI` the app uses JSON files under `data/`; without Cloudinary keys uploads go
to `public/uploads/`; without Delhivery keys the courier actions show a setup notice. This makes
local development possible with zero external accounts.

### Scripts

| Command             | Purpose                                  |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start the development server             |
| `npm run build`     | Create a production build                |
| `npm start`         | Serve the production build               |
| `npm run typecheck` | Type-check the project without emitting  |

---

## Admin studio

`/admin` is protected by middleware plus a signed, HTTP-only cookie. Sessions last eight hours
and login attempts are rate-limited. The studio has seven sections:

- **Overview** — request value, new orders, unread enquiries, low stock, recent requests and live
  integration status.
- **Products** — create, edit, feature and delete products. Packs, pricing, stock, nutrition,
  benefits, artwork and Cloudinary images are all editable.
- **Orders** — search and filter requests, update status, copy the customer's details, open
  WhatsApp, export CSV and hand orders to **Delhivery**.
- **Enquiries** — read/unread, reply by email, call or WhatsApp, delete.
- **Subscribers** — copy emails, export CSV, remove unsubscribe requests.
- **Content** — brand details, WhatsApp number, shipping settings, hero copy/image,
  announcements, story, mission, vision and statistics.
- **Integrations** — read-only health check for MongoDB, Cloudinary, Delhivery and admin
  security, plus the environment-variable checklist.

### Courier workflow

1. Open **Orders** and find a request.
2. Confirm it (status `confirmed`) or pack it (`packed`).
3. Click **Ship with Delhivery**. The server manifests the order and stores the AWB.
4. Click **Track** to pull the latest scans. The order advances automatically to `shipped`,
   `delivered` or `cancelled` (RTO).
5. Vercel Cron refreshes open waybills daily at 06:00 UTC so the studio stays current without
   manual clicks.

The public tracking link is shown next to every AWB; customers can also use it directly.

---

## Environment variables

Copy `.env.example` to `.env.local` for development and add the same values in
**Vercel → Project → Settings → Environment Variables** for production. Redeploy after changes.

| Variable                   | Required | Purpose                                                        |
| -------------------------- | -------- | -------------------------------------------------------------- |
| `ADMIN_PASSWORD`           | Yes      | Password for `/admin`. Change before any public deployment.     |
| `ADMIN_SESSION_SECRET`     | Yes      | Long random string used to sign the session cookie.             |
| `CRON_SECRET`              | Yes      | Bearer token protecting the shipment-sync cron endpoint.        |
| `NEXT_PUBLIC_SITE_URL`     | Yes      | Canonical origin for metadata, sitemap, robots and tracking.    |
| `MONGODB_URI`              | Yes*     | MongoDB Atlas connection string.                                |
| `MONGODB_DB`               | No       | Database name. Defaults to `tasty-treasures`.                   |
| `CLOUDINARY_CLOUD_NAME`    | Yes*     | Cloudinary cloud name.                                          |
| `CLOUDINARY_API_KEY`       | Yes*     | Cloudinary API key.                                             |
| `CLOUDINARY_API_SECRET`    | Yes*     | Cloudinary API secret (server-only).                            |
| `DELHIVERY_API_TOKEN`      | Yes*     | Delhivery API token.                                            |
| `DELHIVERY_CLIENT`         | Yes*     | Delhivery client/account name.                                  |
| `DELHIVERY_ENV`            | No       | `production` (default) or `staging`.                            |
| `DELHIVERY_SHIPPING_MODE`  | No       | `Surface` (default) or `Express`.                               |
| `DELHIVERY_PICKUP_NAME`    | Yes*     | Exact registered warehouse name (case-sensitive).               |
| `DELHIVERY_PICKUP_ADDRESS` | Yes*     | Warehouse street address.                                       |
| `DELHIVERY_PICKUP_CITY`    | Yes*     | Warehouse city.                                                 |
| `DELHIVERY_PICKUP_PINCODE` | Yes*     | Warehouse PIN code.                                             |
| `DELHIVERY_PICKUP_PHONE`   | Yes*     | Warehouse phone with country code.                              |
| `DELHIVERY_PICKUP_COUNTRY` | No       | Defaults to `India`.                                            |

\* Required for production. Without them the app still builds and runs in local fallback mode.

Generate secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Never ship the development fallbacks. If `ADMIN_PASSWORD` or `ADMIN_SESSION_SECRET` is missing,
the studio uses known defaults and shows “Development fallbacks” in **Integrations**.

---

## Deployment: GitHub → Vercel → MongoDB → Cloudinary → Delhivery

### 1. GitHub

```bash
git init
git add .
git commit -m "Tasty Treasures storefront and admin studio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/tasty-treasures.git
git push -u origin main
```

The included workflow (`.github/workflows/ci.yml`) runs `npm ci`, typecheck and build on every
push/PR to `main`.

### 2. MongoDB Atlas

1. Create a free cluster at <https://cloud.mongodb.com>.
2. Add a database user and allow network access (use `0.0.0.0/0` or Vercel's IP ranges).
3. Copy the connection string into `MONGODB_URI`, including `retryWrites=true&w=majority`.
4. Set `MONGODB_DB=tasty-treasures` (or your preferred name).

The app creates collections on first write: `products`, `orders`, `enquiries`, `subscribers` and
`content`. Products seed from `lib/catalogue.ts` when the collection is empty.

### 3. Vercel

1. Import the GitHub repository at <https://vercel.com/new>.
2. Framework preset: **Next.js**. Build command `npm run build`. Output: default.
3. Add every environment variable above.
4. Deploy, then open `/admin` and sign in with `ADMIN_PASSWORD`.
5. Vercel Cron runs daily. Keep `CRON_SECRET` set; Vercel sends it as a Bearer token.

### 4. Cloudinary

1. Create a free account at <https://cloudinary.com>.
2. Copy the cloud name, API key and API secret from the product environment credentials.
3. Verify **Admin → Products → Edit → Product image** uploads to
   `tasty-treasures/products/`.

Uploads are signed on the server (SHA-1 signature + timestamp + folder), so the API secret never
reaches the browser. Accepted types: JPG, PNG, WebP, AVIF up to 5 MB.

### 5. Delhivery

1. Get the API token from **Delhivery One → Settings → API Setup**.
2. Ask Delhivery to register your pickup warehouse. The name must match
   `DELHIVERY_PICKUP_NAME` exactly, including capitalisation.
3. Set the pickup address, city, PIN code and phone in Vercel.
4. Keep `DELHIVERY_ENV=staging` while testing, then switch to `production`.
5. Create a test order, mark it `packed`, and click **Ship with Delhivery**.
6. Check **Admin → Integrations** for green Delhivery status.

Order creation uses `POST /api/cmu/create.json` with `format=json&data=<payload>` and
`Authorization: Token <token>`. Tracking uses `GET /api/v1/packages/json/?waybill=<awb>`.

---

## Data and storage

`lib/store.ts` exposes one API for two backends:

- **MongoDB** when `MONGODB_URI` is set. Collections are written with per-document upserts, so a
  failed write cannot empty a collection. Order patches use `findOneAndUpdate` to avoid lost
  updates when two admins work at once.
- **JSON files** under `data/` for local development. These files and `public/uploads/*` are
  git-ignored and are **not** suitable for Vercel's read-only filesystem.

```
data/products.json      data/orders.json
data/enquiries.json     data/subscribers.json
data/content.json
public/uploads/         local image uploads
```

---

## Project structure

```
app/                  Routes, API handlers, metadata, sitemap, robots
  admin/              Studio entry and login
  api/                Orders, products, content, uploads, cron, courier routes
components/
  admin/              Dashboard, product/order/content panels, media, integrations
  site/ home/ shop/   Storefront chrome and sections
  product/ commerce/  Product detail, cart, checkout
  ui/                 Buttons, reveals, botanical marks, typography
lib/                  Types, catalogue, content, store, auth, Delhivery, Cloudinary
data/                 Local JSON fallback (git-ignored)
public/images/        Editorial photography
.github/workflows/    GitHub Actions CI
vercel.json           Framework preset and shipment-sync cron
```

---

## Content and legal caveats

- The WhatsApp number, email, phone and address shipped in `lib/content.ts` are **demo
  placeholders**. Replace them in **Admin → Content** before launch and verify every number.
- Policy pages (`/policies/privacy`, `/shipping`, `/returns`, `/terms`) contain editable template
  text hydrated with your live contact and shipping settings. Have the legal copy reviewed for
  your jurisdiction.
- Product descriptions, nutrition values, storage guidance and wellness language are editorial
  starting points. Confirm them against your actual formulations and local food-labelling rules.
- Statistics on the About page are qualitative process claims, editable in the studio — not
  customer counts or audited figures.
- Photography uses licensed Unsplash images; product packaging is original SVG illustration
  rendered by `ProductArt`. Review image licensing for your final commercial use.

---

## Troubleshooting

| Symptom                                   | Fix                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------- |
| `/admin` redirects to login repeatedly    | Set `ADMIN_SESSION_SECRET`; clear the `tt_admin_session` cookie.     |
| Data disappears after a Vercel deploy     | `MONGODB_URI` is missing or the Atlas IP allow-list is blocking.    |
| Image upload returns 502                  | Check the three Cloudinary keys; the secret must be server-side.    |
| Delhivery says “pickup location invalid”  | `DELHIVERY_PICKUP_NAME` must exactly match the registered warehouse.|
| Delhivery returns 401                     | Regenerate the API token in Delhivery One and redeploy.             |
| Cron returns 401                          | Set `CRON_SECRET`; Vercel sends it as `Authorization: Bearer …`.     |
| Build fails on Google Fonts in CI         | Network hiccup — rerun the job; fonts are fetched at build time.    |
