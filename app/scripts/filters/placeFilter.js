'use strict';

var module = angular.module('where2workApp');

module.filter('wifiColor', function(parseService, $q) {
  return function (wifiQuality) {
    if(wifiQuality>2) {
      return "progress-bar-success";
    }
    else if(wifiQuality>1) {
      return "progress-bar-warning";
    }
    else {
      return "progress-bar-danger";
    }
  };
});
