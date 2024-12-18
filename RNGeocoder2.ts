export class RNGeocoder {
  static greet(name: string): string {
    if (!name || typeof name !== "string") {
      throw new Error("Invalid name provided");
    }
    return `Hello, ${name}!`;
  }
}

export default RNGeocoder;
