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

  .controller('CatsCtrl', function CatsController ($scope) {
    $scope.categories = [{
      id: 'history',
      title: 'Historia y Teoría',
      image: 'history.jpg'
    }];
  })

  .controller('CatCtrl', function CatController ($scope, $stateParams) {
    var data = {
      history: [
        {
          subTitle: 'Diseño Contemporaneo',
          topics: [
            {
              id: 1,
              thumbnail: 'history/hist1/hist1.jpg',
              title: 'Art & craft',
              subTitle: 'Historia del diseño, 1 video',
              brief: 'Breve descripción del tema.',
              time: '5,05'
            },
            {
              id: 2,
              thumbnail: 'history/hist2/hist2.jpg',
              title: 'Vanguardias',
              subTitle: 'Historia del diseño, 6 video',
              brief: 'Breve descripción del tema.',
              time: '5,30'
            },
            {
              id: 3,
              thumbnail: 'history/hist3/hist3.jpg',
              title: 'Posguerra',
              subTitle: 'Historia del diseño, 4 video',
              brief: 'Breve descripción del tema.',
              time: '26,03'
            },
            {
              id: 4,
              thumbnail: 'history/hist4/hist4.jpg',
              title: 'Posmodernismo',
              subTitle: 'Historia del diseño, 2 video',
              brief: 'Breve descripción del tema.',
              time: '15,06'
            }
          ]
        },
        {
          subTitle: 'Historia del Diseño en Chile',
          topics: [
            {
              id: 5,
              thumbnail: 'history/hist5/hist5.png',
              title: 'Orígenes, tradiciones y prácticas',
              subTitle: 'Historia del Diseño en Chile, 1 video',
              brief: 'En el siglo XVIII, las Bellas Artes se separan de las prácticas artísticas con fines utilitarios, y la industrialización da paso al nacimiento de las llamadas Artes Aplicadas.',
              time: '51,01'
            },
            {
              id: 6,
              thumbnail: 'history/hist6/hist6.jpg',
              title: 'Vicente larrea años 60',
              subTitle: 'Historia del Diseño en Chile, 1 video',
              brief: 'En 1963 inicia su trabajo gráfico en el Departamento de Extensión Cultural de la universidad, donde se dedica a la producción de material informativo para las escuelas de temporada.',
              time: '21,09'
            },
            {
              id: 7,
              thumbnail: 'history/hist7/hist7.png',
              title: 'Cartelismo años 70',
              subTitle: 'Historia del Diseño en Chile, 2 video',
              brief: 'Carteles políticos del periodo de gobierno de Salvador Allende y la Unidad Popular en Chile (1971-1973). Cartel Social, legado histórico de los afiches de la Polla Chilena de Beneficencia',
              time: '3,28'
            },
            {
              id: 8,
              thumbnail: 'history/hist8/hist8.png',
              title: 'da diseñadores asociados 1981',
              subTitle: 'Historia del Diseño en Chile, 1 video',
              brief: 'Se funda la primera empresa de Diseño "Diseñadores asociados"',
              time: '2,28'
            },
            {
              id: 9,
              thumbnail: 'history/hist9/hist9.png',
              title: 'Colegio de diseñadores 1985',
              subTitle: 'Historia del Diseño en Chile, 1 video',
              brief: 'Creación del Colegio de Diseñadores Profesionales de Chile.',
              time: '00,34'
            },
            {
              id: 10,
              thumbnail: 'history/hist10/hist10.png',
              title: 'Vicente Larrea diseño social v/s diseño comercial',
              subTitle: 'Historia del Diseño en Chile, 2 video',
              brief: 'El destacado diseñador habla sobre el diseño, la impresiono y la evolución de estos.',
              time: '03,14'
            },
            {
              id: 11,
              thumbnail: 'history/hist11/hist11.png',
              title: 'Diseño editorial, prisma tv',
              subTitle: 'Historia del Diseño en Chile, 1 video',
              brief: 'Entrevista a Revista paula, The Clinic, Joia magazine. Portafolio del estudio gráfico Lamano.',
              time: '24,43'
            },
            {
              id: 12,
              thumbnail: 'history/hist12/hist12.png',
              title: 'Nuevos medios, prisma tv',
              subTitle: 'Historia del Diseño en Chile, 3 video',
              brief: 'Entrevista a DelightLab, Sebastián Skoknic y Oktopus. Portafolio de Ayerviernes.',
              time: '25,35'
            },
            {
              id: 13,
              thumbnail: 'history/hist13/hist13.png',
              title: 'Tipografía, prisma tv',
              subTitle: 'Historia del Diseño en Chile, 1 video',
              brief: 'Entrevista a Latinotype, Francisco Gálvez, Roberto Osses y Zelén Vargas. Portafolio de Leyenda.',
              time: '25,47'
            },
            {
              id: 14,
              thumbnail: 'history/hist14/hist14.png',
              title: 'Street art, prisma tv',
              subTitle: 'Historia del Diseño en Chile, 3 video',
              brief: 'Entrevistados Raverlab, Galería Bomb y Mono González. Portafolio: Carburadores.',
              time: '29,20'
            }
          ]
        }
      ]
    };
    $scope.category = $stateParams.cat;
    $scope.categories = data[$scope.category];
  })

  .controller('ResCtrl', function ResController ($scope, $stateParams) {
    $scope.value = $stateParams.id;
  });
})();
