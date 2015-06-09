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
      copyHtml: 'build/html/'
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
          '<%= meta.srcPathJs %>home/home.js'
        ],
        dest: 'build/app/<%= pkg.name %>.js'
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
          'build/assets/css/style.min.css': 'build/assets/css/style.css',
          'build/assets/css/reset.min.css': 'build/assets/css/reset.css'
        }
      }
    },

    uglify: {
      build: {
        files: {
          'build/app/<%= pkg.name %>.min.js': [
            'build/app/<%= pkg.name %>.js'
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
              '**/home/home.html'
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
        tasks: ['sass', 'cssmin', 'concat', 'copy']
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

  // Default task.
  grunt.registerTask('default', ['sass', 'cssmin', 'concat', 'copy', 'watch']);

};
