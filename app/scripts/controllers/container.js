'use strict';

function updateBodyLayout($rootScope, path) {
  var isIntro = ("/" === path);
  $rootScope.bodylayout = isIntro ? "bg" : "";
}

angular.module('where2workApp')
  .controller('ContainerCtrl', function ($rootScope, $location) {
    updateBodyLayout($rootScope, $location.path());

    $rootScope.$on("$locationChangeStart", function(event, next, current) { 
      var path = next.split("#");
      updateBodyLayout($rootScope, path[1]);
    });
  });