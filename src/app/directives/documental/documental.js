(function () {
  'use strict';

  angular.module('learnApp')
  .directive('documental', function (store) {
    return {
      restrict: 'E',

      scope: {
        doc: '='
      },
      templateUrl: 'build/html/directives/documental/documental.html',
      link: function ($scope, element) {
        console.log($scope.doc);
      }
    };
  });
})();
