'use strict';

angular.module('where2workApp')
  .controller('PlacesCtrl', function ($scope, parseService, geolocationService) {
    $scope.loading = true;

    var placesPromise = parseService.getAll();
    placesPromise.then(function(results) {
      $scope.places = results;

      var addressPromise = geolocationService.reverseGeocodeLocation();
      addressPromise.then(function(formattedAddress) {
        $scope.formattedAddress = formattedAddress;
        $scope.loading = false;
      });
    }, function(reason) {
      console.log("get places failed with reason :"+reason);
      $scope.loading = false;
    });
  });
