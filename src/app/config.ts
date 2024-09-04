import dotenv from "dotenv";
dotenv.config();

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
  };
}

// Config to be imported into other files like the api, so we can access the api keys without calling dotenv in the api files.
const config: Config = {
  politics: {
    dataGovApiKey: process.env.DATA_GOV_API_KEY,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
    defaultUrls: {
      member: "https://api.congress.gov/v3/member/",
      bill: "https://api.congress.gov/v3/cosponsor/",
    },
  },
};

export default config;
