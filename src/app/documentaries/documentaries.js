(function () {
  'use strict';

  angular.module('learnApp.documentaries', [
    'ui.router',
    'angular-storage'
  ])

  .config(function ($stateProvider) {
    $stateProvider
    .state('docs', {
      url: '/documentaries',
      controller: 'DocsCtrl',
      templateUrl: 'build/html/documentaries/documentaries.html'
    })
    .state('docs.id', {
      url: '/:id',
      controller: 'DocCtrl',
      templateUrl: 'build/html/documentaries/documental.html'
    });
  })

  .controller('DocsCtrl', function DocsController ($scope, store, docsData) {
    var documentaries = store.get('documentaries');
    $scope.documentaries = [];

    if (documentaries) {
      console.log('loading data from local storage');
      documentaries.forEach(function (elem) {
        var doc = {
          id: elem.id,
          thumbnail: elem.thumbnail,
          title: elem.title,
          subTitle: elem.sub_title,
          brief: elem.brief,
          time: elem.time
        };
        $scope.documentaries.push(doc);
        $scope.loadingIsDone = true;
      });
    } else {
      docsData.getDocumentaries().then(function (docs) {
        console.log('loading data from server');
        $scope.documentaries = docs;
        $scope.loadingIsDone = true;
      });
    }
  })

  .controller('DocCtrl', function DocController ($rootScope, $scope, $stateParams, docsData) {
    docsData.getDocumentary($stateParams.id - 1).then(function (doc) {
      $scope.doc = doc;
      $rootScope.$broadcast('event:data-received', {
        type: doc.type,
        video: doc.videoId
      });

      $scope.loadingIsDone = true;
    });
  })

  .factory('docsData', function (API_URL, $q, $http, store, $state) {
    var getDocumentaries, getDocumentary;

    getDocumentaries = function () {
      return $http.get(API_URL + '/documentaries')
        .then(function (response) {
          var documentaries = [];

          if (typeof response.data === 'object') {
            store.set('documentaries', response.data.documentaries);
            response.data.documentaries.forEach(function (elem) {
              var doc = {
                id: elem.id,
                thumbnail: elem.thumbnail,
                title: elem.title,
                subTitle: elem.sub_title,
                brief: elem.brief,
                time: elem.time
              };
              documentaries.push(doc);
            });
            return documentaries;
          }
          // invalid response
          return $q.reject(response.data);
        }, function (response) {
          // something went wrong
          return $q.reject(response.data);
        });
    };

    getDocumentary = function (id) {
      var documentaries, deferred, documents;

      documentaries = store.get('documentaries');
      deferred = $q.defer();
      documents = [];

      if (documentaries) {
        documentaries.forEach(function (elem) {
          var doc = {
            id: elem.id,
            title: elem.title,
            data: elem.content,
            videoId: elem.media,
            type: elem.type,
            time: elem.time
          };
          documents.push(doc);
        });
        deferred.resolve(documents[id]);
        return deferred.promise;
      }

      $state.go('docs');
    };

    return {
      getDocumentaries: getDocumentaries,
      getDocumentary: getDocumentary
    };
  });
})();
