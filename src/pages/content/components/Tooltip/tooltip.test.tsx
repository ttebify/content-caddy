describe("add function", () => {
  it("should add two numbers correctly", () => {
    const result = add(2, 3);
    expect(result).toEqual(5);
  });
});
function add(x: number, y: number) {
  return x + y;
}
