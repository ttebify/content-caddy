import type { WebsiteDetectionOptions } from "@src/types";

/**
 * This file contains a list of website structures and input field selectors that are used by the input field detection algorithm.
 * Each object in the list represents a website and has the following properties:
 * - href: a regular expression matching the website URL
 * - classNames: an array of class names that are used to identify input fields
 * - selectors: an array of additional selectors that are used to identify input fields
 * - attributes: an array of attributes that are commonly used in input fields
 * - threshold: a number between 0 and 1 that represents the minimum similarity score required to consider an element an input field
 *
 * To add a new website to the list, create a new object with the above properties and add it to the array.
 *
 * Example usage:
 *
 * export const websitesInputFieldConfigOptions: WebsiteDetectionOptions[] = [
 *   {
 *     href: /twitter\.com\/compose\/tweet/,
 *     classNames: ["public-DraftEditor-content"],
 *     selectors: [
 *       "[data-testid='tweetTextarea_0']",
 *       "[role='textbox']",
 *       "[aria-multiline='true']",
 *       "[contenteditable='true']",
 *     ],
 *     attributes: ["spellcheck"],
 *     threshold: 0.5,
 *   },
 * ];
 */
export const websitesInputFieldConfigOptions: WebsiteDetectionOptions[] = [
  // Twitter
  {
    href: /twitter\.com\/compose\/tweet/,
    classNames: ["public-DraftEditor-content"],
    selectors: [
      "[data-testid='tweetTextarea_0']",
      "[role='textbox']",
      "[aria-multiline='true']",
      "[contenteditable='true']",
      "[data-text='true']",
    ],
    attributes: ["spellcheck", "data-text"],
    threshold: 0.3,
  },
  // Medium
  {
    href: /medium\.com/,
    classNames: [
      "postArticle-content",
      "js-postField",
      "js-notesSource",
      "editable",
      "graf",
    ],
    selectors: [
      "[contenteditable='true']",
      "[data-default-value='Title Tell your story…']",
      "[data-gramm='false']",
    ],
    attributes: [
      "role",
      "spellcheck",
      "aria-multiline",
      "data-gramm",
      "data-default-value",
    ],
    threshold: 0.3,
  },
  // Add more website structures and input field selectors here

  // Fallback for all other websites
  {
    href: /.*/,
    classNames: [],
    selectors: [
      'input[type="text"]',
      'input[type="password"]',
      'input[type="email"]',
      'input[type="tel"]',
      'input[type="url"]',
      "textarea",
      '[contenteditable="true"]',
      '[contenteditable="plaintext-only"]',
      '[role="textbox"]',
      '[role="searchbox"]',
    ],
    attributes: ["name", "placeholder", "aria-placeholder"],
    threshold: 0.4,
  },
];
