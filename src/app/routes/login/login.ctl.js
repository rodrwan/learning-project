(function () {
  'use strict';

  angular.module('learnApp.login')

  .controller('LoginCtrl', function LoginController ($scope, $http, store, $state, Login) {
    $scope.user = {};

    $scope.login = function () {
      Login.login($scope.user).then(function (res) {
        store.set('session', 'loginCredential');
        store.set('session_token', res.data.session_token);
        store.set('username', res.data.username);
        $state.go('home');

      }, function (code) {
        if (code === 401) {
          alert('Error en sección. Debes ingresar tu email y password correspondientes.');
        }
      });
    };
  });
})();
