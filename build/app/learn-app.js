(function () {
  'use strict';

  var app = angular.module('learnApp', [
    'learnApp.home',
    'angular-storage'
  ]);

  app.config(function MLConfig ($urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
  });

  app.run(function ($rootScope, $state, store) {
    $rootScope.$on('$stateChangeStart', function (e, to) {
      if (to.data && to.data.requiresLogin) {
        if (!store.get('session')) {
          e.preventDefault();
          $state.go('login');
        }
      }
    });
  });

  app.controller('AppCtrl', function ($scope) {
    $scope.$on('$routeChangeSuccess', function (e, nextRoute) {
      if (nextRoute.$$route && angular.isDefined(nextRoute.$$route.pageTitle)) {
        $scope.pageTitle = nextRoute.$$route.pageTitle;
      }
    });
  });

  app.filter('sanitize', function ($sce) {
    return function (htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    };
  });
})();

(function () {
  'use strict';

  angular.module('learnApp.home', [
    'ui.router',
    'angular-storage'
  ])

  .config(function ($stateProvider) {
    $stateProvider.state('home', {
      url: '/home',
      controller: 'HomeCtrl',
      templateUrl: 'build/html/home/home.html'
    });
  })

  .controller('HomeCtrl', function HomeController () {

  });
})();
