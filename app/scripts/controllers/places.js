'use strict';

angular.module('where2workApp')
  .controller('PlacesCtrl', function ($scope, parseService, geolocationService) {
    $scope.loading = true;

    //Load from cache
    if(sessionStorage.getItem('places')!=undefined) {
      console.log("places="+sessionStorage.getItem('places'));
      $scope.places = JSON.parse(sessionStorage.places);
      $scope.formattedAddress = sessionStorage.formattedAddress;
      $scope.loading = false;
    }
    else {
      console.log("no cache");
      var placesPromise = parseService.getAll();
      placesPromise.then(function(results) {
        sessionStorage.setItem('places', JSON.stringify(results));
        $scope.places = JSON.parse(sessionStorage.places);

        var addressPromise = geolocationService.reverseGeocodeLocation();
        addressPromise.then(function(formattedAddress) {
          $scope.formattedAddress = formattedAddress;
          sessionStorage.setItem('formattedAddress', formattedAddress);
          $scope.loading = false;
        });
      }, function(reason) {
        console.log("get places failed with reason :"+reason);
        $scope.loading = false;
      });
    }
  });


angular.module('where2workApp')
  .controller('PlaceCtrl', function ($scope, $routeParams, parseService) {
    var id = $routeParams.id;
    var parsePromise = parseService.getObject(id);
    
    parsePromise.then(function(object) {
      $scope.place = object;
    });
  });


