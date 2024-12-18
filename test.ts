import RNGeocoder from "./RNGeocoder";

describe("greet", () => {
  it("should return a greeting with the provided name", () => {
    expect(RNGeocoder.greet("World")).toBe("Hello, World!");
  });

  it("should throw an error for empty string", () => {
    expect(() => RNGeocoder.greet("")).toThrow("Invalid name provided");
  });

  it("should throw an error for invalid input types", () => {
    expect(() => RNGeocoder.greet(null as any)).toThrow("Invalid name provided");
    expect(() => RNGeocoder.greet(123 as any)).toThrow("Invalid name provided");
  });

  it("should handle special characters", () => {
    expect(RNGeocoder.greet("!@#$%^&*()_+=-`")).toBe("Hello, !@#$%^&*()_+=-`!");
  });

  it("should handle unicode characters", () => {
    expect(RNGeocoder.greet("你好")).toBe("Hello, 你好!");
  });
});
