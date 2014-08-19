
// Export to the Grunt CLI
module.exports = function(grunt) {

  // Load plugins
  require('load-grunt-tasks')(grunt);

  var config = {
    pkg: grunt.file.readJSON('package.json'),

    // variables
    iwcJs: 'bower_components/ozp-iwc/dist/js',

    clean: {
      dist: ['./dist/']
    },

    concat: {
      options: {
        banner: 'angular.module(\'ozpIwcAngular\', []).factory(\'ozpIwc\', function () {\n',
        footer: '\n//Return the ozpIwc object\nreturn ozpIwc;\n});'
      },
      bus: {
        src: '<%= iwcJs %>/ozpIwc-bus.js',
        dest: 'dist/js/ozpIwc-bus-angular.js'
      },
      client: {
        src: '<%= iwcJs %>/ozpIwc-client.js',
        dest: 'dist/js/ozpIwc-client-angular.js'
      },
      metrics: {
        src: '<%= iwcJs %>/ozpIwc-metrics.js',
        dest: 'dist/js/ozpIwc-metrics-angular.js'
      }
    },

    uglify: {
      bus: {
        src: 'dist/js/ozpIwc-bus-angular.js',
        dest: 'dist/js/ozpIwc-bus-angular.min.js'
      },
      client: {
        src: 'dist/js/ozpIwc-client-angular.js',
        dest: 'dist/js/ozpIwc-client-angular.min.js'
      },
      metrics: {
        src: 'dist/js/ozpIwc-metrics-angular.js',
        dest: 'dist/js/ozpIwc-metrics-angular.min.js'
      }
    },

    // NOTE: must be running 'grunt test' in ozp-iwc first!!
    // Then manually run grunt connect:sender in one terminal and
    //    grunt connect:receiver in another
    connect: {
      sender: {
        options: {
          port: 9001,
          base: ['dist','demo/sender'],
          hostname: 'localhost',
          keepalive: true
        }
      },
      receiver: {
        options: {
          port: 9002,
          base: ['dist', 'demo/receiver'],
          hostname: 'localhost',
          keepalive: true
        }
      }
    }

  };
    grunt.initConfig(config);

    grunt.registerTask('default', ['clean', 'concat', 'uglify']);
};
