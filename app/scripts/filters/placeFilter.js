'use strict';

var module = angular.module('where2workApp');

module.filter('distance', function(parseService, $q) {
  return function (targetCoordinates) {
    var targetPoint = {latitude: targetCoordinates.latitude, longitude: targetCoordinates.longitude}
    return 10;//parseService.getDistanceFromUser(targetCoordinates);
  };
});