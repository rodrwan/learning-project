(function () {
  'use strict';

  angular.module('learnApp.rte.categories')

  .controller('CatsCtrl', function CatsController ($scope, Categories) {
    Categories.getList().then(function (categories) {
      $scope.categories = categories;
      $scope.loadingIsDone = true;
    });
  });
})();
