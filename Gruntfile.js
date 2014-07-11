// Dependencies
var fs = require('fs');

// Export to the Grunt CLI
module.exports = function(grunt) {
    
    // Local vars
    var IWC_PATH = 'ozp-iwc',
        IWC_NG = 'ozp-iwc-angular',
        GRUNT_PATH = __dirname,
        IWC_FULL_PATH = GRUNT_PATH + '/' + IWC_PATH;

        console.log('Grunt path ' + GRUNT_PATH);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        iwcPkg: grunt.file.readJSON(IWC_PATH + '/package.json'),
        gitclone: {
            clone: {
                options: {
                    repository: 'https://github.com/ozone-development/ozp-iwc.git',
                    directory: IWC_PATH
                }
            }
        },
        gitpull: {
            pull: {
                options: {
                    remote: 'origin',
                    branch: 'master'
                }
            }
        },

        // TODO: require the Gruntfile and use programmitically?
        // Modified configuration from IWC's Gruntfile
        iwcSrc: {
            metrics: [
                IWC_FULL_PATH + '/' + 'app/js/common/util.js',
                IWC_FULL_PATH + '/' + 'app/js/metrics/statistics/sample.js',
                IWC_FULL_PATH + '/' + 'app/js/metrics/statistics/binary_heap.js',
                IWC_FULL_PATH + '/' + 'app/js/metrics/statistics/exponentiallyDecayingSample.js',
                IWC_FULL_PATH + '/' + 'app/js/metrics/statistics/exponentiallyWeightedMovingAverage.js',
                IWC_FULL_PATH + '/' + 'app/js/metrics/metricsRegistry.js',
                IWC_FULL_PATH + '/' + 'app/js/metrics/**/*.js'
            ],
            bus: [
                '<%= iwcSrc.metrics %>',
                IWC_FULL_PATH + '/' + 'app/js/bus/jquery-2.1.0.min.js',
                IWC_FULL_PATH + '/' + 'app/js/common/event.js',
                IWC_FULL_PATH + '/' + 'app/js/common/**/*.js',
                IWC_FULL_PATH + '/' + 'app/js/bus/es5-sham.min.js',
                IWC_FULL_PATH + '/' + 'app/js/bus/util/**/*.js',
                IWC_FULL_PATH + '/' + 'app/js/bus/security/**/*.js',
                IWC_FULL_PATH + '/' + 'app/js/bus/network/**/*.js',
                IWC_FULL_PATH + '/' + 'app/js/bus/transport/participant.js',
                IWC_FULL_PATH + '/' + 'app/js/bus/transport/internalParticipant.js',
                IWC_FULL_PATH + '/' + 'app/js/bus/transport/router.js',
                IWC_FULL_PATH + '/' + 'app/js/bus/transport/**/*.js',
                IWC_FULL_PATH + '/' + 'app/js/bus/storage/**/*.js',
                IWC_FULL_PATH + '/' + 'app/js/bus/api/keyValueApiBase.js',
                IWC_FULL_PATH + '/' + 'app/js/bus/*/**/*.js'
            ],
            client: [
                IWC_FULL_PATH + '/' + 'app/js/common/**/*.js',
                IWC_FULL_PATH + '/' + 'app/js/client/**/*.js'
            ],
            owf7: [
                '<%= iwcSrc.bus %>',
                IWC_FULL_PATH + '/' + 'app/js/owf7/lib/**/*',
                IWC_FULL_PATH + '/' + 'app/js/owf7/*.js'
            ],
            test: [
                IWC_FULL_PATH + '/' + 'app/test/**/*'
            ],
            all: [
                '<%= iwcSrc.metrics %>',
                '<%= iwcSrc.bus %>',
                '<%= iwcSrc.client %>',
                '<%= iwcSrc.owf7 %>'
            ]
        },
        output: {
            busJs: GRUNT_PATH + '/<%= iwcPkg.name %>-bus-angular',
            clientJs: GRUNT_PATH + '/<%= iwcPkg.name %>-client-angular',
            metricsJs: GRUNT_PATH + '/<%= iwcPkg.name %>-metrics-angular',
            owf7Js: GRUNT_PATH + '/<%= iwcPkg.name %>-owf7-angular'
        },
        concat: {
            options: {
                banner: 'angular.module(\'ozpIwcAngular\', []).factory(\'ozpIwc\', function () {\n',
                footer: '\n//Return the ozpIwc object\nreturn ozpIwc;\n});'
            },
            bus: {
                src: '<%= iwcSrc.bus %>',
                dest: '<%= output.busJs %>.js'
            },
            client: {
                src: '<%= iwcSrc.client %>',
                dest: '<%= output.clientJs %>.js'
            },
            metrics: {
                src: '<%= iwcSrc.metrics %>',
                dest: '<%= output.metricsJs %>.js'
            },
            owf7: {
                src: '<%= iwcSrc.owf7 %>',
                dest: '<%= output.owf7Js %>.js'
            }
        },
        uglify: {
            bus: {
                src: '<%= concat.bus.dest %>',
                dest: '<%= output.busJs %>.min.js'
            },
            client: {
                src: '<%= concat.client.dest %>',
                dest: '<%= output.clientJs %>.min.js'
            },
            metrics: {
                src: '<%= concat.metrics.dest %>',
                dest: '<%= output.metricsJs %>.min.js'
            },
            owf7: {
                src: '<%= concat.owf7.dest %>',
                dest: '<%= output.owf7Js %>.min.js'
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    
    // Custom tasks
    // Update the IWC via either a git clone or git pull
    grunt.registerTask('updateIwcGit', 'Update the local IWC with the latest code from Github', function() {
        // If iwc path does not exist
        if (!fs.existsSync(IWC_PATH)) {
            // Clone the IWC repo
            grunt.log.writeln('IWC path not found, cloning the repo into ' + IWC_PATH);
            grunt.task.run('gitclone');
        } 
        // Else, the path exists 
        else {
            // Change directory and pull
            process.chdir(__dirname + '/' + IWC_PATH);
            grunt.log.writeln('IWC found. Starting git pull')
            grunt.task.run('gitpull');
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['updateIwcGit', 'concat', 'uglify']);

};