(function () {
  'use strict';

  angular.module('learnApp.rte.categories', [
    'ui.router',
    'angular-storage',
    'learnApp.rte.categoryList',
    'learnApp.rte.resourse',
    'learnApp.svc.categories'
  ])

  .config(function ($stateProvider) {
    $stateProvider
    .state('categories', {
      url: '/categories',
      controller: 'CatsCtrl',
      templateUrl: 'build/html/routes/categories/categories.html'
    })
    .state('categories.cat', {
      url: '/:cat',
      controller: 'CatListCtrl',
      templateUrl: 'build/html/routes/categories/category-list/category-list.html'
    })
    .state('categories.resource', {
      url: '/:cat/:id',
      controller: 'ResCtrl',
      templateUrl: 'build/html/routes/categories/resourse/resourse.html'
    });
  });
})();
