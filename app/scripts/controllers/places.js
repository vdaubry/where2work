'use strict';

angular.module('where2workApp')
  .controller('PlacesCtrl', function ($scope, parseService, geolocationService, $route) {
    $scope.loading = true;

    //Load from cache
    if(sessionStorage.getItem('places')!=undefined) {
      $scope.places = JSON.parse(sessionStorage.getItem('places'));
      $scope.formattedAddress = sessionStorage.getItem('formattedAddress');
      $scope.loading = false;
    }
    else {
      console.log("no cache");
      var placesPromise = parseService.getAll();
      placesPromise.then(function(results) {
        sessionStorage.setItem('places', JSON.stringify(results));
        $scope.places = JSON.parse(sessionStorage.getItem('places'));

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

    $scope.reloadList = function() {
      sessionStorage.removeItem('places');
      $route.reload();
    }
  });


angular.module('where2workApp')
  .controller('PlaceCtrl', function ($scope, $routeParams, parseService, $sce) {
    var id = $routeParams.id;
    var parsePromise = parseService.getObject(id);

    parsePromise.then(function(object) {
      $scope.place = object;
      var google_api_key = "AIzaSyATWjJ2N7zzsx5hpsiVy3QNvzGhZLq2-R4"
      var url = encodeURI("https://www.google.com/maps/embed/v1/place?key="+google_api_key+"&q="+object.get('address'));
      console.log("add="+object.get('address'));
      $scope.url = url;
      $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
      }
    });


  });


angular.module('where2workApp')
  .controller('PlaceCreateCtrl', function ($scope, parseService, geolocationService) {
    $scope.place = {};

    var addressPromise = geolocationService.reverseGeocodeLocation();
    addressPromise.then(function(formattedAddress) {
      if(!$scope.place.address) {
        $scope.place.address = formattedAddress;
        $scope.place.longitude = geolocationService.currentLocation.longitude;
        $scope.place.latitude = geolocationService.currentLocation.latitude;
      }
    });

    $scope.updateCoords = function(address) {
      var geoservicePromise = geolocationService.geocodeAddress(address);
      geoservicePromise.then(function(result, coords){
        $scope.place.address = result.formatedAddress;
        $scope.place.longitude = result.coords.longitude;
        $scope.place.latitude = result.coords.latitude;
      })
    }

    $scope.submitElement = function() {
      $scope.errorMsg = null;
      $scope.formSuccess = null;

      var putObjectPromise = parseService.putObject($scope.place);
      putObjectPromise.then(function(){
        //invalidate cache
        sessionStorage.removeItem('places');
        sessionStorage.removeItem('formattedAddress');
        $scope.formSuccess = true;
      }, function(reason) {
        $scope.errorMsg = reason;
      });
    }
  });


