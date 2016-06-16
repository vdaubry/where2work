'use strict';

var geolocationService = angular.module('where2workApp');

geolocationService.factory('geolocationService', function($q, $window, $http) {
  var factory = {};
  factory.currentLocation = null;

  factory.getLocation = function() {
    var deferred = $q.defer();
    if(factory.currentLocation) {
      console.log("found current location in cache");
      deferred.resolve(factory.currentLocation);
    }
    else if(!$window.navigator) {
      deferred.reject(new Error('Geolocation is not supported'));
    } else {
      $window.navigator.geolocation.getCurrentPosition(function(position) {
        factory.currentLocation = position.coords;
        deferred.resolve(factory.currentLocation);
      }, deferred.reject);
    }

    return deferred.promise;
  };

  factory.reverseGeocodeLocation = function() {
    var deferred = $q.defer();
    var MAPS_ENDPOINT = 'http://maps.google.com/maps/api/geocode/json?latlng={POSITION}&sensor=false';

    var geoPromise = factory.getLocation();
    geoPromise.then(function(coordinates) {
      var url = MAPS_ENDPOINT.replace('{POSITION}', coordinates.latitude + ',' + coordinates.longitude);
      return url;
    })
    .then(function(url) {
      $http.get(url).success(function(response) {
        factory.currentAddress = response.results[0].formatted_address;
        deferred.resolve(factory.currentAddress);
      }).error(deferred.reject);
    });

    return deferred.promise;
  };

  factory.geocodeAddress = function(address) {
    var deferred = $q.defer();
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode( { 'address': address}, function(results, status) {
      console.log("results"+results);
      var formatedAddress = results[0].formatted_address;
      var coords = {longitude: results[0].geometry.location.D, latitude: results[0].geometry.location.k};
      var result = {formatedAddress: formatedAddress, coords: coords}
      deferred.resolve(result)
    });

    return deferred.promise;
  }

  return factory;
});
