'use strict';

var parseService = angular.module('where2workApp');

parseService.factory('parseService', function($q, geolocationService) {
  Parse.initialize("tdJ9EW3JJrbezfD2rz6UepSR9qs0Zluun4Am6BF3", "jzpug7fZsuS80WHzfErTVvFznvGYEXZ4rSHjPLau");

  var factory = {};
  factory.getAll = function() {
    var Place = Parse.Object.extend("Place");
    var query = new Parse.Query(Place)
    var deferred = $q.defer();

    var geoPromise = geolocationService.getLocation();

    geoPromise
    .then(function(coordinates) {
      return new Parse.GeoPoint(coordinates);
    })
    .then(function(userGeoPoint) {
      query.near("position", userGeoPoint);

      query.find({
        success: function(results) {
          deferred.resolve(getDistanceForPoints(results));
        },
        error: function(error) {
          deferred.reject(error.message);
        }
      });
    })
    ,function(reason) {
      console.log("get places failed with reason :"+reason);
    };    

    return deferred.promise;
  };

  factory.getObject = function(id) {
    var deferred = $q.defer();
    var Place = Parse.Object.extend("Place");
    var query = new Parse.Query(Place);
    query.get(id, {
      success: function(object) {
        deferred.resolve(object);
      },
      error: function(object, error) {
        deferred.reject(error.message);
      }
    });
    return deferred.promise;
  };

  factory.putObject = function(placeDto) {
    var deferred = $q.defer();
    var Place = Parse.Object.extend("Place");
    var place = new Place();
     
    place.set("name", placeDto.name);
    place.set("address", placeDto.address);
    place.set("wifiQuality", parseInt(placeDto.wifiQuality));
     
    place.save(null, {
      success: function(place) {
        deferred.resolve();
      },
      error: function(gameScore, error) {
        deferred.reject(error.message);
      }
    });
    return deferred.promise;
  }

  return factory; 
});

function getDistanceForPoints(results, userLocation) {
  var userPoint = new Parse.GeoPoint(userLocation);

  var resultWithDistance = []
  for (var i = 0; i < results.length; i++) {
    var place = results[i];
    var targetPoint = new Parse.GeoPoint(place.get('position'));
    var distance = targetPoint.milesTo(userPoint);
    var roundedDistance = Math.round(distance/1000*1.6);
    resultWithDistance[i] = {place: place, distance: roundedDistance}
  };

  return resultWithDistance;
}