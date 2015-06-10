(function () {
  'use strict';

  angular.module('learnApp.login', [
    'ui.router',
    'angular-storage'
  ])

  .config(function ($stateProvider) {
    $stateProvider.state('login', {
      url: '/login',
      controller: 'LoginCtrl',
      templateUrl: 'build/html/login/login.html'
    });
  })

  .controller('LoginCtrl', function LoginController ($scope, $http, store, $state) {
    $scope.user = {};

    $scope.login = function () {
      console.log($scope.user);
      store.set('session', 'loginCredential');
      store.set('userData', JSON.stringify($scope.user));
      $state.go('profile');
    };
  });
})();
