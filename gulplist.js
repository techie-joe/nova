const
  copyList = {
    files:[
      'index'
    ].map(item => `src/files/${item}/**/*`)
  },
  buildList = (() => {
    const o = {}
    const _scss = item => `src/scss/${item}/**/*.scss`;
    o.scss = [
      'core'
    ].map(_scss);
    o.scss_dev = [
      'dev'
    ].map(_scss);
    ['html', 'php', 'txt', 'md'].forEach(type => {
      o[type] = [
        'basic',
        'core',
        'index',
        'lab',
        'starter',
        'template',
        'themejs',
      ].map(item => `src/pug/${item}/**/*.${type}.pug`);
    });
    return o;
  })(),
  watchList = buildList,
  destinations = {
    pages:   'site',
    css:     'site/css',
    scripts: 'site/js',
    css_dev: 'src/scss/dev_css',
  };
module.exports = { copyList, buildList, watchList, destinations };