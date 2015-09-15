(function () {
  'use strict';

  angular.module('learnApp.signup')

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
  });
})();
