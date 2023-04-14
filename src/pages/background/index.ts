import { TextHighlightExplanationAPI } from "@src/api";
import { sendMessageToClient } from "@src/api/helpers";
import type { Bookmark, ExtensionDefaultState } from "@src/types";
import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the chrome automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.css");

chrome.runtime.onInstalled.addListener(() => {
  const defaultState: ExtensionDefaultState = {
    config: {
      isExtensionEnabled: false,
      quoteSource: false,
      apiKey: "",
    },
    socials: [
      {
        name: "twitter",
        characterLimit: 280,
        enabled: true,
      },
      {
        name: "linkedin",
        characterLimit: 1300,
        enabled: true,
      },
      {
        name: "facebook",
        characterLimit: 63206,
        enabled: false,
      },
      {
        name: "whatsapp",
        characterLimit: 65535,
        enabled: false,
      },
    ],
    bookmarks: [
      {
        id: "12345678",
        title: "Content Caddy",
        url: "https://github.com/ttebify/content-caddy",
        excerpt:
          "A browser extension to easily save, organise, and share sections of web content packed with a powerful Highlight to Explain feature.",
        content:
          "A browser extension to easily save, organise, and share sections of web content packed with a powerful Highlight to Explain feature.. This extension was built using TypeScript and React.",
        date: new Date().toISOString(),
      },
    ],
  };

  chrome.storage.sync.set(defaultState);
});

const excerptLength = 100; // set your desired excerpt length here

chrome.runtime.onMessage.addListener(async function (request) {
  if (request.type === "createBookmark") {
    const excerpt = request.text.slice(0, excerptLength) + "..."; // create the excerpt from the selected text

    const bookmark = {
      id: generateRandomId(15),
      title: `${request.title} (${extractDomainName(request.url)})`,
      url: request.url,
      excerpt: excerpt,
      content: request.text,
      date: new Date().toISOString(),
    };

    chrome.storage.sync.get({ bookmarks: [] }).then(function (data) {
      const bookmarks = data.bookmarks;
      bookmarks.push(bookmark);
      chrome.storage.sync.set({ bookmarks: bookmarks }).then(function () {
        // to send back your response  to the current tab

        sendMessageToClient({
          type: "createBookmark",
          success: true,
          message: `Bookmark added: ${bookmark.title}`,
        });
      });
    });
  } else if (request.type === "deleteBookmark") {
    chrome.storage.sync.get(["bookmarks"]).then(function (data) {
      const bookmarks: Bookmark[] = data.bookmarks || [];
      const id = request.bookmarkId;

      const index = bookmarks.findIndex((bookmark) => bookmark.id === id);
      if (index >= 0) {
        bookmarks.splice(index, 1);
        chrome.storage.sync.set({ bookmarks: bookmarks }).then(function () {
          sendMessageToClient({
            type: "deleteBookmark",
            success: true,
            message: `Bookmark with id ${id} deleted`,
            data: { id },
          });
        });
      } else {
        sendMessageToClient({
          type: "deleteBookmark",
          success: false,
          message: `Bookmark with id ${id} not found`,
          data: { id },
        });
      }
    });
  } else if (request.type === "explainText") {
    chrome.storage.sync
      .get({ config: { apiKey: "" } })
      .then(async function (data) {
        const apiKey: string = data.config.apiKey;
        if (!apiKey || apiKey.length === 0) {
          sendMessageToClient({
            type: "explainText",
            success: false,
            message: `To use the highlight to explain feature, you need to add your OpenAI API key in the extension settings.`,
            data: {},
          });
        } else {
          const text = request.text;
          const textHighlightAPI = new TextHighlightExplanationAPI(apiKey);
          const selectors = [
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "meta[name='description']",
            "p",
          ];

          await textHighlightAPI.explainText(text, selectors);
        }
      });
  }
});

function extractDomainName(url: string) {
  const domain = new URL(url).hostname;
  const domainName = domain.replace(/^www\./i, "");
  return domainName;
}

function generateRandomId(length = 10) {
  const range = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvw0123456789";
  let id = "";

  for (let i = 0; i < length; i++) {
    id += range[Math.floor(Math.random() * (range.length - 1))];
  }
  return id;
}
