module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    //Read the package.json (optional)
    pkg: grunt.file.readJSON('package.json'),

    // Metadata.
    meta: {
      basePath: '',
      srcPath: 'assets/scss/',
      deployPath: 'build/assets/css/'
    },

    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ',

    // Task configuration.
    sass: {
      dist: {
        files: {
          '<%= meta.deployPath %>style.css': '<%= meta.srcPath %>style.scss',
          '<%= meta.deployPath %>reset.css': '<%= meta.srcPath %>reset.scss'
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

    watch: {
      scripts: {
        files: [
          '<%= meta.srcPath %>/**/*.scss'
        ],
        tasks: ['sass', 'cssmin']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task.
  grunt.registerTask('default', ['sass', 'cssmin', 'watch']);

};
