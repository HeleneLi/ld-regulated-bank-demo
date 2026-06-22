const users = {
  employee: {
    label: "Internal bank employee",
    context: {
      kind: "user",
      key: "employee-001",
      name: "Internal Employee",
      employee: true,
      customerTier: "staff",
      riskBand: "low",
      region: "EMEA",
      country: "GB"
    }
  },

  pilot: {
    label: "Trusted pilot customer",
    context: {
      kind: "user",
      key: "pilot-001",
      name: "Pilot Customer",
      employee: false,
      customerTier: "pilot",
      riskBand: "low",
      region: "EMEA",
      country: "DE"
    }
  },

  standard: {
    label: "Standard customer",
    context: {
      kind: "user",
      key: "standard-001",
      name: "Standard Customer",
      employee: false,
      customerTier: "standard",
      riskBand: "medium",
      region: "EMEA",
      country: "FR"
    }
  }
};

function createSimulatedPilotContext(index) {
  return {
    ...users.pilot.context,
    key: `pilot-sim-${index}`,
    name: `Pilot Customer ${index}`
  };
}

module.exports = {
  users,
  createSimulatedPilotContext
};
