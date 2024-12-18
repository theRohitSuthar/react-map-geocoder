/**
 * Module to use Google's geocoding & reverse geocoding.
 */
export class RNGeocoder {
  private static apiKey: string | null = null;
  private static options: Record<string, any> = {};

  /**
   * Initialize the module.
   * @param apiKey The API key of your application in Google.
   * @param options Extra options for your geocoding request.
   * @see https://developers.google.com/maps/documentation/geocoding/intro#geocoding
   */
  static init(apiKey: string, options: Record<string, any> = {}): void {
    this.apiKey = apiKey;
    this.options = options;
  }

  /**
   * @returns True if the module has been initiated, false otherwise.
   */
  static get isInit(): boolean {
    return !!this.apiKey;
  }

  /**
   * Perform geocoding or reverse geocoding.
   * Converts geographic coordinates into a human-readable address and vice versa.
   * @param params Accepted formats:
   * - latitude, longitude (as numbers)
   * - [latitude, longitude] or [latitude, longitude, language] (as an array)
   * - { latitude, longitude, language } or { lat, lng, lang }
   * - Address string, optionally with a bounds object
   * @returns Promise containing the geocoding response data.
   * @see https://developers.google.com/maps/documentation/geocoding/intro#GeocodingResponses
   */
  static async from(...params: any[]): Promise<any> {
    if (!this.isInit) {
      throw {
        code: RNGeocoder.Errors.NOT_INITIATED,
        message: "Geocoder isn't initialized. Call RNGeocoder.init with your app's API key.",
      };
    }

    let queryParams: Record<string, any> | undefined;

    // Handle different parameter formats
    if (!isNaN(params[0]) && !isNaN(params[1])) {
      queryParams = { latlng: `${params[0]},${params[1]}` };
    } else if (Array.isArray(params[0]) && params[0].length === 3) {
      queryParams = { latlng: `${params[0][0]},${params[0][1]}`, language: params[0][2] };
    } else if (Array.isArray(params[0])) {
      queryParams = { latlng: `${params[0][0]},${params[0][1]}` };
    } else if (params[0] instanceof Object && "latitude" in params[0] && "longitude" in params[0]) {
      queryParams = {
        latlng: `${params[0].latitude || params[0].lat},${params[0].longitude || params[0].lng}`,
        language: params[0].language || params[0].lang || "en",
      };
    } else if (params[0] instanceof Object) {
      queryParams = { latlng: `${params[0].lat || params[0].latitude},${params[0].lng || params[0].longitude}` };
    } else if (typeof params[0] === "string" && params[1] instanceof Object) {
      queryParams = { address: params[0], bounds: params[1] };
    } else if (typeof params[0] === "string") {
      queryParams = { address: params[0] };
    }

    if (!queryParams) {
      throw {
        code: RNGeocoder.Errors.INVALID_PARAMETERS,
        message: "Invalid parameters: " + JSON.stringify(params, null, 2),
      };
    }

    queryParams = { key: this.apiKey, ...this.options, ...queryParams };
    const url = `https://maps.google.com/maps/api/geocode/json?${toQueryParams(queryParams)}`;

    let response: Response;
    let data: any;

    try {
      response = await fetch(url);
    } catch (error) {
      throw {
        code: RNGeocoder.Errors.FETCHING,
        message: "Error while fetching. Check your network.",
        origin: error,
      };
    }

    try {
      data = await response.json();
    } catch (error) {
      throw {
        code: RNGeocoder.Errors.PARSING,
        message: "Error parsing response body into JSON.",
        origin: response,
      };
    }

    if (data.status !== "OK") {
      throw {
        code: RNGeocoder.Errors.SERVER,
        message: "Error from the server while geocoding.",
        origin: data,
      };
    }

    return data;
  }

  /**
   * All possible error codes.
   */
  static Errors = {
    NOT_INITIATED: 0,
    INVALID_PARAMETERS: 1,
    FETCHING: 2,
    PARSING: 3,
    SERVER: 4,
  };
}

/**
 * Encodes a bounds object into a URL-encoded string.
 */
function encodeBounds(bounds: { southwest: { lat: number; lng: number }; northeast: { lat: number; lng: number } }): string {
  const southwest = bounds.southwest;
  const northeast = bounds.northeast;
  return `${encodeURIComponent(southwest.lat)},${encodeURIComponent(southwest.lng)}|${encodeURIComponent(northeast.lat)},${encodeURIComponent(northeast.lng)}`;
}

/**
 * Encodes a component to be safely used inside a URL.
 */
function encodeComponent(key: string, value: any): string {
  if (key === "bounds") {
    return encodeBounds(value);
  }
  return encodeURIComponent(value);
}

/**
 * Converts an object into query parameters.
 * @param object The object to convert.
 * @returns Encoded query parameters.
 */
function toQueryParams(object: Record<string, any>): string {
  return Object.keys(object)
    .filter((key) => !!object[key])
    .map((key) => `${key}=${encodeComponent(key, object[key])}`)
    .join("&");
}

export default RNGeocoder;
