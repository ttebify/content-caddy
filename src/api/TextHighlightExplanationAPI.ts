// Used for Explaining highlighted text

import { sendMessageToClient } from "./helpers";

export class TextHighlightExplanationAPI {
  private apiKey: string;
  public extractedText: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public async explainText(text: string, selectors: string[]): Promise<void> {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (selectors.length === 0) {
        throw new Error("No selectors provided.");
      }

      const [headingsResult, metaResult, paragraphsResult] = await Promise.all([
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          args: [selectors],
          func: function getHeadings(selectors) {
            const allHeadingTagsUpercased = [
              "H1",
              "H2",
              "H3",
              "H4",
              "H5",
              "H6",
            ];

            const headings = Array.from(
              document.querySelectorAll(selectors.join(", "))
            )
              .filter((h) => allHeadingTagsUpercased.includes(h.tagName))
              .map((h: HTMLHeadElement) => h.innerText.trim());
            return headings;
          },
        }),
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: function getMetaDescription() {
            const meta = document.querySelector(
              'meta[name="description"]'
            ) as HTMLMetaElement | null;
            return meta?.content || null;
          },
        }),
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          args: [selectors],
          func: function getParagraphs(selectors) {
            const paragraphs = Array.from(
              document.querySelectorAll<HTMLElement>(selectors.join(", "))
            ).filter((p) => p.tagName === "P");
            // Get only the first one for now
            return paragraphs.length ? paragraphs[0].innerText.trim() : null;
          },
        }),
      ]);

      // Check that the results are valid before using them
      const headings =
        headingsResult && headingsResult[0].result
          ? headingsResult[0].result
          : [];

      const metaDescription =
        metaResult && metaResult[0].result ? metaResult[0].result : null;

      const paragraphs =
        paragraphsResult && paragraphsResult[0].result
          ? paragraphsResult[0].result
          : null;

      const extractedText = [headings, metaDescription, paragraphs]
        .filter((x) => !!x)
        .join(" ");

      this.extractedText = extractedText;

      const highlightedText = text.trim();
      const explanation = await this.generateExplanation(
        highlightedText,
        extractedText
      );

      sendMessageToClient({
        type: "explainText",
        message: explanation.text,
        success: explanation.success,
      });
    } catch (err) {
      sendMessageToClient({
        type: "explainText",
        message: `An error occurred while explaining text. Reason ${err.message}`,
        success: false,
      });
    }
  }

  private async generateExplanation(
    text: string,
    context: string
  ): Promise<{ text: string; success: boolean }> {
    const prompt = `Please provide a concise explanation of "${text}" in the context of the following sections on the webpage: ${context}`;

    try {
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          prompt,
          max_tokens: 64,
          n: 1,
          stop: ".",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return { text: data.choices[0].text.trim(), success: true };
    } catch (error) {
      return {
        text: `Error: Could not fetch explanation. reason: ${error.message}`,
        success: true,
      };
    }
  }
}
