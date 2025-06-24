// ===============================================================
// This is the gulper task definitions.
// - telling gulper how to build the project.
// Find more information about Gulp on http://gulpjs.com
// ===============================================================
// To list available tasks, run: > gulp --tasks
// ===============================================================

const
  log = console.log,
  assign = Object.assign,
  { src, dest, series, parallel, watch } = require('gulp'),
  pug = require('gulp-pug'), // read pug write html,php,txt,md
  sass = require('gulp-sass')(require("sass")), // read sass write css
  cleanCSS = require('gulp-clean-css'), // minify css
  rename = require('gulp-rename'), // name file extension
  ext = extname => {
    return rename((path) => {
      path.basename = path.basename.substring(0, path.basename.lastIndexOf('.'));
      path.extname = extname;
    })
  },
  isEmpty = (...oo) => oo.every(o => typeof o === 'object' && s.length > 0);
// isString = (...ss) => ss.every(s => typeof s === 'string' && s.length > 0);

const main = (() => {
  const { buildList, watchList, copyList, _dest } = require('./gulplist');
  if (!buildList || !watchList || !copyList || !_dest) {
    throw new Error('Error reading gulplist.js');
  }
  const
    redMessage = (message) => '\x1B[31m' + message + '\x1B[0m',
    onError = function onError(error) {
      const
        { message, msg, code, fileName, line, column } = error,
        logs = [redMessage('Error: ') + (message || (code + ' : ' + msg))];
      if (fileName) logs.push(fileName + ((line && column) ? ` [${line}${column ? '|' + column : ''}]` : ''));
      log(logs.join('\n'));
      this.emit('end');
    },
    // copier
    files = ((source, destination) => async function file_copier() {
      log(`Copying files from: \n${source.join('\n')}`)
      return src(source, { dot: true })
      .on('error', onError)
      .pipe(dest(destination));
    })(copyList.files,_dest.pages),
    slog = (what, source) => log(`Transpiling ${what} from: \n${source.join('\n')}`),
    html = (source, destination) => async function html_transpiler() {
      slog('HTML', source);
      return src(source)
        .on('error', onError)
        .pipe(pug({ pretty: true }))
        .pipe(ext('.html'))
        .pipe(dest(destination));
    },
    php = (source, destination) => async function php_transpiler() {
      slog('PHP', source);
      return src(source)
        .on('error', onError)
        .pipe(pug({ pretty: true }))
        .pipe(ext('.php'))
        .pipe(dest(destination));
    },
    txt = (source, destination) => async function txt_transpiler() {
      slog('TXT', source);
      return src(source)
        .on('error', onError)
        .pipe(pug())
        .pipe(ext('.txt'))
        .pipe(dest(destination));
    },
    md = (source, destination) => async function md_transpiler() {
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
    scss = (source, destination, opt = sassOpt) => async function scss_transpiler() {
      slog('SCSS', source);
      return src(source)
        .on('error', onError)
        .pipe(sass(opt))
        .pipe(cleanCSS())
        .pipe(dest(destination));
    },
    watchOpt = {
      ignoreInitial: false
    },
    _watch = (fn, src, dest, opt = watchOpt) => function watcher() {
      if (!isEmpty(dest, src)) {
        log(`Watching:\n${src.join('\n')}`);
        watch(src, opt, fn(src, dest));
      }
      else log(`Error in _watch - src: ${src}, dest: ${dest}`);
    },
    // builders
    pages = parallel(
      html(buildList.html, _dest.pages),
      php(buildList.php, _dest.pages),
      txt(buildList.txt, _dest.pages),
      md(buildList.md, _dest.pages),
    ),
    styles = scss(buildList.css, _dest.css),
    // watchers
    pagesw = parallel(
      _watch(html, watchList.html, _dest.pages),
      _watch(php, watchList.php, _dest.pages),
      _watch(txt, watchList.txt, _dest.pages),
      _watch(md, watchList.md, _dest.pages),
    ),
    stylesw = _watch(scss, watchList.css, _dest.css);

  return {
    test: async () => {
      log('Gulp is working!');
      log('Build List:', buildList);
      log('Watch List:', watchList);
      log('Destination:', _dest);
    },
    html,
    php,
    txt,
    md,
    scss,
    files,
    pages,
    styles,
    pagesw,
    stylesw,
    default: parallel(pages, styles),
    watch: parallel(pagesw, stylesw),
  }
})();

assign(exports, main);