(function () {
  'use strict';

  angular.module('learnApp')

  .controller('AppCtrl', function AppController ($rootScope, $scope, store) {
    var session = store.get('session');
    if (session) {
      console.log('sess: ' + session);
      $rootScope.login = true;
      $rootScope.username = store.get('username');
    }

    $scope.logout = function () {
      $rootScope.login = false;
      $rootScope.username = undefined;

      store.remove('username');
      store.remove('session_token');
      store.remove('session');
    };
  });
})();
