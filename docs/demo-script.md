# Demo Script

## Opening
I interpreted the customer as a regulated EMEA retail bank. The business initiative is faster release velocity. The constraint is low risk appetite. So I built around controlled exposure, instant rollback, and measurable product learning.

## 0-15 minutes: Discovery recap
Pain:
- Releases expose too many customers at once.
- Rollback depends on engineering redeploys.
- Product teams lack evidence about whether a new experience is better.

Success criteria:
- Internal staff see the new flow first.
- Trusted pilot customers can be added next.
- Standard customers stay on the old stable flow.
- The feature can be rolled back instantly.
- Completion data supports an experiment.

## 15-30 minutes: Solution and value
Demo steps:
1. Show app homepage.
2. Show standard customer on old flow.
3. Show `new-payment-review-flow` targeting.
4. Show internal employee gets new flow.
5. Show pilot customer gets new flow.
6. Show standard customer remains on old flow.
7. Turn release flag off.
8. Refresh app and show rollback.
9. Show `payment-review-copy-variant`.
10. Show metric / experiment.

So-what:
- Targeting → controlled blast radius.
- Segments → release by risk cohort.
- Toggle off → rollback without redeploy.
- Metric → better product decision.
- Server-side SDK → better fit for regulated context handling.

## 30-45 minutes: Objection and close

### Objection: Can we send customer data to LaunchDarkly?
In this demo I used synthetic IDs and non-PII attributes. In production, I would run a data-classification review.

### Objection: What happens if LaunchDarkly is unavailable?
The fallback for the release flag is false, which means the old stable flow. The fallback for the copy flag is control.

### Objection: We already have CI/CD. Why do we need this?
CI/CD controls deployment. LaunchDarkly controls release: who sees code, when, and how quickly exposure can be reversed.

### Close
I would recommend a two-week pilot on one real customer-facing release, with success measured by rollback time, percentage of users exposed before full rollout, and one product metric tied to the feature.