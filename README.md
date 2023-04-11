# Content Caddy

Content Caddy is a powerful browser extension designed to help you save, organise, and share web content effortlessly. With Content Caddy, you can quickly capture and store text sections from any web page, making it easy to keep track of important information and references.

Whether you're conducting research, working on a project, or just browsing the web, Content Caddy is an essential tool for organizing your findings. The extension also comes with a range of customization options that allow you to personalize the way you save and access content, including the ability to **highlight and explain text** for better comprehension.

This extension was built using the latest TypeScript and React, and it offers a highly intuitive and user-friendly interface that anyone can use, regardless of their level of technical expertise.

## Highlight to Explain 🌟🤩 

Content Caddy now includes a powerful new feature called **Highlight to Explain!** With this feature, you can simply highlight any word or phrase on a website, and get an explanation of its meaning in the context of the website you are reading, making your browsing experience more informative and enjoyable.

To enable this feature, you'll need to generate an OpenAI API key. You can get one by following the instructions on the [OpenAI website.](https://platform.openai.com/account/api-keys) Once you have your API key, create a `.env` file in the root directory of the extension (you can rename the `.env-example` file that comes with the project after you clone it). Then, add the following line to the `.env` file, but replace `VITE_OPENAI_API_KEY` with your actual API key to include it in the project:

With your API key added, Highlight to Explain will be ready to use! Simply highlight any word or phrase on a website, click on the explain icon, and you'll get a brief definition or explanation of the highlighted text. Thanks to the power of OpenAI, the explanations provided by this feature are accurate and detailed, making it easier than ever to understand the content you're reading.

## Getting Started

Although Content Caddy extension is not yet published, you can still use it in your browser. Getting started with this extension is a breeze! Just follow the steps below:

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

## Join the community

Content Caddy is an open-source project, and we welcome anyone who's interested in contributing to the development of the extension. If you'd like to get involved, please check out our GitHub repository and submit a pull request with your changes. Together, we can make Content Caddy the best browser extension for organizing and sharing web content!

## ✨ Contributors

- We really like it when people contribute to this project! You can contribute too!
- We would be very grateful for any contributions you make.
- Let's keep contributing to help the project stay active and grow.

<a href="https://github.com/ttebify/content-caddy/graphs/contributors" style="display: flex; align-items: center;">
<p>
  <img src="https://contrib.rocks/image?repo=ttebify/content-caddy" alt="A table of avatars from the project's contributors" />
  <img width="65px" height="65px" src="https://avatars.githubusercontent.com/u/11428345?v=4" style="border-radius: 50%;margin-left: 2px;" />
</p>
</a>

## Credits

- This project was created from the template [Chrome Extension Boilerplate with React + Vite + Typescript.](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)

- The icons used in this extension were provided by [Icons8](https://icons8.com/). We would like to thank them for their excellent work and for making these icons available for use in our project.
