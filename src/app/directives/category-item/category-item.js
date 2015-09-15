(function () {
  'use strict';

  angular.module('learnApp')
  .directive('categoryItem', function () {
    return {
      restrict: 'E',

      scope: {
        data: '=',
        category: '=?',
        sectype: '@'
      },
      templateUrl: 'build/html/directives/category-item/category-item.html',
      link: function ($scope, element) {
        if ($scope.sectype === 'cats') {
          $scope.section = 'categories';
        } else {
          $scope.section = 'documentaries';
        }
      }
    };
  });
})();
