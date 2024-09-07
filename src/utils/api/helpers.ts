import crypto from "crypto";

const addQueryParams = (url: string, params: Record<string, string>) => {
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return queryParams ? `${url}?${queryParams}` : url;
};

// Url parameters provided in an array, where the dynamic part is also provided in the relevant index.
const constructUrl = (baseUrl: string, params: string[]) => {
  let url = baseUrl;
  for (let i = 0; i < params.length; i++) {
    url += params[i];
    if (i < params.length - 1) {
      url += "/";
    }
  }
  return url;
};

const checkApiKey = (api_key: string | undefined): string => {
  if (!api_key) {
    console.log("API key not found");
    throw new Error("API key not found");
  }
  return api_key;
};

function bioguideToNumber(bioguideId: string): number {
  const hash = crypto.createHash("sha256");
  hash.update(bioguideId);
  const hashBuffer = hash.digest();
  const int = hashBuffer.readUIntBE(0, 6);
  return int >>> 0;
}

export { addQueryParams, bioguideToNumber, checkApiKey, constructUrl };
