(function () {
  'use strict';

  angular.module('learnApp.news')

  .controller('NewsCtrl', function NewsController ($scope, $http, store, $state) {
    $scope.arrNews = [{
        'url': 'documentaries',
        'title': 'Documentales',
        'image': 'documentaries/doc_port',
        'id': 'documentaries'
    }];
  });
})();
