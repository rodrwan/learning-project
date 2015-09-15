(function () {
  'use strict';

  angular.module('learnApp.events')

  .controller('EventsCtrl', function NewsController ($scope, $http, store, $state) {
    $scope.arrNews = [{
        url: 'documentaries',
        title: 'Documentales',
        image: 'documentaries/doc_port',
        id: 'documentaries',
        date: ''
    }];
  });
})();
