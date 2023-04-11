import { type SendMessageOptions } from "@src/types";

export function sendMessageToClient(data: SendMessageOptions) {
  chrome.tabs
    .query({ active: true, currentWindow: true })
    .then(function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, data);
      }
    });
}
