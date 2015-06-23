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

    // var data = {
    //   history: [
    //     {
    //       subTitle: 'Diseño Contemporaneo',
    //       topics: [
    //         {
    //           id: 1,
    //           thumbnail: 'history/hist1/hist1.jpg',
    //           title: 'Art & craft',
    //           subTitle: 'Historia del diseño, 1 video',
    //           brief: 'Breve descripción del tema.',
    //           time: '5,05'
    //         },
    //         {
    //           id: 2,
    //           thumbnail: 'history/hist2/hist2.jpg',
    //           title: 'Vanguardias',
    //           subTitle: 'Historia del diseño, 6 video',
    //           brief: 'Breve descripción del tema.',
    //           time: '5,30'
    //         },
    //         {
    //           id: 3,
    //           thumbnail: 'history/hist3/hist3.jpg',
    //           title: 'Posguerra',
    //           subTitle: 'Historia del diseño, 4 video',
    //           brief: 'Breve descripción del tema.',
    //           time: '26,03'
    //         },
    //         {
    //           id: 4,
    //           thumbnail: 'history/hist4/hist4.jpg',
    //           title: 'Posmodernismo',
    //           subTitle: 'Historia del diseño, 2 video',
    //           brief: 'Breve descripción del tema.',
    //           time: '15,06'
    //         }
    //       ]
    //     },
    //     {
    //       subTitle: 'Historia del Diseño en Chile',
    //       topics: [
    //         {
    //           id: 5,
    //           thumbnail: 'history/hist5/hist5.png',
    //           title: 'Orígenes, tradiciones y prácticas',
    //           subTitle: 'Historia del Diseño en Chile, 1 video',
    //           brief: 'En el siglo XVIII, las Bellas Artes se separan de las prácticas artísticas con fines utilitarios, y la industrialización da paso al nacimiento de las llamadas Artes Aplicadas.',
    //           time: '51,01'
    //         },
    //         {
    //           id: 6,
    //           thumbnail: 'history/hist6/hist6.jpg',
    //           title: 'Vicente larrea años 60',
    //           subTitle: 'Historia del Diseño en Chile, 1 video',
    //           brief: 'En 1963 inicia su trabajo gráfico en el Departamento de Extensión Cultural de la universidad, donde se dedica a la producción de material informativo para las escuelas de temporada.',
    //           time: '21,09'
    //         },
    //         {
    //           id: 7,
    //           thumbnail: 'history/hist7/hist7.png',
    //           title: 'Cartelismo años 70',
    //           subTitle: 'Historia del Diseño en Chile, 2 video',
    //           brief: 'Carteles políticos del periodo de gobierno de Salvador Allende y la Unidad Popular en Chile (1971-1973). Cartel Social, legado histórico de los afiches de la Polla Chilena de Beneficencia',
    //           time: '3,28'
    //         },
    //         {
    //           id: 8,
    //           thumbnail: 'history/hist8/hist8.png',
    //           title: 'da diseñadores asociados 1981',
    //           subTitle: 'Historia del Diseño en Chile, 1 video',
    //           brief: 'Se funda la primera empresa de Diseño "Diseñadores asociados"',
    //           time: '2,28'
    //         },
    //         {
    //           id: 9,
    //           thumbnail: 'history/hist9/hist9.png',
    //           title: 'Colegio de diseñadores 1985',
    //           subTitle: 'Historia del Diseño en Chile, 1 video',
    //           brief: 'Creación del Colegio de Diseñadores Profesionales de Chile.',
    //           time: '00,34'
    //         },
    //         {
    //           id: 10,
    //           thumbnail: 'history/hist10/hist10.png',
    //           title: 'Vicente Larrea diseño social v/s diseño comercial',
    //           subTitle: 'Historia del Diseño en Chile, 2 video',
    //           brief: 'El destacado diseñador habla sobre el diseño, la impresiono y la evolución de estos.',
    //           time: '03,14'
    //         },
    //         {
    //           id: 11,
    //           thumbnail: 'history/hist11/hist11.png',
    //           title: 'Diseño editorial, prisma tv',
    //           subTitle: 'Historia del Diseño en Chile, 1 video',
    //           brief: 'Entrevista a Revista paula, The Clinic, Joia magazine. Portafolio del estudio gráfico Lamano.',
    //           time: '24,43'
    //         },
    //         {
    //           id: 12,
    //           thumbnail: 'history/hist12/hist12.png',
    //           title: 'Nuevos medios, prisma tv',
    //           subTitle: 'Historia del Diseño en Chile, 3 video',
    //           brief: 'Entrevista a DelightLab, Sebastián Skoknic y Oktopus. Portafolio de Ayerviernes.',
    //           time: '25,35'
    //         },
    //         {
    //           id: 13,
    //           thumbnail: 'history/hist13/hist13.png',
    //           title: 'Tipografía, prisma tv',
    //           subTitle: 'Historia del Diseño en Chile, 1 video',
    //           brief: 'Entrevista a Latinotype, Francisco Gálvez, Roberto Osses y Zelén Vargas. Portafolio de Leyenda.',
    //           time: '25,47'
    //         },
    //         {
    //           id: 14,
    //           thumbnail: 'history/hist14/hist14.png',
    //           title: 'Street art, prisma tv',
    //           subTitle: 'Historia del Diseño en Chile, 3 video',
    //           brief: 'Entrevistados Raverlab, Galería Bomb y Mono González. Portafolio: Carburadores.',
    //           time: '29,20'
    //         }
    //       ]
    //     }
    //   ],
    //   economy: [
    //     {
    //       subTitle: 'Gestión de proyectos',
    //       topics: [
    //         {
    //           id: 1,
    //           thumbnail: 'economy/econ1/econ1.jpg',
    //           title: 'Funciones de administración de la empresa',
    //           subTitle: 'Gestión de proyectos, Lectura',
    //           brief: 'Según Henry Fayol, toda empresa cumple seis funciones básicas. Funciones técnicas, comerciales, financieras, de seguridad, contables y administrativas.',
    //           time: '0'
    //         },
    //         {
    //           id: 2,
    //           thumbnail: 'economy/econ2/econ2.png',
    //           title: 'Reconocer e identificar las gerencias de área',
    //           subTitle: 'Gestión de proyectos, 1 Video',
    //           brief: 'organigrama, tipos de organigramas.',
    //           time: '04,02'
    //         }
    //       ]
    //     },
    //     {
    //       subTitle: 'Tipos de empresas',
    //       topics: [
    //         {
    //           id: 3,
    //           thumbnail: 'economy/econ3/econ3.png',
    //           title: 'Constitución de una empresa ministerio de economía, gobierno de chile',
    //           subTitle: 'Gestión de proyectos, 1 Video',
    //           brief: 'Funciones administrativas, finanzas, producción y rol de la organización.',
    //           time: '06,53'
    //         },
    //         {
    //           id: 4,
    //           thumbnail: 'economy/econ4/econ4.jpg',
    //           title: 'Conocer e identificar las empresas',
    //           subTitle: 'Tipos de empresa, 1 Video',
    //           brief: 'Clasificación de las empresas según su actividad.',
    //           time: '13,47'
    //         },
    //         {
    //           id: 5,
    //           thumbnail: 'economy/econ5/econ5.png',
    //           title: 'Macro y micro entorno',
    //           subTitle: 'Gestión de proyectos, 1 Video',
    //           brief: 'Entorno, micro-entorno: la empresa, proveedores, intermediarios, clientes, competencia. macro-entorno: demográfico, económico, natural, tecnológico, político y cultural.',
    //           time: '04,33'
    //         },
    //         {
    //           id: 6,
    //           thumbnail: 'economy/econ6/econ6.jpg',
    //           title: 'Importancia de los canales de distribución',
    //           subTitle: 'Gestión de proyectos, 1 Video',
    //           brief: 'Aspectos generales importantes, tamaño, valores de mercado, costos del canal.',
    //           time: '06,14'
    //         },
    //         {
    //           id: 7,
    //           thumbnail: 'economy/econ7/econ7.jpg',
    //           title: 'Aplicando el concepto de design thinking en tu empresa',
    //           subTitle: 'Gestión de proyectos, 1 Video',
    //           brief: 'La aplicación de este concepto sirve para todo... Sitios web, indumentaria, muebles y, ¿por qué no?, para la forma en que interactúas con tu cliente.',
    //           time: '58,18'
    //         }
    //       ]
    //     },
    //     {
    //       subTitle: 'Desarrollo de Emprendedores',
    //       topics: [
    //         {
    //           id: 8,
    //           thumbnail: 'economy/econ8/econ8.png',
    //           title: 'Ideas de negocios',
    //           subTitle: 'Desarrollo de Emprendedores, 9 Video',
    //           brief: 'Presentación de cortos para emprendedores.',
    //           time: '24,85'
    //         },
    //         {
    //           id: 9,
    //           thumbnail: 'economy/econ9/econ9.jpg',
    //           title: 'Descripción del negocio',
    //           subTitle: 'Desarrollo de Emprendedores, 2 Videos, 1 Artículo',
    //           brief: 'Serie de videos de ayuda para tu negocio... ¿Cómo describir a tu empresa?,¿ Cuál es la misión y visión? ¿Cómo es su estructura legal?',
    //           time: '29,91'
    //         },
    //         {
    //           id: 10,
    //           thumbnail: 'economy/econ10/econ10.jpg',
    //           title: 'Productos y servicios',
    //           subTitle: 'Desarrollo de Emprendedores, 4 Videos, 1 Artículo',
    //           brief: 'Posicionamiento de una marca, ciclo de vida, ¿cómo es el cliente y cuáles son sus necesidades?,¿ cómo patentar una idea?, procesos y procedimientos.',
    //           time: '31,46'
    //         },
    //         {
    //           id: 11,
    //           thumbnail: 'economy/econ11/econ11.jpg',
    //           title: 'Operaciones y administración',
    //           subTitle: 'Desarrollo de Emprendedores, 3 Videos',
    //           brief: 'Aseguramiento de Calidad, Recursos Humanos, Administración y estructura organizacional.',
    //           time: '24,73'
    //         }
    //       ]
    //     },
    //     {
    //       subTitle: 'Brnading',
    //       topics: [
    //         {
    //           id: 12,
    //           thumbnail: 'economy/econ12/econ12.jpg',
    //           title: 'Conceptos de arquitectura y construción de marca',
    //           subTitle: 'Desarrollo de Emprendedores, 3 Videos',
    //           brief: 'El significado de Términos en la Imagen corporativa, Fases para la construcción de una marca Branding y Comunicación persuasiva para las empresas.',
    //           time: '25,73'
    //         },
    //         {
    //           id: 13,
    //           thumbnail: 'economy/econ13/econ13.png',
    //           title: 'Conceptos de arquitectura y construción de marca',
    //           subTitle: 'Desarrollo de Emprendedores, 2 Videos',
    //           brief: 'Segmentación de mercado y Neuromarketing.',
    //           time: '29,45'
    //         },
    //         {
    //           id: 14,
    //           thumbnail: 'economy/econ14/econ14.jpg',
    //           title: 'Conceptos de arquitectura y construción de marca',
    //           subTitle: 'Desarrollo de Emprendedores, 1 Videos',
    //           brief: 'Diseño de estrategias',
    //           time: '04,58'
    //         },
    //         {
    //           id: 15,
    //           thumbnail: 'economy/econ15/econ15.png',
    //           title: 'Conceptos de arquitectura y construción de marca',
    //           subTitle: 'Desarrollo de Emprendedores, 4 Videos, 1 artículo',
    //           brief: 'Ciclo de vida de una marca, tipologias de consumidor, estrategias de mantención de marcas líderes, estrategias para marcas, estrategias para marcas con potencial desgastado.',
    //           time: '23,19'
    //         }
    //       ]
    //     }
    //   ]
    // };

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
          var categories = [];

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
