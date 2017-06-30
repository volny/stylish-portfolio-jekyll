'use strict';

/*jshint -W003*/

module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-markdown');
	grunt.loadNpmTasks('grunt-gh-pages');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: grunt.file.readJSON('.jshintrc'),
			all: ['Gruntfile.js', 'src/**/*.js']
		},
		clean: {
			tmp: ['tmp/**/*'],
			deploy: ['public/**/*']
		},
		markdown: {
			options: {
				template: './template/page.html',
				templateContext: {
					title: '<%=pkg.name%>',
					description: '<%=pkg.description%>',
					author: '<%=pkg.author.name%>',
					date: new Date().toISOString()
				},
				markdownOptions: {
					gfm: true,
					highlight: 'auto'
				}
			},
			all: {
				src: 'README.md',
				dest: 'public/index.html'
			}
		},
		'gh-pages': {
			options: {
				branch: 'gh-pages',
				base: 'public'
			},
			publish: {
				options: {
					repo: 'https://github.com/Bartvds/demo-travis-gh-pages.git',
					message: 'publish gh-pages (cli)'
				},
				src: ['**/*']
			},
			deploy: {
				options: {
					user: {
						name: 'demo-travis-gh-pages',
						email: 'bartvanderschoor@gmail.com'
					},
					repo: 'https://' + process.env.GH_TOKEN + '@github.com/Bartvds/demo-travis-gh-pages.git',
					message: 'publish gh-pages (auto)' + getDeployMessage(),
					silent: true
				},
				src: ['**/*']
			}
		}
	});

	// get a formatted commit message to review changes from the commit log
	// github will turn some of these into clickable links
	function getDeployMessage() {
		var ret = '\n\n';
		if (process.env.TRAVIS !== 'true') {
			ret += 'missing env vars for travis-ci';
			return ret;
		}
		ret += 'branch:       ' + process.env.TRAVIS_BRANCH + '\n';
		ret += 'SHA:          ' + process.env.TRAVIS_COMMIT + '\n';
		ret += 'range SHA:    ' + process.env.TRAVIS_COMMIT_RANGE + '\n';
		ret += 'build id:     ' + process.env.TRAVIS_BUILD_ID  + '\n';
		ret += 'build number: ' + process.env.TRAVIS_BUILD_NUMBER + '\n';
		return ret;
	}

	grunt.registerTask('check-deploy', function() {
		// need this
		this.requires(['build']);

		// only deploy under these conditions
		if (process.env.TRAVIS === 'true' && process.env.TRAVIS_SECURE_ENV_VARS === 'true' && process.env.TRAVIS_PULL_REQUEST === 'false') {
			grunt.log.writeln('executing deployment');
			// queue deploy
			grunt.task.run('gh-pages:deploy');
		}
		else {
			grunt.log.writeln('skipped deployment');
		}
	});

	grunt.registerTask('prep', 'Clean-up project', [
		'clean',
		'jshint'
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
