# Decision Log

## 1. Three design decisions

### Decision 1: Server-side SDK

I used the LaunchDarkly Node.js server-side SDK rather than a browser-only SDK because this is a regulated banking scenario. I wanted SDK key handling, context construction, and fallback behavior to live server-side.

The trade-off is that the demo has slightly more backend setup than a pure front-end app, but it better fits a financial services customer where data handling and safe fallback behavior matter.

### Decision 2: Cohort-based rollout

I modeled the rollout around internal staff, trusted pilot customers, and standard customers.

That maps “safer release” to controlled blast radius. Internal users see the new journey first, trusted pilot customers can be added next, and standard customers stay on the old stable journey until the bank is ready.

The trade-off is that the sample contexts are more detailed than a basic feature-flag demo, but the targeting story is much more relevant to the customer.

### Decision 3: Iterate instead of Observe

I chose Iterate because the scenario asks for more confident decisions about what to build.

Release proves the bank can ship safely. Iterate proves the bank can measure whether the new payment review copy improves completion before expanding the rollout.

The trade-off is that I did not build deep production observability or incident tooling. I focused on the product-decision story.

## 2. One AI suggestion I rejected

AI initially suggested a more client-heavy React implementation.

I rejected that because it weakened the regulated-bank story. For this scenario, I wanted server-side evaluation, synthetic non-PII attributes, and explicit safe fallback values.

## 3. What I would build differently for a 50-person startup

For a 50-person startup, I would simplify the governance model.

I would probably use fewer segments, faster percentage rollouts, and less emphasis on formal approval patterns. The startup value story would be speed of iteration. The regulated-bank value story is controlled release, reduced blast radius, and safer decision-making.

## 4. Biggest production risk

The biggest risk is that a real customer copies this demo as a production governance model.

The demo does not include real authentication, authorization, secrets management, approval workflows, audit review, incident response, data classification, or flag lifecycle cleanup. Those would need to be designed deliberately before this pattern could be used in a real banking environment.

## 5. What I would build with another four hours

I would add a simulated regression metric and a guarded-release style workflow.

I would choose that over UI polish because it strengthens the core business outcome: helping the bank ship faster without increasing operational risk.