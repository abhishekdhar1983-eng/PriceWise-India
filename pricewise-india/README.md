# PriceWise India — MVP v0.1 (demo)
Vite + React + TypeScript + Tailwind. **All prices are fictional demo data — not live retailer data.** No API keys, database or login needed.

## Run on Windows
1. Install Node.js LTS from https://nodejs.org (restart your terminal afterwards). Check: `node -v`
2. Open PowerShell in this folder, then:
```
npm install
npm run dev
```
3. Open the URL shown (usually http://localhost:5173).

## Tests and build
```
npm test
npm run build
```
## Structure
`src/data` sample catalog · `src/services/pricingProvider.ts` PricingProvider interface + MockPricingProvider · `src/utils` pricing, basket and search logic (UI-independent) · `src/context` state + localStorage · `src/pages`, `src/components` UI.
## Notes
Pincode is saved locally; location pricing is simulated and no serviceability is checked. To add real data later, implement `PricingProvider` and swap it in `src/context/AppContext.tsx`.
