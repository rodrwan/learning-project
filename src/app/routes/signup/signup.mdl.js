(function () {
  'use strict';

  angular.module('learnApp.signup', [
    'ui.router',
    'angular-storage'
  ])

  .config(function ($stateProvider) {
    $stateProvider.state('signup', {
      url: '/signup',
      controller: 'SignUpCtrl',
      templateUrl: 'build/html/routes/signup/signup.html'
    });
  });
})();
