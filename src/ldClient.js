require("dotenv").config();

const LaunchDarkly = require("@launchdarkly/node-server-sdk");

if (!process.env.LD_SDK_KEY) {
  throw new Error("Missing LD_SDK_KEY. Add it to your .env file.");
}

const client = LaunchDarkly.init(process.env.LD_SDK_KEY);

async function waitForLaunchDarkly() {
  try {
    await client.waitForInitialization({ timeout: 10 });
    console.log("LaunchDarkly initialized.");
  } catch (err) {
    console.error("LaunchDarkly failed to initialize:", err.message);
    console.error("The app will continue using fallback values.");
  }
}

module.exports = {
  client,
  waitForLaunchDarkly
};
