var gulp = require('gulp')
var nib = require('nib')
var stylus = require('gulp-stylus')
var browserify = require('browserify')
var babel = require('babelify')
var watch = require('gulp-watch')
var source = require('vinyl-source-stream')
var watchify = require('watchify')
var uglify = require('gulp-uglify')
var pump = require('pump')

gulp.task('stylus', () =>{
	return gulp.src('./lib/styles/*.styl')
		.pipe(stylus({
			use: nib(),
			compress: true,
			'include css': true,
		}))
		.pipe(gulp.dest('public/css/'))
})

function compile(watch){
	var bundle = browserify('./lib/js/app.js', {debug: true})

	if(watch){
		bundle = watchify(bundle)
		bundle.on('update', function(){
			console.log('Bundling...')
			rebundle()
		})
	}

	function rebundle(){
		bundle
			.transform(babel, {presets: ['es2015'], plugins: ['syntax-async-functions', 'transform-regenerator']})
			.bundle()
			.on('error', function(error){ 
				console.log(error)
				this.emit('end')
			})
			.pipe(source('app.js'))
			.pipe(gulp.dest('public/js'))		
	}

	rebundle()
}

gulp.task('js', function(){
	return compile()
})

gulp.task('watching', function(){
	return compile(true)
})

gulp.task('compressjs', function(){
	pump([
			gulp.src('public/js/app.js'),
			uglify(),
			gulp.dest('public/js/')
		]
	)
})

gulp.task('watch', ()=> {
	gulp.watch('./lib/styles/*.styl', ['stylus'])
	gulp.watch('./lib/js/*.js', ['watching'])
})

gulp.task('default', ['stylus', 'js', 'watch', 'compressjs'])