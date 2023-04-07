# Content Caddy

Content Caddy is a browser extension that allows you to save, organize, and share sections of web content easily. This extension was built using TypeScript and React.

## Getting Started

To get started, follow these steps:

1. Clone the repository to your local machine.
2. Run `yarn install` to install the dependencies.
3. Run `yarn dev` to start the development server. This will compile the extension with HMR (Hot Module Replacement) enabled and start a server to reload the extension automatically.
4. Open your browser and go to the Extensions page. (In Chrome, go to `chrome://extensions/`.)
5. Enable Developer Mode in the top right corner if it's not already enabled.
6. Click "Load unpacked" and select the `dist` folder in the project directory.
7. The extension should now be installed and ready to use.

Note: If you make any changes to the code, the extension will automatically reload thanks to HMR.

## Building

To build the extension, run `yarn build`. This will compile the TypeScript files and bundle them with Vite.

## Testing

To run tests, run `yarn test`. This will run all tests using Jest.

## Credits

This project was created from the template [Chrome Extension Boilerplate with React + Vite + Typescript.](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)

The icons used in this extension were provided by [Icons8](https://icons8.com/). We would like to thank them for their excellent work and for making these icons available for use in our project.
