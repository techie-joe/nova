"use strict";
(() => {
    const ALLOWED_LIST = [
        'localhost',
        'techie-joe.github.io',
        'themejs.pages.dev',
    ], TYPE = (a) => Object.prototype.toString.call(a), A = (a) => typeof a, isSTR = (a) => A(a) === A(''), isARR = Array.isArray ? ((a) => Array.isArray(a)) : ((a) => TYPE(a) === TYPE([])), w = window, d = document, doc = d.documentElement || d.body, loc = location, host = loc.host, { log } = console, storage = localStorage, listenTo = (what, type, listener, options) => { what.addEventListener(type, listener, options); }, nodeId = (id) => d.getElementById(id), setAttribute = (e, attr, value) => { e.setAttribute(attr, value); }, getTokens = (s) => new Set((s || '').split(/\s+/).filter(Boolean)), updateClass = (e, rem, add) => {
        for (const cls of getTokens(rem))
            e.classList.remove(cls);
        for (const cls of getTokens(add))
            e.classList.add(cls);
    }, scheme = (() => {
        const COLOR_SCHEME = 'color-scheme', e = (() => {
            var e = nodeId('_color_scheme');
            if (!e) {
                var a = d.getElementsByName(COLOR_SCHEME);
                if (isARR(a)) {
                    e = a[a.length - 1];
                }
            }
            if (!e) {
                e = d.createElement('meta');
                var t = [['name', COLOR_SCHEME]];
                for (var i in t) {
                    setAttribute(e, t[i][0], t[i][1]);
                }
                d.head && d.head.appendChild(e);
            }
            return e;
        })(), set = (v) => { setAttribute(e, 'content', v); }, sync = (v) => {
            (v && isSTR(v) && v.substring(0, 2) === '_d') ? set('dark') : set('light');
        };
        return { set, sync };
    })(), ALLOWED = ALLOWED_LIST.find(e => host.endsWith(e));
    if (!ALLOWED) {
        return;
    }
    log('Initializing ThemeJS ..');
    const _ = '', DARK_THEME = '_dark', DEFAULT_LIST = ['', DARK_THEME], THEME_KEY = 'theme', LIST_KEY = 'themes', MEDIA = w.matchMedia('(prefers-color-scheme: dark)'), DARK_MEDIA = MEDIA.matches, parseList = (stored_list) => {
        try {
            return JSON.parse(stored_list || '[]');
        }
        catch (e) {
            console.error('Fail to parse stored themes: ' + stored_list);
            return [];
        }
    }, list = parseList(storage.getItem(LIST_KEY)) || DEFAULT_LIST;
    let current = (() => {
        var stored = storage.getItem(THEME_KEY);
        return (stored && isSTR(stored)) ? stored : DARK_MEDIA ? DARK_THEME : null;
    })();
    const set = (new_theme, begin) => {
        var old_theme = current || _;
        if (isARR(new_theme)) {
            Object.assign(list, new_theme);
            storage.setItem(LIST_KEY, JSON.stringify(list));
            current = list[isSTR(begin) ? list.indexOf(begin || _) : 0];
        }
        if (typeof new_theme === 'string') {
            current = new_theme;
        }
        else {
            current = _;
        }
        updateClass(doc, old_theme, current);
        scheme.sync(current);
        storage.setItem(THEME_KEY, current || _);
    }, reset = () => {
        Object.assign(list, DEFAULT_LIST);
        var old_theme = current || _;
        current = DARK_MEDIA ? DARK_THEME : _;
        updateClass(doc, old_theme, current);
        scheme.sync(current);
        storage.removeItem(THEME_KEY);
        storage.removeItem(LIST_KEY);
    }, change = () => {
        set(list[list.indexOf(current || _) + 1] || _);
    };
    d.addEventListener('DOMContentLoaded', () => {
        scheme.sync(current);
    });
    listenTo(MEDIA, 'change', () => { set(DARK_MEDIA ? DARK_THEME : _); });
    listenTo(w, 'keyup', e => { if (e.altKey && e.code === 'KeyT')
        change(); });
    w.theme = Object.assign(w.theme || {}, {
        reset,
        set,
        change,
        list: () => list,
        current: () => current,
        updateClass,
    });
    log('ThemeJS loaded.');
})();
