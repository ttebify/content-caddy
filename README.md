# Content Caddy

Content Caddy is a browser extension that makes it easy to save, organize, and share web content. With Content Caddy, you can capture and store text sections from any web page, keeping track of important information and references. It's perfect for research, projects, or browsing, and offers customization options like **highlighting and explaining text**.

Built with TypeScript and React, Content Caddy has a user-friendly interface for all levels of technical expertise.
## Highlight to Explain 🌟🤩 

Content Caddy introduces a powerful new feature called **Highlight to Explain!** This feature allows you to highlight any word or phrase on a website to get a contextual explanation, enhancing your browsing experience.

To use the feature:

1. Generate an OpenAI API key by following the instructions on the [OpenAI website.](https://platform.openai.com/account/api-keys).
2. Click on the Content Caddy extension icon to open the popup, then go to the Settings tab.
3. Click on the `"Add a new key"` button and enter your OpenAI API key.
4. Click on `"Save"` to save your changes.

With your API key added, you can now highlight any word or phrase on a website, click on the explain icon, and get a brief definition or explanation. The explanations provided by OpenAI are detailed and accurate, making it easier to comprehend website content.

## Getting Started

Note that this version is still in its early stages, so you may encounter some bugs or glitches. If you have any issues or suggestions, please don't hesitate to contact the developers here by creating an issue.

## Installation

### Option 1: Install from the Microsoft Web Store

1. Open your Microsoft Edge browser.
2. Go to the Microsoft web store at the following URL: https://microsoftedge.microsoft.com/addons/detail/icblaofpjceadeagkejnojmknpbkhpdd.
3. Click on the "Get" button to download and install the extension.
4. Once the installation is complete, you should see the Content Caddy icon in your browser toolbar.
5. Click on the icon to start using the extension and explore its features.

### Option 2: Build and install from source code

1. Clone the repository to your local machine.
2. Run `yarn install` to install the dependencies.
3. Run `yarn build` to build the extension.
4. Open your browser and go to the Extensions page. (In Chrome, go to `chrome://extensions/`.)
5. Enable Developer Mode in the top right corner if it's not already enabled.
6. Click "Load unpacked" and select the `dist` folder in the project directory.

The extension should now be installed and ready to use.

## Build for development

To build the extension in development mode, run `yarn dev` tto start the development server. This will compile the extension with HMR (Hot Module Replacement) enabled and start a server to reload the extension automatically.

## Testing

To run tests, run `yarn test`. This will run all tests using Jest.

## Join the community

Content Caddy is an open-source project, and we welcome anyone who's interested in contributing to the development of the extension. If you'd like to get involved, please check out our GitHub repository and submit a pull request with your changes. Together, we can make Content Caddy the best browser extension for organizing and sharing web content!

## ✨ Contributors

- We really like it when people contribute to this project! You can contribute too!
- We would be very grateful for any contributions you make.
- Let's keep contributing to help the project stay active and grow.

<a href="https://github.com/ttebify/content-caddy/graphs/contributors" style="display: flex; align-items: center;">
<p>
  <img src="https://contrib.rocks/image?repo=ttebify/content-caddy" alt="A table of avatars from the project's contributors" />
  <img width="65px" height="65px" src="https://avatars.githubusercontent.com/u/11428345?v=4" style="border-radius: 65px;margin-left: 2px;" />
</p>
</a>

## Credits

- This project was created from the template [Chrome Extension Boilerplate with React + Vite + Typescript.](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)

- The icons used in this extension were provided by [Icons8](https://icons8.com/). We would like to thank them for their excellent work and for making these icons available for use in our project.
