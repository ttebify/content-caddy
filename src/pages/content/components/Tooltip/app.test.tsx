import { render, screen } from "@testing-library/react";
import Tooltip from "@src/pages/content/components/Tooltip/Tooltip";

describe("appTest", () => {
  test("render text", () => {
    // given
    const text = "content view";

    // when
    render(<Tooltip />);

    // then
    screen.getByText(text);
  });
});
