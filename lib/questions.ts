export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  questions: Question[];
}

export const FINANCE_MODULES: Module[] = [
  {
    id: "dcf",
    title: "Discounted Cash Flow (DCF)",
    description: "Master the art of intrinsic valuation by forecasting free cash flows and determining the appropriate discount rate.",
    difficulty: "Intermediate",
    questions: [
      {
        id: "dcf_1",
        question: "In a DCF analysis, what happens to the Enterprise Value if the WACC increases, assuming all other variables remain constant?",
        options: [
          "Enterprise Value increases",
          "Enterprise Value decreases",
          "Enterprise Value remains unchanged",
          "Enterprise Value becomes zero",
        ],
        correctIndex: 1,
        explanation: "The WACC (Weighted Average Cost of Capital) is the denominator in the DCF formula. An increase in the discount rate reduces the present value of future cash flows, thereby decreasing the Enterprise Value.",
      },
      {
        id: "dcf_2",
        question: "Which of the following is the most common method for calculating the Terminal Value in a professional DCF model?",
        options: [
          "Simple Average Method",
          "Gordon Growth Method (Perpetuity Growth)",
          "Linear Interpolation",
          "Historical Growth Method",
        ],
        correctIndex: 1,
        explanation: "The Gordon Growth Method assumes the business grows at a constant rate forever. Alternatively, the Exit Multiple method is used, but Gordon Growth is a primary theoretical foundation.",
      },
    ],
  },
  {
    id: "lbo",
    title: "Leveraged Buyouts (LBO)",
    description: "Understand how private equity firms use debt to acquire companies and generate high returns through deleveraging.",
    difficulty: "Advanced",
    questions: [
      {
        id: "lbo_1",
        question: "What is the primary driver of returns in a Leveraged Buyout (LBO) besides operational improvement?",
        options: [
          "Dividend payouts",
          "Debt paydown (Deleveraging)",
          "Increasing the WACC",
          "Reducing the equity contribution",
        ],
        correctIndex: 1,
        explanation: "In an LBO, the PE firm uses a large amount of debt to purchase the asset. As the company's cash flows are used to pay down this debt, the equity value of the firm increases even if the exit multiple remains the same.",
      },
    ],
  },
  {
    id: "accounting",
    title: "Core Accounting",
    description: "The language of finance. Learn how the three financial statements interconnect and impact valuation.",
    difficulty: "Beginner",
    questions: [
      {
        id: "acc_1",
        question: "If Depreciation increases by $10, how does it affect the Cash Flow Statement, assuming a 20% tax rate?",
        options: [
          "Cash flow decreases by $10",
          "Cash flow increases by $2",
          "Cash flow increases by $8",
          "Cash flow remains unchanged",
        ],
        correctIndex: 1,
        explanation: "Depreciation is a non-cash expense. While it reduces Net Income by $10, it provides a tax shield of $2 (10 * 0.2). Therefore, the net impact on cash flow is an increase of $2.",
      },
    ],
  },
];
