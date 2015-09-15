(function () {
  'use strict';

  angular.module('learnApp.rte.categoryList')

  .controller('CatListCtrl', function ($scope, $stateParams, Categories) {
    var categoryMeta = {};

    Categories.getList().then(function (categories) {
      $scope.loadingIsDone = false;
      categories.forEach(function (elem) {
        categoryMeta[elem.id] = {};
        categoryMeta[elem.id].sectionTitle = elem.title;
        categoryMeta[elem.id].description = elem.description;
      });
      $scope.loadingIsDone = true;
    });

    $scope.category = $stateParams.cat;
    Categories.one($scope.category).getList().then(function (topics) {
      $scope.category = $stateParams.cat;
      $scope.categories = topics;
      $scope.meta = categoryMeta[$scope.category];
      $scope.loadingIsDone = true;
    });
  });
})();
