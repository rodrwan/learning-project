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
      templateUrl: 'build/html/signup/signup.html'
    });
  })

  .controller('SignUpCtrl', function SignUpController ($scope, $http, store, $state, SignUp) {
    $scope.user = {};

    $scope.signup = function () {
      console.log($scope.user);
      SignUp.register($scope.user).then(function (res) {
        console.log('-- RESPONSE --');
        console.log(res);
        console.log('user registered.');
        $state.go('login');
      }, function (data) {
        console.log('-- FAIL --');
        console.log(data);
        alert('Error en signup');
        $state.go('.');
      });
    };
  })

  .factory('SignUp', function (API_URL, $q, $http) {
    var register;

    register = function (userData) {
      var url = API_URL + '/user/create';
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
        deferred.reject(msg);
        console.log(msg, code);
      });

      return deferred.promise;
    };

    return {
      register: register
    };
  });
})();
