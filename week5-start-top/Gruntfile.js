/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    sass: {                              // Task 
      dist: {                            // Target 
        options: {                       // Target options 
          style: 'compressed'
        },
        files: {                         // Dictionary of files 
          'dist/css/app.css': 'src/sass/**/*.{scss,sass}'
        }
      }
    },
    livescript: {
      src: {
        files: {
          'dist/js/app.js': ['src/ls/*.ls'], // compile and concat into single file
          'S1/index.js': 'S1/index.ls',
          'S2/index.js': 'S2/index.ls',
          'S3/index.js': 'S3/index.ls',
          'S4/index.js': 'S4/index.ls'
        }
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['lib/**/*.js'],
        dest: 'dist/js/vendor.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/app.min.js'
      }
    },
    watch: {
      sass: {
        files: ['src/sass/**/*.{scss,sass}'],
        tasks: ['sass'],
        options: {
          livereload: true,
        }
      },
      livescript: {
        files: ['src/ls/**/*.ls', 'S1/index.ls', 'S2/index.ls', 'S3/index.ls', 'S4/index.ls'],
        tasks: ['livescript'],
        options: {
          livereload: true,
        }
      },
      concat: {
        files: ['lib/**/*.js'],
        tasks: ['concat'],
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-livescript');

  // Default task.
  grunt.registerTask('default', ['livescript', 'sass', 'concat', 'uglify']);

};
