/* ===============================================================
// TESTING ThemeJs v2.0
// ============================================================ */
(() => {

  // add localstorage listener

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
    now = () => new Date(),
    TYPE = e => Object.prototype.toString.call(e),
    A = a => typeof a,
    isFUN = a => A(a) === A(() => { }),
    isOBJ = a => A(a) === A({}),
    isSTR = a => A(a) === A(''),
    isARR = Array.isArray ? (a => Array.isArray(a)) : (a => TYPE(a) === TYPE([])),
    assign = (target, obj) => Object.assign(target || {}, obj),
    parse = a => { if (isSTR(a)) try { return JSON.parse(a); } catch { } },
    stringify = (obj) => {
      if (isOBJ(obj)) {
        let o = [];
        for (i = 0; i < obj.length; i++) {
          const k = obj.key(i), v = parse(obj[k]) || obj[k];
          o.push(`  ${k}: ${isSTR(v) ? `"${v}"` : JSON.stringify(v)}`);
        }
        return `{\n${o.join(',\n')}\n}`;
      }
      else { return JSON.stringify(obj, null, 2); }
    },
    w = window,
    d = document,
    doc = d.documentElement || d.body, // html or body
    { log } = console,
    cog = (v, style) => { log('%c' + v, style); },
    eid = e => d.getElementById(e),
    hid = (id, html) => eid(id).innerHTML += html,
    jss = eid('jss'),
    sec = eid('sec'),
    pre = eid('pre'),
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
    note_ok = (label) => { note(label + ': ☑', GREEN); },
    note_err = (label) => { note(label + ': ☒', RED); },
    scroll = (e) => { e.scrollTo(0, e.scrollHeight); },
    hr = () => { pre.append(d.createElement('hr')); },
    storage = localStorage,
    stg = eid('storage'),
    ste = eid('sec_storage'),
    storeSet = () => {
      let
        x = Math.random().toString(36),
        k = x.substring(2, 7),
        v = x.substring(2, 10);
      localStorage.setItem(k, v);
      out(`storage.set "${k}": "${v}"`);
      scroll(sec);
    },
    getRandomStoreKey = () => {
      return storage.key(Math.floor(Math.random() * storage.length));
    },
    storeGet = (key) => {
      const
        k = key || getRandomStoreKey(),
        v = k ? storage.getItem(k) : null;
      out(`storage.get "${k}"` + (v ? `: "${v}"` : ''));
      scroll(sec);
    },
    storeRemove = (key) => {
      const
        k = key || storage.key(0),
        v = k ? storage.removeItem(k) : null;
      out(`storage.remove "${k}"` + (v ? `: "${v}"` : ''));
      scroll(sec);
    },
    storeClear = () => {
      storage.clear();
      note(`storage.cleared`);
      scroll(sec);
    },
    themeCurrent = () => {
      note(`theme.current is ${theme.current() || 'none'}`);
      scroll(sec);
    },
    themeChange = () => {
      const previous = theme.current();
      theme.change();
      const current = theme.current();
      note(`theme.change from ${previous || 'none'} to ${current || 'none'}`);
      scroll(sec);
    },
    themeReset = () => {
      theme.reset();
      note(`theme.set to ${JSON.stringify(theme.list())} > ${theme.current() || 'none'}`);
      scroll(sec);
    },
    themeSet = (set) => {
      theme.set(set);
      if (isSTR(set))
        note(`theme.set to ${theme.current() || 'none'}`);
      else
        note(`theme.set to ${JSON.stringify(theme.list())} > ${theme.current() || 'none'}`);
      scroll(sec);
    },
    reset = () => {
      test = ''; pre.innerHTML = ''; console.clear();
      jss.setAttribute('style', GREEN); jss.innerHTML = '[JS:OK]';
      out('Console was cleared', GREY);
    },
    sync = () => {

      const o = [];

      o.push(`doc.className: "${doc.className}"`);

      if (isFUN(theme.list)) {
        o.push(`theme.list:    ${JSON.stringify(theme.list())}`);
      } else { note_err('theme.list'); }

      if (isFUN(theme.current)) {
        o.push(`theme.current: "${theme.current()}"`);
      } else { note_err('theme.current'); }

      o.push(`storage[${storage.length}]: ` + stringify(storage));

      stg.innerHTML = o.join('\n');
      scroll(ste);

    },
    TEST_FUN = (what, label) => (isFUN(what) ? note_ok(label) : note_err(label), what),
    TEST_OBJ = (what, label) => (isOBJ(what) ? note_ok(label) : note_err(label), what),
    dev_updateClass = (e, rem, add) => {

      note('testing dev_updateClass', ORANGE);
      try {
        const
          old = e.className,
          S = /\s+/,
          getTokens = s => new Set((s || '').split(S).filter(Boolean)),
          REM = getTokens(rem),
          ADD = getTokens(add);
        for (const cls of REM) e.classList.remove(cls);
        for (const cls of ADD) e.classList.add(cls);

        note([
          `old = "${old}"`,
          `rem = "${rem}"`,
          `add = "${add}"`,
          `REM = "${[...REM]}"`,
          `ADD = "${[...ADD]}"`,
          `new = "${e.className}"`,
        ].join("\n"));

      } catch (e) { note_err('Error while executing dev_updateClass : ' + e); }

    },
    thm_updateClass = (e, rem, add) => {

      note('testing thm_updateClass', ORANGE);
      try {
        const
          old = e.className;
        theme.updateClass(e, rem, add);

        note([
          `old = "${old}"`,
          `rem = "${rem}"`,
          `add = "${add}"`,
          `new = "${e.className}"`,
        ].join("\n"));

      } catch (e) { note_err('Error while executing thm_updateClass : ' + e); }

    },
    test_1 = (fn) => {

      const e = eid('test_element'), THEN = now();

      e.removeAttribute('class');
      fn(e,
        '   a a b b   c c d d   ',
        '   e e  f f   '
      );
      hr();

      e.className = '   a a x b b   c c y d d   ';
      fn(e,
        '   a a b b   c c d d   ',
        '   e e   f f   '
      );
      hr();

      e.className = 'A A X B B   C C Y D D';
      fn(e,
        'A A B B   C C D D',
        'E E   F F'
      );
      hr();

      // hr();
      note(`Finished in ${now() - THEN}ms`, ORANGE);
      scroll(sec);

    },
    run = () => {

      sync();
      note(`initial doc.className: "${doc.className}"`);
      // test_1(dev_updateClass);
      // test_1(thm_updateClass);
      scroll(sec);

    };

  // ================================================ add listener

  w.onerror = (event) => {
    jss.setAttribute('style', RED); jss.innerHTML = '[JS:ER]';
    out(event.toString(), RED);
    scroll(sec);
  };

  // ==================================================== finished

  w.addEventListener("storageChanged", sync);

  d.addEventListener('DOMContentLoaded', () => {

    try { theme } catch (err) { note_err(err); return; }

    w.test = assign(w.test, {
      run,
      sync,
      reset,
      storeSet,
      storeGet,
      storeRemove,
      storeClear,
      themeCurrent,
      themeChange,
      themeReset,
      themeSet,
      test_1: () => { hr(); test_1(dev_updateClass) },
      test_2: () => { hr(); test_1(thm_updateClass) },
    });

    jss && (
      jss.setAttribute('style', GREEN),
      jss.innerHTML = '[JS:OK]'
    );

    TEST_OBJ(theme, 'theme');
    TEST_FUN(theme.list, 'theme.list');
    TEST_FUN(theme.current, 'theme.current');
    TEST_FUN(theme.set, 'theme.set');
    TEST_FUN(theme.change, 'theme.change');
    TEST_FUN(theme.reset, 'theme.reset');
    note(`initial doc.className: "${doc.className}"`);
    setTimeout(run, 500);

  });

})();