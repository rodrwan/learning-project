(function () {
  'use strict';

  function HomeController ($scope, $http, store, $state) {
    $scope.user = {};

    $scope.login = function () {
      store.set('session', 'loginCredential');
      store.set('userData', JSON.stringify($scope.user));
      $state.go('profile');
    };
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
