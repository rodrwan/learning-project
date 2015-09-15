(function () {
  'use strict';

  angular.module('learnApp.rte.documentaries')

  .controller('DocsCtrl', function ($scope, store, Documentaries) {
    $scope.documentaries = [];

    Documentaries.getList().then(function (documentaries) {
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
    });
  });
})();
