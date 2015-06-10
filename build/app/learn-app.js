(function () {
  'use strict';

  var app = angular.module('learnApp', [
    'learnApp.home',
    'learnApp.login',
    'angular-storage'
  ]);

  app.config(["$urlRouterProvider", function MLConfig ($urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
  }]);

  app.run(["$rootScope", "$state", "store", function ($rootScope, $state, store) {
    $rootScope.$on('$stateChangeStart', function (e, to) {
      if (to.data && to.data.requiresLogin) {
        if (!store.get('session')) {
          e.preventDefault();
          $state.go('login');
        }
      }
    });
  }]);

  app.controller('AppCtrl', ["$scope", function ($scope) {
    $scope.$on('$routeChangeSuccess', function (e, nextRoute) {
      if (nextRoute.$$route && angular.isDefined(nextRoute.$$route.pageTitle)) {
        $scope.pageTitle = nextRoute.$$route.pageTitle;
      }
    });
  }]);

  app.filter('sanitize', ["$sce", function ($sce) {
    return function (htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    };
  }]);
})();

(function () {
  'use strict';

  angular.module('learnApp.home', [
    'ui.router',
    'angular-storage'
  ])

  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state('home', {
      url: '/home',
      controller: 'HomeCtrl',
      templateUrl: 'build/html/home/home.html'
    });
  }])

  .controller('HomeCtrl', function HomeController () {

  });
})();

(function () {
  'use strict';

  angular.module('learnApp.login', [
    'ui.router',
    'angular-storage'
  ])

  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state('login', {
      url: '/login',
      controller: 'LoginCtrl',
      templateUrl: 'build/html/login/login.html'
    });
  }])

  .controller('LoginCtrl', ["$scope", "$http", "store", "$state", function LoginController ($scope, $http, store, $state) {
    $scope.user = {};

    $scope.login = function () {
      console.log($scope.user);
      store.set('session', 'loginCredential');
      store.set('userData', JSON.stringify($scope.user));
      $state.go('profile');
    };
  }]);
})();
