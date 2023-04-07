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
        title:
          "ttebify/content-caddy: A browser extension to easily save, organise, and share sections of web content. (github.com)",
        url: "https://github.com/ttebify/content-caddy",
        excerpt:
          "Content Caddy is a browser extension that allows you to save, organize, and share sections of web contents",
        content:
          "Content Caddy is a browser extension that allows you to save, organize, and share sections of web content easily. This extension was built using TypeScript and React.",
        date: new Date().toISOString(),
      },
    ],
  };

  chrome.storage.sync.set(defaultState);
});

const excerptLength = 100; // set your desired excerpt length here

chrome.runtime.onMessage.addListener(function (request) {
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
          sendMessagePopup({
            type: "deleteBookmark",
            success: true,
            message: `Bookmark with id ${id} deleted`,
            data: { id },
          });
        });
      } else {
        sendMessagePopup({
          type: "deleteBookmark",
          success: false,
          message: `Bookmark with id ${id} not found`,
          data: { id },
        });
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

function sendMessagePopup(data: unknown) {
  chrome.runtime.sendMessage(data);
}

function sendMessageToClient(data: unknown) {
  chrome.tabs
    .query({ active: true, currentWindow: true })
    .then(function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, data);
      }
    });
}
