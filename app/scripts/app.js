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
        controller: 'introCtrl'
      })
      .when('/places', {
        templateUrl: 'views/places.html',
        controller: 'PlacesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });