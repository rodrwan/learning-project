(function () {
  'use strict';

  angular.module('learnApp')
  .directive('categoriesMeta', function () {
    return {
      restrict: 'E',

      scope: {
        meta: '=',
        category: '='
      },
      templateUrl: 'build/html/directives/categories-meta/categories-meta.html',
      link: function ($scope, element) {
        console.log($scope.doc);
      }
    };
  });
})();
