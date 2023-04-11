import { TextHighlightExplanationAPI } from "../TextHighlightExplanationAPI";
import { sendMessageToClient } from "../helpers";

jest.mock("../helpers", () => ({
  sendMessageToClient: jest.fn(),
}));

// Mock the `chrome` object to be able to test the `explainText` method
const mockChrome = {
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn(),
  },
  scripting: {
    executeScript: jest.fn(),
  },
};
(global as any).chrome = mockChrome;

// Mock the `fetch` function to test the `generateExplanation` method
const mockFetch = jest.fn();
(global as any).fetch = mockFetch;

describe("TextHighlightExplanationAPI", () => {
  let api: TextHighlightExplanationAPI;

  beforeEach(() => {
    api = new TextHighlightExplanationAPI("testApiKey");
    mockChrome.tabs.query.mockReset();
    mockChrome.scripting.executeScript.mockReset();
    mockFetch.mockReset();
  });

  describe("explainText", () => {
    it("should extract text and generate an explanation", async () => {
      mockChrome.tabs.query.mockResolvedValue([{ id: 123 }]);
      mockChrome.scripting.executeScript.mockImplementation(async (opts) => {
        if (opts.func.name === "getHeadings") {
          return [{ result: ["Heading 1", "Heading 2"] }];
        } else if (opts.func.name === "getMetaDescription") {
          return [{ result: "Meta description" }];
        } else if (opts.func.name === "getParagraphs") {
          return [{ result: "Paragraph 1" }];
        }
      });
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => ({ choices: [{ text: "Explanation" }] }),
      });

      await api.explainText("test text", ["h1", "h2", "p"]);

      // Check that the mocks were called with the correct arguments
      expect(mockChrome.tabs.query).toHaveBeenCalledWith({
        active: true,
        currentWindow: true,
      });
      expect(mockChrome.scripting.executeScript).toHaveBeenCalledWith({
        target: { tabId: 123 },
        func: expect.any(Function),
      });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer testApiKey",
          },
          body: expect.any(String),
        })
      );

      // Check that the message was sent to the client with the correct data
      expect(sendMessageToClient).toHaveBeenCalledWith({
        type: "explainText",
        message: "Explanation",
        success: true,
      });
    });

    it("should handle errors gracefully", async () => {
      mockChrome.tabs.query.mockResolvedValue(new Error("Tab not found"));
      mockChrome.scripting.executeScript.mockRejectedValue(
        new Error("Script error")
      );
      mockFetch.mockRejectedValue(new Error("Fetch error"));

      // Call the method and wait for it to complete
      await api.explainText("test text", ["h1", "h2", "p"]);

      // Check that the message was sent to the client with the correct data
      expect(sendMessageToClient).toHaveBeenCalledWith({
        type: "explainText",
        message: expect.stringContaining(
          "An error occurred while explaining text."
        ),
        success: false,
      });
    });

    it("should extract text and generate an explanation for matched selectors", async () => {
      mockChrome.tabs.query.mockResolvedValue([{ id: 123 }]);
      mockChrome.scripting.executeScript.mockImplementation(async (opts) => {
        if (opts.func.name === "getHeadings") {
          return [
            { result: ["Heading 1", "Heading 2", "Heading 3", "Heading 4"] },
          ];
        } else if (opts.func.name === "getMetaDescription") {
          return [{ result: "Meta description" }];
        } else if (opts.func.name === "getParagraphs") {
          return [{ result: "Paragraph 1" }, { result: "Paragraph 2" }];
        }
      });
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => ({ choices: [{ text: "Explanation" }] }),
      });

      // Call the method and wait for it to complete
      await api.explainText("test text", ["h1", "h2", "h3", "h4", "p"]);

      // Check that the mocks were called with the correct arguments
      expect(mockChrome.tabs.query).toHaveBeenCalledWith({
        active: true,
        currentWindow: true,
      });
      expect(mockChrome.scripting.executeScript).toHaveBeenCalledWith({
        target: { tabId: 123 },
        func: expect.any(Function),
      });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer testApiKey",
          },
          body: expect.any(String),
        })
      );

      // Check that the message was sent to the client with the correct data
      expect(sendMessageToClient).toHaveBeenCalledWith({
        type: "explainText",
        message: "Explanation",
        success: true,
      });

      // Check that the extracted text includes all matched selectors
      expect(api.extractedText).toEqual(
        "Heading 1,Heading 2,Heading 3,Heading 4 Meta description Paragraph 1"
      );
    });
  });
});
