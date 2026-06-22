# AI Prompt Log

## Prompt 1: Discovery framing
I asked AI to act as a CTO, Head of Risk, and VP Product at a regulated EMEA bank and list likely concerns about release velocity.

Useful output:
- Blast radius
- Rollback time
- Evidence for product decisions
- Avoiding PII in targeting

My judgement:
I used these as assumptions, not facts, and made them explicit in the README.

## Prompt 2: LaunchDarkly implementation
I asked AI for a LaunchDarkly Node.js implementation.

Issue found:
The first answer leaned toward a browser/client-heavy implementation and did not make fallback behavior central.

Override:
I used the server-side SDK, kept the SDK key in an environment variable, and used safe fallback values.

## Prompt 3: Demo flow
I asked AI for a demo script.

Issue found:
The first version sounded like a generic feature tour.

Override:
I rewrote the flow as pain → capability → business outcome.