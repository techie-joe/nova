// ===============================================================
// This is the gulper task definitions.
// - telling gulper how to build the project.
// Find more information about Gulp on http://gulpjs.com
// ===============================================================
// To list available tasks, run: > gulp --tasks
// ===============================================================

const { buildList:_b, watchList:_w, copyList:_c, publishList:_p } = require('./gulplist');
if (!_b || !_w || !_c || !_p) {
  throw new Error('Error reading gulplist.js');
}
const
  { src, dest, series, parallel, watch } = require('gulp'),
  pug = require('gulp-pug'), // read pug write html,php,txt,md
  sass = require('gulp-sass')(require("sass")), // read sass write css
  cleanCSS = require('gulp-clean-css'), // minify css
  rename = require('gulp-rename'), // name file extension
  ext = extname => rename((path) => {
    path.basename = path.basename.substring(0, path.basename.lastIndexOf('.'));
    path.extname = extname;
  }),
  isEmpty = (...oo) => oo.every(o => typeof o === 'object' && o.length > 0),
  log = console.log,
  slog = (what, source) => log(`Writing ${what} from: \n${source.map(item => '- ' + item).join('\n')}`),
  redMessage = (message) => '\x1B[31m' + message + '\x1B[0m',
  onError = function (error) {
    const
      { message, msg, code, fileName, line, column } = error,
      logs = [redMessage(`Error: [${message || (code + ' : ' + msg)}]`)];
    if (fileName) logs.push(fileName + ((line && column) ? ` [${line}${column ? '|' + column : ''}]` : ''));
    log(logs.join('\n'));
    this.emit('end');
  },
  watchOpt = {
    ignoreInitial: false
  },
  _watch = (fn, src, dest, opt = watchOpt) => function watcher() {
    if (isEmpty(src, dest)) {
      log(`Watching: ${redMessage('[Error]')}\n- [src]: ${src}\n- [dest]: ${dest}`);
    }
    else {
      log(`Watching:\n${src.map(item => '- '+item).join('\n')}`);
      watch(src, opt, fn(src, dest));
    }
  },
  file = (source, destination) => async function file_writer() {
    slog('FILE', source);
    return src(source, { dot: true })
      .on('error', onError)
      .pipe(dest(destination));
  },
  html = (source, destination) => async function html_writer() {
    slog('HTML', source);
    return src(source)
      .on('error', onError)
      .pipe(pug({ pretty: true }))
      .pipe(ext('.html'))
      .pipe(dest(destination));
  },
  php = (source, destination) => async function php_writer() {
    slog('PHP', source);
    return src(source)
      .on('error', onError)
      .pipe(pug({ pretty: true }))
      .pipe(ext('.php'))
      .pipe(dest(destination));
  },
  txt = (source, destination) => async function txt_writer() {
    slog('TXT', source);
    return src(source)
      .on('error', onError)
      .pipe(pug())
      .pipe(ext('.txt'))
      .pipe(dest(destination));
  },
  md = (source, destination) => async function md_writer() {
    slog('MD', source);
    return src(source)
      .on('error', onError)
      .pipe(pug())
      .pipe(ext('.md'))
      .pipe(dest(destination));
  },
  sassOpt = {
    outputStyle: 'compressed' // compressed | expanded
  },
  scss = (source, destination, opt = sassOpt) => async function scss_writer() {
    slog('SCSS', source);
    return src(source)
      .on('error', onError)
      .pipe(sass(opt))
      .pipe(cleanCSS())
      .pipe(dest(destination));
  },
  // builders
  files = series(
    file(_c.files, _p.pages),
    file([_p.pages+'/404.html'],'./'), // duplicate to root
  ),
  pages = parallel(
    html(_b.html, _p.pages),
    php(_b.php, _p.pages),
    txt(_b.txt, _p.pages),
    md(_b.md, _p.pages),
  ),
  styles = parallel(
    scss(_b.scss, _p.css),
    scss(_b.scss_dev, _p.dev_css),
  ),
  // watchers
  pagesw = parallel(
    _watch(html, _w.html, _p.pages),
    _watch(php, _w.php, _p.pages),
    _watch(txt, _w.txt, _p.pages),
    _watch(md, _w.md, _p.pages),
  ),
  stylesw = parallel(
    _watch(scss, _w.scss, _p.css),
    _watch(scss, _w.scss_dev, _p.dev_css),
  ),
  test = async () => {
    log('Build List:', _b);
    log('Watch List:', _w);
    log('Copy List:', _c);
    log('Publish List:', _p);
  };
Object.assign(exports, {
  test,
  files,
  pages,
  styles,
  pagesw,
  stylesw,
  all: parallel(pages, styles, files),
  default: parallel(pages, styles),
  watch: parallel(pagesw, stylesw),
});