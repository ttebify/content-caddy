export const getImageUrl = (url: string) => {
  return chrome.runtime.getURL(url);
};

interface WebsiteDetectionOptions {
  href: RegExp;
  classNames: string[];
  selectors: string[];
  attributes: string[];
  // events: string[];
  threshold: number;
}

const webnsiteDetectionOptions: WebsiteDetectionOptions[] = [
  {
    href: /twitter\.com\/compose\/tweet/,
    classNames: ["public-DraftEditor-content"],
    selectors: ["[data-testid='tweetTextarea_0']"],
    attributes: ["role"],
    // events: ["focus", "keyup"],
    threshold: 0.4,
  },
  {
    href: /medium\.com/,
    classNames: ["postArticle-content"],
    selectors: ["[contenteditable='true']"],
    attributes: ["data-quillbot-element"],
    // events: ["focus"],
    threshold: 0.4,
  },
  {
    href: /.*/,
    classNames: [],
    selectors: [],
    attributes: [],
    // events: [],
    threshold: 0.4,
  },
];

/**
 * A class that detects input fields on specific websites based on predefined options.
 * @class InputDetector
 */
export class InputDetector {
  private readonly options: WebsiteDetectionOptions;
  private readonly node: HTMLElement;
  private events: Map<string, EventListener[]> = new Map();

  /**
   * Constructs a new instance of the InputDetector class.
   * @param {Element} node - The node to be checked for input fields.
   * @throws {Error} Throws an error if the node parameter is not provided or not an instance of HTMLElement.
   */

  constructor(node: HTMLElement) {
    if (!node) {
      throw new Error("Node is required.");
    }

    let websiteOptions: WebsiteDetectionOptions | undefined;

    for (let i = 0; i < webnsiteDetectionOptions.length; i++) {
      const websiteOption = webnsiteDetectionOptions[i];
      if (window.location.href.match(websiteOption.href)) {
        console.log(websiteOption);
        websiteOptions = websiteOption;
        break;
      }
    }

    if (!websiteOptions) {
      throw new Error("Website options not found.");
    }

    this.options = Object.assign({}, websiteOptions);
    this.node = node;

    // this.initializeEventListeners();
  }

  /**
   * Initializes event listeners on the node.
   * @private
   */
  /* private initializeEventListeners(): void {
    const originalAddEventListener = this.node.addEventListener.bind(this.node);

    this.node.addEventListener = (type: string, listener: EventListener) => {
      if (!this.events.has(type)) {
        this.events.set(type, []);
      }

      this.events.get(type)?.push(listener);
      originalAddEventListener(type, listener);
    };
  } */

  /**
   * Returns an array of event listeners for the specified event type.
   * @param {string} type - The type of event to search for.
   * @returns {EventListener[]} An array of event listeners for the specified event type.
   */
  public getEventListeners(type: string): EventListener[] {
    return this.events.get(type) ?? [];
  }

  /**
   * Checks if the node has any of the predefined class names for an input field.
   * @returns {boolean} Returns true if the node has any of the predefined class names for an input field.
   */
  private checkClassNames(): boolean {
    return this.options.classNames.some((className) =>
      this.node.classList.contains(className)
    );
  }

  /**
   * Checks if the node matches any of the predefined selectors for an input field.
   * @returns {boolean} Returns true if the node matches any of the predefined selectors for an input field.
   */
  private checkSelectors(): boolean {
    return this.options.selectors.some((selector) => {
      return this.node.matches(selector) || !!this.node.querySelector(selector);
    });
  }

  /**
   * Checks if the node has any of the predefined attributes for an input field.
   * @returns {boolean} Returns true if the node has any of the predefined attributes for an input field.
   */
  private checkAttributes(): boolean {
    return this.options.attributes.some((attribute) => {
      const selector = `[${attribute}]`;
      return this.node.matches(selector) || !!this.node.querySelector(selector);
    });
  }

  /**
   * Checks if the node has any of the predefined events for an input field.
   * @returns {boolean} Returns true if the node has any of the predefined events for an input field.
   */
  /* private checkEvents(): boolean {
    return this.options.events.some((event) => {
      const elements = Array.from(this.node.querySelectorAll("*")).filter(
        (element) => element instanceof HTMLElement
      );

      return elements.some((element) => {
        const listeners = this.getEventListeners(event);
        return listeners && listeners.length > 0;
      });
    });
  } */

  /**
   * Checks if the number of matches found meets the threshold required to identify the node as an input field.
   * @param {number} matches - The number of matches found.
   * @param {number} total - The total number of checks performed.
   * @returns {boolean} Returns true if the number of matches found meets the threshold required to identify the node as an input field.
   */
  private checkThreshold(matches: number, total: number): boolean {
    console.log(matches, total);
    return total > 0 && matches / total >= this.options.threshold;
  }

  /**
   * Checks if the node is an input field.
   * @returns {boolean} Returns true if the node is identified as an input field based on the predefined options.
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

    /* if (this.checkEvents()) {
      matches++;
    }
    total++; */

    return this.checkThreshold(matches, total);
  }
}
