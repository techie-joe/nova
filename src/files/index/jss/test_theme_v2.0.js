/* ===============================================================
// TESTING ThemeJs v2.0
// ============================================================ */
(()=>{

  const
    w = window,
    s = localStorage,
    { setItem, removeItem, clear } = s;

  function storageChanged(key, oldValue, newValue) {
    w.dispatchEvent(new CustomEvent('storageChanged', {
      detail: { key, oldValue, newValue }
    }));
  }

  s.setItem = function (key, value) {
    const oldValue = s.getItem(key);
    setItem.apply(this, arguments);
    storageChanged(key, oldValue, value);
  };

  s.removeItem = function (key) {
    const oldValue = s.getItem(key);
    removeItem.apply(this, arguments);
    storageChanged(key, oldValue, null);
  };

  s.clear = function () {
    clear.apply(this);
    storageChanged('*', null, null); // use * to clear all
  };

  // Also listen to cross-tab changes
  w.addEventListener('storage', (e) => {
    storageChanged(e.key, e.oldValue, e.newValue);
  });

})();
(() => {
  let test = '';
  const
    now = () => new Date().getMilliseconds(),
    assign = (target,obj) => Object.assign(target||{},obj),
    w = window,
    d = document,
    doc = d.documentElement || d.body, // html or body
    eid = e => d.getElementById(e),
    hid = (id, html) => eid(id).innerHTML += html,
    jss = eid('jss'),
    sec = eid('sec'),
    pre = eid('pre'),
    pre_text = pre.innerHTML,
    element = eid('element'),
    storage = localStorage,
    { log } = console,
    cog = (v, style) => { log('%c' + v, style); },
    scroll = () => { sec.scrollTo(0, sec.scrollHeight); },
    hr = () => { pre.append(d.createElement('hr')); },
    KEY = 'cuba',
    TC = 'theme',
    TL = 'themes',
    GREY = 'color:#888888;',
    RED = 'color:#e22200;',
    GREEN = 'color:#008800;',
    ORANGE = 'color:#916900;',
    PURPLE = 'color:#9f40a9;',
    BROWN = 'color:#a52a2a;',
    out = (v, style) => {
      var e = d.createElement('div');
      style && e.setAttribute('style', style);
      e.append(v);
      pre.append(e);
    },
    note = (v, style) => { out(v, style); cog(v, style); },
    tes = (what, label) => { what ? note(label + ': ☑', GREEN) : note(label + ': ☒', RED); },
    storeAdd = () => {
      let
        x = Math.random().toString(36),
        k = x.substring(2,7),
        v = x.substring(2,10);
      localStorage.setItem(k,v);
    },
    storeCheck = () => {
      out(`storage[${storage.length}]: ` + JSON.stringify(storage, null, 2));
      scroll();
    },
    storeClear = () => {
      storage.clear();
    },
    reset = () => {
      test = ''; pre.innerHTML = ''; console.clear();
      jss.setAttribute('style', GREEN); jss.innerHTML = '[JS:OK]';
      out('Console was cleared', GREY);
    },
    run = () => {
      storeCheck();
      jss && (
        jss.setAttribute('style', GREEN),
        jss.innerHTML = '[JS:OK]'
      );      
      cog(pre_text, GREY);
    };

  // ================================================ add listener

  w.onerror = (event) => {
    jss.setAttribute('style', RED); jss.innerHTML = '[JS:ER]';
    out(event.toString(), RED);
    hr();
    scroll();
  };

  // ==================================================== finished

  w.addEventListener("storageChanged", storeCheck);

  d.addEventListener('DOMContentLoaded', () => {

    w.test = assign(w.test,{
      run,
      reset,
      storeAdd,
      storeCheck,
      storeClear,
      // run_check,
      // run_reset,
      // run_set,
      // run_change,
      // run_updateClass,
    });

    // run();

  });

})();