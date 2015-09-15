(function () {
  'use strict';

  angular.module('learnApp.rte.documentaries', [
    'ui.router',
    'angular-storage',
    'learnApp.rte.documental',
    'learnApp.svc.documentaries'
  ])

  .config(function ($stateProvider) {
    $stateProvider
    .state('docs', {
      url: '/documentaries',
      controller: 'DocsCtrl',
      templateUrl: 'build/html/routes/documentaries/documentaries.html'
    })
    .state('docs.id', {
      url: '/:id',
      controller: 'DocCtrl',
      templateUrl: 'build/html/routes/documentaries/documental.html'
    });
  });
})();
