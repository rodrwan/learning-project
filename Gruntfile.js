module.exports = function (grunt) {

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
          '<%= meta.srcPathJs %>app.mdl.js',
          '<%= meta.srcPathJs %>app.ctl.js',
          '<%= meta.srcPathJs %>routes/**/*.mdl.js',
          '<%= meta.srcPathJs %>routes/**/*.ctl.js',
          '<%= meta.srcPathJs %>services/**/*.mdl.js',
          '<%= meta.srcPathJs %>services/**/*.svc.js',
          '<%= meta.srcPathJs %>directives/**/*.js'

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
      // dist: {
      //   files: {
      //     '<%= meta.deployPath %>css/style.css': '<%= meta.srcPathCss %>style.scss',
      //     '<%= meta.deployPath %>css/reset.css': '<%= meta.srcPathCss %>reset.scss'
      //   }
      // }
      dist: {
        files: [{
          expand: true,
          src: [
            '<%= meta.srcPathCss %>*.scss',
            '<%= meta.srcPathJs %>directives/**/*.scss'
          ],
          dest: '.tmp/<%= meta.deployPath %>css/',
          ext: '.css'
        }]
      }
    },

    concat_css: {
      options: {
        // Task-specific options go here.
      },
      all: {
        src: ['.tmp/<%= meta.deployPath %>/css/**/*.css'],
        dest: '<%= meta.deployPath %>css/style.css'
      }
    },

    cssmin: {
      build: {
        files: {
          '<%= meta.deployPath %>css/styles.min.css': '<%= meta.deployPath %>css/style.css',
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
        files: [{
            dest: '<%= meta.copyHtml %>',
            src: [
              'routes/**/*.html',
              'directives/**/*.html'
            ],
            cwd: 'src/app/',
            expand: true
        }]
      }
    },

    clean: ['.tmp'],

    wiredep: {
      task: {

        // Point to the files that should be updated when
        // you run `grunt wiredep`
        src: [
          'index.html'   // .html support...
        ],

        options: {
          // See wiredep's configuration documentation for the options
          // you may pass:

          // https://github.com/taptapship/wiredep#configuration
        }
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
  grunt.loadNpmTasks('grunt-concat-css');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('build', [
    'sass',
    'concat_css',
    'cssmin',
    'clean',
    'concat',
    'ngAnnotate',
    'uglify',
    'copy',
    'wiredep'
    // 'watch'
  ]);
  // Default task.
  grunt.registerTask('default', [
    'build'
  ]);
};
