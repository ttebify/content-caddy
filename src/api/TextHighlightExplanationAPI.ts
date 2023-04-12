import { sendMessageToClient } from "./helpers";

/**
 * A class for generating concise explanations of highlighted text on a webpage
 * @class TextHighlightExplanationAPI
 */
export class TextHighlightExplanationAPI {
  /**
   * The API key used to authenticate with the OpenAI API
   * @private
   */

  private apiKey: string;

  /**
   * The extracted text from the page used for generating explanation exposed for testing purposes
   * @public
   */

  public extractedText: string;

  /**
   *
   * Creates an instance of TextHighlightExplanationAPI.
   * @constructor
   * @param {string} apiKey - The API key used to authenticate with the OpenAI API
   */

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Generates an explanation for the given highlighted text within the specified page sections
   * @async
   * @public
   * @param {string} text - The highlighted text to generate an explanation for
   * @param {string[]} selectors - The selectors of the page sections to focus on
   * @throws {Error} If no selectors are provided
   */

  public async explainText(text: string, selectors: string[]): Promise<void> {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (selectors.length === 0) {
        throw new Error("No selectors provided.");
      }

      const [headingsResult, metaResult, paragraphsResult, titleResult] =
        await Promise.all([
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
                .map((h: HTMLHeadingElement) => h.innerText.trim());
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
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: function getTitle() {
              return document.title;
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

      const pageTitle =
        titleResult && titleResult[0].result ? titleResult[0].result : null;

      const extractedText = [pageTitle, headings, metaDescription, paragraphs]
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

  /**
   * Generates an explanation for the given text in the context of the specified sections using the OpenAI AP
   * @async
   * @private
   * @param {string} text - The text to generate an explanation for
   * @param {string} context - The context of the specified section
   * @returns {Promise<{ text: string; success: boolean }>} The generated explanation and success status
   */

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
