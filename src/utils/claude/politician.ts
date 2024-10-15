import axios from "axios";
import config from "../../app/config";

class BillClassifier {
  private claudeApiKey: string;
  private context: string;

  constructor() {
    this.claudeApiKey = process.env.CLAUDE_API_KEY || "";
    this.context = config.politics.tagContext;
    if (!this.claudeApiKey) {
      throw new Error("CLAUDE_API_KEY is not set in the environment variables");
    }
  }

  async classifyBill(title: string, summary: string): Promise<string> {
    const prompt = `${this.context}
    
    Title: ${title}
    Summary: ${summary}`;

    try {
      const response = await axios.post(
        "https://api.anthropic.com/v1/completions",
        {
          model: "claude-v1",
          prompt: prompt,
          max_tokens_to_sample: 300,
          max_tokens: 1000,
          stop_sequences: ["\n\n"],
          temperature: 0.5,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": this.claudeApiKey,
          },
        }
      );

      const classification = response.data.completion.trim();
      const tags = classification.split(":")[1].split(",");
      return tags;
    } catch (error) {
      console.error("Error classifying bill:", error);
      return "Error: Unable to classify";
    }
  }
}

export default BillClassifier;
