ozp-iwc-angular
===============

Angular wrappers around the [OZP-IWC](https://github.com/ozone-development/ozp-iwc). See the IWC [wiki](https://github.com/ozone-development/ozp-iwc/wiki) for the full documentation of the IWC's API. 

## Usage
Include [Angular.js](https://angularjs.org/) in your index, then include the appropriate file from this repo. Typically you will use the Client file.

In development, you should use non minified files like `ozpIwc-client-angular.js`. In production, use the minified version, `ozpIwc-client-angular.min.js`.

Then in your app module, declare the `ozpIwcAngular` as one of your dependencies.

```javascript
var myApp = angular.module('myApp', [ 'ozpIwcAngular' ]);
```

You are then able to use Angular's [Dependency Injection](https://docs.angularjs.org/guide/di) to access the IWC object. Such as:

```javascript
myApp.service('fooService', [ 'ozpIwc', function(ozpIwc) {
  // Do IWC stuff here
}]);
