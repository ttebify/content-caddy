import { InputDetector } from "@src/api";

// Mock non-empty options
jest.mock("@src/config/input_field_configs", () => ({
  websitesInputFieldConfigOptions: [
    {
      href: /.*/,
      classNames: ["input-field"],
      selectors: ["input[type='text']"],
      attributes: ["required"],
      threshold: 0.3,
    },
  ],
}));

describe("InputDetector", () => {
  test("should throw an error if node is not provided", () => {
    expect(() => new InputDetector(null)).toThrow("Node is required.");
  });

  test("should detect input field based on class name", () => {
    const div = document.createElement("div");
    div.classList.add("input-field");
    const detector = new InputDetector(div);
    expect(detector.isInputField()).toBe(true);
  });

  test("should detect input field based on selector", () => {
    const div = document.createElement("div");
    div.innerHTML = '<input type="text" />';
    const detector = new InputDetector(div);
    expect(detector.isInputField()).toBe(true);
  });

  test("should detect input field based on attribute", () => {
    const div = document.createElement("div");
    div.innerHTML = '<input type="text" required />';
    const detector = new InputDetector(div);
    expect(detector.isInputField()).toBe(true);
  });

  test("should not detect input field if threshold is not met", () => {
    const div = document.createElement("div");
    div.classList.add("input-field");
    const detector = new InputDetector(div);
    detector["options"].threshold = 1;
    expect(detector.isInputField()).toBe(false);
  });
});
