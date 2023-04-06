export const getImageUrl = (url: string) => {
  return chrome.runtime.getURL(url);
};
