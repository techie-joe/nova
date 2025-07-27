"use strict";
(() => {
    const _ = '', w = window, { log, error } = console, ALLOWED = atob(w._host || _).split(',');
    if (ALLOWED.indexOf(w.location.host) < 0) {
        return;
    }
    const d = document, doc = d.documentElement || d.body, darkMedia = w.matchMedia('(prefers-color-scheme: dark)'), storage = localStorage, TYPE = (a) => Object.prototype.toString.call(a), A = (a) => typeof a, isSTR = (a) => A(a) === A(''), isARR = Array.isArray ? ((a) => Array.isArray(a)) : ((a) => TYPE(a) === TYPE([])), nodeId = (id) => d.getElementById(id), nodeAttribute = (e, attr, value) => { e.setAttribute(attr, value); }, getTokens = (s) => new Set((s || '').split(/\s+/).filter(Boolean)), updateClass = (e, rem, add) => {
        for (const cls of getTokens(rem))
            e.classList.remove(cls);
        for (const cls of getTokens(add))
            e.classList.add(cls);
    }, listenTo = (what, type, listener, options) => { what.addEventListener(type, listener, options); }, assign = (target, obj) => Object.assign(target || {}, obj), THEME_KEY = 'theme', LIST_KEY = 'themes', DARK_THEME = '_dark', DEFAULT_LIST = [_, DARK_THEME], parse = (v) => {
        if (!isSTR(v)) {
            return;
        }
        try {
            return JSON.parse(v);
        }
        catch (_a) { }
    };
    let list = (() => {
        var stored = storage.getItem(LIST_KEY);
        return isSTR(stored) ? parse(stored || _) || DEFAULT_LIST : DEFAULT_LIST;
    })(), current = (() => {
        var stored = storage.getItem(THEME_KEY);
        return isSTR(stored) ? stored || _ : darkMedia.matches ? DARK_THEME : _;
    })();
    const scheme = (() => {
        const COLOR_SCHEME = 'color-scheme', e = (() => {
            var e = nodeId('_color_scheme');
            if (!e) {
                var a = d.getElementsByName(COLOR_SCHEME);
                e = a[a.length - 1];
            }
            if (!e) {
                e = d.createElement('meta');
                nodeAttribute(e, 'name', COLOR_SCHEME);
                d.head && d.head.appendChild(e);
            }
            return e;
        })(), set = (v) => { nodeAttribute(e, 'content', v); }, sync = (v) => {
            set((v && isSTR(v) && v.startsWith(DARK_THEME)) ? 'dark' : 'light');
        };
        return { set, sync };
    })(), set = (v, beginWith) => {
        var oldTheme = current;
        if (isSTR(v)) {
            current = v;
        }
        else if (isARR(v)) {
            list = v;
            storage.setItem(LIST_KEY, JSON.stringify(list));
            current = list[(beginWith && isSTR(beginWith)) ? list.indexOf(beginWith) : 0] || _;
        }
        if (oldTheme != current) {
            updateClass(doc, oldTheme, current);
            scheme.sync(current);
            storage.setItem(THEME_KEY, current || _);
        }
    }, change = () => {
        var next = list[list.indexOf(current) + 1];
        set(isSTR(next) ? next : list[0] || _);
    }, reset = () => {
        list = DEFAULT_LIST;
        var oldTheme = current;
        current = darkMedia.matches ? DARK_THEME : _;
        updateClass(doc, oldTheme, current);
        scheme.sync(current);
        storage.removeItem(THEME_KEY);
        storage.removeItem(LIST_KEY);
    };
    d.addEventListener('DOMContentLoaded', () => {
        scheme.sync(current);
        updateClass(doc, null, current);
    });
    listenTo(w, 'keyup', e => { if (e.altKey && e.code === 'KeyT')
        change(); });
    w.theme = assign(w.theme, {
        reset,
        set,
        change,
        updateClass,
        list: () => list,
        current: () => current,
    });
})();
