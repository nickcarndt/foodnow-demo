# FoodNow Demo

FoodNow is a lightweight, presentation-ready demo of a food delivery platform using Stripe Connect. It showcases:
- Express onboarding for restaurants and couriers
- Platform Payments with separate transfers
- Radar fraud simulations
- Instant payout simulations

## Local Setup

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_RESTAURANT_ACCOUNT_ID=acct_...
NEXT_PUBLIC_DEMO_COURIER_ACCOUNT_ID=acct_...
```

Run the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` — start local dev server
- `npm run build` — production build
- `npm run start` — run production server
- `npm run lint` — lint the project
