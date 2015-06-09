(function () {
  'use strict';

  angular.module('learnApp.home', [
    'ui.router',
    'angular-storage'
  ])

  .config(function ($stateProvider) {
    $stateProvider.state('home', {
      url: '/home',
      controller: 'HomeCtrl',
      templateUrl: 'build/html/home/home.html'
    });
  })

  .controller('HomeCtrl', function HomeController () {

  });
})();
