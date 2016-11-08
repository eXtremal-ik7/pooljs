'use strict';

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		options: {
			appDir: __dirname + '/../webapp/static/s',
			appFiles: ['<%= concat.pool.dest %>', '<%= concat.polyfill.dest %>', '<%= concat.boot.dest %>'],
			vendorFiles: ['script/angular.js', 'script/angular-route.js']
		},

		concat: {
			polyfill: {
				src: 'script/lib/polyfill/*.js',
				dest: 'build/polyfill.js'
			},
			boot: {
				src:  ['script/boot/*.js', 'build/main.js'],
				dest: 'build/boot.js'
			},
			pool: {
				src: ['script/lib/*.js', 'script/pool/app.js', 'script/pool/**/*.js'],
				dest: 'build/pool.js'
			}			
		},

		copy: {
			vendor: {
 				expand: true,
				flatten: true,
				src: ['<%= options.vendorFiles %>'],
				dest: '<%= options.appDir %>/'
			},
			app: {
				expand: true,
				flatten: true,
				src: '<%= options.appFiles %>',
				dest: '<%= options.appDir %>/'
			}
		},

		uglify: {
			vendor: {
 				expand: true,
				flatten: true,
				src: ['<%= options.vendorFiles %>'],
				dest: '<%= options.appDir %>/'
			},
			app: {
				options: {
					// TODO: add filename here
					banner: '/*! <%= pkg.name %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
				expand: true,
				flatten: true,
				src: '<%= options.appFiles %>',
				dest: '<%= options.appDir %>/'
			}
		},

		less: {
			dev: {
				files: {
					'<%= options.appDir %>/app.css' : 'style/app.less'
				}
			},
			live: {
				options: {
					compress: true
					// yuicompress: true
					// TODO: fix bug in IE7
				},
				files: '<%= less.dev.files %>'
			}
		},

		clean: {
			options: {
				force: true
			},
			build: ["build", '<%= options.appDir %>/{*.css,*.js}'],
			postbuild: "build"
		},

		watch: {
			less: {
				files: 'style/**/*.less',
				tasks: 'less:dev'
			},
			js: {
				files: 'script/**/*.js',
				tasks: ['concat', 'copy:app']
			}
		}
	});

	// grunt-imgo
	// grunt-remove-logging
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['clean', 'concat', 'uglify', 'less:live', 
								   'clean:postbuild']);

	grunt.registerTask('dev', ['concat', 'copy', 'less:dev', 'clean:postbuild']);
};
