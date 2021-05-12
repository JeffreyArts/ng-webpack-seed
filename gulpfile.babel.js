import gulp from 'gulp';
import webpack from 'webpack';
import "core-js/stable";
import "regenerator-runtime/runtime";
import path from 'path';
import log from 'fancy-log';
import serve from 'browser-sync';
import pluginError from 'plugin-error';
import del from 'del';
import webpackDevMiddelware from 'webpack-dev-middleware';
import webpackHotMiddelware from 'webpack-hot-middleware';
import colorsSupported from 'supports-color';
import historyApiFallback from 'connect-history-api-fallback';

process.noDeprecation = true;
//source code folder
const root = 'client';

// map of all paths
const paths = {
  entry: [
    'core-js',
    path.join(__dirname, root, 'app/app.js')
  ],
};

//use webpack.config.js to build modules
gulp.task('build', cb => {
  const config = require('./webpack.dist.config');
  config.entry.app = paths.entry;

  webpack(config, (err, stats) => {
    if(err) {
      throw new pluginError('webpack', err);
    }
    log('[webpack]', stats.toString({
      colors: colorsSupported,
      chunks: false,
      errorDetails: false
    }));

    cb();
  });
});

gulp.task('serve', () => {
  const config = require('./webpack.dev.config');
  config.entry = [
    'webpack-hot-middleware/client',
  ].concat(paths.entry);

  const compiler = webpack(config);

  serve({
    port: process.env.PORT || 4000,
    open: false,
    server: {baseDir: root},
    middleware: [
      historyApiFallback(),
      webpackDevMiddelware(compiler, {
        stats: {
          colors: colorsSupported,
          chunks: false,
          modules: false
        },
        publicPath: config.output.publicPath
      }),
      webpackHotMiddelware(compiler)
    ]
  });
});

gulp.task('clean', (cb) => {
  del([paths.dest]).then(function (paths) {
    log("[clean]", paths);
    cb();
  });
});

gulp.task('default', gulp.series('serve'));

