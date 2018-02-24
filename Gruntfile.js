'use strict';
module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'lib/*.js',
        'bin/*.js',
        'test/**/*.js'
      ]
    },
    clean: {
      bower: 'bower_components',
      tmp: 'tmp'
    },
    copy: {
      unit: {
        expand: true,
        cwd: 'test/unit/fixtures/bower_components',
        src: ['**/*'],
        dest: 'tmp/bower_components'
      },
      acceptance: {
        expand: true,
        cwd: 'test/acceptance/fixtures',
        src: ['*.js', '!*-expected.js'],
        dest: 'tmp/'
      }
    },
    simplemocha: {
      options: {
        reporter: 'dot',
        timeout: '5000'
      },
      bin: {
        src: ['test/binary/*.js']
      },
      unit: {
        src: ['test/unit/*.js']
      },
      acceptance: {
        src: ['test/acceptance/*.js']
      }
    },
    bower: {
      options: {
        exclude: ['underscore']
      },
      standard: {
        rjsConfig: 'tmp/config.js'
      },
      pathless: {
        rjsConfig: 'tmp/pathless-config.js'
      },
      global: {
        rjsConfig: 'tmp/global-config.js'
      },
      baseurl: {
        options: {
          baseUrl: './'
        },
        rjsConfig: 'tmp/baseurl.js'
      }
    }
  });

  grunt.registerTask('mkdir', function (dir) {
    require('fs').mkdirSync(dir);
  });

  grunt.registerTask('bower-install', function () {
    var done = this.async();
    grunt.util.spawn({
      cmd: 'bower',
      args: ['install'],
      opts: {
        stdio: 'inherit'
      }
    }, function (error, result) {
      if (error) {
        grunt.fail.fatal(result.stdout);
      }
      grunt.log.writeln(result.stdout);
      done();
    });
  });

  grunt.registerTask('reset-tmp', ['clean:tmp', 'mkdir:tmp']);

  grunt.registerTask('test', [
    'clean',
    'mkdir:tmp',
    'bower-install',
    'simplemocha:bin',
    'reset-tmp',
    'copy:unit',
    'simplemocha:unit',
    'reset-tmp',
    'copy:acceptance',
    'simplemocha:acceptance',
    'clean'
  ]);

  grunt.registerMultiTask('simplemocha', 'Run tests with mocha', function() {
    /*
     * grunt-simple-mocha
     * https://github.com/yaymukund/grunt-simple-mocha
     *
     * Copyright (c) 2012 Mukund Lakshman
     * Licensed under the MIT license.
     */

    var path = require('path'),
        Mocha = require('mocha');

    var options = this.options(),
        mocha_instance = new Mocha(options);

    this.filesSrc.forEach(mocha_instance.addFile.bind(mocha_instance));

    // We will now run mocha asynchronously and receive number of errors in a
    // callback, which we'll use to report the result of the async task by
    // calling done() with the appropriate value to indicate whether an error
    // occurred.

    var done = this.async();

    mocha_instance.run(function(errCount) {
      var withoutErrors = (errCount === 0);
      done(withoutErrors);
    });
  });

  grunt.registerTask('default', ['test']);
};
