import { InputDetector } from "@src/api";

jest.mock("@src/config/input_field_configs", () => ({
  websitesInputFieldConfigOptions: [],
}));

describe("InputDetector", () => {
  test("should throw an error if website options are not found", () => {
    const div = document.createElement("div");
    expect(() => new InputDetector(div)).toThrow("Website options not found.");
  });
});
