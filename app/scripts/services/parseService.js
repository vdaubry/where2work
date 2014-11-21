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
          deferred.resolve(getDistanceForPoints(results, userGeoPoint));
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
    var geoPoint = new Parse.GeoPoint({latitude: placeDto.latitude, longitude: placeDto.longitude});

    place.set("name", placeDto.name);
    place.set("address", placeDto.address);
    place.set("wifiQuality", parseInt(placeDto.wifiQuality));
    place.set("placeType", placeDto.placeType);
    place.set("phoneFriendly", (placeDto.phoneFriendly==1));
    place.set("quiet", (placeDto.quiet==1));
    place.set("price", parseInt(placeDto.price));
    place.set("position", geoPoint);

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
  var resultWithDistance = []
  for (var i = 0; i < results.length; i++) {
    var place = results[i];
    var distanceKilometer = distance(place.get('position').latitude, place.get('position').longitude, userLocation.latitude, userLocation.longitude);
    var roundedDistance = Math.round(distanceKilometer*10)/10;
    resultWithDistance[i] = {place: place, distance: roundedDistance}
  };

  return resultWithDistance;
}


function distance(lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var radlon1 = Math.PI * lon1/180
    var radlon2 = Math.PI * lon2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    dist = dist * 1.609344
    return dist
}
