module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // Read the package.json (optional)
    pkg: grunt.file.readJSON('package.json'),

    // Metadata.
    meta: {
      basePath: '',
      srcPathCss: 'src/scss/',
      srcPathJs: 'src/app/',
      deployPath: 'build/assets/',
      copyHtml: 'build/html/',
      buildApp: 'build/app/'
    },

    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ',

    // Task configuration.
    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: [
          '<%= meta.srcPathJs %>app.js',
          '<%= meta.srcPathJs %>home/home.js',
          '<%= meta.srcPathJs %>login/login.js'
        ],
        dest: '<%= meta.buildApp %><%= pkg.name %>.js'
      }
    },

    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= meta.buildApp %>',
          src: '*.js',
          dest: '<%= meta.buildApp %>'
        }]
      }
    },

    sass: {
      dist: {
        files: {
          '<%= meta.deployPath %>css/style.css': '<%= meta.srcPathCss %>style.scss',
          '<%= meta.deployPath %>css/reset.css': '<%= meta.srcPathCss %>reset.scss'
        }
      }
    },

    cssmin: {
      build: {
        files: {
          '<%= meta.deployPath %>css/style.min.css': '<%= meta.deployPath %>css/style.css',
          '<%= meta.deployPath %>css/reset.min.css': '<%= meta.deployPath %>css/reset.css'
        }
      }
    },

    uglify: {
      build: {
        files: {
          '<%= meta.buildApp %><%= pkg.name %>.min.js': [
            '<%= meta.buildApp %><%= pkg.name %>.js'
          ]
        }
      }
    },

    copy: {
      dist: {
        files: [
          {
            dest: '<%= meta.copyHtml %>',
            src: [
              '**/home/home.html',
              '**/login/login.html'
            ],
            cwd: '<%= meta.srcPathJs %>',
            expand: true
          }
        ]
      }
    },

    watch: {
      scripts: {
        files: [
          '<%= meta.srcPathCss %>**/*.scss',
          '<%= meta.srcPathJs %>**/*.js'
        ],
        tasks: [
          'sass',
          'cssmin',
          'concat',
          'ngAnnotate',
          'uglify',
          'copy'
        ]
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-ng-annotate');

  // Default task.
  grunt.registerTask('default', [
    'sass',
    'cssmin',
    'concat',
    'ngAnnotate',
    'uglify',
    'copy',
    'watch'
  ]);

};
