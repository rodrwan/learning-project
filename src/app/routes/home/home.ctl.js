(function () {
  'use strict';

  angular.module('learnApp.home')

  .controller('HomeCtrl', function ($scope, RandomArticles) {
    RandomArticles.getList().then(function (articles) {
      $scope.articles = articles;
    });
  });
})();
