(function () {
  'use strict';

  angular.module('learnApp.rte.documental')

  .controller('DocCtrl', function ($rootScope, $scope, $stateParams, Documentaries) {
    Documentaries.getList().then(function (documentaries) {
      var doc = documentaries[$stateParams.id - 1];
      $scope.doc = {
        id: doc.id,
        title: doc.title,
        data: doc.content,
        videoId: doc.media,
        type: doc.type,
        time: doc.time,
        credits: doc.credits
      };

      $rootScope.$broadcast('event:data-received', {
        type: doc.type,
        video: doc.videoId
      });
    });
  });
})();
