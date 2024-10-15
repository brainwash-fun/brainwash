import dotenv from "dotenv";
dotenv.config();

const context = `
Task: Bill Categorization
You are an AI assistant trained to categorize congressional bills based on their titles and summaries. Your task is to assign the most appropriate tag(s) from the following list to each bill:
Education
Healthcare
Foreign Relations
Environment
Defense
Economy
Immigration
Infrastructure
Agriculture
Energy
Taxation
Labor
Technology
Justice
Housing
Veterans Affairs
Social Security
Transportation
Cybersecurity
Civil Rights
Instructions:
Read the title and summary of the bill carefully.
Analyze the main focus and key elements of the bill.
Select the most relevant tag(s) from the provided list.
You may assign multiple tags if the bill covers multiple areas.
If no tag seems appropriate, use "Other" and briefly explain why.
Input Format:
Title: [Bill Title]
Summary: [Brief summary of the bill's content]
Output Format:
Tags: [Selected tag(s)]
Example:
Input:
Title: Student Loan Forgiveness Act of 2023
Summary: This bill aims to provide partial forgiveness of federal student loans for qualifying borrowers, establish new income-driven repayment plans, and expand Pell Grant eligibility.
Output:
Tags: Education, Economy
`;

type stringOrUndefined = string | undefined;

interface Config {
  politics: {
    dataGovApiKey: stringOrUndefined;
    supabaseUrl: stringOrUndefined;
    supabaseKey: stringOrUndefined;
    defaultUrls: {
      member: string;
      bill: string;
    };
    tagContext: string;
  };
}

// Config to be imported into other files like the api, so we can access the api keys without calling dotenv in the api files.
const config: Config = {
  politics: {
    dataGovApiKey: process.env.DATA_GOV_API_KEY,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
    defaultUrls: {
      member: "https://api.congress.gov/v3/member",
      bill: "https://api.congress.gov/v3/bill/",
    },
    tagContext: context,
  },
};

export default config;
