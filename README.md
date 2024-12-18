# react-map-geocoder

A geocoding module for [React Native](https://github.com/facebook/react-native) to transform a description of a location (i.e. street address, town name, etc.) into geographic coordinates (i.e. latitude and longitude) and vice versa.

This module uses [Google Maps Geocoding API](https://developers.google.com/maps/documentation/geocoding/intro) and requires an API key for purposes of quota management. Please check [this link](https://developers.google.com/maps/documentation/geocoding/get-api-key) out to obtain your API key.

## Install

```shell
npm install --save react-map-geocoder
```

## Example

```js
import RNGeocoder from 'react-map-geocoder';

RNGeocoder.init("YOUR_GOOGLE_API_KEY");

// Reverse geocoding
RNGeocoder.from(37.7749, -122.4194)
  .then((data) => console.log(data))
  .catch((error) => console.error(error));

// Reverse geocoding with language
RNGeocoder.from([37.7749, -122.4194, "es"])
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

```js
import RNGeocoder from 'react-map-geocoder';

// Initialize the module (needs to be done only once)
RNGeocoder.init("xxxxxxxxxxxxxxxxxxxxxxxxx"); // use a valid API key
// With more options
// RNGeocoder.init("xxxxxxxxxxxxxxxxxxxxxxxxx", {language : "en"}); // set the language

// Search by address
RNGeocoder.from("Colosseum")
		.then(json => {
			var location = json.results[0].geometry.location;
			console.log(location);
		})
		.catch(error => console.warn(error));

// Search by address, with a biased geo-bounds
RNGeocoder.from("Pyramid", {
		southwest: {lat: 36.05, lng: -115.25},
		northeast: {lat: 36.16, lng: -115.10}})
		.then(json => {
			var location = json.results[0].geometry.location;
			console.log(location);
		})
		.catch(error => console.warn(error));

// Search by geo-location (reverse geo-code)
RNGeocoder.from(41.89, 12.49)
		.then(json => {
        		var addressComponent = json.results[0].address_components[0];
			console.log(addressComponent);
		})
		.catch(error => console.warn(error));

// Works as well :
// ------------

// location object
RNGeocoder.from({
	latitude : 41.89,
	longitude : 12.49
});

// latlng object
RNGeocoder.from({
	lat : 41.89,
	lng : 12.49
});

// array
RNGeocoder.from([41.89, 12.49]);
```

# Error Codes
| Name | Code | Description |
| --- | --- | --- |
| NOT_INITIATED | 0 | Module hasn't been initiated. Call init function, and pass it your app's api key as parameter. |
| INVALID_PARAMETERS | 1 | Parameters are invalid. |
| FETCHING | 2 | Error wile fetching to server. The error's 'origin' property contains the fetch error. |
| PARSING | 3 | Error while parsing server response. The error's 'origin' property contains the response. |
| SERVER | 4 | Error from the server. The error's 'origin' property contains the response's body. |


## Release Notes

See [CHANGELOG.md](https://github.com/theRohitSuthar/react-map-geocoder/blob/master/CHANGELOG.md)
