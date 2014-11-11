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

module.filter('typeIcon', function(parseService, $q) {
  return function (type) {
    if(type=="bar") {
      return "glyphicons_273_drink.png";
    }
    else if(type=="coworking") {
      return "glyphicons_043_group.png";
    }
    else if(type=="library"){
      return "glyphicons_351_book_open.png";
    }
  };
});

module.filter('boolIcon', function(parseService, $q) {
  return function (phone) {
    return phone ? "glyphicon-ok" : "glyphicon-remove";
  };
});