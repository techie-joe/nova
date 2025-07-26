/*! ThemeJs | v2.0.1 | Copyright 2025 - Techie Joe | https://themejs.pages.dev */
/* ===============================================================
// To include the above copyright tag in the  output:
// 1. Set tsconfig.json > removeComments to false.
// 2. The *! tag must be on the first line.
// 3. Avoid using the tag to pass Envato Check.
/* ===============================================================
// IMPORTANT: must compile to ES5 or above.
// TARGET: compile to ES6.
// ECMAScript 5 (ES5) aka ECMAScript 2009,
// - See tsconfig.json > compilerOptions.target = 'ES5';
// - "use strict", Array.isArray, JSON, get and set keywords,
// - Date.now(), String.trim(), Number.
// ECMAScript 6 (ES6), also known as ECMAScript 2015.
// - Template literals and regex.
// - Embedded expression and backticks `${v}`.
// - Rest and Spread Operators: fn(...args).
// - Destructuring Assignment: { var } = obj, [a,b] = [b,a].
// - Classes: Introduces class syntax for constructors.
// - Modules: support for using import and export statements.
// - Promises: new Promise().
// ============================================================ */
"use strict";
interface Window {
  theme: {}
}
(() => {

  // can only be used on these domains
  const ALLOWED_DOMAINS = [
    'localhost',
    'techie-joe.github.io',
    'themejs.pages.dev',
  ];
  if (!(ALLOWED_DOMAINS.find(ends => window.location.host.endsWith(ends)))) { return }
  
  const
    W = window,
    D = document,
    DOC = D.documentElement || D.body, // html or body
    A = (a: any) => typeof a,
    TYPE = (e: any) => Object.prototype.toString.call(e),
    NULL = null,
    _ = '',
    STR = A(_),
    ARR = TYPE([]),
    isSTR = (v: any) => A(v) === STR,
    isARR = Array.isArray || (e => TYPE(e) === ARR),
    failTo = (e: string) => {
      throw ('Fail to ' + e);
    },
    nodeId = (id: string) => D.getElementById(id),
    listenTo = <K extends keyof HTMLElementEventMap>(
      what: HTMLElement | MediaQueryList | Window | Document,
      type: K,
      listener: (e: any) => any,
      options?: boolean | AddEventListenerOptions
    ): void => { what.addEventListener(type, listener, options) },
    updateClass = (e: HTMLElement, rem?: string | null, add?: string | null) => {
      try {
        const
          getTokens = (s: string | null | undefined) => new Set((s||'').split(/\s+/).filter(Boolean)),
          REM = getTokens(rem),
          ADD = getTokens(add);
        for (const cls of REM) e.classList.remove(cls);
        for (const cls of ADD) e.classList.add(cls);

        // console.log([
        //   `old = "${old}"`,
        //   `rem = "${rem}"`,
        //   `add = "${add}"`,
        //   `REM = "${[...REM]}"`,
        //   `ADD = "${[...ADD]}"`,
        //   `new = "${e.className}"`,
        // ].join("\n"));

      } catch (e) { failTo('updateClass'); }
    },
    setAttribute = (e: HTMLElement, attr: string, value: string) => { e.setAttribute(attr, value) },
    STORE = (() => {
      const
        { localStorage: localStore } = W,
        set = (key?: string, value?: string) => {
          // store key value
          key ?
            isSTR(value) ?
              localStore.setItem(key, value as string)
              : remove(key)
            : failTo('set ' + key);
        },
        get = (key: string): string | null => {
          // get key value
          return key ?
            localStore.getItem(key)
            : (failTo('get ' + key), NULL);
        },
        remove = (key: string) => {
          // get key value
          key ?
            localStore.removeItem(key)
            : failTo('remove ' + key);
        };
      return {
        set,
        get,
        remove,
      }
    })(),
    THEME = (() => {
      const
        KEY = 'theme', // storage key to store current theme
        KEYS = 'themes', // storage key to store current list
        DARK = '_dark',
        COLOR_SCHEME = 'color-scheme',
        SCHEME = (() => {
          var e: HTMLElement = (() => {
            var e = nodeId('_color_scheme');
            if (!e) {
              var a = D.getElementsByName(COLOR_SCHEME);
              if (isARR(a)) { e = a[a.length - 1]; }
            }
            if (!e) {
              e = D.createElement('meta');
              var t = [['name', COLOR_SCHEME]];
              for (var i in t) { setAttribute(e, t[i][0], t[i][1]) }
              D.head && D.head.appendChild(e);
            }
            return e;
          })();
          return { set: (v: string) => { e && setAttribute(e, 'content', v) } }
        })(),
        set = (new_theme?: string | string[], begin?: string) => {
          // set & store current theme and list
          var old_theme = theme || _;
          if (isARR(new_theme)) {
            list = new_theme;
            STORE.set(KEYS, JSON.stringify(list));
            new_theme = list[isSTR(begin) ? list.indexOf(begin || _) : 0];
          }
          theme = isSTR(new_theme) ? (new_theme || _) : _;
          updateClass(DOC, old_theme, theme);
          syncScheme(theme);
          STORE.set(KEY, theme);
        },
        change = () => { set(list[list.indexOf(theme || _) + 1] || _) },
        parseList = (stored_list: string | null): string[] | null => {
          try { return stored_list && JSON.parse(stored_list) } catch (e) { console.error('Fail to parse stored themes: ' + stored_list) }
          return NULL;
        },
        reset = () => {
          list = [DARK];
          var old_theme = theme || _;
          theme = media.matches ? DARK : _;
          updateClass(DOC, old_theme, theme);
          syncScheme(theme);
          STORE.remove(KEY);
          STORE.remove(KEYS);
        },
        syncScheme = (v: string | undefined | null) => { (v && v.substring(0, 2) === '_d') ? SCHEME.set('dark') : SCHEME.set('light'); },
        media = W.matchMedia('(prefers-color-scheme: dark)');

      // prepare presets
      var
        stored_list = parseList(STORE.get(KEYS)), // load user decided list
        stored_theme = STORE.get(KEY), // load user decided theme
        list: string[] = stored_list || [DARK], // list: were decided by user or ace
        theme: string | undefined | null = isSTR(stored_theme) ? stored_theme : media.matches ? DARK : _; // theme: were decided by user or refers to media-matches.

      // apply load theme
      D.addEventListener('DOMContentLoaded', () => {
        updateClass(DOC, '_hidden', theme);
        syncScheme(theme);
      });

      // open to changes
      listenTo(media, 'change', e => { e.matches ? set(DARK) : set() });
      listenTo(W, 'keyup', e => { e.altKey && 'KeyT' === e.code && change(); });

      // export
      return W.theme = {
        reset,
        set,
        change,
        list: () => list,
        current: () => theme,
        fn: {
          // A, TYPE, STR, ARR, isSTR, isARR, DOC,
          // failTo,
          // listenTo, newRegex,
          updateClass,
          storage: STORE,
        },
      }

    })(); // THEME

})();