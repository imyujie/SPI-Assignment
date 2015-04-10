/*global module:false*/
var path = require('path');
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
          'dist/public/css/app.css': 'public/sass/**/*.{scss,sass}'
        }
      }
    },
    copy: {
      main: {
        expand: true,
        cwd: 'public/views/',
        src: '**/*.jade',
        dest: 'dist/views/',
        ext: '.jade'
      }
    },
    livescript: {
      server: {
        expand: true,
        cwd: 'server/',
        src: ['**/**.ls'],
        dest: 'dist/',
        ext: '.js'
      },
      client: {
        expand: true,
        cwd: 'public/livescript',
        src: ['**/*.ls'],
        dest: 'dist/public/js/',
        ext: '.js'
      }
    },
    express: {
      options: {
        port: 9000,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          server: path.resolve('./dist/app.js'),
          livereload: true,
          serverreload: false,
          bases: [path.resolve('./.tmp'), path.resolve(__dirname, './dist')]
        }
      },
      test: {
        options: {
          server: path.resolve('./dist/app.js'),
          bases: [path.resolve('./.tmp'), path.resolve(__dirname, './dist')]
        }
      },
      dist: {
        options: {
          server: path.resolve('./dist/app.js'),
          bases: [path.resolve('./.tmp'), path.resolve(__dirname, './dist')]
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    },
    watch: {
      sass: {
        files: ['public/sass/**/*.{scss,sass}'],
        tasks: ['sass'],
        options: {
          livereload: true,
        }
      },
      livescript: {
        files: ['server/app.ls', 'server/routes/**/*.ls', 'server/models/**/*.ls', 'public/livescript/**/*.ls'],
        tasks: ['livescript'],
        options: {
          livereload: true,
        }
      },
      copy: {
        files: ['public/views/**/*.jade'],
        tasks: ['copy']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-livescript');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-express');

  // Default task.
  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'express:dist:keepalive']);
    }

    grunt.task.run([
      'express:livereload',
      'open',
      'watch'
    ]);
  });
  grunt.registerTask('build', ['copy', 'livescript', 'sass']);
  grunt.registerTask('default', ['build']);

};