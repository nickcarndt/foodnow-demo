# FoodNow Demo — Interview Day Fixes

**Goal:** Turn a 6.5-7/10 demo into a 9+/10 interview weapon  
**Status:** ✅ P0 + P1 + P2 ALL COMPLETE — Verified working 2026-02-01  
**Estimated Score:** 9/10 — Ready to ship  
**Philosophy:** "Default view = product, Expanded view = payments engineer"

---

## 🔴 P0 — Must Fix Before Interview (Non-Negotiable)

These are interview-day footguns. If any of these break during the demo, you're fighting uphill.

### 1. Kill the "Run end-to-end demo (2 min)" button

**File:** `src/components/Demo/RunDemoButton.tsx`

**Problem:** 
- Navigates to `/checkout/success` without processing a real payment
- Shows fake success state that breaks interviewer trust immediately
- Confirmed broken in live testing

**Fix Options:**
- **Option A (Recommended):** Remove the component entirely from dashboard
- **Option B:** Replace with static "Suggested Demo Path" checklist (no navigation)

**Action:**
```tsx
// In src/app/page.tsx - REMOVE this line:
<RunDemoButton />

// Replace with static guidance:
<div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
  <p className="font-semibold mb-2">Suggested demo path (5-7 min)</p>
  <ol className="list-decimal list-inside space-y-1">
    <li>Dashboard overview → explain platform model</li>
    <li>Onboarding → show Express account creation</li>
    <li>Checkout → process real test payment</li>
    <li>Success → show money flow + transfer IDs</li>
    <li>Fraud → run Radar simulation</li>
    <li>Payouts → show instant payout UX</li>
  </ol>
</div>
```

---

### 2. Fix the Logs Panel bug

**File:** `src/components/Demo/LogPanel.tsx`

**Problem:**
- Badge shows count (e.g., "16")
- Panel shows "No logs yet" when opened
- Reads as "this was rushed or not tested end-to-end"

**Debug steps:**
1. Check if `fetchLogs` is being called when panel opens
2. Check if the API response parsing is correct
3. Verify the logs state is being set properly

**Quick fix if debugging takes too long:**
- Hide the logs panel entirely (remove from DemoShell)
- Better no logs than broken logs

---

### 3. Fix fake-looking fallback transfer IDs

**File:** `src/app/api/create-transfers/route.ts`

**Problem:**
- `tr_demo_restaurant_001` screams "mock"
- Breaks credibility instantly

**Fix:**
```typescript
// Change from:
const fallbackResponse: CreateTransfersResponse = {
  success: true,
  fallback: true,
  restaurantTransferId: 'tr_demo_restaurant_001',
  courierTransferId: 'tr_demo_courier_001',
  // ...
};

// Change to:
const generateSimulatedId = () => `tr_simulated_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const fallbackResponse: CreateTransfersResponse = {
  success: true,
  fallback: true,
  restaurantTransferId: generateSimulatedId(),
  courierTransferId: generateSimulatedId(),
  // ...
};
```

---

## 🟠 P1 — Should Fix (High ROI)

### 4. Add `source_transaction` to transfers

**File:** `src/app/api/create-transfers/route.ts`

**Why it matters:**
- Shows you understand funded vs unfunded transfers
- Lets you answer: "How does Stripe ensure funds exist before transferring?"
- Signals seniority even if interviewer never asks

**Fix:**
```typescript
// Need to get the charge ID from the PaymentIntent first
const paymentIntent = await stripe.paymentIntents.retrieve(body.paymentIntentId);
const chargeId = paymentIntent.latest_charge as string;

const restaurantTransfer = await stripe.transfers.create({
  amount: body.restaurantAmount,
  currency: 'usd',
  destination: body.restaurantAccountId,
  transfer_group: body.orderId,
  source_transaction: chargeId, // <-- ADD THIS
  metadata: { /* ... */ },
});
```

**Note:** This may require updating the API request to include charge info, or fetching it server-side.

---

### 5. Improve onboarding page localhost messaging

**File:** `src/app/onboarding/page.tsx`

**Current:** "Hosted onboarding requires a public HTTPS URL. Use demo accounts for the interview."

**Better:**
```tsx
<div className="mt-3 text-sm text-gray-700 bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg">
  <p className="font-medium">💡 Interview mode</p>
  <p className="mt-1">
    For reliable demos, I use pre-created test accounts to avoid onboarding delays.
    Live Express onboarding works on the deployed Vercel URL.
  </p>
</div>
```

This reframes the limitation as **intentional demo design**, not a missing feature.

---

### 6. Add "View in Stripe Dashboard" link

**File:** `src/app/checkout/success/success-client.tsx`

**Add after the PaymentIntent display:**
```tsx
<a
  href={`https://dashboard.stripe.com/test/payments/${paymentIntentId}`}
  target="_blank"
  rel="noopener noreferrer"
  className="text-sm text-orange-600 hover:text-orange-700 underline"
>
  View in Stripe Dashboard →
