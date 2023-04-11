import { websitesInputFieldConfigOptions } from "@src/config/input_field_configs";
import { WebsiteDetectionOptions } from "@src/types";

/**
 * A class that detects input fields on specific websites based on predefined options.
 */
export class InputDetector {
  private readonly options: WebsiteDetectionOptions;
  private readonly node: HTMLElement;

  constructor(node: HTMLElement) {
    if (!node) {
      throw new Error("Node is required.");
    }

    let websiteOptions: WebsiteDetectionOptions | undefined;

    for (let i = 0; i < websitesInputFieldConfigOptions.length; i++) {
      const websiteOption = websitesInputFieldConfigOptions[i];
      if (window.location.href.match(websiteOption.href)) {
        websiteOptions = websiteOption;
        break;
      }
    }

    if (!websiteOptions) {
      throw new Error("Website options not found.");
    }

    this.options = Object.assign({}, websiteOptions);
    this.node = node;
  }

  /**
   * Checks if the node has any of the predefined class names for an input field.
   */
  private checkClassNames(): boolean {
    return this.options.classNames.some((className) =>
      this.node.classList.contains(className)
    );
  }

  /**
   * Checks if the node matches any of the predefined selectors for an input field.
   */
  private checkSelectors(): boolean {
    return this.options.selectors.some((selector) => {
      return this.node.matches(selector) || !!this.node.querySelector(selector);
    });
  }

  /**
   * Checks if the node has any of the predefined attributes for an input field.
   */
  private checkAttributes(): boolean {
    return this.options.attributes.some((attribute) => {
      const selector = `[${attribute}]`;
      return this.node.matches(selector) || !!this.node.querySelector(selector);
    });
  }

  /**
   * Checks if the number of matches found meets the threshold required to identify the node as an input field.
   */
  private checkThreshold(matches: number, total: number): boolean {
    return total > 0 && matches / total >= this.options.threshold;
  }

  /**
   * Checks if the node is an input field.
   */
  public isInputField(): boolean {
    let matches = 0;
    let total = 0;

    if (this.checkClassNames()) {
      matches++;
    }
    total++;

    if (this.checkSelectors()) {
      matches++;
    }
    total++;

    if (this.checkAttributes()) {
      matches++;
    }
    total++;

    return this.checkThreshold(matches, total);
  }
}
