// All interface text for the Pricing screen and the advertising package screen.
// Keep every user-visible string here so the app can be translated in one pass.

export const strings = {
  pricing: {
    metaTitle: "What it costs — AdBoost",
    metaDescription:
      "Two amounts every month: a monthly fee and an advertising budget. No setup fee, cancel monthly.",
    back: "Back",
    heading: "What it costs",
    subheading: "Two amounts, every month. Nothing else.",
    perMonth: "per month",
    budgetPrefix: "+",
    budgetSuffix: "advertising budget",
    mostChosen: "Most chosen",
    chooseLabel: (name: string) => `Choose ${name}`,
    trustLines: [
      "Your advertising account belongs to you. Even if you leave.",
      "You see exactly what goes to Google and what goes to us.",
      "Cancel monthly. No minimum term.",
    ],
    footnote: "Prices include no setup fee. VAT excluded.",
  },

  adPackage: {
    metaTitle: "Your advertising package — AdBoost",
    metaDescription:
      "Choose an advertising package, see the monthly fee that goes with it, and add to your package.",
    title: "Your advertising package",
    seeAllPackages: "See all packages",
    leftInPackage: "Left in your package",
    emptyNote: "Choose a package below to get started.",
    activeNote: "This is what is left for your ads.",
    chooseHeading: "Choose your package",
    customLabel: "Or your own amount",
    customPlaceholder: "€ amount",
    reachPrefix: "≈",
    reachSuffix: "people reached",
    estimateNote:
      "Estimate only. Actual reach depends on your area and what you sell.",
    payButton: (amount: string) => `Prepay ${amount}`,
    ownership:
      "Your advertising account belongs to you. You see exactly what goes to Google and what goes to us, and you can cancel monthly.",
    historyTitle: "History",
    dialogTitleDone: "Payment done",
    dialogTitle: (amount: string) => `Add ${amount} to your package`,
    dialogDescriptionDone:
      "Your ads can now run. Nothing was charged — this is a demo.",
    dialogDescription:
      "This is a demo. No money is charged and no card details are needed.",
    dialogSummary: (amount: string, tier: string, fee: string) =>
      `${amount} advertising budget · ${tier} · ${fee} per month.`,
    simulate: "Simulate payment",
    seeResults: "See my results",
    historyAddLabel: "Added to package (demo)",
  },

  settingsRow: {
    pricing: "Pricing",
  },

  welcome: {
    pricingLink: "What does it cost?",
  },
} as const;
