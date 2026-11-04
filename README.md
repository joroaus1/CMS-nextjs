# Directory Studio — the dashboard behind your business-directory PWA

This is the **backend + dashboard** for your Airbnb-style app. You (and your team) log in here to add businesses, upload photos and videos, and edit the app's onboarding and welcome screens — **no coding needed**. Your Next.js PWA (the next phase) will read everything from this dashboard's API.

**Built with:** Payload CMS 3 (runs on Next.js) · Supabase (Postgres database) · Cloudflare R2 (photos & videos) · Docker (deploys on Dokploy and Coolify)

![Dashboard](docs/screenshots/02-dashboard.png)

---

## What's inside the dashboard

| Menu | What it's for | App screen it powers |
|---|---|---|
| **Businesses** | Each business: name, category, photos, video, city, contact, hours. Draft → **Publish**. | Business page, search results, Top businesses |
| **Categories** | Food 🍔, Travel ✈️, Beauty 💄, Clothes 👗, Auto 🚗, Landscaping 🌿 (created automatically, editable) | Category chips |
| **Cities** | City + State (e.g. "Miami, FL") | Search bar (city, state) |
| **Media Library** | All photos and videos, with folders and bulk upload | Everywhere |
| **Onboarding screens** | The intro slides new users swipe through | Onboarding |
| **Welcome / Home screen** | Greeting, banner, featured picks | Welcome page |
| **App branding & settings** | App name, logo, icon, colors, legal links | Whole app + install icon |
| **App users** | People who signed up in the app | Sign in / sign out / profile |
| **Team** | People who can log in to this dashboard (Admin or Editor) | — |

Screenshots of every screen are in [`docs/screenshots`](docs/screenshots).

---

## Part 1 — One-time setup (about 45 minutes)

You'll collect a few "keys" (passwords) from Supabase and Cloudflare, then paste them into Dokploy and Coolify. Keep a notepad open.

### Step 1. Supabase (the database)

1. Go to **supabase.com** → **New project**. Pick a name, a strong **database password** (save it!), and the region closest to your VPS.
2. When it's ready, click the **Connect** button at the top of the project.
3. Choose **Session pooler** (not "Direct" and not "Transaction").
4. Copy the URI. It looks like:
   `postgresql://postgres.abcd1234:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres`
5. Replace `[YOUR-PASSWORD]` with your database password. 📝 This is your **`DATABASE_URL`**.

