(function () {
  'use strict';

  angular.module('learnApp.categories', [
    'ui.router',
    'angular-storage'
  ])

  .config(function ($stateProvider) {
    $stateProvider
    .state('categories', {
      url: '/categories',
      controller: 'CatsCtrl',
      templateUrl: 'build/html/categories/categories.html'
    })
    .state('categories.cat', {
      url: '/:cat',
      controller: 'CatCtrl',
      templateUrl: 'build/html/categories/category.html'
    })
    .state('categories.resource', {
      url: '/:cat/:id',
      controller: 'ResCtrl',
      templateUrl: 'build/html/categories/resource.html'
    });
  })

  .controller('CatsCtrl', function CatsController ($scope) {
    $scope.categories = [{
      id: 'history',
      title: 'Historia y Teoría',
      image: 'history.jpg'
    }];
  })

  .controller('CatCtrl', function CatController ($scope, $stateParams) {
    $scope.category = $stateParams.cat;
  })

  .controller('ResCtrl', function ResController ($scope, $stateParams) {
    $scope.value = $stateParams.id;
  });
})();