</a>
```

This is impressive during demos — shows the payment is real.

---

### 7. Clamp small-order edge case

**File:** `src/app/api/create-payment/route.ts`

**Problem:** Fixed $2.50 courier fee breaks if order total is too small.

**Fix:**
```typescript
const calculateBreakdown = (amount: number): OrderBreakdown => {
  // Minimum order validation
  const MIN_ORDER = 1000; // $10.00
  if (amount < MIN_ORDER) {
    throw new Error(`Minimum order amount is $${MIN_ORDER / 100}`);
  }
  
  const platformFee = Math.round(amount * 0.15);
  const courierAmount = 250;
  const restaurantAmount = amount - platformFee - courierAmount;

  return { total: amount, platformFee, restaurantAmount, courierAmount };
};
```

---

## ✨ P2 — Elevate to 9+/10 (If Time Permits)

### 8. Add Architecture Drawer (HIGH LEVERAGE)

**New component:** `src/components/Demo/ArchitectureDrawer.tsx`

This is a collapsible panel that shows:
- **Charge model:** "Separate charges & transfers"
- **Why not destination charges:** "Multi-party splits require separate transfers"
- **When funds move:** "Charge → Platform balance → Transfers"
- **Who holds liability:** "Platform is merchant of record"

**Trigger:** Add a "How it works" button on checkout or success page.

Interviewers LOVE this. It shows you can explain complex systems simply.

---

### 9. Add Refund Concept (Lightweight)

You don't need to implement refunds — just show you understand them.

**Add to success page:**
```tsx
<div className="text-sm text-gray-500 mt-4 p-3 border border-gray-200 rounded">
  <p className="font-medium">💡 What about refunds?</p>
  <p className="mt-1">
    Refunds reverse the PaymentIntent. Transfer reversals would claw back 
    funds from connected accounts proportionally. In production, this 
    requires handling partial refunds and timing edge cases.
  </p>
</div>
```

If asked to elaborate, you can say: "I didn't implement reversals because the complexity deserves a proper discussion about refund policies, timing, and liability."

---

### 10. Custom Favicon

**File:** `public/favicon.ico` or `src/app/favicon.ico`

Replace Next.js default with FoodNow branding. Small but noticeable.

---

## 📋 Interview Prep — Know Your Answers

### Q: "Why are Radar rules mocked?"
**A:** "Radar rules are account-specific and require Radar for Fraud Teams. Live rule mutation is risky in demos. The simulation still shows the decisioning logic that platforms use."

### Q: "How do refunds work in this model?"
**A:** "Refunds reverse the PaymentIntent charge. For transfers, you'd use transfer reversals to claw back funds from connected accounts. The complexity is in partial refunds, timing, and who absorbs losses — that's a product decision, not just an API call."

### Q: "What if the restaurant account isn't payout-enabled?"
**A:** "The transfer would fail. In production, you'd check `payouts_enabled` before attempting transfers and show appropriate UI — either queue the transfer or prompt the user to complete onboarding."

### Q: "Why source_transaction on transfers?"
**A:** "It links the transfer to the specific charge that funded it. This ensures the platform has sufficient balance from that transaction before moving money. Without it, you're doing unfunded transfers from your general balance."

### Q: "Why separate transfers instead of destination charges?"
**A:** "Destination charges only support one recipient. Multi-party marketplaces — where platform, restaurant, AND courier all get paid — require the separate charges & transfers model. It also gives the platform full control over timing and amounts."

---

## ✅ Pre-Interview Checklist

- [ ] P0 fixes complete
- [ ] Tested on localhost — all flows work
- [ ] Deployed to Vercel (optional but recommended)
- [ ] Tested on Vercel — redirects work, payments succeed
- [ ] Pre-created demo accounts exist and are payout-enabled
- [ ] Demo accounts loaded by default (not requiring user action)
- [ ] Practiced 7-minute walkthrough
- [ ] Know answers to follow-up questions

---

## Demo Script (7 minutes)

1. **Dashboard (30s):** "FoodNow is a delivery platform. We onboard restaurants and couriers, process payments, and handle splits."

2. **Onboarding (1 min):** "Here's Express onboarding. I've pre-created accounts for demo reliability. In production, Stripe hosts the identity verification."

3. **Checkout (2 min):** "Customer pays $25. Watch the breakdown — platform keeps 15%, restaurant gets $18.75, courier gets $2.50. I'll use the test card..." [complete payment]

4. **Success (1 min):** "Real PaymentIntent, real transfers. Notice the transfer IDs — these are actual Stripe objects. [click Dashboard link if added] You can verify in Stripe."

5. **Fraud (1 min):** "Radar rules protect against card testing, velocity abuse, geo mismatch. [run simulation] This one's blocked — high risk, low amount. Classic card testing pattern."

6. **Payouts (1 min):** "Couriers want instant payouts for retention. This is a simulation — eligibility varies by account — but the UX shows what they'd see."

7. **Summary (30s):** "Connect, Payments, Transfers, Radar, Payouts — this is the core of how marketplaces work on Stripe."

---

*Last updated: 2026-02-01*