> Why "Session pooler"? Most VPS servers can't reach Supabase's "Direct" address (it's IPv6-only). The pooler works everywhere.
> You don't need to create any tables — the dashboard creates them automatically the first time it starts.

### Step 2. Cloudflare R2 (photos & videos)

1. In **dash.cloudflare.com** → left menu **R2 Object Storage** → **Create bucket**. Name it e.g. `directory-media`. 📝 That's **`R2_BUCKET`**.
2. On the R2 overview page, copy your **Account ID** (right side). 📝 That's **`R2_ACCOUNT_ID`**.
3. Make files public so the app can show them fast:
   open your bucket → **Settings** → **Custom Domains** → **Connect domain** → type e.g. `media.yourdomain.com` (your domain must be on Cloudflare).
   📝 `https://media.yourdomain.com` is **`R2_PUBLIC_URL`**.
   *(For quick testing only, you can instead enable the "r2.dev subdomain" on the same page and use that URL.)*
4. Create a key: R2 overview → **Manage API tokens** → **Create API token** → Permissions **Object Read & Write** → limit it to your bucket → **Create**.
   📝 Copy **Access Key ID** → **`R2_ACCESS_KEY_ID`** and **Secret Access Key** → **`R2_SECRET_ACCESS_KEY`** (shown only once!).

### Step 3. Put this code on GitHub (easiest way)

1. Create a free account at **github.com** → **New repository** → name `directory-cms` → **Private** → Create.
2. On the empty repo page, click **"uploading an existing file"**.
3. Unzip the project on your computer, open the folder, select **everything inside it** and drag it into the browser. Click **Commit changes**.
   *(Tip: install **GitHub Desktop** later — it makes future updates one click.)*

### Step 4. Make your secret key

Go to **https://generate-secret.vercel.app/64** and copy the text. 📝 That's **`PAYLOAD_SECRET`**. Use the **same** value on both servers.

### Your notepad should now have

```
DATABASE_URL=postgresql://postgres.xxxx:password@aws-0-....pooler.supabase.com:5432/postgres
PAYLOAD_SECRET=...64 random characters...
PAYLOAD_PUBLIC_SERVER_URL=https://cms.yourdomain.com      ← the dashboard's address on THIS server
FRONTEND_URLS=https://app.yourdomain.com                  ← your PWA's address (can add more, comma-separated)
R2_ACCOUNT_ID=...
R2_BUCKET=directory-media
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_PUBLIC_URL=https://media.yourdomain.com
```

(The same list is in the file `.env.example`.)

---

## Part 2 — Deploy

Do **one server first**, wait until it's green, then do the second. (The first start creates the database tables; the second server then just connects.)

### Option A — Dokploy

1. Dokploy → **Projects** → **Create Project** → open it → **Create Service** → **Application**.
2. **Provider:** GitHub → pick your `directory-cms` repo, branch `main`.
3. **Build Type:** **Dockerfile** (path `Dockerfile`).
4. **Environment** tab → paste all the lines from your notepad → **Save**.
5. **Domains** tab → **Add Domain** → host `cms.yourdomain.com`, **Container Port `3000`**, turn on **HTTPS** (Let's Encrypt).
6. Click **Deploy**. The first build takes ~5 minutes. Watch **Logs** — when you see `Ready`, you're live.

### Option B — Coolify

1. Coolify → **Projects** → your project → **+ New** → **Private Repository (with GitHub App)** (or Public Repository) → pick `directory-cms`.
2. **Build Pack:** **Dockerfile**.
3. **Ports Exposes:** `3000`.
4. **Domains:** `https://cms2.yourdomain.com` (Coolify adds HTTPS automatically).
5. **Environment Variables** → **Developer view** → paste your notepad lines → **Save**. Change `PAYLOAD_PUBLIC_SERVER_URL` to this server's address.
6. Click **Deploy**.

### Step 5. First login

Open `https://cms.yourdomain.com/admin`. The first time, it asks you to **create the first account** — that's you, as **Admin**. Done! 🎉

Health check (for monitoring): `https://cms.yourdomain.com/api/health` → `{"status":"ok"}`

> **Both servers use the same Supabase + R2?** Yes, that's the recommended setup: both dashboards show the same content, and if one server goes down the other keeps working (put a load balancer or DNS failover in front later). If instead you want one server for **testing** and one for **live**, create a second Supabase project and a second R2 bucket for the test server.

> **Using Cloudflare's orange cloud (proxy) on `cms.yourdomain.com`?** The free plan blocks uploads bigger than 100 MB. Keep videos under 100 MB, or set that DNS record to "DNS only" (grey cloud).

---

## Part 3 — Everyday use

### Add a business (2 minutes)
1. Dashboard → **Add a business** (or Businesses → **Create New**).
2. Fill the tabs **left to right**: **1. Basics → 2. Photos & Video → 3. Location → 4. Contact & Hours**.
3. In the right sidebar, tick **⭐ Top business** if it should appear in "Top businesses" (and set its position).
4. Click **Publish changes**. It's now live in the app. Not ready yet? It auto-saves as a **Draft**, which the app doesn't show.

![Business editor](docs/screenshots/04-business-basics.png)
![Photos tab](docs/screenshots/05-business-photos.png)

### Upload photos & videos
**Media Library** → **Bulk Upload** → drag in many files at once. Use **By Folder** to keep one folder per business. Click a photo to set its **focal point** (the part that must never be cropped).

![Media library](docs/screenshots/08-media-library.png)

### Edit app screens
- **Onboarding screens** → **Add Screen** → title, subtitle, photo/video → **Publish changes**.
- **Welcome / Home screen** → greeting, banner, featured categories/businesses → **Publish changes**.

![Onboarding](docs/screenshots/11-onboarding.png)

### Add a team member
**Team (dashboard logins)** → **Create New** → choose **Editor** (content only) or **Admin** (everything).

---

## Part 4 — For the PWA (next phase)

All addresses start with `https://cms.yourdomain.com/api`.

| What the app needs | Endpoint |
|---|---|
| Onboarding slides | `GET /globals/onboarding?depth=1` |
| Welcome page | `GET /globals/welcome-page?depth=2` |
| Branding (name, colors, icon) | `GET /globals/app-settings?depth=1` |
| Categories | `GET /categories?where[isActive][equals]=true&sort=sortOrder` |
| Cities (search suggestions) | `GET /locations?where[displayName][like]=mia` |
| **Search** | `GET /businesses/search?q=tacos&city=Miami&state=FL&category=food&page=1&limit=20` |
| Top businesses | `GET /businesses/search?top=true` |
| Business page | `GET /businesses?where[slug][equals]=lupitas-taqueria&depth=2` |
| Sign up | `POST /app-users` `{ email, password, fullName }` |
| Sign in | `POST /app-users/login` `{ email, password }` → returns `token` |
| Sign out | `POST /app-users/logout` |
| Profile | `GET /app-users/me` · update with `PATCH /app-users/{id}` |
| Save a favorite | `PATCH /app-users/{id}` `{ favorites: [ids...] }` |

Send the token as the header `Authorization: JWT <token>`. App users can only see/edit their own profile and can never open the dashboard. Images come with ready-made sizes (`thumbnail`, `card`, `hero`, in WebP) served straight from Cloudflare.

---

## Why this scales

- **Stateless servers:** nothing is stored on the VPS — data lives in Supabase and files in R2 — so you can run 2, 5 or 20 copies behind a load balancer.
- **Fast images:** files are served from Cloudflare's network, not your server; optimized WebP sizes are generated on upload.
- **Indexed search:** name, city, state, category and "top" are database-indexed; the search endpoint is cacheable.
- **Safe database changes:** the schema only changes through versioned migrations that run automatically on deploy — never by accident.

---

## For developers (later)

```bash
cp .env.example .env          # fill in values
npm install
npm run migrate               # create/update tables
npm run dev                   # http://localhost:3000/admin
npm run seed:demo             # optional demo businesses
```
Changed a collection/field? Run `npm run migrate:create <name>` and commit the new file in `src/migrations` — production applies it on the next deploy. After adding custom admin components run `npm run generate:importmap`.

**Not yet set up (easy to add later):** sending emails (password reset emails are currently only written to the server log — add Resend or SMTP), reviews written by users, and map coordinates lookup.
# CMS-nextjs
