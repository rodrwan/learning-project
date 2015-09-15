(function () {
  'use strict';

  angular.module('learnApp.events', [
    'ui.router',
    'angular-storage'
  ])

  .config(function ($stateProvider) {
    $stateProvider.state('evenst', {
      url: '/events',
      controller: 'EventsCtrl',
      templateUrl: 'build/html/routes/events/events.html'
    });
  });
})();
