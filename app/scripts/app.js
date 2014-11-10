'use strict';

/**
 * @ngdoc overview
 * @name where2workApp
 * @description
 * # where2workApp
 *
 * Main module of the application.
 */
angular
  .module('where2workApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/intro.html',
        controller: 'IntroCtrl'
      })
      .when('/places', {
        templateUrl: 'views/places.html',
        controller: 'PlacesCtrl'
      })
      .when('/place/:id', {
        templateUrl: 'views/place.html',
        controller: 'PlaceCtrl'
      })
      .when('/places/new', {
        templateUrl: 'views/new.html',
        controller: 'PlaceCreateCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });