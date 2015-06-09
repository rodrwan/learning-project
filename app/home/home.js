(function () {
  'use strict';

  function HomeController () {
  }

  angular.module('learnApp.home', [
    'ui.router',
    'angular-storage'
  ])

  .config(function ($stateProvider) {
    $stateProvider.state('home', {
      url: '/home',
      controller: 'HomeCtrl',
      templateUrl: 'app/home/home.html'
    });
  })

  .controller('HomeCtrl', HomeController);
})();
