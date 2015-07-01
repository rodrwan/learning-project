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
  })

  .factory('Login', function (API_URL, $q, $http) {
    var login;

    login = function (userData) {
      var url = API_URL + '/user/session';
      console.log('-- REQUEST --');
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: url,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj)
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
          return str.join('&');
        },
        data: userData
      }).success(function (data) {
        deferred.resolve(data);
      }).error(function (msg, code) {
        deferred.reject(code);
        console.log(msg, code);
      });

      return deferred.promise;
    };

    return {
      login: login
    };
  });
})();
