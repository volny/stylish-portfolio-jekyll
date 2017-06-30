'use strict';

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-markdown');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      tmp: ['tmp/**/*'],
      deploy: ['public/**/*']
    },
    markdown: {
      options: {
        markdownOptions: {
          gfm: true,
          highlight: 'auto'
        }
      },
      all: {
        src: 'README.md',
        dest: 'public/index.html'
      }
    }
  });

  grunt.registerTask('check-deploy', function() {
    // need this
    this.requires(['build']);

  });

  grunt.registerTask('prep', 'Clean-up project', [
    'clean'
  ]);

  grunt.registerTask('build', 'Rebuild locally', [
    'prep',
    'markdown:all'
  ]);

  grunt.registerTask('publish', 'Publish from CLI', [
    'build',
    'gh-pages:publish'
  ]);

  grunt.registerTask('deploy', 'Publish from Travis', [
    'build',
    'check-deploy'
  ]);

  // per convention set a test task
  grunt.registerTask('test', ['build']);

  grunt.registerTask('default', ['test']);
};
