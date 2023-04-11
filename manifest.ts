import packageJson from "./package.json";

/**
 * After changing, please reload the extension at `chrome://extensions`
 */
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: "ContentCaddy",
  version: packageJson.version,
  description: packageJson.description,
  background: {
    service_worker: "src/pages/background/index.js",
    type: "module",
  },
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "assets/icons/icon-32.png",
  },
  icons: {
    "16": "assets/icons/icon-16.png",
    "32": "assets/icons/icon-32.png",
    "48": "assets/icons/icon-48.png",
    "128": "assets/icons/icon-128.png",
  },
  permissions: [
    "activeTab",
    "clipboardRead",
    "clipboardWrite",
    "storage",
    "scripting",
  ],
  host_permissions: ["http://*/*", "https://*/*", "<all_urls>"],
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      js: ["src/pages/content/index.js"],
      // KEY for cache invalidation
      css: ["assets/css/contentStyle<KEY>.chunk.css"],
    },
  ],
  devtools_page: "src/pages/devtools/index.html",
  web_accessible_resources: [
    {
      resources: [
        "assets/js/*.js",
        "assets/css/*.css",
        "assets/icons/*.png",
        "assets/images/*.{png,jpg}",
      ],
      matches: ["*://*/*"],
    },
  ],
};

export default manifest;
