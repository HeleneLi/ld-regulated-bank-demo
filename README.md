# LaunchDarkly Regulated Bank Demo

## Scenario
Regulated EMEA retail bank releasing a new payment review journey.

## What this proves
- Safer release through targeted rollout
- Instant rollback without redeploy
- Better product decisions through experiment metrics

## Architecture
- Node.js
- Express
- LaunchDarkly Node.js server-side SDK
- Server-side flag evaluation
- Synthetic context attributes only
- No PII

## LaunchDarkly setup
### Flags
- new-payment-review-flow
- payment-review-copy-variant

### Segments
- internal-bank-staff
- trusted-beta-customers

### Metric
- payment-review-completed

### Experiment
- Payment Review Copy Experiment

## Local setup
npm install
cp .env.example .env
npm run dev

## Simulate traffic
npm run simulate

## Demo flow
1. Show old flow.
2. Target internal staff.
3. Add trusted pilot customers.
4. Roll back by turning flag off.
5. Show metric / experiment.

## Known limitations
- No real auth
- No real banking data
- No production approval workflow
- No secrets manager
- No incident integration
- Simulated traffic only