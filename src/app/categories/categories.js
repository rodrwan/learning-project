(function () {
  'use strict';

  angular.module('learnApp.categories', [
    'ui.router',
    'angular-storage'
  ])

  .config(function ($stateProvider) {
    $stateProvider
    .state('categories', {
      url: '/categories',
      controller: 'CatsCtrl',
      templateUrl: 'build/html/categories/categories.html'
    })
    .state('categories.cat', {
      url: '/:cat',
      controller: 'CatCtrl',
      templateUrl: 'build/html/categories/category_list.html'
    })
    .state('categories.resource', {
      url: '/:cat/:id',
      controller: 'ResCtrl',
      templateUrl: 'build/html/categories/resource.html'
    });
  })

  .controller('CatsCtrl', function CatsController ($scope, catsData, store) {
    var categories = store.get('categories');

    if (!categories) {
      console.log('loading data from server');
      $scope.loadingIsDone = false;
      catsData.getCategories().then(function (categories) {
        $scope.categories = categories;
        $scope.loadingIsDone = true;
      });
    } else {
      console.log('loading data from local storage');
      $scope.categories = categories;
      $scope.loadingIsDone = true;
    }

  })

  .controller('CatCtrl', function CatController ($scope, $stateParams, store, catsData) {
    var categories = store.get('categories');
    var categoryMeta = {};
    $scope.loadingIsDone = false;
    categories.forEach(function (elem) {
      categoryMeta[elem.id] = {};
      categoryMeta[elem.id].sectionTitle = elem.title;
      categoryMeta[elem.id].description = elem.description;
    });

    $scope.category = $stateParams.cat;
    catsData.getTopicsByCategory($scope.category).then(function (topics) {
      var data = topics;
      $scope.category = $stateParams.cat;
      $scope.categories = data;
      $scope.meta = categoryMeta[$scope.category];
      $scope.loadingIsDone = true;
    });
  })

  .controller('ResCtrl', function ResController ($rootScope, $scope, $stateParams, catsData, $sce) {
    var _id = $stateParams.id;
    var cat = $stateParams.cat;

    catsData.getTopicPost(cat, _id).then(function (res) {
      console.log(res);
      $scope.topics = res.topics;
      var times = [];
      $scope.topics.forEach(function (topic, idx) {
        $scope.topics[idx].content = $sce.trustAsHtml(topic.content);
        times.push(topic.time);
      });

      $scope.times = times;
      $scope.meta = res.meta;
      $rootScope.$broadcast('event:data-received', {
        type: res.type,
        video: res.media
      });
    });
  })

  .factory('catsData', function (API_URL, $q, $http, store) {
    var getCategories, getTopicsByCategory, getTopicPost;

    getCategories = function () {
      return $http.get(API_URL + '/categories')
        .then(function (response) {
          var categories = [];

          if (typeof response.data === 'object') {
            store.set('categories', response.data.categories);
            response.data.categories.forEach(function (elem) {
              var cat = {
                id: elem.id,
                title: elem.title,
                description: elem.description,
                image: elem.image
              };
              categories.push(cat);
            });
            return categories;
          }
          // invalid response
          return $q.reject(response.data);
        }, function (response) {
          // something went wrong
          return $q.reject(response.data);
        });
    };

    getTopicsByCategory = function (category) {
      return $http.get(API_URL + '/categories/' + category)
        .then(function (response) {
          if (typeof response.data === 'object') {
            store.set(category + 'topics', response.data.topics);
            return response.data.topics;
          }
          // invalid response
          return $q.reject(response.data);
        }, function (response) {
          // something went wrong
          return $q.reject(response.data);
        });
    };

    getTopicPost = function (category, topicId) {

      return $http.get(API_URL + '/categories/' + category + '/topic/' + topicId)
        .then(function (response) {
          if (typeof response.data === 'object') {
            return response.data;
          }
          // invalid response
          return $q.reject(response.data);
        }, function (response) {
          // something went wrong
          return $q.reject(response.data);
        });
    };

    return {
      getCategories: getCategories,
      getTopicsByCategory: getTopicsByCategory,
      getTopicPost: getTopicPost
    };
  });
})();
