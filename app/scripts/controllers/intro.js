'use strict';

angular.module('where2workApp')
  .controller('IntroCtrl', function ($scope, $location) {
    $scope.goToPlaces = function() {
      $location.path("places");
    }
});
