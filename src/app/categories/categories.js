(function () {
  'use strict';

  angular.module('learnApp.categories', [
    'ui.router',
    'angular-storage'
  ])

  .config(function ($stateProvider) {
    $stateProvider.state('categories', {
      url: '/categories',
      controller: 'CatsCtrl',
      templateUrl: 'build/html/categories/categories.html'
    });
  })

  .controller('CatsCtrl', function CatsController ($scope) {
    $scope.categories = [
      {
        'name': 'Historia y Teoría',
        'link': '/history',
        'image': 'history.jpg'
      }
    ]
  });
})();
