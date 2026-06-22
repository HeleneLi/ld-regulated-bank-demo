require("dotenv").config();

const LaunchDarkly = require("@launchdarkly/node-server-sdk");
const { createSimulatedPilotContext } = require("../src/users");

if (!process.env.LD_SDK_KEY) {
  throw new Error("Missing LD_SDK_KEY. Add it to your .env file.");
}

const client = LaunchDarkly.init(process.env.LD_SDK_KEY);

async function main() {
  await client.waitForInitialization({ timeout: 10 });

  const results = {
    control: {
      exposed: 0,
      completed: 0
    },
    "clear-risk-copy": {
      exposed: 0,
      completed: 0
    }
  };

  for (let i = 1; i <= 250; i++) {
    const context = createSimulatedPilotContext(i);

    const showNewReview = await client.variation(
      "new-payment-review-flow",
      context,
      false
    );

    if (!showNewReview) {
      continue;
    }

    const copyVariant = await client.variation(
      "payment-review-copy-variant",
      context,
      "control"
    );

    if (!results[copyVariant]) {
      results[copyVariant] = {
        exposed: 0,
        completed: 0
      };
    }

    results[copyVariant].exposed += 1;

    const completionProbability =
      copyVariant === "clear-risk-copy" ? 0.72 : 0.58;

    const completed = Math.random() < completionProbability;

    if (completed) {
      client.track("payment-review-completed", context, {
        variant: copyVariant,
        simulated: true
      });

      results[copyVariant].completed += 1;
    }
  }

  await client.flush();
  await client.close();

  console.log("Simulated traffic sent.");
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
