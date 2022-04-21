'use strict';
module.exports = function ( grunt ) {

  grunt.initConfig( {
    sass: {
      dist: {
        options: {
          style: 'compressed',
          compass: false,
          sourcemap: false,
          loadPath: ['./', 'node_modules', 'node_modules/video.js']
        },
        files: {
          'dist/css/wmvjs.css': [
            'src/sass/wmvjs.sass'
          ]
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      sass: {
        files: [
          'src/sass/**/*.sass'
        ],
        tasks: ['sass']
      },
    },
    clean: {
      dist: [
        'dist/css/wmvjs.css',
      ]
    }
  } );

  // Load tasks
  grunt.loadNpmTasks( 'grunt-contrib-clean' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks( 'grunt-contrib-sass' );

  // Register tasks
  grunt.registerTask( 'default', [
    'clean',
    'sass',
  ] );
  grunt.registerTask( 'dev', [
    'watch'
  ] );

};