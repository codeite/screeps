module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    var branch = 'default';

    grunt.initConfig({
        screepsPull: {
            options: {
                email: 'sam@codeite.com',
                password: 'Alpha678+'
            }
        },
        screepsPush: {
            options: {
                email: 'sam@codeite.com',
                password: 'Alpha678+'
            }
        }
    });

    grunt.registerTask('pull', ['screepsPull']);
    grunt.registerTask('push', ['screepsPush']);
}
