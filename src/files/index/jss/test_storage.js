/* ===============================================================
// TESTING Storage
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
    TYPE = e => Object.prototype.toString.call(e),
    A = a => typeof a,
    isFUN = a => A(a) === A(() => { }),
    isOBJ = a => A(a) === A({ }),
    assign = (target, obj) => Object.assign(target || {}, obj),
    stringify = (obj) => {
      if (isOBJ(obj)) {
        let o = [];
        for (i = 0; i < obj.length; i++) {
          const k = obj.key(i), v = jsonparse(obj[k]);
          o.push(`  ${k}: ${isSTR(v) ? `"${v}"` : JSON.stringify(v)}`);
        }
        return `{\n${o.join(',\n')}\n}`;
      }
      else { return JSON.stringify(obj, null, 2); }
    },
    w = window,
    d = document,
    { log } = console,
    cog = (v, style) => { log('%c' + v, style); },
    eid = e => d.getElementById(e),
    hid = (id, html) => eid(id).innerHTML += html,
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
      out(`storage.get "${k}"`+(v?`: "${v}"`:''));
      scroll(sec);
    },
    storeRemove = (key) => {
      const
        k = key || storage.key(0),
        v = k ? storage.removeItem(k) : null;
      out(`storage.remove "${k}"`+(v?`: "${v}"`:''));
      scroll(sec);
    },
    storeClear = () => {
      storage.clear();
      note(`storage.cleared`);
      scroll(sec);
    },
    reset = () => {
      test = ''; pre.innerHTML = ''; console.clear();
      out('Console was cleared', GREY);
    },
    sync = () => {

      const o = [];

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
    run = () => {
      TEST_OBJ(storage, 'storage');
      TEST_FUN(storage.setItem, 'storage.setItem');
      TEST_FUN(storage.getItem, 'storage.getItem');
      TEST_FUN(storage.removeItem, 'storage.removeItem');
      scroll(sec);
      sync()
    };


  // ================================================ add listener

  w.onerror = (event) => {
    out(event.toString(), RED);
    scroll(sec);
  };

  // ==================================================== finished

  w.addEventListener("storageChanged", sync);

  d.addEventListener('DOMContentLoaded', () => {

    w.test = assign(w.test, {
      run,
      sync,
      reset,
      storeSet,
      storeGet,
      storeRemove,
      storeClear,
    });

    run();

  });

})();