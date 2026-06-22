const express = require("express");
const { users } = require("./users");
const { client, waitForLaunchDarkly } = require("./ldClient");

const app = express();

app.use(express.urlencoded({ extended: true }));

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return replacements[char];
  });
}

function getSelectedUser(userKey) {
  return users[userKey] || users.standard;
}

function page(title, body) {
  return `
    <html>
      <head>
        <title>${escapeHtml(title)}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            max-width: 950px;
            line-height: 1.5;
          }

          .card {
            border: 1px solid #d8d8d8;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
          }

          .old {
            background: #f7f7f7;
          }

          .new {
            background: #eef6ff;
          }

          .risk {
            border-left: 4px solid #222;
            padding-left: 14px;
            margin-top: 16px;
          }

          .meta {
            background: #f3f3f3;
            padding: 12px;
            border-radius: 8px;
            font-size: 14px;
          }

          code {
            background: #eee;
            padding: 2px 5px;
            border-radius: 4px;
          }

          button {
            padding: 10px 16px;
            cursor: pointer;
          }

          select,
          input {
            padding: 8px;
            margin: 6px 0;
            min-width: 280px;
          }

          .business-value {
            border-left: 4px solid #555;
            padding-left: 14px;
            color: #333;
          }
        </style>
      </head>
      <body>
        ${body}
      </body>
    </html>
  `;
}

app.get("/", (req, res) => {
  res.send(
    page(
      "EMEA Bank Payment Demo",
      `
        <h1>EMEA Bank Payment Review Demo</h1>

        <div class="card business-value">
          <h2>Scenario</h2>
          <p>
            A regulated EMEA retail bank wants to ship a new payment review journey faster,
            but risk appetite is low. This demo uses LaunchDarkly to release the change
            to low-risk cohorts first, roll it back instantly, and track completion events
            for product decision-making.
          </p>
        </div>

        <form action="/review" method="GET" class="card">
          <h2>Run a payment review</h2>

          <label>User:</label><br/>
          <select name="user">
            <option value="employee">Internal bank employee</option>
            <option value="pilot">Trusted pilot customer</option>
            <option value="standard">Standard customer</option>
          </select>

          <br/><br/>

          <label>Amount:</label><br/>
          <input name="amount" value="2500" />

          <br/><br/>

          <label>Payee:</label><br/>
          <input name="payee" value="ACME Property Services" />

          <br/><br/>

          <button type="submit">Review payment</button>
        </form>
      `
    )
  );
});

app.get("/review", async (req, res) => {
  const userKey = req.query.user || "standard";
  const selectedUser = getSelectedUser(userKey);
  const context = selectedUser.context;

  const amount = escapeHtml(req.query.amount || "2500");
  const payee = escapeHtml(req.query.payee || "ACME Property Services");

  const showNewReview = await client.variation(
    "new-payment-review-flow",
    context,
    false
  );

  const copyVariant = showNewReview
    ? await client.variation("payment-review-copy-variant", context, "control")
    : "control";

  const oldFlow = `
    <div class="card old">
      <h2>Standard payment confirmation</h2>
      <p>You are sending <strong>€${amount}</strong> to <strong>${payee}</strong>.</p>
      <p>Please confirm to continue.</p>
    </div>
  `;

  const controlCopy = `
    <div class="risk">
      <h3>Review details</h3>
      <p>Please check the payment details before confirming.</p>
    </div>
  `;

  const clearRiskCopy = `
    <div class="risk">
      <h3>Before you confirm</h3>
      <p>
        Check the payee, amount, and reason for payment. Bank staff will never
        pressure you to move money urgently or keep this transfer secret.
      </p>
    </div>
  `;

  const selectedCopy =
    copyVariant === "clear-risk-copy" ? clearRiskCopy : controlCopy;

  const newFlow = `
    <div class="card new">
      <h2>New payment review</h2>
      <p><strong>Amount:</strong> €${amount}</p>
      <p><strong>Payee:</strong> ${payee}</p>
      <p><strong>Customer risk band:</strong> ${escapeHtml(context.riskBand)}</p>
      ${selectedCopy}
    </div>
  `;

  res.send(
    page(
      "Payment Review",
      `
        <h1>Payment Review</h1>

        <div class="meta">
          <p><strong>Selected user:</strong> ${escapeHtml(selectedUser.label)}</p>
          <p>
            Context key: <code>${escapeHtml(context.key)}</code><br/>
            customerTier: <code>${escapeHtml(context.customerTier)}</code><br/>
            riskBand: <code>${escapeHtml(context.riskBand)}</code><br/>
            employee: <code>${escapeHtml(context.employee)}</code><br/>
            region: <code>${escapeHtml(context.region)}</code>
          </p>
          <p>
            Flag <code>new-payment-review-flow</code> returned:
            <strong>${escapeHtml(showNewReview)}</strong>
          </p>
          <p>
            Flag <code>payment-review-copy-variant</code> returned:
            <strong>${escapeHtml(copyVariant)}</strong>
          </p>
        </div>

        ${showNewReview ? newFlow : oldFlow}

        <form action="/confirm" method="POST">
          <input type="hidden" name="user" value="${escapeHtml(userKey)}" />
          <input type="hidden" name="variant" value="${escapeHtml(copyVariant)}" />
          <button type="submit">Confirm payment</button>
        </form>

        <p><a href="/">Back</a></p>
      `
    )
  );
});

app.post("/confirm", async (req, res) => {
  const userKey = req.body.user || "standard";
  const selectedUser = getSelectedUser(userKey);
  const context = selectedUser.context;
  const variant = req.body.variant || "control";

  client.track("payment-review-completed", context, {
    variant,
    source: "manual-demo"
  });

  await client.flush();

  res.send(
    page(
      "Payment Confirmed",
      `
        <h1>Payment confirmed</h1>

        <div class="card">
          <p>Tracked LaunchDarkly event:</p>
          <p><code>payment-review-completed</code></p>
          <p>User: <code>${escapeHtml(context.key)}</code></p>
          <p>Variant: <code>${escapeHtml(variant)}</code></p>
        </div>

        <p><a href="/">Run another test</a></p>
      `
    )
  );
});

const port = process.env.PORT || 3000;

waitForLaunchDarkly().then(() => {
  app.listen(port, () => {
    console.log(`Demo running at http://localhost:${port}`);
  });
});
