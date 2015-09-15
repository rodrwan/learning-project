(function () {
  'use strict';

  angular.module('learnApp.rte.resourse')

  .controller('ResCtrl', function ($rootScope, $scope, $stateParams, Categories, $sce) {
    var _id = $stateParams.id;
    var cat = $stateParams.cat;

    Categories.one(cat).one('topic').one(_id).getList().then(function (res) {
      var times = [];
      // console.log(res);
      $scope.topics = res;

      $scope.topics.forEach(function (topic, idx) {
        $scope.topics[idx].content = $sce.trustAsHtml(topic.content);
        times.push(topic.time);
      });
      $scope.times = times;
      $scope.meta = res[0].meta;
      $rootScope.$broadcast('event:data-received', {
        type: res.type,
        video: res.media
      });
    });
  });
})();
