(function () {
  'use strict';

  angular.module('learnApp.news', [
    'ui.router',
    'angular-storage'
  ])

  .config(function ($stateProvider) {
    $stateProvider.state('news', {
      url: '/news',
      controller: 'NewsCtrl',
      templateUrl: 'build/html/routes/news/news.html'
    });
  });
})();
