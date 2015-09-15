(function () {
  'use strict';

  angular.module('learnApp')
  .directive('documentariesItem', function () {
    return {
      restrict: 'E',

      scope: {
        doc: '='
      },
      templateUrl: 'build/html/directives/documentaries-item/documentaries-item.html',
      link: function ($scope, element) {
        console.log($scope.doc);
      }
    };
  });
})();
