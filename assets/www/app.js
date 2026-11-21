/* 存存 · CunCun */
(function () {
  'use strict';

  /* ---------------- 基础工具 ---------------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function uid() { return Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4); }
  function b64(buf) {
    var bytes = new Uint8Array(buf), s = '';
    for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  }
  function b64d(s) {
    var raw = atob(s), arr = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
    return arr;
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  /* ---------------- 图标 ---------------- */
  var ICONS = {
    key: '<circle cx="9" cy="15" r="4.2"/><path d="M12 12l8-8M17 4.5l2.8 2.8M14.2 7.3l2.5 2.5"/>',
    phone: '<rect x="6.5" y="3" width="11" height="18" rx="2.6"/><path d="M10.2 18.2h3.6"/>',
    chat: '<rect x="3.5" y="5" width="17" height="12" rx="3.4"/><path d="M8.6 20.2l3.1-3.2"/>',
    id: '<rect x="3" y="5.5" width="18" height="13" rx="3"/><circle cx="8.6" cy="11" r="1.9"/><path d="M5.9 16.1c.5-1.6 1.5-2.4 2.7-2.4s2.2.8 2.7 2.4"/><path d="M13.6 10.6h5M13.6 13.6h3.6"/>',
    book: '<path d="M5 5.6A2.1 2.1 0 017.1 3.5h11.4v14.9H7.1A2.1 2.1 0 005 20.5V5.6z"/><path d="M5 18.4A2.1 2.1 0 017.1 20.5h11.4"/>',
    card: '<rect x="3" y="6" width="18" height="12" rx="3"/><path d="M3 10.4h18"/><path d="M6.8 15h4.2"/>',
    pin: '<path d="M12 20.5s-6.4-5.6-6.4-10a6.4 6.4 0 1112.8 0c0 4.4-6.4 10-6.4 10z"/><circle cx="12" cy="10.5" r="2.4"/>',
    box: '<path d="M12 3.6l7.2 3.6v8.4L12 20.4 4.8 15.6v-8.4L12 3.6z"/><path d="M4.8 7.2L12 10.8 19.2 7.2M12 10.8v9.6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    eye: '<path d="M2.6 12S6 6.2 12 6.2 21.4 12 21.4 12 18 17.8 12 17.8 2.6 12 2.6 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeoff: '<path d="M4 4l16 16"/><path d="M9.3 6.6A9.6 9.6 0 0112 6.2c6 0 9.4 5.8 9.4 5.8a17 17 0 01-3.6 4.1"/><path d="M6.1 8.4A16.6 16.6 0 002.6 12s3.4 5.8 9.4 5.8c1 0 1.9-.2 2.7-.5"/><path d="M9.6 9.8a3 3 0 004.3 4.3"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2.6"/><path d="M4.6 15.2V6.2A1.8 1.8 0 016.4 4.4h8.8"/>',
    trash: '<path d="M4 7h16M9 7V5h6v2"/><path d="M6.2 7l.9 12.6h9.8l.9-12.6"/><path d="M10 11v5.6M14 11v5.6"/>',
    edit: '<path d="M15.2 4.6l4.2 4.2L9 19.4H4.8v-4.2z"/><path d="M13.4 6.4l4.2 4.2"/>',
    download: '<path d="M12 4v10.4m0 0l-3.6-3.6M12 14.4l3.6-3.6"/><path d="M5 17.6V19a1 1 0 001 1h12a1 1 0 001-1v-1.4"/>',
    upload: '<path d="M12 15V4.6m0 0l-3.6 3.6M12 4.6l3.6 3.6"/><path d="M5 17.6V19a1 1 0 001 1h12a1 1 0 001-1v-1.4"/>',
    lock: '<rect x="5" y="10" width="14" height="10" rx="2.6"/><path d="M8.6 10V7.4a3.4 3.4 0 016.8 0V10"/>',
    shield: '<path d="M12 3.4l7 3v5.8c0 4.5-3 7.6-7 9.2-4-1.6-7-4.7-7-9.2V6.4l7-3z"/><path d="M9.2 12l2 2 3.6-3.8"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    camera: '<rect x="3.4" y="7" width="17.2" height="12" rx="3"/><circle cx="12" cy="13" r="3.4"/><path d="M8.6 7l1.4-2.4h4L15.4 7"/><path d="M17.6 10.2h.6"/>',
    image: '<rect x="3.5" y="5" width="17" height="14" rx="3"/><circle cx="8.6" cy="10" r="1.7"/><path d="M4 17l4.6-4.4 3.4 3 3-2.6L20 17"/>',
    clock: '<circle cx="12" cy="12" r="8.4"/><path d="M12 7.6V12l3 2"/>',
    folder: '<path d="M3.6 7.2a2 2 0 012-2h3.4l2 2.4h6.6a2 2 0 012 2v7.4a2 2 0 01-2 2H5.6a2 2 0 01-2-2V7.2z"/>',
    pinmark: '<path d="M9 4h6l-1 6 3 3.2V15H7v-1.8l3-3.2-1-6z"/><path d="M12 15v5"/>',
    chev: '<path d="M9 5l7 7-7 7"/>',
    sparkle: '<path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 8.2v.5M12 11v4.8"/>'
  };
  function svg(name) {
    return '<svg viewBox="0 0 24 24">' + (ICONS[name] || ICONS.box) + '</svg>';
  }

  /* ---------------- 平台标识 ---------------- */
  // 常见平台的单字 / 图形标识，只在列表与详情里当「头像」用
  var BRANDS = [
    { re: /telegram|tg|纸飞机|电报/i, name: 'Telegram', color: '#229ed9',
      svg: '<path d="M21.5 4.1L2.9 11.3c-.9.4-.8 1.5.1 1.8l4.5 1.5 1.7 5.4c.2.8 1.1 1 1.7.4l2.4-2.3 4.6 3.5c.7.5 1.7.1 1.9-.8l2.9-14.3c.2-1-.8-1.8-1.7-1.4z"/>' },
    { re: /微信|wechat|weixin/i, name: '微信', color: '#07c160',
      svg: '<ellipse cx="8.7" cy="9.2" rx="6.1" ry="5.2"/><path d="M5.2 13.3l-1.7 3 3.8-1.1z"/>' +
        '<ellipse cx="16.3" cy="14.8" rx="4.7" ry="4"/><path d="M19.7 17.8l1.3 2.4-3.1-.9z"/>' },
    { re: /qq邮箱|qq mail/i, name: 'QQ 邮箱', color: '#12b7f5', mono: 'Q', svg: '' },
    { re: /qq账号|qq号|qq|腾讯/i, name: 'QQ', color: '#12b7f5',
      svg: '<path d="M12 2.7c-2.9 0-4.9 2.2-4.9 4.9 0 1 .3 2 1 2.7-1.2.9-2.7 2.1-2.7 4 0 2.3 2.5 4.1 6.6 4.1s6.6-1.8 6.6-4.1c0-1.9-1.5-3.1-2.7-4 .7-.7 1-1.7 1-2.7 0-2.7-2-4.9-4.9-4.9z"/>' +
        '<circle cx="9.7" cy="7.9" r="1" style="fill:#0b1f33"/><circle cx="14.3" cy="7.9" r="1" style="fill:#0b1f33"/>' },
    { re: /推特|twitter|^x$|x账号|x平台/i, name: '推特 X', color: '#1d9bf0', mono: 'X', svg: '' },
    { re: /steam/i, name: 'Steam', color: '#1b2838', mono: 'S', svg: '' },
    { re: /google|谷歌|gmail/i, name: 'Google', color: '#4285f4', mono: 'G', svg: '' },
    { re: /苹果|apple|icloud|appid/i, name: 'Apple', color: '#3a3a3c', mono: '', svg: '' },
    { re: /微软|microsoft|outlook|hotmail|live邮箱/i, name: '微软', color: '#0078d4',
      svg: '<rect x="3.7" y="3.7" width="7.2" height="7.2"/><rect x="13.1" y="3.7" width="7.2" height="7.2"/>' +
        '<rect x="3.7" y="13.1" width="7.2" height="7.2"/><rect x="13.1" y="13.1" width="7.2" height="7.2"/>' },
    { re: /支付宝|alipay/i, name: '支付宝', color: '#1677ff', mono: '支', svg: '' },
    { re: /淘宝|taobao|天猫|闲鱼/i, name: '淘宝', color: '#ff5000', mono: '淘', svg: '' },
    { re: /抖音|douyin|tiktok/i, name: '抖音', color: '#161823',
      svg: '<path d="M15.4 3.3c.3 2.2 1.8 3.6 4.1 3.8v3.1c-1.6 0-3-.5-4.1-1.4v6.3c0 3-2.3 5.4-5.2 5.4S5 17.9 5 14.9s2.3-5.4 5.2-5.4c.4 0 .8.1 1.2.2v3.2c-.4-.1-.8-.2-1.2-.2-1.3 0-2.3 1-2.3 2.2s1 2.2 2.3 2.2 2.3-1 2.3-2.2V3.3z"/>' },
    { re: /微博|weibo/i, name: '微博', color: '#e6162d', mono: '微', svg: '' },
    { re: /bilibili|b站|哔哩/i, name: 'B 站', color: '#fb7299',
      svg: '<rect x="3.1" y="7.1" width="17.8" height="12.4" rx="3.6"/><path d="M7.7 3.5l3.2 3M16.3 3.5l-3.2 3"/>' +
        '<circle cx="9" cy="13.3" r="1.2" style="fill:#3b1d27"/><circle cx="15" cy="13.3" r="1.2" style="fill:#3b1d27"/>' },
    { re: /小红书|xhs|xiaohongshu/i, name: '小红书', color: '#ff2442', mono: '书', svg: '' },
    { re: /12306|铁路/i, name: '12306', color: '#d81e06', mono: '铁', svg: '' },
    { re: /学信网|学信/i, name: '学信网', color: '#1f63b4', mono: '学', svg: '' },
    { re: /航旅|纵横/i, name: '航旅纵横', color: '#2b7de9', mono: '航', svg: '' },
    { re: /github/i, name: 'GitHub', color: '#24292f', mono: 'GH', svg: '' },
    { re: /农商|银行|招商|工商|建设银行|农业银行|邮储|信用卡|储蓄卡|借记卡|工行|建行|招行|中行/i, name: '银行', color: '#bf5af2', mono: '银', svg: '' },
    { re: /gta|游戏/i, name: 'GTA', color: '#f0a500', mono: 'G', svg: '' },
    { re: /矿好办|矿/i, name: '矿好办', color: '#0a84ff', mono: '矿', svg: '' },
    { re: /商户|面板|后台/i, name: '商户面板', color: '#5e5ce6', mono: '商', svg: '' },
    { re: /邮箱|mail/i, name: '邮箱', color: '#0a84ff', mono: '@', svg: '' }
  ];
  function brandOf(title) {
    var t = String(title || '');
    if (!t) return null;
    for (var i = 0; i < BRANDS.length; i++) if (BRANDS[i].re.test(t)) return BRANDS[i];
    return null;
  }
  // 有平台标识时用品牌色「头像」，没有就退回分类图标
  function iconHTML(it, extraCls) {
    var c = cat(it.cat), b = brandOf(it.title);
    var col = b ? b.color : c.color;
    var inner = b
      ? (b.svg ? '<svg viewBox="0 0 24 24">' + b.svg + '</svg>'
        : '<i class="bm' + ((b.mono || '').length > 1 ? ' sm' : '') + '">' + esc(b.mono || '') + '</i>')
      : svg(c.icon);
    return '<span class="icon ' + (b ? 'brand ' : '') + (extraCls || '') + '" style="--c:' + col + '">' + inner + '</span>';
  }

  /* ---------------- 分类 ---------------- */
  var CATS = [
    { id: 'account', name: '账号密码', color: '#0a84ff', icon: 'key', fields: ['平台', '账号', '密码'] },
    { id: 'phone', name: '手机号', color: '#30d158', icon: 'phone', fields: ['号码', '运营商', '归属地'] },
    { id: 'social', name: '社交账号', color: '#64d2ff', icon: 'chat', fields: ['平台', '账号', '密码'] },
    { id: 'identity', name: '身份证件', color: '#ff9f0a', icon: 'id', fields: ['姓名', '证件类型', '证件号码', '有效期'] },
    { id: 'household', name: '户口本', color: '#ff453a', icon: 'book', fields: ['户主', '户号', '户籍地址'] },
    { id: 'bank', name: '银行卡', color: '#bf5af2', icon: 'card', fields: ['银行', '卡号', '密码'] },
    { id: 'address', name: '地址电话', color: '#5e5ce6', icon: 'pin', fields: ['名称', '地址', '电话'] },
    { id: 'other', name: '其他', color: '#8e8e93', icon: 'box', fields: ['内容'] }
  ];
  function cat(id) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i];
    return CATS[CATS.length - 1];
  }
  function hex2rgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function rgba(h, a) { var r = hex2rgb(h); return 'rgba(' + r[0] + ',' + r[1] + ',' + r[2] + ',' + a + ')'; }
  function lighten(h, amt) {
    var r = hex2rgb(h);
    return 'rgb(' + [r[0], r[1], r[2]].map(function (v) {
      return Math.round(v + (255 - v) * amt);
    }).join(',') + ')';
  }
  function darken(h, amt) {
    var r = hex2rgb(h);
    return 'rgb(' + [r[0], r[1], r[2]].map(function (v) {
      return Math.round(v * (1 - amt));
    }).join(',') + ')';
  }
  function catVars(c, glow) {
    return '--c:' + c.color + ';--c-soft:' + rgba(c.color, .18) + ';--c-line:' + rgba(c.color, .5) +
      ';--c-light:' + lighten(c.color, .32) + ';--c-shadow:' + rgba(c.color, .55) +
      ';--c-dark:' + rgba(darken(c.color, .45), .85) +
      (glow ? ';--accent-soft:' + rgba(c.color, .3) : '');
  }

  /* ---------------- 时间 ---------------- */
  function timeAgo(ts) {
    if (!ts) return '';
    var d = (Date.now() - ts) / 1000;
    if (d < 45) return '刚刚';
    if (d < 3600) return Math.floor(d / 60) + ' 分钟前';
    if (d < 86400) return Math.floor(d / 3600) + ' 小时前';
    if (d < 86400 * 2) return '昨天';
    if (d < 86400 * 7) return Math.floor(d / 86400) + ' 天前';
    var t = new Date(ts);
    if (t.getFullYear() === new Date().getFullYear()) return (t.getMonth() + 1) + '月' + t.getDate() + '日';
    return t.getFullYear() + '年' + (t.getMonth() + 1) + '月';
  }
  function fullTime(ts) {
    var t = new Date(ts);
    return t.getFullYear() + '年' + (t.getMonth() + 1) + '月' + t.getDate() + '日 ' + pad(t.getHours()) + ':' + pad(t.getMinutes());
  }

  /* ---------------- 敏感字段 ---------------- */
  function isSecretKey(k) {
    return /密码|口令|pin|password|pwd|密钥|验证码/i.test(String(k || ''));
  }

  /* ---------------- 状态 ---------------- */
  var LS_ITEMS = 'cc.items';
  var LS_SET = 'cc.settings';
  var items = [];
  var settings = { lock: false, secure: false, salt: null, check: null, haptic: 2, aiBase: '', aiModel: '', aiKey: '', icon: '' };
  var sessionKey = null;
  var sessionSalt = null;
  var currentTab = 'home';
  var currentFilter = 'all';
  var query = '';
  var activeSheet = null;
  var editing = null;

  /* ---------------- 加密 ---------------- */
  var subtle = (window.crypto && window.crypto.subtle) ? window.crypto.subtle : null;
  function te(s) { return new TextEncoder().encode(s); }
  function td(buf) { return new TextDecoder().decode(buf); }

  function deriveKey(pwd, saltB64) {
    var salt = b64d(saltB64);
    return subtle.importKey('raw', te(pwd), 'PBKDF2', false, ['deriveKey']).then(function (km) {
      return subtle.deriveKey(
        { name: 'PBKDF2', salt: salt, iterations: 120000, hash: 'SHA-256' },
        km, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    });
  }
  function encStr(key, text) {
    var iv = crypto.getRandomValues(new Uint8Array(12));
    return subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, te(text)).then(function (buf) {
      return b64(iv) + '.' + b64(buf);
    });
  }
  function decStr(key, packed) {
    var parts = packed.split('.');
    var iv = b64d(parts[0]);
    return subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, b64d(parts[1])).then(function (buf) {
      return td(buf);
    });
  }

  /* ---------------- 图片库 ---------------- */
    var dbp = null;
  function openDB() {
    if (dbp) return dbp;
    dbp = new Promise(function (res, rej) {
      var req = indexedDB.open('cuncun-photos', 1);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains('photos')) db.createObjectStore('photos');
      };
      req.onsuccess = function () { res(req.result); };
      req.onerror = function () { rej(req.error); };
    });
    return dbp;
  }
  function dbPut(id, data) {
    return openDB().then(function (db) {
      return new Promise(function (res, rej) {
        var tx = db.transaction('photos', 'readwrite');
        tx.objectStore('photos').put(data, id);
        tx.oncomplete = function () { res(true); };
        tx.onerror = function () { rej(tx.error); };
      });
    });
  }
  function dbGet(id) {
    return openDB().then(function (db) {
      return new Promise(function (res) {
        var tx = db.transaction('photos', 'readonly');
        var r = tx.objectStore('photos').get(id);
        r.onsuccess = function () { res(r.result || null); };
        r.onerror = function () { res(null); };
      });
    });
  }
  function dbDel(id) {
    return openDB().then(function (db) {
      var tx = db.transaction('photos', 'readwrite');
      tx.objectStore('photos').delete(id);
    }).catch(function () { });
  }

  /* ---------------- 持久化 ---------------- */
  function persist() {
    try {
      if (settings.lock && sessionKey) {
        return encStr(sessionKey, JSON.stringify(items)).then(function (packed) {
          var cut = packed.indexOf('.');
          localStorage.setItem(LS_ITEMS, JSON.stringify({
            v: 1, enc: true, salt: sessionSalt,
            iv: packed.slice(0, cut), data: packed.slice(cut + 1)
          }));
        });
      }
      localStorage.setItem(LS_ITEMS, JSON.stringify({ v: 1, enc: false, data: items }));
    } catch (e) {
      toast('保存失败：' + (e.message || e));
    }
    return Promise.resolve();
  }

  function readSettings() {
    try {
      var s = JSON.parse(localStorage.getItem(LS_SET) || '{}');
      settings.lock = !!s.lock;
      settings.secure = !!s.secure;
      settings.salt = s.salt || null;
      settings.check = s.check || null;
      settings.haptic = (typeof s.haptic === 'number' && s.haptic >= 0 && s.haptic <= 3) ? s.haptic : 2;
      settings.aiBase = s.aiBase || '';
      settings.aiModel = s.aiModel || '';
      settings.aiKey = s.aiKey || '';
      settings.icon = s.icon || '';
    } catch (e) { }
  }
  function writeSettings() {
    localStorage.setItem(LS_SET, JSON.stringify({
      lock: settings.lock, secure: settings.secure, salt: settings.salt, check: settings.check,
      haptic: settings.haptic, aiBase: settings.aiBase, aiModel: settings.aiModel,
      aiKey: settings.aiKey, icon: settings.icon
    }));
  }

  /* ---------------- 渲染 ---------------- */
  function sampleOf(it) {
    if (!it.fields || !it.fields.length) return '';
    for (var i = 0; i < it.fields.length; i++) {
      var f = it.fields[i];
      if (f.k && f.v) return f.k + ' · ' + (isSecretKey(f.k) ? mask(f.v) : f.v);
    }
    return it.fields[0].v || '';
  }
  function mask(v) {
    v = String(v || '');
    if (v.length <= 2) return '••';
    return v.slice(0, 2) + ' ••••••';
  }
  function subOf(it) {
    var s = sampleOf(it);
    return s || cat(it.cat).name;
  }

  function hl(text, q) {
    text = String(text == null ? '' : text);
    if (!q) return esc(text);
    var safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var re = new RegExp('(' + safe + ')', 'gi');
    var out = '', last = 0, m;
    while ((m = re.exec(text)) !== null) {
      out += esc(text.slice(last, m.index)) + '<mark>' + esc(m[0]) + '</mark>';
      last = m.index + m[0].length;
      if (m.index === re.lastIndex) re.lastIndex++;
    }
    return out + esc(text.slice(last));
  }

  function rowHTML(it, q, delay) {
    var c = cat(it.cat);
    return '<button class="row" data-id="' + it.id + '" style="animation-delay:' + (delay || 0) + 'ms">' +
      iconHTML(it) +
      '<span class="row-main">' +
      '<span class="row-title">' + hl(it.title, q) + '</span>' +
      '<span class="row-sub">' + hl(subOf(it), q) + '</span>' +
      '</span>' +
      (it.pinned ? '<svg class="pin-mark" viewBox="0 0 24 24">' + ICONS.pinmark + '</svg>' : '') +
      '<span class="row-meta">' + timeAgo(it.updated) + '</span>' +
      '</button>';
  }

  // 数字从旧值滚到新值，首页统计条不再硬跳
  function countTo(el, to) {
    if (!el) return;
    to = Number(to) || 0;
    var from = Number(el.textContent) || 0;
    if (from === to || Math.abs(to - from) < 2) { el.textContent = to; return; }
    var t0 = Date.now(), dur = 460;
    clearTimeout(el.__ct);
    function step() {
      var k = Math.min(1, (Date.now() - t0) / dur);
      var e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    // 兜底：任何原因动画没跑完，也一定落到正确值
    el.__ct = setTimeout(function () { el.textContent = to; }, dur + 80);
  }

  function renderHome() {
    var used = CATS.filter(function (c) { return items.some(function (i) { return i.cat === c.id; }); });
    countTo($('#stTotal'), items.length);
    countTo($('#stCats'), used.length || 0);
    var photos = 0;
    items.forEach(function (i) { photos += (i.photos || []).length; });
    countTo($('#stPhotos'), photos);

    var w = $('#wallet');
    if (!used.length) {
      w.innerHTML = '<button class="wcard empty" id="emptyCard"><div>' + svg('sparkle') + '<span>添加第一条记录</span></div></button>';
      $('#emptyCard').onclick = function () { openEdit(null); };
    } else {
      w.innerHTML = used.map(function (c, ci) {
        var list = items.filter(function (i) { return i.cat === c.id; })
          .sort(function (a, b) { return b.updated - a.updated; });
        var latest = list[0];
        return '<button class="wcard" data-cat="' + c.id + '" style="' + catVars(c, true) + ';--i:' + ci + '">' +
          '<div class="wc-top"><span class="wc-kind">' + svg(c.icon) + esc(c.name) + '</span>' +
          '<span class="wc-count"><b>' + list.length + '</b><small>条</small></span></div>' +
          '<div class="wc-value">' + esc(latest.title) + '</div>' +
          '<div class="wc-foot"><span>' + esc(sampleOf(latest).slice(0, 18) || c.name) + '</span><span>' + timeAgo(latest.updated) + '</span></div>' +
          '</button>';
      }).join('');
    }
    applyStack(used.length);
    buildDots();

    var recent = items.slice().sort(function (a, b) { return b.updated - a.updated; }).slice(0, 5);
    var rl = $('#recentList');
    if (!recent.length) {
      rl.innerHTML = '<div class="empty"><div class="orb">' + svg('folder') + '</div><h3>还没有记录</h3><p>点右下角的加号，把想记住的信息存进来</p></div>';
    } else {
      rl.innerHTML = recent.map(function (it, i) { return rowHTML(it, '', i * 30); }).join('');
    }
  }

  var walletExpanded = false;

  function applyStack(n) {
    var w = $('#wallet'), tg = $('#stkToggle');
    if (!w) return;
    var canStack = n > 1;
    w.classList.toggle('stacked', canStack && !walletExpanded);
    w.style.setProperty('--stk-n', String(n || 1));
    $$('.wcard', w).forEach(function (card, i) {
      card.style.setProperty('--i', String(i));
    });
    if (tg) {
      tg.style.display = canStack ? '' : 'none';
      tg.textContent = walletExpanded ? '收起' : '展开';
      tg.classList.toggle('on', walletExpanded);
    }
  }

  function toggleStack() {
    walletExpanded = !walletExpanded;
    var used = CATS.filter(function (c) { return items.some(function (i) { return i.cat === c.id; }); });
    applyStack(used.length);
    var w = $('#wallet');
    if (w && walletExpanded) {
      w.classList.add('splayed');
      clearTimeout(toggleStack._t);
      toggleStack._t = setTimeout(function () { w.classList.remove('splayed'); }, 700);
    }
    haptic(10);
  }

  function buildDots() {
    var w = $('#wallet'), dots = $('#dots');
    if (!w || !dots) return;
    var cards = $$('.wcard', w);
    if (cards.length <= 1 || w.classList.contains('stacked')) { dots.innerHTML = ''; return; }
    dots.innerHTML = cards.map(function (_, i) { return '<i class="' + (i === 0 ? 'on' : '') + '"></i>'; }).join('');
    w.onscroll = function () {
      var card = cards[0];
      var step = card.offsetWidth + 12;
      var idx = Math.round(w.scrollLeft / step);
      $$('i', dots).forEach(function (d, i) { d.classList.toggle('on', i === idx); });
    };
  }

  function matchItem(it, q) {
    if (!q) return true;
    var s = q.toLowerCase();
    var hay = [it.title, it.notes, cat(it.cat).name, cat(it.cat).id, it.fields.map(function (f) { return f.k + ' ' + f.v; }).join(' ')]
      .join(' ').toLowerCase();
    return hay.indexOf(s) >= 0;
  }

  function renderAllList() {
    // 分类筛选条
    var counts = {};
    items.forEach(function (i) { counts[i.cat] = (counts[i.cat] || 0) + 1; });
    var f = $('#filters');
    var chips = [['all', '全部', items.length]].concat(CATS.map(function (c) {
      return [c.id, c.name, counts[c.id] || 0];
    }));
    f.innerHTML = chips.map(function (ch) {
      var on = currentFilter === ch[0];
      return '<button class="chip ' + (on ? 'active' : '') + '" data-filter="' + ch[0] + '">' + esc(ch[1]) +
        (ch[2] ? ' ' + ch[2] : '') + '</button>';
    }).join('');

    var list = items.filter(function (i) {
      if (currentFilter !== 'all' && i.cat !== currentFilter) return false;
      return matchItem(i, query);
    }).sort(function (a, b) {
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
      return b.updated - a.updated;
    });

    var meta = $('#resultMeta');
    if (query) {
      meta.textContent = list.length ? '找到 ' + list.length + ' 条结果' : '没有找到匹配的记录';
    } else if (currentFilter !== 'all') {
      meta.textContent = cat(currentFilter).name + ' · ' + list.length + ' 条';
    } else {
      meta.textContent = '共 ' + items.length + ' 条记录';
    }

    $('#allList').innerHTML = list.length ? list.map(function (it, i) { return rowHTML(it, query, i * 26); }).join('')
      : '<div class="empty"><div class="orb">' + svg(query ? 'search' : 'folder') + '</div><h3>' +
      (query ? '没有匹配' : '这里还是空的') + '</h3><p>' +
      (query ? '换个关键词试试，姓名、号码、备注都能搜' : '点右下角的加号新增一条记录') + '</p></div>';
  }

  function renderMe() {
    var bytes = (localStorage.getItem(LS_ITEMS) || '').length;
    var photos = 0;
    items.forEach(function (i) { photos += (i.photos || []).length; });
    $('#usageSub').textContent = items.length + ' 条记录 · ' + photos + ' 张照片 · 约 ' + Math.max(1, Math.round(bytes / 1024)) + ' KB';
    $('#swLock').classList.toggle('on', !!settings.lock);
    $('#lockSub').textContent = settings.lock ? '已开启 · 打开应用需输入密码' : '未开启 · 打开应用需输入密码';
    $('#swSecure').classList.toggle('on', !!settings.secure);
    renderHap();
    var ready = aiReady();
    var tag = $('#aiTag');
    if (tag) { tag.textContent = ready ? '已配置' : '未配置'; tag.style.color = ready ? 'var(--green)' : ''; }
    var aiSub = $('#aiSub');
    if (aiSub) aiSub.textContent = ready ? (settings.aiModel + ' · ' + shortBase(settings.aiBase)) : '未配置 · 填接口地址与密钥即可使用';
    if (window.Native && Native.info) {
      try {
        var info = JSON.parse(Native.info());
        $('#aboutSub').textContent = '版本 ' + info.version + ' · ' + info.model;
      } catch (e) { }
    }
  }

  function renderAll() {
    renderHome();
    renderAllList();
    renderMe();
  }

  /* ---------------- Toast ---------------- */
  var toastTimer = null;
  function toast(msg, good) {
    var el = $('#toast');
    $('#toastTxt').textContent = msg;
    el.querySelector('svg').style.color = good === false ? 'var(--red)' : 'var(--green)';
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2100);
  }
  var HAP_LEVELS = [
    { n: '关', ms: 0, amp: 0 },
    { n: '轻', ms: 9, amp: 60 },
    { n: '中', ms: 13, amp: 130 },
    { n: '强', ms: 20, amp: 220 }
  ];
  function haptic(ms) {
    var lv = HAP_LEVELS[settings.haptic == null ? 2 : settings.haptic] || HAP_LEVELS[2];
    if (!lv || lv.ms === 0) return;
    // 长震动（>25ms，如错误提示）按档位放大感受
    var dur = (ms && ms > 25) ? Math.min(60, ms) : lv.ms;
    try {
      if (window.Native && Native.vibrateAmp) Native.vibrateAmp(dur, lv.amp);
      else if (window.Native && Native.vibrate) Native.vibrate(dur);
    } catch (e) { }
  }
  function applyHaptics() {
    try {
      if (window.Native && Native.setHaptics) Native.setHaptics(settings.haptic);
    } catch (e) { }
  }
  function copyText(t) {
    if (window.Native && Native.copy) {
      var r = Native.copy(t);
      if (String(r) === '1') { toast('已复制'); haptic(12); return; }
    }
    if (nav.clipboard) {
      navigator.clipboard.writeText(t).then(function () { toast('已复制'); });
    } else {
      var ta = document.createElement('textarea');
      ta.value = t; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast('已复制'); } catch (e) { toast('复制失败', false); }
      document.body.removeChild(ta);
    }
  }

  /* ---------------- 弹层 ---------------- */
  var SHEET_IDS = { detail: '#sheetDetail', edit: '#sheetEdit', person: '#sheetPerson', personDetail: '#sheetPersonDetail', ai: '#sheetAI', aiCfg: '#sheetAICfg', guide: '#sheetGuide' };
  function resetSheetStyle(s) {
    if (!s) return;
    s.style.transform = '';
    s.style.opacity = '';
    s.classList.remove('drag');
  }
  function openSheet(name) {
    var el = $(SHEET_IDS[name] || ('#sheet' + name));
    // 同一时刻只允许一层面板：其它面板一律收回，并把拖动留下的位移/透明度清干净，
    // 否则被打断的拖拽会让某个面板停在半空，看起来就是「页面串了」
    $$('.sheet').forEach(function (s) {
      if (s === el) return;
      if (s.classList.contains('open')) {
        // 切换面板时让上一个面板「瞬间」退回，避免两层在过渡中交叉出现
        s.classList.add('instant');
        s.classList.remove('open');
        setTimeout(function () { s.classList.remove('instant'); }, 120);
      } else {
        s.classList.remove('open');
      }
      resetSheetStyle(s);
    });
    if (el) {
      resetSheetStyle(el);
      el.classList.add('open');
    }
    var mainEl = $('#main');
    if (mainEl) { mainEl.style.transform = ''; mainEl.style.opacity = ''; }
    activeSheet = name;
    $('#scrim').classList.add('show');
    $('#fab').classList.add('hide');
    $('#tabbar').classList.add('hide');
  }
  function closeSheet() {
    if (!activeSheet) return;
    $$('.sheet.open').forEach(function (s) { s.classList.remove('open'); resetSheetStyle(s); });
    $('#scrim').classList.remove('show');
    if (currentTab === 'home' || currentTab === 'all') $('#fab').classList.remove('hide');
    $('#tabbar').classList.remove('hide');
    activeSheet = null;
    document.documentElement.style.removeProperty('--accent-soft');
    setTimeout(function () {
      if (!activeSheet) $('#detailBody').innerHTML = '';
    }, 400);
  }

  function dialog(opt) {
    var box = $('#dialogBox');
    var acts = (opt.actions || []).map(function (a, i) {
      return '<button data-i="' + i + '" class="' + (a.cls || '') + '">' + esc(a.label) + '</button>';
    }).join('');
    box.innerHTML = '<div class="dialog-h"><h3>' + esc(opt.title) + '</h3>' +
      (opt.desc ? '<p>' + opt.desc + '</p>' : '') +
      (opt.input ? '<input class="dinput" id="dlgInput" type="' + (opt.inputType || 'text') + '" placeholder="' +
        esc(opt.input) + '" ' + (opt.inputType === 'password' ? 'inputmode="numeric"' : '') + '>' : '') +
      '</div><div class="dd">' + acts + '</div>';
    var layer = $('#dialogLayer');
    layer.classList.add('show');
    return new Promise(function (resolve) {
      function done(v) {
        layer.classList.remove('show');
        box.onclick = null;
        resolve({ value: v, input: opt.input ? ($('#dlgInput') ? $('#dlgInput').value : '') : '' });
      }
      box.onclick = function (e) {
        var b = e.target.closest('button[data-i]');
        if (!b) return;
        var a = opt.actions[+b.dataset.i];
        if (a && a.keepOpen) return;
        done(a ? a.value : null);
      };
      if (opt.input) setTimeout(function () { var x = $('#dlgInput'); if (x) x.focus(); }, 60);
      layer.onclick = function (e) { if (e.target === layer && opt.dismissable !== false) done(null); };
    });
  }

  function confirmBox(title, desc, okLabel, danger) {
    return dialog({
      title: title, desc: desc,
      actions: [
        { label: '取消', value: false },
        { label: okLabel || '确定', value: true, cls: danger ? 'destruct' : 'primary' }
      ]
    }).then(function (r) { return r.value === true; });
  }

  /* ---------------- 详情 ---------------- */
  function fieldRow(f, i) {
    var secret = isSecretKey(f.k);
    var mono = /^[0-9a-zA-Z\s\-*.]{4,}$/.test(String(f.v || ''));
    return '<div class="frow' + '" data-frow="' + i + '">' +
      '<span class="fk">' + esc(f.k || '内容') + '</span>' +
      '<span class="fv' + (mono ? ' mono' : '') + '" data-fv="' + i + '">' + esc(secret ? mask(f.v) : (f.v || '')) + '</span>' +
      '<div class="act">' +
      (secret ? '<button class="mini" data-eye="' + i + '">' + svg('eye') + '</button>' : '') +
      '<button class="mini" data-cop="' + i + '">' + svg('copy') + '</button>' +
      '</div></div>';
  }

  function detailHTML(it) {
    var c = cat(it.cat);
    var qc = quickCopyHTML(it);
    return '<div class="detail-hero" style="' + catVars(c, true) + '">' +
      '<div class="blob"></div>' +
      '<button class="detail-close" id="detailClose">' + svg('close') + '</button>' +
      iconHTML(it) +
      '<h2>' + esc(it.title) + '</h2>' +
      '<div class="detail-meta"><span class="pill">' + esc(c.name) + '</span>' +
      (brandOf(it.title) ? '<span class="pill plain">' + esc(brandOf(it.title).name || '平台') + '</span>' : '') +
      (it.pinned ? '<span class="pill plain">置顶</span>' : '') +
      '<span>更新于 ' + fullTime(it.updated) + '</span></div>' +
      (qc ? '<div class="dquick">' + qc + '</div>' : '') +
      '</div>' +
      '<div class="section">' +
      (it.fields.length ? '<div class="section-title">内容</div><div class="group">' +
        it.fields.map(fieldRow).join('') + '</div>' : '') +
      (it.notes ? '<div class="section-title">备注</div><div class="notes">' + esc(it.notes) + '</div>' : '') +
      ((it.photos && it.photos.length) ? '<div class="section-title">照片 · ' + it.photos.length +
        '</div><div class="photos" id="detailPhotos">' +
        it.photos.map(function (p) {
          return '<button class="photo" data-photo="' + p + '"><img alt=""></button>';
        }).join('') + '</div>' : '') +
      '</div>' +
      '<div class="actions">' +
      '<button class="action" data-act="copyall">' + svg('copy') + '<span>复制全部</span></button>' +
      '<button class="action" data-act="edit">' + svg('edit') + '<span>编辑</span></button>' +
      '<button class="action danger" data-act="del">' + svg('trash') + '<span>删除</span></button>' +
      '</div>';
  }

  function quickCopyHTML(it) {
    var acc = '', pwd = '', url = '';
    (it.fields || []).forEach(function (f) {
      var k = String(f.k || ''), v = String(f.v || '');
      if (!v) return;
      if (!acc && /账号|帐号|账户|邮箱|号码|电话|用户名|账户名/.test(k)) acc = v;
      if (!pwd && /密码/.test(k)) pwd = v;
      if (!url && /网址|链接|网站/.test(k)) url = v;
    });
    var out = '';
    if (acc) out += '<button class="dq" data-qc="acc">' + svg('copy') + '复制账号</button>';
    if (pwd) out += '<button class="dq" data-qc="pwd">' + svg('copy') + '复制密码</button>';
    if (url) out += '<button class="dq" data-qc="url">' + svg('eye') + '打开网址</button>';
    return out;
  }

  function openDetail(id) {
    var it = items.filter(function (x) { return x.id === id; })[0];
    if (!it) return;
    var c = cat(it.cat);
    haptic(8);
    var body = $('#detailBody');
    body.innerHTML = detailHTML(it);
    body.dataset.id = id;

    $$('[data-fv]', body).forEach(function (node) {
      var i = +node.dataset.fv;
      var f = it.fields[i];
      var shown = false;
      var eye = body.querySelector('[data-eye="' + i + '"]');
      if (eye) eye.onclick = function () {
        shown = !shown;
        node.textContent = shown ? f.v : mask(f.v);
        eye.innerHTML = svg(shown ? 'eyeoff' : 'eye');
        haptic(8);
      };
      var cop = body.querySelector('[data-cop="' + i + '"]');
      if (cop) cop.onclick = function () { copyText(f.v || ''); };
    });

    $$('.photo', body).forEach(function (btn) {
      var pid = btn.dataset.photo;
      dbGet(pid).then(function (d) {
        if (!d) return;
        var img = btn.querySelector('img');
        img.src = d;
        img.onclick = function () { openViewer(d); };
      });
    });

    var acts = {
      copyall: function () {
        var lines = [it.title, '分类：' + cat(it.cat).name, ''];
        it.fields.forEach(function (f) { lines.push(f.k + '：' + f.v); });
        if (it.notes) lines.push('', '备注：' + it.notes);
        copyText(lines.join('\n'));
      },
      edit: function () { openEdit(it.id); },
      del: function () {
        confirmBox('删除这条记录？', '删除后无法恢复，照片也会一并移除。', '删除', true).then(function (ok) {
          if (!ok) return;
          var ps = it.photos || [];
          ps.forEach(function (p) { dbDel(p); });
          items = items.filter(function (x) { return x.id !== it.id; });
          persist();
          closeSheet();
          renderAll();
          toast('已删除');
        });
      }
    };
    $$('[data-act]', body).forEach(function (b) { b.onclick = acts[b.dataset.act]; });
    var x = $('#detailClose', body);
    if (x) x.onclick = function () { closeSheet(); };

    $$('[data-qc]', body).forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        var acc = '', pwd = '', url = '';
        it.fields.forEach(function (f) {
          var k = String(f.k || ''), v = String(f.v || '');
          if (!v) return;
          if (!acc && /账号|帐号|账户|邮箱|号码|电话|用户名|账户名/.test(k)) acc = v;
          if (!pwd && /密码/.test(k)) pwd = v;
          if (!url && /网址|链接|网站/.test(k)) url = v;
        });
        if (b.dataset.qc === 'acc') copyText(acc);
        else if (b.dataset.qc === 'pwd') copyText(pwd);
        else if (url) {
          try {
            if (window.Native && Native.openUrl) { Native.openUrl(url); return; }
          } catch (err) { }
          copyText(url);
        }
      };
    });

    document.documentElement.style.setProperty('--accent-soft', rgba(c.color, .3));
    openSheet('detail');
    $('#sheetDetail .sheet-scroll').scrollTop = 0;
  }

  function openViewer(src) {
    $('#viewerImg').src = src;
    $('#viewer').classList.add('show');
  }

  /* ---------------- 编辑器 ---------------- */
  function renderEdit() {
    var body = $('#editBody');
    if (!editing) return;
    var c = cat(editing.cat);
    body.innerHTML =
      '<div class="form">' +
      '<div class="fbig"><input id="eTitle" placeholder="给这条记录起个名字" value="' + esc(editing.title) + '" maxlength="40"></div>' +
      '<div class="fhint">比如「招商银行储蓄卡」「爸爸的身份证」</div>' +
      '<div class="cats" id="eCats">' + CATS.map(function (x) {
        return '<button class="cat-pick ' + (x.id === editing.cat ? 'on' : '') + '" data-cat="' + x.id +
          '" style="--c:' + x.color + ';--c-soft:' + rgba(x.color, .2) + ';--c-line:' + rgba(x.color, .55) + '">' +
          '<i style="--c:' + x.color + '"></i>' + esc(x.name) + '</button>';
      }).join('') + '</div>' +
      '<div class="section-title" style="margin-left:4px">内容</div>' +
      '<div class="fields" id="eFields">' + editing.fields.map(function (f, i) {
        return '<div class="fitem" data-i="' + i + '">' +
          '<input class="k" placeholder="字段名" value="' + esc(f.k) + '" maxlength="14">' +
          '<input class="v" placeholder="填写内容" value="' + esc(f.v) + '" ' +
          (isSecretKey(f.k) ? 'type="password" ' : '') + 'autocomplete="off">' +
          '<button class="del" data-del="' + i + '">' + svg('close') + '</button></div>';
      }).join('') + '</div>' +
      '<button class="addf" id="addField">' + svg('plus') + '添加字段</button>' +
      '<div class="section-title" style="margin-left:4px">照片</div>' +
      '<div class="photogrid" id="ePhotos"></div>' +
      '<div class="section-title" style="margin-left:4px">备注</div>' +
      '<textarea class="notes-edit" id="eNotes" placeholder="补充说明，比如开户行、办理日期…">' + esc(editing.notes) + '</textarea>' +
      '<div style="margin-top:12px" class="toggle-row"><span>置顶这条记录</span>' +
      '<span class="switch ' + (editing.pinned ? 'on' : '') + '" id="ePin"></span></div>' +
      '<div style="height:10px"></div>' +
      '</div>';

    $('#eTitle').oninput = function () { editing.title = this.value; };
    $('#eNotes').oninput = function () { editing.notes = this.value; };
    $$('#eCats .cat-pick').forEach(function (b) {
      b.onclick = function () {
        editing.cat = b.dataset.cat;
        haptic(8);
        if (!editing.fields.some(function (f) { return f.v && f.v.trim(); })) {
          var preset = cat(editing.cat).fields;
          editing.fields = preset.map(function (k) { return { k: k, v: '' }; });
        }
        renderEdit();
      };
    });
    $$('#eFields .fitem').forEach(function (row) {
      var i = +row.dataset.i;
      var k = row.querySelector('.k'), v = row.querySelector('.v');
      k.oninput = function () { editing.fields[i].k = k.value; };
      v.oninput = function () { editing.fields[i].v = v.value; };
      row.querySelector('.del').onclick = function () {
        editing.fields.splice(i, 1);
        renderEdit();
      };
    });
    $('#addField').onclick = function () {
      editing.fields.push({ k: '', v: '' });
      renderEdit();
      var rows = $$('#eFields .fitem');
      var last = rows[rows.length - 1];
      if (last) last.querySelector('.k').focus();
    };
    $('#ePin').onclick = function () {
      editing.pinned = !editing.pinned;
      this.classList.toggle('on', editing.pinned);
      haptic(8);
    };
    renderEditPhotos();
  }

  function renderEditPhotos() {
    var box = $('#ePhotos');
    if (!editing || !box) return;
    box.innerHTML = (editing.photos || []).map(function (p) {
      return '<div class="photo"><img alt=""><button class="rm" data-rm="' + p + '">' + svg('close') + '</button></div>';
    }).join('') +
      '<button class="photo-add" id="addPhoto">' + svg('camera') + '<span>添加</span></button>';
    $$('.photo', box).forEach(function (ph, idx) {
      var pid = editing.photos[idx];
      dbGet(pid).then(function (d) { if (d) ph.querySelector('img').src = d; });
    });
    $$('[data-rm]', box).forEach(function (b) {
      b.onclick = function () {
        var pid = b.dataset.rm;
        editing.photos = editing.photos.filter(function (x) { return x !== pid; });
        dbDel(pid);
        renderEditPhotos();
      };
    });
    $('#addPhoto').onclick = function () {
      dialog({
        title: '添加照片',
        desc: '照片只保存在本机，用于存放证件、卡面等影像。',
        actions: [
          { label: '拍照', value: 'camera' },
          { label: '从相册选择', value: 'gallery' }
        ]
      }).then(function (r) {
        if (!r.value) return;
        if (window.Native && Native.pickImage) Native.pickImage(r.value);
        else toast('当前环境不支持选择照片', false);
      });
    };
  }

  window.__onPick = function (dataUrl) {
    if (!dataUrl || !editing) return;
    var id = uid();
    dbPut(id, dataUrl).then(function () {
      editing.photos = editing.photos || [];
      editing.photos.push(id);
      renderEditPhotos();
      toast('照片已添加');
    });
  };

  function openEdit(id, draft) {
    if (id) {
      var it = items.filter(function (x) { return x.id === id; })[0];
      if (!it) return;
      editing = {
        id: it.id, title: it.title, cat: it.cat,
        fields: it.fields.map(function (f) { return { k: f.k, v: f.v }; }),
        notes: it.notes || '', photos: (it.photos || []).slice(),
        pinned: !!it.pinned, created: it.created, person: it.person || null
      };
      $('#editTitle').textContent = '编辑记录';
    } else if (draft) {
      editing = {
        id: null, title: draft.title || '',
        cat: cat(draft.cat || 'account').id,
        fields: (draft.fields && draft.fields.length ? draft.fields : cat(draft.cat || 'account').fields.map(function (k) { return { k: k, v: '' }; }))
          .map(function (f) { return { k: f.k, v: f.v }; }),
        notes: draft.notes || '', photos: [], pinned: false, person: draft.person || null
      };
      $('#editTitle').textContent = '新增记录';
    } else {
      editing = {
        id: null, title: '', cat: currentFilter !== 'all' ? currentFilter : 'account',
        fields: cat(currentFilter !== 'all' ? currentFilter : 'account').fields.map(function (k) { return { k: k, v: '' }; }),
        notes: '', photos: [], pinned: false, person: null
      };
      $('#editTitle').textContent = '新增记录';
    }
    if (activeSheet === 'detail') { $('#sheetDetail').classList.remove('open'); }
    activeSheet = null;
    renderEdit();
    openSheet('edit');
    $('#sheetEdit .sheet-scroll').scrollTop = 0;
  }

  function saveEdit() {
    if (!editing) return;
    var title = String(editing.title || '').trim();
    var fields = editing.fields.filter(function (f) { return (f.k && f.k.trim()) || (f.v && f.v.trim()); })
      .map(function (f) { return { k: (f.k || '').trim() || '内容', v: String(f.v || '').trim() }; });
    if (!title) {
      var firstVal = fields.filter(function (f) { return f.v; })[0];
      title = firstVal ? firstVal.v.slice(0, 24) : '';
    }
    if (!title && !fields.length) { toast('至少写一点内容吧', false); return; }

    var now = Date.now();
    if (editing.id) {
      var it = items.filter(function (x) { return x.id === editing.id; })[0];
      if (!it) return;
      it.title = title || '未命名记录';
      it.cat = editing.cat;
      it.fields = fields;
      it.notes = String(editing.notes || '').trim();
      it.photos = editing.photos || [];
      it.pinned = !!editing.pinned;
      it.person = editing.person || null;
      it.updated = now;
    } else {
      items.push({
        id: uid(), title: title || '未命名记录', cat: editing.cat, fields: fields,
        notes: String(editing.notes || '').trim(), photos: editing.photos || [],
        pinned: !!editing.pinned, created: now, updated: now, person: editing.person || null
      });
    }
    persist();
    closeSheet();
    editing = null;
    renderAll();
    toast('已保存');
    haptic(14);
  }

  /* ---------------- 导出 / 导入 ---------------- */
  function stamp() {
    var d = new Date();
    return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + '-' + pad(d.getHours()) + pad(d.getMinutes());
  }

  function buildPayload() {
    var photoIds = [];
    items.forEach(function (i) { (i.photos || []).forEach(function (p) { if (photoIds.indexOf(p) < 0) photoIds.push(p); }); });
    return Promise.all(photoIds.map(function (p) {
      return dbGet(p).then(function (d) { return [p, d]; });
    })).then(function (pairs) {
      var photos = {};
      pairs.forEach(function (x) { if (x[1]) photos[x[0]] = x[1]; });
      return { app: '存存', format: 'cuncun-backup', version: 1, exportedAt: new Date().toISOString(), items: items, photos: photos };
    });
  }

  function saveFile(name, content, mime) {
    if (window.Native && Native.saveText) {
      var r;
      try { r = JSON.parse(Native.saveText(name, content, mime) || '{}'); } catch (e) { r = {}; }
      if (r.ok) { toast('已保存到 ' + r.path); haptic(14); }
      else toast(r.msg || '保存失败', false);
      return;
    }
    var blob = new Blob([content], { type: mime });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 3000);
    toast('已下载 ' + name);
  }

  function doExport() {
    if (!items.length) { toast('还没有可导出的记录', false); return; }
    buildPayload().then(function (payload) {
      var json = JSON.stringify(payload);
      if (settings.lock && sessionKey) {
        encStr(sessionKey, json).then(function (packed) {
          var cut = packed.indexOf('.');
          var file = JSON.stringify({
            format: 'cuncun-enc', version: 1, salt: sessionSalt,
            iv: packed.slice(0, cut), data: packed.slice(cut + 1), exportedAt: new Date().toISOString()
          });
          saveFile('存存备份_' + stamp() + '.cuncun', file, 'application/octet-stream');
        });
      } else {
        saveFile('存存备份_' + stamp() + '.json', JSON.stringify(payload, null, 2), 'application/json');
      }
    });
  }

  function csvCell(v) {
    v = String(v == null ? '' : v);
    if (/[",\n]/.test(v)) return '"' + v.replace(/"/g, '""') + '"';
    return v;
  }
  function doCsv() {
    if (!items.length) { toast('还没有可导出的记录', false); return; }
    var rows = [['标题', '分类', '内容', '备注', '更新时间']];
    items.slice().sort(function (a, b) { return b.updated - a.updated; }).forEach(function (it) {
      rows.push([
        it.title, cat(it.cat).name,
        it.fields.map(function (f) { return f.k + '：' + f.v; }).join(' / '),
        it.notes || '', fullTime(it.updated)
      ]);
    });
    var csv = '\ufeff' + rows.map(function (r) { return r.map(csvCell).join(','); }).join('\r\n');
    saveFile('存存表格_' + stamp() + '.csv', csv, 'text/csv');
  }

  function applyImport(payload, mode) {
    var incoming = (payload.items || []).map(function (it) {
      return {
        id: it.id || uid(), title: it.title || '未命名记录', cat: it.cat || 'other',
        fields: (it.fields || []).map(function (f) { return { k: f.k || '内容', v: f.v || '' }; }),
        notes: it.notes || '', photos: it.photos || [], pinned: !!it.pinned,
        created: it.created || Date.now(), updated: it.updated || Date.now()
      };
    });
    var ps = payload.photos || {};
    var puts = Object.keys(ps).map(function (k) { return dbPut(k, ps[k]); });
    Promise.all(puts).then(function () {
      if (mode === 'replace') {
        items = incoming;
      } else {
        var map = {};
        items.forEach(function (i) { map[i.id] = i; });
        incoming.forEach(function (i) { map[i.id] = i; });
        items = Object.keys(map).map(function (k) { return map[k]; });
      }
      persist();
      renderAll();
      toast('已恢复 ' + incoming.length + ' 条记录');
      haptic(16);
    });
  }

  function handleImportText(text) {
    var payload;
    try { payload = JSON.parse(text); } catch (e) { toast('文件格式不对，无法读取', false); return; }
    if (payload && payload.format === 'cuncun-enc') {
      dialog({
        title: '这是加密备份',
        desc: '请输入导出这份备份时使用的应用锁密码。',
        input: '应用锁密码', inputType: 'password',
        actions: [{ label: '取消', value: null }, { label: '解密', value: 'go', cls: 'primary' }]
      }).then(function (r) {
        if (r.value !== 'go' || !r.input) return;
        deriveKey(r.input, payload.salt).then(function (key) {
          return decStr(key, payload.iv + '.' + payload.data);
        }).then(function (plain) {
          var inner = JSON.parse(plain);
          askMode(inner);
        }).catch(function () { toast('密码不正确，解密失败', false); });
      });
      return;
    }
    if (payload && (payload.format === 'cuncun-backup' || payload.items)) { askMode(payload); return; }
    toast('这不是存存的备份文件', false);
  }

  function askMode(payload) {
    dialog({
      title: '恢复备份',
      desc: '备份里有 <b>' + (payload.items || []).length + '</b> 条记录。合并会保留现有记录，覆盖会用备份替换全部内容。',
      actions: [
        { label: '取消', value: null },
        { label: '合并', value: 'merge' },
        { label: '覆盖', value: 'replace', cls: 'primary' }
      ]
    }).then(function (r) {
      if (!r.value) return;
      applyImport(payload, r.value);
    });
  }

  /* ---------------- 安全设置 ---------------- */
  function toggleLock() {
    if (!subtle) { toast('当前环境不支持加密', false); return; }
    if (!settings.lock) {
      dialog({
        title: '设置应用锁',
        desc: '设置后，每次打开存存都需要输入密码，记录会加密保存在本机。请记牢密码，忘记后无法恢复数据。',
        input: '设置一个密码（建议 4-8 位数字）', inputType: 'password',
        actions: [{ label: '取消', value: null }, { label: '开启', value: 'ok', cls: 'primary' }]
      }).then(function (r) {
        if (r.value !== 'ok') return;
        var pwd = (r.input || '').trim();
        if (pwd.length < 4) { toast('密码至少 4 位', false); return; }
        var salt = b64(crypto.getRandomValues(new Uint8Array(16)));
        deriveKey(pwd, salt).then(function (key) {
          sessionKey = key;
          sessionSalt = salt;
          settings.lock = true;
          settings.salt = salt;
          return encStr(key, 'cuncun').then(function (chk) {
            settings.check = chk;
            writeSettings();
            return persist();
          });
        }).then(function () {
          renderMe();
          toast('应用锁已开启');
        });
      });
    } else {
      confirmBox('关闭应用锁？', '关闭后记录将以未加密形式保存在本机，打开应用也不再需要密码。', '关闭').then(function (ok) {
        if (!ok) return;
        settings.lock = false;
        settings.salt = null;
        settings.check = null;
        sessionKey = null;
        writeSettings();
        persist();
        renderMe();
        toast('应用锁已关闭');
      });
    }
  }

  function toggleSecure() {
    settings.secure = !settings.secure;
    writeSettings();
    try { if (window.Native && Native.setSecure) Native.setSecure(settings.secure); } catch (e) { }
    renderMe();
    toast(settings.secure ? '隐私模式已开启' : '隐私模式已关闭');
  }

  function wipeAll() {
    confirmBox('清空全部数据？', '本机所有记录和照片都会被删除，且无法恢复。建议先导出备份。', '清空', true).then(function (ok) {
      if (!ok) return;
      var ps = [];
      items.forEach(function (i) { (i.photos || []).forEach(function (p) { ps.push(p); }); });
      ps.forEach(function (p) { dbDel(p); });
      items = [];
      persons = [];
      writePersons();
      persist();
      renderAll();
      renderRel();
      toast('已清空');
    });
  }

  /* ---------------- 初始化 & 事件 ---------------- */
  var TABS = ['home', 'all', 'rel', 'me'];
  var TAB_VIEW = { home: 'viewHome', all: 'viewAll', rel: 'viewRel', me: 'viewMe' };

  function moveThumb(tab, instant) {
    var bar = $('#tabbar');
    var b = bar && bar.querySelector('button[data-tab="' + tab + '"]');
    if (!b) return;
    var barRect = bar.getBoundingClientRect();
    var r = b.getBoundingClientRect();
    var w = $('#thumb').getBoundingClientRect().width || 84;
    var x = Math.round(r.left - barRect.left + (r.width - w) / 2);
    var th = $('#thumb');
    if (instant) th.style.transition = 'none';
    th.style.transform = 'translateX(' + x + 'px)';
    if (instant) requestAnimationFrame(function () { th.style.transition = ''; });
  }

  function goTab(tab) {
    if (TABS.indexOf(tab) < 0) tab = 'home';
    currentTab = tab;
    Object.keys(TAB_VIEW).forEach(function (k) {
      var el = $('#' + TAB_VIEW[k]);
      if (el) el.classList.toggle('active', k === tab);
    });
    $$('#tabbar button').forEach(function (b) {
      b.classList.toggle('active', b.dataset.tab === tab);
    });
    moveThumb(tab);
    $('#glow').style.background = '';
    // 清掉横滑可能残留的位移，避免页面看起来「串」在一起
    var mainEl = $('#main');
    if (mainEl) { mainEl.style.transition = ''; mainEl.style.transform = ''; mainEl.style.opacity = ''; }
    window.scrollTo(0, 0);
    // 加号只属于记录页，设置页 / 关系页收起，免得压住开关和按钮
    var fab = $('#fab');
    if (fab) fab.classList.toggle('hide', tab === 'me' || tab === 'rel');
    if (tab === 'all') renderAllList();
    if (tab === 'rel') renderRel();
    if (tab === 'me') renderMe();
    haptic(8);
  }

  function bind() {
    // 标签栏
    $$('#tabbar button').forEach(function (b) {
      b.onclick = function () { goTab(b.dataset.tab); };
    });
    $('#fab').onclick = function () { openEdit(null); };
    $('#btnAddTop').onclick = function () { openEdit(null); };
    $('#btnSearchTop').onclick = function () {
      goTab('all');
      setTimeout(function () { $('#q').focus(); }, 120);
    };
    $('#linkAll').onclick = function () { currentFilter = 'all'; goTab('all'); };
    var stg = $('#stkToggle');
    if (stg) stg.onclick = toggleStack;
    $('#linkRecent').onclick = function () { currentFilter = 'all'; goTab('all'); };
    $('#scrim').onclick = closeSheet;

    // 列表点击（事件委托）
    document.addEventListener('click', function (e) {
      var row = e.target.closest('.row');
      if (row) { openDetail(row.dataset.id); return; }
      var catCard = e.target.closest('.wcard[data-cat]');
      if (catCard) {
        var wl = catCard.closest('#wallet');
        if (wl && wl.classList.contains('stacked')) { toggleStack(); return; }
        currentFilter = catCard.dataset.cat;
        goTab('all');
      }
    });

    // 筛选
    $('#filters').addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      currentFilter = chip.dataset.filter;
      renderAllList();
      haptic(6);
    });

    // 搜索
    var qTimer = null;
    $('#q').addEventListener('input', function () {
      var v = this.value;
      $('#qClear').classList.toggle('on', !!v);
      clearTimeout(qTimer);
      qTimer = setTimeout(function () { query = v.trim(); renderAllList(); }, 130);
    });
    $('#qClear').onclick = function () {
      $('#q').value = ''; query = ''; this.classList.remove('on'); renderAllList(); $('#q').blur();
    };

    // 顶栏滚动阴影
    window.addEventListener('scroll', function () {
      $('#top').classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });

    // 编辑面板
    $('#editCancel').onclick = function () { closeSheet(); editing = null; };
    $('#editSave').onclick = saveEdit;

    // 设置项
    $('#btnExport').onclick = doExport;
    $('#btnCsv').onclick = doCsv;
    $('#btnImport').onclick = function () { $('#filePick').click(); };
    $('#swLock').onclick = toggleLock;
    $('#swSecure').onclick = toggleSecure;
    $('#btnWipe').onclick = wipeAll;

    // —— v1.1：AI / 关系网 / 个性化 ——
    var aiBtn = $('#btnAI');
    if (aiBtn) aiBtn.onclick = openAI;
    var aiEntry = $('#aiEntry');
    if (aiEntry) aiEntry.onclick = openAI;
    $('#btnAIOpen').onclick = openAI;
    $('#btnAICfg').onclick = openAICfg;
    $('#aiClose').onclick = function () { closeSheet(); };
    $('#aiSend').onclick = function () { aiRun($('#aiInput').value); };
    $('#aiInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); aiRun(this.value); }
    });
    $('#aiInput').addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = Math.min(118, this.scrollHeight) + 'px';
    });
    $('#cfgCancel').onclick = function () { closeSheet(); };
    $('#cfgSave').onclick = saveAICfg;
    $('#cfgTest').onclick = testAICfg;

    $('#segHap').addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b || !b.dataset.hap) return;
      setHap(b.dataset.hap);
      toast('震动：' + HAP_LEVELS[settings.haptic].n, true);
    });
    $('#btnIcon').onclick = function () { $('#iconPick').click(); };
    $('#iconPick').addEventListener('change', function () {
      onIconFile(this.files && this.files[0]);
      this.value = '';
    });
    $('#btnMail').onclick = function () { copyText('3372991529@qq.com'); };

    // —— v1.2：守则 / GitHub / 批量识别 ——
    $('#btnGuide').onclick = function () { openSheet('guide'); haptic(8); };
    $('#guideClose').onclick = function () { closeSheet(); };
    dragSheet($('#sheetGuide'), function () { closeSheet(); });
    $('#btnGithub').onclick = function () {
      var url = 'https://github.com/zmy531/cuncun';
      try {
        if (window.Native && Native.openUrl) { Native.openUrl(url); return; }
      } catch (e) { }
      copyText(url);
    };
    $('#btnAddPerson').onclick = function () { openPerson(null); };
    $('#graphEmptyBtn').onclick = function () { openPerson(null); };
    $('#btnRelReset').onclick = function () {
      gview = { x: 0, y: 0, s: 1 };
      applyGView();
      haptic(8);
    };
    document.addEventListener('click', function (e) {
      var pc = e.target && e.target.closest ? e.target.closest('.person-card') : null;
      if (pc) openPersonDetail(pc.dataset.pid);
    });

    $('#pdClose').onclick = function () { closeSheet(); };
    dragSheet($('#sheetPersonDetail'), function () { closeSheet(); });

    $('#personCancel').onclick = function () { closeSheet(); editingPerson = null; };
    $('#personSave').onclick = savePerson;
    dragSheet($('#sheetPerson'), function () { closeSheet(); editingPerson = null; });
    dragSheet($('#sheetAI'), function () { closeSheet(); });
    dragSheet($('#sheetAICfg'), function () { closeSheet(); });

    bindGraphGestures();
    bindSwipe();

    $('#filePick').addEventListener('change', function () {
      var f = this.files && this.files[0];
      if (!f) return;
      var fr = new FileReader();
      fr.onload = function () { handleImportText(String(fr.result)); };
      fr.readAsText(f, 'utf-8');
      this.value = '';
    });

    $('#viewer').onclick = function () { this.classList.remove('show'); $('#viewerImg').src = ''; };

    // 锁屏
    $('#lockBtn').onclick = tryUnlock;
    $('#lockPwd').addEventListener('keydown', function (e) { if (e.key === 'Enter') tryUnlock(); });

    // 面板下拉关闭
    dragSheet($('#sheetDetail'), function () { closeSheet(); });
    dragSheet($('#sheetEdit'), function () { closeSheet(); editing = null; });
  }

  function dragSheet(sheet, onClose) {
    var startY = 0, dy = 0, dragging = false;
    var bar = sheet.querySelector('.sheet-bar, .grabber');
    function down(e) {
      var t = e.touches ? e.touches[0] : e;
      startY = t.clientY; dragging = true; dy = 0;
      sheet.classList.add('drag');
    }
    function move(e) {
      if (!dragging) return;
      var t = e.touches ? e.touches[0] : e;
      dy = Math.max(0, t.clientY - startY);
      sheet.style.transform = 'translateY(' + dy + 'px)';
    }
    function up() {
      if (!dragging) return;
      dragging = false;
      sheet.classList.remove('drag');
      sheet.style.transform = '';
      if (dy > 90) onClose();
    }
    bar.addEventListener('touchstart', down, { passive: true });
    bar.addEventListener('touchmove', move, { passive: true });
    bar.addEventListener('touchend', up);
    bar.addEventListener('mousedown', down);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }

  async function tryUnlock() {
    var pwd = ($('#lockPwd').value || '').trim();
    var tip = $('#lockTip');
    if (!pwd) { tip.textContent = '请输入密码'; return; }
    tip.textContent = '正在解锁…';
    try {
      var key = await deriveKey(pwd, settings.salt || '');
      var ok = true;
      if (settings.check) {
        var chk = await decStr(key, settings.check);
        ok = (chk === 'cuncun');
      }
      if (!ok) throw new Error('bad');
      sessionKey = key;
      sessionSalt = settings.salt;
      var raw = localStorage.getItem(LS_ITEMS);
      if (raw) {
        var pack = JSON.parse(raw);
        if (pack.enc) {
          var plain = await decStr(key, pack.iv + '.' + pack.data);
          items = JSON.parse(plain) || [];
          sessionSalt = pack.salt || sessionSalt;
        } else {
          items = (pack.data || []);
        }
      }
      $('#lock').classList.remove('show');
      $('#lockPwd').value = '';
      tip.textContent = '';
      renderAll();
    } catch (e) {
      tip.textContent = '密码不正确，请重试';
      haptic(30);
    }
  }

  function boot() {
    readSettings();
    var raw = localStorage.getItem(LS_ITEMS);
    if (raw) {
      try {
        var pack = JSON.parse(raw);
        if (!pack.enc) items = pack.data || [];
      } catch (e) { items = []; }
    }
    // 数据容错
    items = (items || []).filter(function (i) { return i && i.id; }).map(function (i) {
      i.fields = i.fields || [];
      i.photos = i.photos || [];
      i.title = i.title || '未命名记录';
      i.cat = cat(i.cat).id;
      i.created = i.created || i.updated || Date.now();
      i.updated = i.updated || i.created;
      return i;
    });
    loadSeed();
    renderAll();
    bind();
    goTab('home');
    readPersons();
    applyIcon();
    applyHaptics();
    renderHap();
    renderRel();

    try { if (window.Native && Native.setSecure && settings.secure) Native.setSecure(true); } catch (e) { }

    startGuide();

    if (settings.lock) {
      $('#lock').classList.add('show');
      if (subtle) setTimeout(function () { $('#lockPwd').focus(); }, 300);
    }
  }

  /* ============================================================
     v1.1 · 关系网
     ============================================================ */
  var LS_PERSONS = 'cc.persons';
  var persons = [];
  var RELS = [
    { id: 'family', name: '家人', color: '#ff453a' },
    { id: 'friend', name: '朋友', color: '#30d158' },
    { id: 'work', name: '同事', color: '#0a84ff' },
    { id: 'other', name: '其他', color: '#8e8e93' }
  ];
  var gview = { x: 0, y: 0, s: 1 };
  var editingPerson = null;
  var personSel = {};

  function relOf(id) {
    for (var i = 0; i < RELS.length; i++) if (RELS[i].id === id) return RELS[i];
    return RELS[3];
  }
  function readPersons() {
    try { persons = JSON.parse(localStorage.getItem(LS_PERSONS) || '[]') || []; } catch (e) { persons = []; }
    persons = persons.filter(function (p) { return p && p.id; }).map(function (p) {
      p.name = p.name || '未命名';
      p.rel = p.rel || 'other';
      p.color = p.color || relOf(p.rel).color;
      return p;
    });
  }
  function writePersons() {
    try { localStorage.setItem(LS_PERSONS, JSON.stringify(persons)); } catch (e) { }
  }
  function countPerson(pid) {
    var n = 0;
    items.forEach(function (i) { if (i.person === pid) n++; });
    return n;
  }
  // 按名字找人，没有就新建，返回人物 id
  function ensurePerson(name, rel) {
    name = String(name || '').trim().slice(0, 12);
    if (!name) return null;
    var found = persons.filter(function (p) { return p.name === name; })[0];
    if (found) {
      if (rel && found.rel !== rel) { found.rel = rel; found.color = relOf(rel).color; writePersons(); }
      return found.id;
    }
    var pid = uid();
    var r = relOf(rel || 'other');
    persons.push({ id: pid, name: name, rel: r.id, color: r.color, note: '' });
    writePersons();
    return pid;
  }

  function renderRel() {
    renderGraph();
    renderPersonList();
  }

  // 一个人名下最能代表“个人信息”的一条值，用在人物卡片和详情头
  var BRIEF_KEYS = ['电话', '手机号', '微信号', '账号', '邮箱', '地址'];
  function personBrief(pid) {
    var recs = items.filter(function (i) { return i.person === pid; });
    if (!recs.length) return '还没有挂记录';
    for (var k = 0; k < BRIEF_KEYS.length; k++) {
      for (var r = 0; r < recs.length; r++) {
        var fs = recs[r].fields || [];
        for (var f = 0; f < fs.length; f++) {
          var key = String(fs[f].k || ''), val = String(fs[f].v || '');
          if (val && key.indexOf(BRIEF_KEYS[k]) >= 0 && key.indexOf('密码') < 0) {
            return key + ' ' + (val.length > 16 ? val.slice(0, 16) + '…' : val);
          }
        }
      }
    }
    return recs.length + ' 条记录';
  }

  function renderPersonList() {
    var box = $('#personList');
    if (!box) return;
    if (!persons.length) {
      box.innerHTML = '<p class="footnote" style="text-align:center;padding:8px 18px 0">还没有人物。点上面「＋ 人物」添加家人、朋友或同事。</p>';
      return;
    }
    box.innerHTML = persons.map(function (p, i) {
      var c = relOf(p.rel);
      return '<button class="person-card" data-pid="' + p.id + '" style="animation-delay:' + (i * 26) + 'ms">' +
        '<span class="avatar" style="background:linear-gradient(140deg,' + lighten(c.color, .2) + ',' + c.color + ')">' + esc(p.name.slice(0, 1)) + '</span>' +
        '<span class="pc-main"><b>' + esc(p.name) + '</b><small>' + c.name + ' · ' + esc(personBrief(p.id)) + '</small></span>' +
        '<span class="pc-tag" style="color:' + lighten(c.color, .35) + ';background:' + rgba(c.color, .16) + '">' + countPerson(p.id) + ' 条</span>' +
        '<span class="pc-arrow">' + svg('chev') + '</span></button>';
    }).join('');
  }

  function emptyGraph(title, desc, btn) {
    $('#graphEmptyTitle').textContent = title;
    $('#graphEmptyDesc').textContent = desc;
    $('#graphEmptyBtn').textContent = btn;
    $('#graphEmpty').classList.remove('hide');
  }

  function renderGraph() {
    var el = $('#graph');
    if (!el) return;
    if (!persons.length) {
      el.innerHTML = '';
      emptyGraph('关系还没连起来', '添加人物后，把你存的资料挂到他们身上', '添加第一个人物');
      return;
    }
    $('#graphEmpty').classList.add('hide');
    drawPeople();
  }

  function nodeSVG(id, x, y, r, txt, sub, grad, strokeC, fs, idx) {
    // --nx/--ny 交给 CSS 计算 transform，保证 pop / 入场动画不会把节点挪到原点；
    // 额外一层透明大圆是给手指留的命中余量，点偏一点也能选中。
    return '<g class="gnode" data-node="' + id + '" transform="translate(' + x + ',' + y + ')" ' +
      'style="--nx:' + x + ';--ny:' + y + ';--d:' + (idx || 0) + '">' +
      '<circle class="ghit" r="' + (r + 28) + '" fill="rgba(0,0,0,0)"/>' +
      '<circle r="' + r + '" fill="url(#' + grad + ')"/>' +
      '<circle r="' + r + '" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="2"/>' +
      '<circle r="' + (r + 9) + '" fill="none" stroke="' + strokeC + '" stroke-opacity=".14" stroke-width="6"/>' +
      '<text y="' + Math.round(fs / 3) + '" text-anchor="middle" font-size="' + fs + '" font-weight="700" fill="#fff">' + esc(txt) + '</text>' +
      (sub ? '<text y="' + (r + 34) + '" text-anchor="middle" font-size="22" fill="rgba(255,255,255,.62)">' + esc(sub) + '</text>' : '') +
      '</g>';
  }

  function drawPeople() {
    var n = persons.length;
    var R = n <= 2 ? 244 : (n <= 4 ? 248 : (n <= 6 ? 268 : 302));
    var cx = 500, cy = 500;
    // 人数为偶数时整体偏半格，避免两个人物正好排在正上/正下，看着像一条直线
    var off = (n % 2) ? 0 : 0.5;
    var step = (2 * Math.PI) / n;
    var parts = ['<g id="gRoot">'];
    var defs = '<defs>';
    var colors = ['#0a84ff'];
    persons.forEach(function (p) { colors.push(relOf(p.rel).color); });
    colors.forEach(function (c, i) {
      defs += '<radialGradient id="gp' + i + '" cx="32%" cy="26%" r="78%">' +
        '<stop offset="0" stop-color="' + lighten(c, .34) + '"/>' +
        '<stop offset="58%" stop-color="' + c + '"/>' +
        '<stop offset="100%" stop-color="' + darken(c, .32) + '"/></radialGradient>';
    });
    defs += '</defs>';
    parts.push(defs);

    var coords = [];
    persons.forEach(function (p, i) {
      var a;
      // 只有两个人时排成左右上斜角（三角形），否则会和我连成一条横线
      if (n === 2) a = -Math.PI / 2 + (i === 0 ? -0.62 : 0.62);
      else a = -Math.PI / 2 + (i + off) * step;
      coords.push({ x: Math.round(cx + Math.cos(a) * R), y: Math.round(cy + Math.sin(a) * R) });
    });
    coords.forEach(function (c, i) {
      parts.push('<line class="gedge" x1="' + cx + '" y1="' + cy + '" x2="' + c.x + '" y2="' + c.y +
        '" stroke="' + relOf(persons[i].rel).color + '" stroke-opacity=".45" stroke-width="4" stroke-linecap="round"/>');
    });
    parts.push(nodeSVG('@me', cx, cy, 86, '我', items.length + ' 条', 'gp0', '#0a84ff', 36, 0));
    persons.forEach(function (p, i) {
      var c = coords[i];
      var name = p.name.length > 3 ? p.name.slice(0, 3) : p.name;
      parts.push(nodeSVG(p.id, c.x, c.y, 58, name, countPerson(p.id) + ' 条', 'gp' + (i + 1), relOf(p.rel).color, 26, i + 1));
    });
    parts.push('</g>');
    $('#graph').innerHTML = parts.join('');
    applyGView();
  }

  function applyGView() {
    var g = $('#gRoot');
    if (g) g.setAttribute('transform', 'translate(' + gview.x + ',' + gview.y + ') scale(' + gview.s + ')');
  }

  // 用手指落点跟每个节点的圆心做距离比较，不依赖 SVG 自己的命中测试，
  // 这样即使点到节点的边缘、或者别的元素盖在上面，也照样能选中人物。
  function nearestNode(x, y) {
    var nodes = $$('#graph [data-node]');
    var best = null, bestD = 1e9;
    nodes.forEach(function (g) {
      var r = g.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var rad = Math.min(r.width, r.height) / 2;
      var d = Math.hypot(x - cx, y - cy);
      if (d <= rad * 1.35 && d < bestD) { bestD = d; best = g; }
    });
    return best;
  }

  function tapNode(g) {
    if (!g) return;
    var id = g.getAttribute('data-node');
    if (id === '@me') {
      openSheet('personDetail');
      $('#pdTitle').textContent = '我这台手机';
      var meRows = persons.map(function (p) {
        var c = relOf(p.rel);
        return '<button class="person-card" data-pid="' + p.id + '">' +
          '<span class="avatar" style="background:linear-gradient(140deg,' + lighten(c.color, .2) + ',' + c.color + ')">' + esc(p.name.slice(0, 1)) + '</span>' +
          '<span class="pc-main"><b>' + esc(p.name) + '</b><small>' + c.name + ' · ' + esc(personBrief(p.id)) + '</small></span>' +
          '<span class="pc-arrow">' + svg('chev') + '</span></button>';
      }).join('');
      $('#pdBody').innerHTML = '<div class="pd-head"><span class="avatar big" style="background:linear-gradient(140deg,#4da3ff,#0a84ff)">我</span>' +
        '<div class="pd-main"><b>我这台手机</b><small>共 ' + items.length + ' 条记录 · ' + persons.length + ' 个人物</small></div></div>' +
        '<div class="pd-sec">我的人物</div>' +
        (persons.length ? '<div class="pd-list">' + meRows + '</div>' : '<div class="pd-empty">还没有人物。点「＋ 人物」把家人朋友加上来。</div>');
      return;
    }
    haptic(8);
    try { g.classList.add('pop'); setTimeout(function () { g.classList.remove('pop'); }, 380); } catch (e) { }
    pdPid = id;
    openPersonDetail(id);
  }

  function bindGraphGestures() {
    var box = $('#graphBox'), sv = $('#graph');
    if (!box || !sv) return;
    var mode = 0, sx = 0, sy = 0, ox = 0, oy = 0, startDist = 0, startS = 1;
    var moved = false, tst = 0, tsx = 0, tsy = 0, lastTap = 0;

    function unit() {
      var r = box.getBoundingClientRect();
      return 1000 / Math.max(1, Math.min(r.width, r.height));
    }
    sv.addEventListener('touchstart', function (e) {
      if (e.touches.length >= 2) {
        mode = 2;
        var t1 = e.touches[0], t2 = e.touches[1];
        startDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY) || 1;
        startS = gview.s;
      } else if (e.touches.length === 1) {
        mode = 1; sx = e.touches[0].clientX; sy = e.touches[0].clientY; ox = gview.x; oy = gview.y;
        moved = false; tst = Date.now(); tsx = sx; tsy = sy;
      }
    }, { passive: true });
    sv.addEventListener('touchmove', function (e) {
      if (mode === 2 && e.touches.length >= 2) {
        var t1 = e.touches[0], t2 = e.touches[1];
        var d = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        gview.s = Math.max(0.55, Math.min(2.6, startS * (d / startDist)));
        applyGView();
        if (e.cancelable) e.preventDefault();
      } else if (mode === 1 && e.touches.length === 1) {
        var t = e.touches[0];
        if (!moved && Math.hypot(t.clientX - tsx, t.clientY - tsy) > 14) moved = true;
        if (!moved) return;
        var k = unit();
        gview.x = ox + (t.clientX - sx) * k;
        gview.y = oy + (t.clientY - sy) * k;
        applyGView();
        if (e.cancelable) e.preventDefault();
      }
    }, { passive: false });
    function end() { mode = 0; }
    sv.addEventListener('touchend', function (e) {
      if (mode === 1 && !moved && Date.now() - tst < 700) {
        var t = (e.changedTouches && e.changedTouches[0]) || null;
        var node = null;
        if (t) {
          node = nearestNode(t.clientX, t.clientY);
          if (!node) {
            var el = document.elementFromPoint(t.clientX, t.clientY);
            node = el && el.closest ? el.closest('[data-node]') : null;
          }
        }
        if (node) {
          lastTap = Date.now();
          tapNode(node);
        }
      }
      end();
    });
    sv.addEventListener('touchcancel', function () { moved = true; end(); });
    box.addEventListener('wheel', function (e) {
      e.preventDefault();
      gview.s = Math.max(0.55, Math.min(2.6, gview.s * (e.deltaY > 0 ? 0.9 : 1.12)));
      applyGView();
    }, { passive: false });

    sv.addEventListener('click', function (e) {
      if (Date.now() - lastTap < 350) return;
      var g = (e.target && e.target.closest ? e.target.closest('[data-node]') : null) || nearestNode(e.clientX, e.clientY);
      tapNode(g);
    });
  }

  function openPerson(id) {
    editingPerson = id || null;
    personSel = {};
    var p = editingPerson ? persons.filter(function (x) { return x.id === editingPerson; })[0] : null;
    $('#personTitle').textContent = p ? '编辑人物' : '添加人物';
    if (p) items.forEach(function (i) { if (i.person === p.id) personSel[i.id] = true; });
    var body = $('#personBody');
    body.innerHTML =
      '<div class="person-name"><input id="pName" placeholder="名字，例如：妈妈 / 老王" value="' + esc(p ? p.name : '') + '" autocomplete="off"></div>' +
      '<div class="person-rel" id="pRel">' + RELS.map(function (r) {
        return '<button data-rel="' + r.id + '" class="' + ((p ? p.rel : 'family') === r.id ? 'active' : '') + '">' + r.name + '</button>';
      }).join('') + '</div>' +
      '<div class="person-links"><div class="pl-head">把相关记录挂到 TA 身上（可多选）</div><div id="pLinks"></div></div>';
    $$('#pRel button').forEach(function (b) {
      b.onclick = function () {
        $$('#pRel button').forEach(function (x) { x.classList.toggle('active', x === b); });
        haptic(6);
      };
    });
    renderPersonLinks();
    openSheet('person');
    setTimeout(function () { var i = $('#pName'); if (i) i.focus(); }, 300);
  }

  function renderPersonLinks() {
    var box = $('#pLinks');
    if (!box) return;
    var list = items.slice().sort(function (a, b) { return b.updated - a.updated; });
    if (!list.length) {
      box.innerHTML = '<div class="cfg-note" style="margin:0 0 0 2px">还没有记录。可以先添加人物，稍后再把记录挂上来。</div>';
      return;
    }
    box.innerHTML = list.map(function (it) {
      var c = cat(it.cat);
      var on = !!personSel[it.id];
      return '<button class="link-pick ' + (on ? 'on' : '') + '" data-iid="' + it.id + '">' +
        '<span class="icon" style="background:' + rgba(c.color, .24) + ';color:' + lighten(c.color, .3) + '">' + svg(c.icon) + '</span>' +
        '<span class="lp-main"><b>' + esc(it.title) + '</b><small>' + esc(c.name) + ' · ' + esc(sampleOf(it)) + '</small></span>' +
        '<span class="tick">' + svg('check') + '</span></button>';
    }).join('');
    $$('#pLinks .link-pick').forEach(function (b) {
      b.onclick = function () {
        var iid = b.dataset.iid;
        if (personSel[iid]) delete personSel[iid]; else personSel[iid] = true;
        b.classList.toggle('on', !!personSel[iid]);
        haptic(6);
      };
    });
  }

  function savePerson() {
    var nameEl = $('#pName');
    var name = (nameEl && nameEl.value || '').trim();
    if (!name) { toast('先给 TA 起个名字', false); haptic(30); return; }
    var b = $('#pRel button.active');
    var rel = b ? b.dataset.rel : 'other';
    var pid = editingPerson;
    if (pid) {
      var p = persons.filter(function (x) { return x.id === pid; })[0];
      if (!p) return;
      p.name = name; p.rel = rel; p.color = relOf(rel).color;
    } else {
      pid = uid();
      persons.push({ id: pid, name: name, rel: rel, color: relOf(rel).color, note: '' });
    }
    items.forEach(function (it) {
      if (personSel[it.id]) it.person = pid;
      else if (it.person === pid) it.person = null;
    });
    writePersons();
    persist();
    closeSheet();
    editingPerson = null;
    renderAll();
    renderRel();
    toast('已保存');
    haptic(12);
  }

  var pdPid = null;
  function openPersonDetail(pid) {
    var p = persons.filter(function (x) { return x.id === pid; })[0];
    if (!p) { toast('这个人物不在了', false); return; }
    pdPid = pid;
    var c = relOf(p.rel);
    var recs = items.filter(function (i) { return i.person === pid; }).sort(function (a, b) { return b.updated - a.updated; });
    $('#pdTitle').textContent = p.name;

    // 把 TA 名下所有非密码字段抽成胶囊，头一眼就能看到这个人的电话、账号、住址
    var chips = [];
    recs.forEach(function (it) {
      (it.fields || []).forEach(function (f) {
        var k = String(f.k || ''), v = String(f.v || '');
        if (!v || k.indexOf('密码') >= 0) return;
        if (chips.length < 8 && chips.indexOf(k + ' ' + v) < 0) chips.push(k + ' ' + v);
      });
    });

    var body = $('#pdBody');
    body.innerHTML =
      '<div class="pd-head">' +
        '<span class="avatar big" style="background:linear-gradient(140deg,' + lighten(c.color, .2) + ',' + c.color + ')">' + esc(p.name.slice(0, 1)) + '</span>' +
        '<div class="pd-main"><b>' + esc(p.name) + '</b>' +
          '<small>' + c.name + ' · ' + recs.length + ' 条关联记录' + (p.note ? ' · ' + esc(p.note) : '') + '</small></div>' +
        '<span class="pd-badge" style="color:' + lighten(c.color, .35) + ';background:' + rgba(c.color, .16) + '">' + c.name + '</span>' +
      '</div>' +
      '<div class="pd-rel" id="pdRel">' + RELS.map(function (r) {
        return '<button data-rel="' + r.id + '" class="' + (p.rel === r.id ? 'active' : '') + '">' + r.name + '</button>';
      }).join('') + '</div>' +
      (chips.length ? '<div class="pd-chips">' + chips.map(function (t) {
        return '<button class="pd-chip" data-copy="' + esc(t.slice(t.indexOf(' ') + 1)) + '">' + esc(t) + '</button>';
      }).join('') + '</div>' : '') +
      '<div class="pd-acts">' +
        '<button class="pd-btn" id="pdAddLink">' + svg('plus') + '编辑 / 挂载记录</button>' +
        '<button class="pd-btn ghost" id="pdDel">删除人物</button>' +
      '</div>' +
      '<div class="pd-sec">关联记录</div>' +
      (recs.length ? '<div class="pd-list" id="pdList">' + recs.map(function (it, i) { return rowHTML(it, '', i * 24); }).join('') + '</div>'
        : '<div class="pd-empty">还没有挂记录。点上面「编辑 / 挂载记录」，把 TA 的电话、账号、密码都归到一个人名下。</div>');

    $('#pdAddLink').onclick = function () { openPerson(pid); };
    $('#pdDel').onclick = function () { delPerson(pid); };
    $$('#pdBody .row').forEach(function (row) {
      row.onclick = function () { openDetail(row.dataset.id); };
    });
    $$('#pdRel button').forEach(function (b) {
      b.onclick = function () {
        var rel = b.dataset.rel;
        p.rel = rel;
        p.color = relOf(rel).color;
        writePersons();
        renderGraph();
        renderPersonList();
        openPersonDetail(pid);
        haptic(8);
        toast('已标记为「' + relOf(rel).name + '」');
      };
    });
    $$('#pdBody .pd-chip').forEach(function (b) {
      b.onclick = function () { copyText(b.dataset.copy); };
    });
    if (activeSheet === 'personDetail') { haptic(8); return; }
    openSheet('personDetail');
    haptic(8);
  }

  function delPerson(pid) {
    var p = persons.filter(function (x) { return x.id === pid; })[0];
    if (!p) return;
    confirmBox('删除人物「' + p.name + '」？', '记录本身不会被删除，只是解除与 TA 的关联。', '删除', true).then(function (ok) {
      if (!ok) return;
      persons = persons.filter(function (x) { return x.id !== pid; });
      items.forEach(function (i) { if (i.person === pid) i.person = null; });
      writePersons();
      persist();
      closeSheet();
      renderAll();
      renderRel();
      toast('已删除人物');
    });
  }

  /* ============================================================
     v1.1 · 震动触感
     ============================================================ */
  function renderHap() {
    var seg = $('#segHap');
    if (!seg) return;
    $$('button', seg).forEach(function (b) { b.classList.toggle('active', Number(b.dataset.hap) === settings.haptic); });
    var sub = $('#hapSub');
    if (sub) sub.textContent = ['关闭 · 点按不再震动', '轻微 · 一点点触感反馈', '中等 · 点按有轻微反馈', '强 · 明显震感'][settings.haptic] || '';
  }
  function setHap(v) {
    v = Math.max(0, Math.min(3, Number(v) || 0));
    settings.haptic = v;
    writeSettings();
    applyHaptics();
    renderHap();
    haptic(12);
  }

  /* ============================================================
     v1.1 · 图标
     ============================================================ */
  function applyIcon() {
    var src = settings.icon || 'img/cuncun.png';
    ['brandImg', 'iconPreview', 'iconPreview2'].forEach(function (id) {
      var el = $('#' + id);
      if (el) el.src = src;
    });
    $$('.lock .mark img').forEach(function (img) { img.src = src; });
  }
  function onIconFile(f) {
    if (!f) return;
    var fr = new FileReader();
    fr.onload = function () {
      var img = new Image();
      img.onload = function () {
        var max = 512;
        var s = Math.min(max / img.width, max / img.height, 1);
        var c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.width * s));
        c.height = Math.max(1, Math.round(img.height * s));
        var cx = c.getContext('2d');
        cx.drawImage(img, 0, 0, c.width, c.height);
        var url = c.toDataURL('image/jpeg', 0.86);
        if (url.length > 800000) { toast('这张图太大了，换一张小点的', false); return; }
        settings.icon = url;
        writeSettings();
        applyIcon();
        toast('图标已更换');
        haptic(14);
      };
      img.onerror = function () { toast('这张图读不出来', false); };
      img.src = String(fr.result);
    };
    fr.readAsDataURL(f);
  }

  /* ============================================================
     v1.1 · AI 助手（OpenAI 兼容接口）
     ============================================================ */
  var AI_SYS = '你是手机应用「存存」（纯本地保存账号密码的小工具）里的智能助手，负责把用户的一句话变成对应用的操作，或直接回答问题。' +
    '你只输出一个 JSON 对象，禁止解释、禁止 markdown、禁止代码块，格式：{"reply":"给用户看的中文","actions":[...]}。' +
    'actions 是数组，可以为空，可以有多项（按顺序执行）。只允许以下类型：' +
    '{"type":"haptic","value":0|1|2|3} 震动强度；' +
    '{"type":"secure","value":true|false} 隐私模式（禁止截屏）；' +
    '{"type":"lock","value":true|false} 应用锁；' +
    '{"type":"tab","value":"home|all|rel|me"} 切换页面（home首页 all全部记录 rel人物关系 me我的）；' +
    '{"type":"search","value":"关键词"} 搜索记录；' +
    '{"type":"openAI"} 打开助手面板；' +
    '{"type":"export"} 导出备份；' +
    '{"type":"newRecord","title":"平台或用途","cat":"account|phone|social|identity|household|bank|address|other","fields":[{"k":"账号","v":"..."},{"k":"密码","v":"..."}],"notes":"可选"} 新建记录；' +
    '{"type":"addPerson","name":"名字","rel":"family|friend|work|other"} 添加人物；' +
    '{"type":"none"}。' +
    '必须遵守：' +
    '1. 一句话里常有好几个要求，全部放进 actions，不要只做一件；' +
    '2. 用户给出账号/密码/邮箱/电话/卡号/网址等，一律用 newRecord，按原样写进 fields；字段名用「平台」「账号」「密码」「邮箱」「电话」「网址」「卡号」「姓名」「备注」；密码绝不改写、绝不省略大小写和符号；用户没给的值不要编造，也不要留空字段；' +
    '3. 出现人物和联系方式（如「我妈妈李阿姨电话13800138000」「老王的微信是…」）时，必须同时给 addPerson（name 是真实姓名，没有就写称呼如「妈妈」；rel 按关系判断）和 newRecord，应用会把记录挂到这个人名下——不要只存电话、丢掉人物；' +
    '4. 只是提问（例如「我有几张银行卡」「xx 的密码是多少」「怎么备份」）时，用 reply 直接回答，actions 用空数组；你可以使用对话下方给出的「已有记录清单」；' +
    '5. 如果用户说的东西应用做不到，reply 里说明，并在 actions 放 {"type":"none"}，不要假装已完成；' +
    '6. reply 不超过 40 个汉字，中文自然口语，不要复述指令或 JSON；' +
    '7. 只输出一个 JSON 对象，不要输出第二段文字。' +
    '参考（照着这个格式输出，不要输出这些例子本身）：' +
    '「我妈李阿姨电话13800138000」→{"reply":"李阿姨已加为家人，电话挂在 TA 名下","actions":[{"type":"addPerson","name":"李阿姨","rel":"family"},{"type":"newRecord","title":"李阿姨的电话","cat":"phone","fields":[{"k":"电话","v":"13800138000"}]}]}；' +
    '「招商银行卡 6225 8801 2345 6789 密码 abc123」→{"reply":"整理成一条银行卡记录","actions":[{"type":"newRecord","title":"招商银行","cat":"bank","fields":[{"k":"卡号","v":"6225880123456789"},{"k":"密码","v":"abc123"}]}]}；' +
    '「老王微信 laowang888 密码 Ww123456」→{"reply":"老王加了朋友，微信挂到 TA 名下","actions":[{"type":"addPerson","name":"老王","rel":"friend"},{"type":"newRecord","title":"老王的微信","cat":"social","fields":[{"k":"账号","v":"laowang888"},{"k":"密码","v":"Ww123456"}]}]}；' +
    '「我一共有几条记录」→{"reply":"你一共有 17 条记录","actions":[]}。';

  var aiMsgs = [];
  var httpSeq = 0, httpWait = {};

  window.__httpCb = function (id, code, text) {
    var cb = httpWait[id];
    if (!cb) return;
    delete httpWait[id];
    try { cb(code, text); } catch (e) { }
  };

  function httpReq(method, url, headers, body) {
    return new Promise(function (resolve, reject) {
      if (!(window.Native && Native.httpRequest)) { reject(new Error('当前环境不支持联网请求')); return; }
      var id = 'q' + (++httpSeq) + '_' + Date.now();
      var done = false;
      var timer = setTimeout(function () {
        if (done) return;
        done = true;
        delete httpWait[id];
        reject(new Error('请求超时，检查网络或接口地址'));
      }, 45000);
      httpWait[id] = function (code, text) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        resolve({ code: code, text: text || '' });
      };
      try {
        Native.httpRequest(id, method || 'POST', url, JSON.stringify(headers || {}), body || '');
      } catch (e) {
        done = true;
        clearTimeout(timer);
        delete httpWait[id];
        reject(e);
      }
    });
  }

  function aiReady() {
    return !!(settings.aiBase && settings.aiKey && settings.aiModel);
  }
  function aiCall(messages) {
    var base = String(settings.aiBase || '').trim().replace(/\/+$/, '');
    return httpReq('POST', base + '/chat/completions', {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + settings.aiKey
    }, JSON.stringify({ model: settings.aiModel, messages: messages, temperature: 0.3, max_tokens: 900 }))
      .then(function (r) {
        var j = null;
        try { j = JSON.parse(r.text); } catch (e) { }
        if (j && j.error) throw new Error(typeof j.error === 'string' ? j.error : (j.error.message || '接口报错'));
        if (!j) throw new Error(r.code >= 400 ? ('接口返回 ' + r.code) : '接口返回的不是 JSON');
        if (r.code >= 400) throw new Error('接口返回 ' + r.code);
        var c = j.choices && j.choices[0];
        var m = c ? (c.message ? c.message.content : (c.text || '')) : '';
        if (!m) throw new Error('接口没有返回内容');
        return String(m).trim();
      });
  }
  function cleanJSON(t) {
    t = String(t || '').trim();
    t = t.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    var i = t.indexOf('{'), j = t.lastIndexOf('}');
    if (i >= 0 && j > i) t = t.slice(i, j + 1);
    return t;
  }
  /* ---- 整段内容 → 结构化记录（AI 优先，本地兜底） ---- */
  var AI_EXTRACT_SYS = '你是「存存」里的整理助手。用户会贴一段杂乱文字，里面可能是好几个平台的账号、密码、邮箱、电话、验证码、网址。' +
    '请把它整理成 JSON，只输出 {"records":[{"title":"平台名","cat":"account|phone|social|identity|household|bank|address|other","fields":[{"k":"账号|密码|邮箱|电话|两步验证|网址|卡号|备注","v":"值"}],"notes":"可选"}]}。' +
    '规则：一个平台一条记录；同平台的多个账号/密码都写进 fields，字段名可以重复；密码原样保留大小写和符号，不要改写；看不清的字段名保持原文；绝不编造内容；不要输出 JSON 以外的任何文字。';

  function aiExtract(text) {
    return aiCall([{ role: 'system', content: AI_EXTRACT_SYS }, { role: 'user', content: String(text || '') }]).then(function (raw) {
      var obj = null;
      try { obj = JSON.parse(cleanJSON(raw)); } catch (e) { obj = null; }
      if (!obj) throw new Error('AI 返回的不是 JSON');
      var arr = obj.records || obj.items || (Array.isArray(obj) ? obj : []);
      var recs = arr.map(function (r) {
        var fields = (r.fields || []).map(function (f) {
          if (typeof f === 'string') return { k: '内容', v: String(f) };
          return { k: String(f.k || '内容'), v: String(f.v == null ? '' : f.v) };
        }).filter(function (f) { return f.v; });
        var title = String(r.title || r.name || '记录').trim() || '记录';
        return {
          title: title,
          cat: cat(r.cat || guessCat(title, fields)).id,
          fields: fields,
          notes: String(r.notes || '')
        };
      }).filter(function (r) { return r.fields.length; });
      if (!recs.length) throw new Error('AI 没认出内容');
      return recs;
    });
  }

  // AI 能用就交给 AI 整理（完全不管格式），不行就退回本地解析
  function bulkSmart(text, cb) {
    var local = parseBulk(text);
    if (!aiReady()) { cb(local, '本地'); return; }
    var settled = false;
    toast('AI 正在整理这段内容…');
    aiExtract(text).then(function (recs) {
      if (settled) return; settled = true;
      cb(recs, 'AI');
    }).catch(function () {
      if (settled) return; settled = true;
      cb(local, '本地');
    });
  }

  function scrollAI() {
    var sc = $('#sheetAI .ai-scroll');
    if (sc) sc.scrollTop = sc.scrollHeight;
  }
  function aiPush(who, text) {
    aiMsgs.push({ who: who, text: String(text || '') });
    var log = $('#aiLog');
    if (!log) return;
    var div = document.createElement('div');
    div.className = 'ai-msg ' + (who === 'me' ? 'me' : who === 'sys' ? 'sys' : 'bot');
    div.textContent = String(text || '');
    log.appendChild(div);
    var hero = $('#aiHero');
    if (hero && aiMsgs.length > 1) hero.classList.add('hide');
    scrollAI();
    return div;
  }
  function renderQuick() {
    var q = $('#aiQuick');
    if (!q) return;
    var chips = ['把震动调强', '关掉震动', '打开隐私模式', '导出备份', '看看关系网', '记一条银行卡'];
    q.innerHTML = chips.map(function (c) {
      return '<button data-say="' + esc(c) + '">' + esc(c) + '</button>';
    }).join('') + '<button class="ghost-chip" data-act="paste">整理一段账号</button>';
    $$('#aiQuick button').forEach(function (b) {
      b.onclick = function () {
        if (b.dataset.act === 'paste') {
          var inp = $('#aiInput');
          if (inp) { inp.focus(); inp.placeholder = '整段账号密码直接粘进来，不用排版'; }
          toast('把那一整段粘进来就行，不用排版', true);
          return;
        }
        aiRun(b.dataset.say);
      };
    });
  }
  function openAI() {
    renderQuick();
    if (!aiMsgs.length) {
      aiPush('bot', aiReady()
        ? '在的。说一句话就行，比如「把震动调强」「找一下我的银行卡」，也可以把一大段账号密码整段粘给我，我来分类存好。'
        : '还没配置 AI 接口，我暂时用内置指令帮你：把震动调强、打开隐私模式、记一条银行卡都行。整段账号密码贴进来我也能直接分类入库。配置入口在「我的 → AI 接口配置」。');
    }
    var hero = $('#aiHero');
    if (hero) hero.classList.toggle('hide', aiMsgs.length > 1);
    openSheet('ai');
    scrollAI();
  }

  var aiBusy = false;
  function aiRun(text) {
    var t = String(text || '').trim();
    if (!t) return;
    if (aiBusy) { toast('上一条还在处理，稍等一下', false); return; }
    aiPush('me', t);
    var inp = $('#aiInput');
    if (inp) { inp.value = ''; inp.style.height = ''; }

    // 一眼看出是整段账号密码：本地结构化，配置了 AI 就让 AI 再整理一遍（不限格式）
    if (looksBulk(t)) {
      aiBusy = true;
      bulkSmart(t, function (recs, src) {
        aiBusy = false;
        if (!recs || !recs.length) {
          aiPush('bot', '这段我没整理出来，可以补几行说明（平台名 / 账号 / 密码）再发一次。');
          return;
        }
        aiPush('bot', '看出 ' + recs.length + ' 条记录（' + src + '整理），确认一下就存进来。');
        haptic(10);
        closeSheet();
        setTimeout(function () { openBulkPreview(recs, src); }, 400);
      });
      return;
    }

    var think = aiPush('sys', '思考中…');
    haptic(8);
    aiBusy = true;

    function done() {
      aiBusy = false;
      if (think && think.parentNode) think.parentNode.removeChild(think);
    }

    if (!aiReady()) {
      var lf = localIntent(t);
      done();
      if (lf.acts.length) execActs(lf.acts, lf.reply, '本地指令');
      else aiPush('bot', lf.reply);
      return;
    }
    var msgs = [{ role: 'system', content: AI_SYS }];
    // 带上最近几轮对话，AI 才接得上「刚才那个」「再加一个」
    var hist = aiMsgs.filter(function (m) { return m.who !== 'sys'; }).slice(-7);
    if (hist.length && hist[hist.length - 1].who === 'me') hist.pop();
    hist.forEach(function (m) {
      msgs.push({ role: m.who === 'me' ? 'user' : 'assistant', content: String(m.text).replace(/\n（[^）]*）$/, '') });
    });
    msgs.push({ role: 'user', content: aiContext(t) });
    aiCall(msgs).then(function (raw) {
      done();
      var obj = parseAIAction(raw);
      if (!obj) {
        var lf2 = localIntent(t);
        if (lf2.acts.length) { execActs(lf2.acts, lf2.reply, '本地兜底'); return; }
        var plain = String(raw || '').replace(/```(?:json)?/gi, '').trim();
        aiPush('bot', plain.slice(0, 220) || '这句我没答上来，换个说法再试一次？');
        return;
      }
      execActs(obj.actions || [], obj.reply, 'AI');
    }).catch(function (err) {
      done();
      var lf3 = localIntent(t);
      if (lf3.acts.length) execActs(lf3.acts, lf3.reply + '（AI 暂时不可用，用本地指令完成）', '本地兜底');
      else aiPush('bot', 'AI 调用失败：' + (err.message || err) + '\n去「我的 → AI 接口配置」检查地址、模型和密钥。');
    });
  }

  // 给 AI 的现场信息：状态 + 已有记录清单（只给标题和字段名，不发密码内容）
  function aiContext(t) {
    var l = [];
    l.push('现在：震动=' + HAP_LEVELS[settings.haptic].n + '，隐私模式=' + (settings.secure ? '开' : '关') +
      '，应用锁=' + (settings.lock ? '开' : '关') + '，共 ' + items.length + ' 条记录、' + persons.length + ' 个人物。');
    if (items.length) {
      var rows = items.slice(0, 30).map(function (it) {
        var keys = (it.fields || []).map(function (f) { return f.k; }).filter(Boolean).slice(0, 4).join('/');
        var who = it.person ? (persons.filter(function (p) { return p.id === it.person; })[0] || {}).name : '';
        return it.title + '[' + cat(it.cat).name + (keys ? '·' + keys : '') + (who ? '·' + who : '') + ']';
      });
      l.push('已有记录：' + rows.join('；') + (items.length > 30 ? '…（还有更多）' : ''));
    } else l.push('已有记录：空');
    if (persons.length) l.push('人物：' + persons.map(function (p) { return p.name + '(' + relOf(p.rel).name + ')'; }).join('、'));
    l.push('用户这句话：' + String(t || ''));
    return l.join('\n');
  }

  // 从模型输出里尽量捞出一个 {reply, actions}；不行就退化成纯文字回答
  function parseAIAction(raw) {
    var txt = cleanJSON(raw);
    var obj = null;
    try { obj = JSON.parse(txt); } catch (e) { obj = null; }
    if (obj && typeof obj === 'object') {
      if (!obj.reply) obj.reply = obj.answer || obj.text || obj.message || '';
      if (!Array.isArray(obj.actions)) obj.actions = [];
      if (obj.reply || obj.actions.length) return obj;
    }
    var rm = String(raw || '').match(/"reply"\s*:\s*"((?:[^"\\]|\\.)*)"/);
    var am = String(raw || '').match(/"actions"\s*:\s*(\[[\s\S]*\])/);
    var acts2 = [];
    if (am) { try { acts2 = JSON.parse(am[1]); } catch (e) { acts2 = []; } }
    if (rm || acts2.length) {
      var rep = rm ? rm[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : '';
      return { reply: rep, actions: Array.isArray(acts2) ? acts2 : [] };
    }
    return null;
  }

  function execActs(acts, reply, tag) {
    acts = acts || [];
    var draft = acts.filter(function (a) { return a && a.type === 'newRecord'; });
    var personAct = acts.filter(function (a) { return a && a.type === 'addPerson' && a.name; })[0];

    // 人物 + 记录一起给：直接建人物，把记录挂上去，不再拆成两个表单
    if (personAct && draft.length) {
      var pid = ensurePerson(String(personAct.name), personAct.rel);
      var made = draft.map(function (a) {
        var fs = (a.fields || []).filter(function (f) { return f && f.v; }).map(function (f) {
          return { k: String(f.k || '内容'), v: String(f.v) };
        });
        if (!fs.length) return null;
        var title = String(a.title || fs[0].v || '记录').slice(0, 24);
        var now = Date.now();
        var it = {
          id: uid(), title: title, cat: cat(a.cat || guessCat(title, fs)).id, fields: fs,
          notes: String(a.notes || ''), photos: [], pinned: false, created: now, updated: now, person: pid
        };
        items.push(it);
        return it;
      }).filter(Boolean);
      if (made.length) {
        persist();
        renderAll();
        renderRel();
        var p = persons.filter(function (x) { return x.id === pid; })[0] || {};
        aiPush('bot', (reply || '存好了') + '\n（' + p.name + ' · ' + relOf(p.rel).name + '，已挂上 ' + made.length + ' 条）');
        toast('已存到 ' + p.name + ' 名下', true);
        haptic(12);
        return;
      }
    }

    // 单条记录且字段齐全：直接入库，不再弹表单让人点一次「保存」
    if (draft.length === 1) {
      var one = draft[0];
      var fs1 = (one.fields || []).filter(function (f) { return f && f.v; }).map(function (f) {
        return { k: String(f.k || '内容'), v: String(f.v) };
      });
      if (fs1.length) {
        var title1 = String(one.title || fs1[0].v || '记录').slice(0, 24);
        var now1 = Date.now();
        items.push({
          id: uid(), title: title1, cat: cat(one.cat || guessCat(title1, fs1)).id, fields: fs1,
          notes: String(one.notes || ''), photos: [], pinned: false, created: now1, updated: now1, person: null
        });
        persist();
        renderAll();
        renderRel();
        closeSheet();
        aiPush('bot', (reply || '存好了') + '\n（已存入「' + cat(items[items.length - 1].cat).name + '」）');
        toast('已存好 · ' + title1, true);
        haptic(12);
        return;
      }
    }

    // 多张新记录：一次性给预览，别一条条弹表单
    if (draft.length > 1) {
      var recs = draft.map(function (a) {
        var fs = (a.fields || []).filter(function (f) { return f && f.v; }).map(function (f) {
          return { k: String(f.k || '内容'), v: String(f.v) };
        });
        var title = String(a.title || '记录');
        return { title: title, cat: cat(a.cat || guessCat(title, fs)).id, fields: fs, notes: String(a.notes || '') };
      }).filter(function (r) { return r.fields.length; });
      if (recs.length) {
        acts = acts.filter(function (a) { return !(a && a.type === 'newRecord'); });
        acts.forEach(function (a) { try { execAct(a); } catch (e) { } });
        aiPush('bot', (reply || '整理好了') + '\n（共 ' + recs.length + ' 条，确认后保存）');
        haptic(10);
        closeSheet();
        setTimeout(function () { openBulkPreview(recs, 'AI'); }, 400);
        return;
      }
    }
    acts.forEach(function (a) { try { execAct(a); } catch (e) { } });
    var msg = reply || '好了';
    if (tag) msg += '\n（' + tag + '）';
    aiPush('bot', msg);
    haptic(10);
  }

  function execAct(a) {
    if (!a || !a.type) return;
    switch (a.type) {
      case 'haptic':
        setHap(Number(a.value) || 0);
        break;
      case 'secure':
        if (!!a.value !== !!settings.secure) toggleSecure();
        break;
      case 'lock':
        if (!!a.value !== !!settings.lock) toggleLock();
        break;
      case 'tab':
        goTab(a.value);
        closeSheet();
        break;
      case 'search':
        currentFilter = 'all';
        query = String(a.value || '');
        var q = $('#q');
        if (q) { q.value = query; $('#qClear').classList.add('on', !!query); }
        goTab('all');
        renderAllList();
        closeSheet();
        break;
      case 'openAI':
        openAI();
        break;
      case 'export':
        closeSheet();
        doExport();
        break;
      case 'newRecord':
        closeSheet();
        openEdit(null, {
          title: a.title || '', cat: a.cat || 'account',
          fields: (a.fields || []).filter(function (f) { return f && f.v; }).map(function (f) {
            return { k: String(f.k || '内容'), v: String(f.v) };
          }),
          notes: a.notes || ''
        });
        break;
      case 'addPerson':
        closeSheet();
        openPerson(null);
        (function () {
          var el = $('#pName');
          if (a.name && el) el.value = String(a.name).slice(0, 12);
          var relId = String(a.rel || 'other');
          $$('#pRel button').forEach(function (b) { b.classList.toggle('active', b.dataset.rel === relId); });
          if (el) setTimeout(function () { el.focus(); }, 260);
        })();
        break;
      default:
        break;
    }
  }

  /* ---- 本地指令（没配 AI 时也能用，尽量听懂人话） ---- */
  var FIELD_KEYS = ['银行卡号', '身份证号', '手机号码', '电话号码', '电话号', '手机号', '两步验证', '账号', '帐号', '用户名', '密码', '邮箱', '电话', '卡号', '网址', '链接', '验证码', '姓名', '昵称', '户号', '备注'];
  var REL_WORDS = [
    { re: /妈妈|老妈|我妈|母亲|妈/, rel: 'family', name: '妈妈' },
    { re: /爸爸|老爸|我爸|父亲|爸/, rel: 'family', name: '爸爸' },
    { re: /爷爷|奶奶|姥姥|姥爷/, rel: 'family', name: '' },
    { re: /老婆|老公|爱人|对象/, rel: 'family', name: '' },
    { re: /儿子|女儿/, rel: 'family', name: '' },
    { re: /姐姐|我姐|哥哥|我哥|妹妹|我妹|弟弟|我弟/, rel: 'family', name: '' },
    { re: /朋友|同学|室友|哥们|闺蜜/, rel: 'friend', name: '' },
    { re: /同事|领导|老板|客户/, rel: 'work', name: '' }
  ];
  var CAT_WORDS = [
    { id: 'bank', re: /银行卡|储蓄卡|信用卡|借记卡|卡号|开户行|银行/ },
    { id: 'identity', re: /身份证|证件|实名/ },
    { id: 'household', re: /户口|户籍/ },
    { id: 'phone', re: /手机号|电话号|运营商|流量|话费/ },
    { id: 'social', re: /微信|qq|QQ|微博|抖音|小红书|社交|推特|telegram|电报/i },
    { id: 'address', re: /地址|收货|住址/ },
    { id: 'account', re: /账号|帐号|密码|登录|app|网站|平台|会员/i }
  ];

  function detectPerson(s) {
    var relWord = '', rel = 'other';
    for (var i = 0; i < REL_WORDS.length; i++) {
      var m = s.match(REL_WORDS[i].re);
      if (m) { relWord = m[0]; rel = REL_WORDS[i].rel; break; }
    }
    if (!relWord) return null;
    var nm = s.match(new RegExp(relWord + '\\s*(?:叫|名字是|名字叫|是|：|:)?\\s*([\\u4e00-\\u9fa5]{2,4})(?=\\s*(?:电话|手机|号码|账号|密码|微信|QQ|qq|邮箱|地址|住|家|$|[，。,]))'));
    var name = nm ? nm[1] : '';
    if (name && /电话|手机|号码|账号|密码|微信|邮箱|地址/.test(name)) name = '';
    var def = REL_WORDS.filter(function (r) { return r.name && r.re.test(s); })[0];
    if (!name) name = relWord === '妈' ? '妈妈' : relWord === '爸' ? '爸爸' : (def ? def.name : '');
    return { name: name, rel: rel };
  }

  function looseFields(s) {
    var txt = String(s || '');
    var re = new RegExp('(' + FIELD_KEYS.join('|') + ')\\s*[:：=是为]?\\s*', 'g');
    var hits = [], m;
    while ((m = re.exec(txt)) !== null) {
      hits.push({ k: m[1], start: m.index, end: re.lastIndex });
      if (m[0].length === 0) re.lastIndex++;
    }
    var out = [];
    hits.forEach(function (h, i) {
      var tail = txt.slice(h.end, i + 1 < hits.length ? hits[i + 1].start : txt.length);
      var v = tail.split(/[，。；、,;|\n]/)[0].trim()
        .replace(/^["“”'‘’]+/, '').replace(/^[号码是为:：]+/, '')
        .replace(/["“”'‘’。，、]+$/, '').replace(/^(的|是)/, '').trim();
      if (!v || v.length < 2) return;
      if (/^(多少|是啥|什么|在哪|怎么|呢|吗|吧|的)$/.test(v)) return;
      if (FIELD_KEYS.indexOf(v) >= 0) return;
      var k = h.k === '帐号' ? '账号' : h.k;
      if (k === '手机号码' || k === '电话号码' || k === '电话号') k = '电话';
      if (k === '银行卡号') k = '卡号';
      out.push({ k: k, v: v });
    });
    return out;
  }

  function guessCatByText(s) {
    for (var i = 0; i < CAT_WORDS.length; i++) if (CAT_WORDS[i].re.test(s)) return CAT_WORDS[i].id;
    return 'account';
  }

  function pickTitle(s, catId) {
    var t = String(s || '').replace(/^.*?(记一条|记一下|存一条|新建|新增|添加一条|添加)\s*/, '');
    t = t.replace(/[，。；、,;|]/g, ' ').trim();
    var first = t.split(/\s+/)[0] || '';
    first = first.replace(/^(一个|一条|个|条|下|我的|我)/, '');
    if (first && first.length <= 12 && !/[:：]/.test(first) && FIELD_KEYS.indexOf(first) < 0) return first;
    var c = cat(catId);
    return c ? c.name : '新记录';
  }

  function localIntent(t) {
    var acts = [], say = [];
    var s = String(t || '');
    if (!s) return { acts: acts, reply: '' };
    var neg = /关|取消|不要|别|停止|不用/.test(s);

    if (/震动|振动|触感|马达|震感/.test(s)) {
      var hv = null;
      if (neg) hv = 0;
      else if (/强|最大|重点|用力|最高/.test(s)) hv = 3;
      else if (/轻|弱|小|柔|最低/.test(s)) hv = 1;
      else if (/中/.test(s)) hv = 2;
      if (hv !== null) { acts.push({ type: 'haptic', value: hv }); say.push('震动已设为' + HAP_LEVELS[hv].n); }
    }
    if (/隐私|截屏|录屏|防截|截图/.test(s)) {
      var onSecure = !neg;
      acts.push({ type: 'secure', value: onSecure });
      say.push(onSecure ? '隐私模式已开启' : '隐私模式已关闭');
    }
    if (/应用锁|上锁|解锁|锁定/.test(s) && !/震动/.test(s)) {
      var onLock = !neg;
      acts.push({ type: 'lock', value: onLock });
      say.push(onLock ? '应用锁已打开' : '应用锁已关闭');
    }
    if (/导出|备份/.test(s)) { acts.push({ type: 'export' }); say.push('正在导出备份'); }

    var isQ = /(多少|几号|几个|是什么|是啥|什么|哪儿|在哪|怎么|吗|？|\?)/.test(s) &&
      !/(记|存一条|存一下|添加|新建|保存|写入)/.test(s);
    var person = isQ ? null : detectPerson(s);
    var addPerson = !isQ && (!!person || /(加|添加|新增|新建|记).{0,4}(人物|人|家人|朋友|同事)/.test(s));
    var personName = '';
    if (addPerson) {
      var nm = s.match(/(?:叫|名字是|名字叫)\s*([^\s，。；、,;]{1,6})/);
      var rel = person ? person.rel : 'other';
      var nick = (s.match(/我妈|老妈|妈妈|老爸|我爸|爸爸|我姐|姐姐|我哥|哥哥|我妹|妹妹|我弟|弟弟|奶奶|爷爷|姥姥|姥爷|老婆|老公|女儿|儿子|室友/) || [''])[0];
      var NICK_NAME = { '我妈': '妈妈', '老妈': '妈妈', '妈妈': '妈妈', '老爸': '爸爸', '我爸': '爸爸', '爸爸': '爸爸', '我姐': '姐姐', '姐姐': '姐姐', '我哥': '哥哥', '哥哥': '哥哥', '我妹': '妹妹', '妹妹': '妹妹', '我弟': '弟弟', '弟弟': '弟弟', '室友': '室友' };
      personName = (person && person.name) || NICK_NAME[nick] || '';
      if (!personName && nm && !/人物|家人|朋友|同事|人/.test(nm[1])) personName = nm[1];
      if (!personName) {
        var g2 = s.match(/(?:给|帮|把)\s*([\u4e00-\u9fa5]{2,3})\s*(?:加|添加|新建|建|存|记)/);
        if (g2 && !/人物|家人|朋友|同事|个人/.test(g2[1])) personName = g2[1];
      }
      acts.push({ type: 'addPerson', name: personName, rel: rel });
    }

    var fields = looseFields(s);
    var newRec = !isQ && (/(记一条|记一下|存一条|存一下|新建一条|新建|新增|添加一条|保存一下|保存这条)/.test(s) ||
      (fields.length > 0 && /(记|存|添加|新建|保存|写入|是|叫)/.test(s)));
    if (fields.length && !isQ) newRec = true;
    if (newRec) {
      var cid = guessCatByText(s);
      var ttl = pickTitle(s, cid);
      ttl = ttl.replace(/^.*(加个人|加个|建个人|添加个人|加一下).*$/, '').trim();
      var badTitle = !ttl || ttl === cat(cid).name || ttl.length > 12;
      // 有人名时标题统一成「人名 + 的 + 分类」，避免出现「朋友王小明电话号」这种一句话标题
      if (personName && (ttl.indexOf(personName) !== 0 || badTitle)) ttl = personName + '的' + cat(cid).name;
      else if (personName && /(朋友|同事|家人|我的|我妈|我爸|我)/.test(ttl.slice(0, 2))) ttl = personName + '的' + cat(cid).name;
      acts.push({ type: 'newRecord', cat: cid, title: ttl || cat(cid).name, fields: fields });
    }
    if (person && fields.length && person.name) say.push('把「' + person.name + '」加进人物关系，并把这条挂到 TA 名下');
    else if (newRec && fields.length) say.push('已按你说的填好 ' + fields.length + ' 个字段，确认后保存');
    else if (addPerson) say.push(personName ? '已添加人物「' + personName + '」' : '已打开添加人物');
    else if (newRec) say.push('已打开新建记录');

    if (/关系网|人物关系|关系页/.test(s) && !addPerson) { acts.push({ type: 'tab', value: 'rel' }); say.push('已切到人物关系'); }
    else if (/设置页|设置|我的页|我的界面|打开我的|去我的/.test(s) && !/搜索|查找|找一下/.test(s)) { acts.push({ type: 'tab', value: 'me' }); say.push('已切到我的'); }
    else if (/首页|回到主页|回首页/.test(s)) { acts.push({ type: 'tab', value: 'home' }); say.push('已回到首页'); }
    else if (/全部|所有记录|记录列表|看看记录/.test(s) && !newRec) { acts.push({ type: 'tab', value: 'all' }); say.push('已切到全部记录'); }

    if (/搜索|查找|搜一下|查询|找一下|搜搜/.test(s)) {
      var qq = s.replace(/^.*?(搜索|查找|搜一下|查询|找一下|搜搜)/, '')
        .replace(/^(一下|下|我的|关于|关于我的)?/, '')
        .replace(/[，。！？""''\s的了吗呢]/g, '');
      if (qq) { acts.push({ type: 'search', value: qq }); say.push('搜索「' + qq + '」'); }
    }
    if (/打开|进入|叫出|唤醒/.test(s) && /助手|ai|AI/.test(s)) { acts.push({ type: 'openAI' }); say.push('助手已经在用啦'); }

    var reply = say.join('；');
    if (!acts.length) {
      var ans = localAnswer(s);
      if (ans) return { acts: [], reply: ans };
      reply = '这句我还没听懂。可以这样说：\n· 把震动调强 / 关掉震动\n· 打开隐私模式 / 打开应用锁\n· 记一条招商银行卡，卡号 6222…，密码 123456\n· 找一下我的银行卡\n· 给妈妈加个人物，挂上她的医保记录';
    }
    return { acts: acts, reply: reply };
  }

  // 没配 AI 时，也能回答「我有几张银行卡」这类问题
  function localAnswer(s) {
    if (/几个人物|几个人|人物有几/.test(s)) {
      if (!persons.length) return '还没添加人物。点「关系」页的「＋ 人物」就能加。';
      return '现在有 ' + persons.length + ' 个人物：' + persons.map(function (p) { return p.name; }).slice(0, 5).join('、') + '。';
    }
    if (/几条记录|多少条记录|总共.*记录|记录.*多少/.test(s)) {
      var cs = {};
      items.forEach(function (it) { var n = cat(it.cat).name; cs[n] = (cs[n] || 0) + 1; });
      return '一共 ' + items.length + ' 条记录：' + Object.keys(cs).map(function (k) { return k + ' ' + cs[k]; }).join('、') + '。';
    }
    // 「我妈妈电话是多少」「张均梅的微信号」——先按人物找，只显示非密码字段
    var who = detectPerson(s);
    if (!who) {
      var nmq = s.match(/([\u4e00-\u9fa5]{2,3})\s*(?:的)?\s*(?:电话|手机|号码|微信|qq|QQ|账号|邮箱|地址|卡号|银行卡|身份证|密码)/);
      if (nmq) who = { name: nmq[1], rel: 'other' };
    }
    if (who && who.name) {
      var p2 = persons.filter(function (p) {
        return p.name === who.name || p.name.indexOf(who.name) >= 0 || who.name.indexOf(p.name) >= 0;
      })[0];
      if (p2) {
        var recs = items.filter(function (it) { return it.person === p2.id; });
        if (recs.length) {
          var vals = [];
          recs.forEach(function (it) {
            (it.fields || []).forEach(function (f) {
              if (f && f.v && !/密码|验证码/.test(f.k || '')) vals.push(f.k + ' ' + f.v);
            });
          });
          return p2.name + ' 名下有 ' + recs.length + ' 条记录' +
            (vals.length ? '：' + vals.slice(0, 4).join('；') : '') + '。';
        }
        return p2.name + ' 名下还没有挂记录，点关系页里的人物可以补上。';
      }
      if (!/[^\u4e00-\u9fa5]/.test(who.name) && who.name.length >= 2) {
        return '人物里还没有「' + who.name + '」，在关系页点「＋ 人物」加一个，再把记录挂上去。';
      }
    }
    var cid = null;
    for (var i = 0; i < CAT_WORDS.length; i++) if (CAT_WORDS[i].re.test(s)) { cid = CAT_WORDS[i].id; break; }
    if (!cid) return '';
    var list = items.filter(function (it) { return it.cat === cid; });
    if (!list.length) return '「' + cat(cid).name + '」里还没有记录。';
    return '「' + cat(cid).name + '」有 ' + list.length + ' 条：' + list.slice(0, 6).map(function (it) { return it.title; }).join('、') + (list.length > 6 ? '…' : '') + '。';
  }

  /* ---- AI 配置 ---- */
  function shortBase(u) {
    u = String(u || '').replace(/^https?:\/\//i, '');
    return u.length > 26 ? u.slice(0, 26) + '…' : u;
  }
  function openAICfg() {
    $('#cfgBase').value = settings.aiBase || '';
    $('#cfgModel').value = settings.aiModel || '';
    $('#cfgKey').value = settings.aiKey || '';
    var st = $('#cfgState');
    st.textContent = aiReady() ? '已配置 · ' + shortBase(settings.aiBase) : '';
    st.className = 'cfg-state' + (aiReady() ? ' ok' : '');
    openSheet('aiCfg');
  }
  function saveAICfg() {
    var base = ($('#cfgBase').value || '').trim();
    var model = ($('#cfgModel').value || '').trim();
    var key = ($('#cfgKey').value || '').trim();
    if (!base || !model || !key) { toast('三项都填上才能用 AI', false); return; }
    if (!/^https?:\/\//i.test(base)) { toast('接口地址要以 http:// 或 https:// 开头', false); return; }
    settings.aiBase = base.replace(/\/+$/, '');
    settings.aiModel = model;
    settings.aiKey = key;
    writeSettings();
    renderMe();
    closeSheet();
    toast('已保存，密钥只存在本机');
    haptic(12);
  }
  function testAICfg() {
    var base = ($('#cfgBase').value || '').trim().replace(/\/+$/, '');
    var model = ($('#cfgModel').value || '').trim();
    var key = ($('#cfgKey').value || '').trim();
    var st = $('#cfgState');
    if (!base || !model || !key) { st.className = 'cfg-state bad'; st.textContent = '三项都要填'; return; }
    st.className = 'cfg-state'; st.textContent = '正在连接…';
    httpReq('POST', base + '/chat/completions', {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + key
    }, JSON.stringify({ model: model, messages: [{ role: 'user', content: '只回复：可用' }], max_tokens: 24 }))
      .then(function (r) {
        var j = null;
        try { j = JSON.parse(r.text); } catch (e) { }
        if (r.code >= 400) {
          st.className = 'cfg-state bad';
          st.textContent = '失败 ' + r.code + '：' + ((j && j.error && (j.error.message || j.error)) || '检查地址或密钥');
        } else if (!j || !j.choices) {
          st.className = 'cfg-state bad';
          st.textContent = '返回格式不对：' + String(r.text).slice(0, 50);
        } else {
          st.className = 'cfg-state ok';
          st.textContent = '连接正常 · ' + model;
        }
      })
      .catch(function (e) {
        st.className = 'cfg-state bad';
        st.textContent = '失败：' + (e.message || e);
      });
  }

  /* ============================================================
     v1.1 · 底部滑动切页
     ============================================================ */
  var swipeLock = false;
  function bindSwipe() {
    var main = $('#main');
    if (!main) return;
    var sx = 0, sy = 0, tracking = false;
    document.addEventListener('touchstart', function (e) {
      if (activeSheet) { tracking = false; return; }
      if (e.touches.length > 1) { tracking = false; return; }
      var tg = e.target;
      if (tg && tg.closest && tg.closest('#graphBox,.wallet,.ai-bar,textarea,input,.searchbar,.filters')) { tracking = false; return; }
      var t = e.touches[0];
      sx = t.clientX; sy = t.clientY; tracking = true; swipeLock = false;
      main.style.transition = 'none';
    }, { passive: true });
    document.addEventListener('touchmove', function (e) {
      if (!tracking || e.touches.length !== 1) return;
      var t = e.touches[0];
      var dx = t.clientX - sx, dy = t.clientY - sy;
      if (!swipeLock && Math.abs(dx) > 16 && Math.abs(dx) > Math.abs(dy) * 1.5) swipeLock = true;
      if (!swipeLock) return;
      if (e.cancelable) e.preventDefault();
      var damp = Math.max(-100, Math.min(100, dx * 0.32));
      main.style.transform = 'translate3d(' + damp + 'px,0,0)';
      main.style.opacity = String(1 - Math.abs(damp) / 260);
    }, { passive: false });
    function end(e) {
      if (!tracking) return;
      tracking = false;
      var t = (e.changedTouches && e.changedTouches[0]) || e;
      var dx = (t.clientX || sx) - sx;
      main.style.transition = 'transform .42s cubic-bezier(.22,1.16,.36,1), opacity .3s';
      main.style.transform = '';
      main.style.opacity = '';
      if (swipeLock && Math.abs(dx) > 62) {
        var idx = TABS.indexOf(currentTab);
        var next = idx + (dx < 0 ? 1 : -1);
        if (next >= 0 && next < TABS.length) goTab(TABS[next]);
      }
      swipeLock = false;
    }
    document.addEventListener('touchend', end, { passive: true });
    document.addEventListener('touchcancel', end, { passive: true });
  }

  /* ============================================================
     v1.2 · 首次启动欢迎页 / 内置数据 / 批量识别
     ============================================================ */
  function loadSeed() {
    try {
      if (localStorage.getItem('cc.seeded') === '1') return;
      var s = window.CUNCUN_SEED;
      if (s && s.items && s.items.length) {
        var now = Date.now();
        var keys = {};
        items.forEach(function (i) {
          keys[(i.title || '') + '|' + ((i.fields && i.fields[0] && i.fields[0].v) || '')] = 1;
        });
        var added = 0;
        s.items.forEach(function (r, i) {
          var k = (r.title || '') + '|' + ((r.fields && r.fields[0] && r.fields[0].v) || '');
          if (keys[k]) return;
          keys[k] = 1;
          added++;
          items.push({
            id: 'sd' + i + now.toString(36).slice(-4),
            title: r.title || '未命名记录',
            cat: cat(r.cat).id,
            fields: (r.fields || []).filter(function (f) { return f && f.k; }),
            notes: r.notes || '',
            photos: [], pinned: false, person: null,
            created: now - (s.items.length - i) * 45000,
            updated: now - (s.items.length - i) * 45000
          });
        });
        if (added) persist();
      }
      localStorage.setItem('cc.seeded', '1');
    } catch (e) { }
  }

  var wOn = false;
  function startGuide() {
    var w = $('#welcome');
    if (!w) return;
    var flag = '';
    try { flag = localStorage.getItem('cc.onboard') || ''; } catch (e) { }
    if (flag === '1') { if (w.parentNode) w.parentNode.removeChild(w); return; }

    var track = $('#wTrack'), dots = $$('#wDots i'), next = $('#wNext'), ag = $('#wAgree');
    if (!track || !dots.length || !next) { if (w.parentNode) w.parentNode.removeChild(w); return; }
    var last = dots.length - 1, idx = 0, agreed = false;
    wOn = true;
    document.body.style.overflow = 'hidden';

    function paint() {
      dots.forEach(function (d, i) { d.classList.toggle('on', i === idx); });
      var end = idx === last;
      next.textContent = end ? '同意并进入' : '下一步';
      next.disabled = end && !agreed;
    }
    function go(i) {
      idx = Math.max(0, Math.min(last, i));
      try { track.scrollTo({ left: idx * track.clientWidth, behavior: 'smooth' }); }
      catch (e) { track.scrollLeft = idx * track.clientWidth; }
      paint(); haptic(6);
    }
    var tick = 0;
    track.addEventListener('scroll', function () {
      clearTimeout(tick);
      tick = setTimeout(function () {
        var i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
        if (i !== idx) { idx = i; paint(); haptic(3); }
      }, 45);
    }, { passive: true });

    next.onclick = function () {
      if (idx < last) { go(idx + 1); return; }
      if (!agreed) { toast('请先勾选「我同意」', false); return; }
      try { localStorage.setItem('cc.onboard', '1'); } catch (e) { }
      w.classList.add('done');
      document.body.style.overflow = '';
      wOn = false;
      haptic(16);
      setTimeout(function () { if (w.parentNode) w.parentNode.removeChild(w); }, 660);
    };
    ag.onclick = function () {
      agreed = !agreed;
      ag.classList.toggle('on', agreed);
      paint(); haptic(9);
    };
    window.addEventListener('resize', function () {
      if (wOn) track.scrollLeft = idx * track.clientWidth;
    });
    paint();
  }

  /* ---- 批量识别 ---- */
  var BULK_KEYS = [
    [/^(账号|帐号|账户|用户名|用户|user|username|uid|id)$/i, '账号'],
    [/^(邮箱|电子邮箱|邮件|mail|email)$/i, '邮箱'],
    [/^(密码|密碼|口令|pass|pwd|password)$/i, '密码'],
    [/^(电话|手机|手机号|电话号码|tel|phone)$/i, '电话'],
    [/^(两步验证|二步验证|双因素|2fa|验证码|动态码|安全码)$/i, '两步验证'],
    [/^(网址|网站|链接|url|web|site)$/i, '网址'],
    [/^(身份证|身份证号|证件号|证件)$/i, '身份证号'],
    [/^(姓名|名字|name)$/i, '姓名'],
    [/^(卡号|银行卡|银行卡号)$/i, '卡号'],
    [/^(备注|说明|注释|note|remark)$/i, '备注']
  ];
  function bulkKey(k) {
    k = String(k || '').trim().replace(/[：:]+$/, '');
    for (var i = 0; i < BULK_KEYS.length; i++) if (BULK_KEYS[i][0].test(k)) return BULK_KEYS[i][1];
    return null;
  }
  function looksBulk(t) {
    var txt = String(t || '');
    var lines = txt.split('\n').filter(function (l) { return l.trim(); });
    if (lines.length < 3) return false;
    var hits = lines.filter(function (l) {
      return /^[^\s：:]{1,10}[：:]\s*\S/.test(l.trim()) || /^(账号|密码|邮箱|电话)/.test(l.trim());
    }).length;
    var marks = (txt.match(/密码|账号|帐号|账户|邮箱|电话|验证|平台/g) || []).length;
    return hits >= 2 || marks >= 3;
  }
  function guessCat(title, fields) {
    var t = String(title || '');
    var keys = fields.map(function (f) { return f.k; }).join(',');
    if (/银行|农商|招商|工商|建设银行|农业银行|信用卡|储蓄卡|借记卡/.test(t)) return 'bank';
    if (/户口|户籍/.test(t)) return 'household';
    if (/身份证|证件/.test(t)) return 'identity';
    if (/邮箱|mail|gmail|outlook/i.test(t)) return 'account';
    if (/推特|twitter|telegram|纸飞机|微信|wechat|抖音|微博|instagram|facebook|tiktok/i.test(t)) return 'social';
    if (/QQ|qq/i.test(t) && !/邮箱/.test(t)) return 'social';
    if (/身份证号/.test(keys)) return 'identity';
    if (/电话/.test(keys) && !/账号|密码|邮箱|网址/.test(keys)) return 'phone';
    return 'account';
  }
  function bulkKeyLoose(k) {
    k = String(k || '').trim().replace(/[：:＝=]+$/, '');
    var exact = bulkKey(k);
    if (exact) return exact;
    if (/两步|二步|双因素|谷歌验证|动态|安全码|验证码/.test(k)) return '两步验证';
    if (/用户名|用户名称|昵称|账户名/.test(k)) return '用户名';
    if (/账号|帐号|账户|帐戶/.test(k)) return '账号';
    if (/邮箱|邮件|e-?mail|gmail|mail/i.test(k)) return '邮箱';
    if (/密码|口令|pass|pwd/i.test(k)) return '密码';
    if (/电话|手机|号码|tel|phone/i.test(k)) return '电话';
    if (/卡号|账号卡/.test(k)) return '卡号';
    if (/网址|网站|链接|url|site/i.test(k)) return '网址';
    if (/备注|说明|注释|note/i.test(k)) return '备注';
    return null;
  }

  // 一行里塞了好几个「账号 x 密码 y」也能拆开
  function inlinePairs(ln) {
    var re = /(?:(?<=^)|(?<=\s)|(?<=[，,、;/|]))(账号|帐号|账户|用户名|邮箱|密码|口令|电话|手机号|手机|号码|卡号|网址|网站|两步验证|二步验证|验证码|备注)\s*[：:＝=]?\s*/g;
    var idx = [], m;
    while ((m = re.exec(ln)) !== null) {
      idx.push({ i: m.index, k: bulkKeyLoose(m[1]), s: re.lastIndex });
      if (re.lastIndex === m.index) re.lastIndex++;
    }
    if (idx.length < 2) return null;
    var prefix = ln.slice(0, idx[0].i).trim();
    var parts = [];
    for (var i = 0; i < idx.length; i++) {
      var end = i + 1 < idx.length ? idx[i + 1].i : ln.length;
      parts.push({ k: idx[i].k, v: ln.slice(idx[i].s, end).trim() });
    }
    return { prefix: prefix, parts: parts };
  }

  function parseBulk(text) {
    var raw = String(text || '').replace(/\r/g, '').replace(/[｜｜]/g, '|');
    var out = [], cur = null, lastTitle = '';
    var SEP = /^[-—－=_·*~]{3,}$/;
    var NAME_RE = /^(steam|qq邮箱|qq账号|qq|微软邮箱|outlook|gmail|google|谷歌|苹果|apple|推特|twitter|x|telegram|tg|纸飞机|电报|微信|wechat|支付宝|淘宝|天猫|抖音|tiktok|微博|小红书|bilibili|b站|学信网|航旅纵横|12306|矿好办|农商银行|工商银行|招商银行|建设银行|github|gta|discord|facebook|instagram|line|whatsapp|paypal|amazon|netflix|spotify|youtube|钉钉|飞书|zoom|notion|openai|chatgpt)/i;

    function newGroup(title) {
      cur = { title: String(title || '').trim(), fields: [], notes: [] };
      cur.phone = false;
      return cur;
    }
    function closeGroup() {
      if (!cur) return;
      if (cur.title || cur.fields.length || cur.notes.length) {
        if (cur.title) lastTitle = cur.title;
        out.push({ title: cur.title, fields: cur.fields, notes: cur.notes.join('\n') });
      }
      cur = null;
    }
    function push(k, v) {
      v = String(v == null ? '' : v).trim();
      if (!k || !v) return false;
      if (!cur) newGroup(lastTitle);
      cur.fields.push({ k: k, v: v });
      if (k === '电话') cur.phone = true;
      return true;
    }
    function hasKey(k) {
      return !!cur && cur.fields.some(function (f) { return f.k === k; });
    }
    function lastKey() {
      if (!cur || !cur.fields.length) return '';
      return cur.fields[cur.fields.length - 1].k;
    }
    function addToken(tok) {
      tok = String(tok || '').trim();
      if (!tok || tok === '/') return;
      if (/^(https?:\/\/|www\.)\S+$/i.test(tok)) return push('网址', tok);
      if (/[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(tok)) return push(hasKey('邮箱') ? '账号' : '邮箱', tok);
      if (/^[+(]/.test(tok) && /\d/.test(tok)) return push('电话', tok);
      if (/^\d{4,10}$/.test(tok)) {
        var lk = lastKey();
        if (/密码|两步验证/.test(lk)) return push('备注', tok);
        if (/邮箱|电话|账号/.test(lk) && !hasKey('两步验证')) return push('两步验证', tok);
        return push('备注', tok);
      }
      if (/^\d{7,}$/.test(tok)) return push(hasKey('账号') ? '电话' : '账号', tok);
      if (hasKey('邮箱') || hasKey('电话')) {
        if (!hasKey('密码')) return push('密码', tok);
        return push('备注', tok);
      }
      if (!hasKey('账号')) return push('账号', tok);
      if (!hasKey('密码')) return push('密码', tok);
      return push('备注', tok);
    }
    var KEYWORD_RE = /^(账号|帐号|账户|用户名|密码|口令|邮箱|电话|手机|手机号|号码|卡号|网址|网站|链接|两步验证|二步验证|验证码|备注)$/;
    function looksTitle(tok) {
      if (!tok) return false;
      if (KEYWORD_RE.test(tok)) return false;
      if (/[：:]/.test(tok)) return false;                       // 电话:+1… / 网址:https… 不是标题
      if (/^(电话|电话号|网址|账号|帐号|密码|邮箱|手机|卡号|用户名|验证码|备注)/.test(tok)) return false;
      if (!/[\u4e00-\u9fa5]/.test(tok) && !NAME_RE.test(tok)) return false;
      return true;
    }
    // 上一组只填了电话，接着又来一个电话 → 说明换了账号，另起一条
    function phoneBoundary() {
      if (!cur || !cur.phone) return false;
      return cur.fields.some(function (f) { return f.k !== '电话'; });
    }

    String(raw).split('\n').forEach(function (line) {
      var ln = line.trim();
      if (!ln) {
        if (cur && cur.fields.length) closeGroup();
        return;
      }
      if (SEP.test(ln)) { closeGroup(); return; }

      // 1) 一行里挤了好几个字段
      var ip = inlinePairs(ln);
      if (ip) {
        if (ip.prefix) {
          closeGroup();
          newGroup(ip.prefix);
        }
        ip.parts.forEach(function (p) {
          if (p.k === '电话' && phoneBoundary()) closeGroup();
          push(p.k, p.v);
        });
        return;
      }

      // 2) 「平台名 值 值」一行搞定（示例：某邮箱 demo@example.com Demo@1234）
      var tb = ln.replace(/\s*\/\s*/g, ' ').split(/\s+/).filter(Boolean);
      if (tb.length >= 2 && looksTitle(tb[0])) {
        closeGroup();
        newGroup(tb[0]);
        tb.slice(1).forEach(addToken);
        return;
      }

      // 3) 键：值
      var m = ln.match(/^(.{1,10}?)[：:＝=]\s*(.+)$/);
      var k = m ? bulkKeyLoose(m[1]) : null;
      if (k) {
        if (k === '电话' && phoneBoundary()) closeGroup();
        push(k, m[2]);
        return;
      }

      // 4) 键 + 空格 + 值
      m = ln.match(/^([^\s：:]{1,10})[ \t]+(\S.*)$/);
      k = m ? bulkKeyLoose(m[1]) : null;
      if (k) {
        if (k === '电话' && phoneBoundary()) closeGroup();
        var cols = m[2].split(/\s{2,}|\t+/).filter(Boolean);
        push(k, cols[0] || m[2]);
        cols.slice(1).forEach(function (c) { if (c.trim()) push(k, c.trim()); });
        return;
      }

      // 5) 键名紧贴值（示例：账号demo_user / 密码Demo@1234）
      var pre = ln.match(/^(两步验证|二步验证|用户名|账号|帐号|账户|邮箱|密码|电话|手机号|号码|网址|网站|卡号|验证码|备注)(.+)$/);
      if (pre) {
        var rest = pre[2].replace(/^[：:＝=、,，\s]+/, '').trim();
        k = bulkKeyLoose(pre[1]);
        if (k && rest && !/[\u4e00-\u9fa5]{2,}/.test(rest)) {
          if (k === '电话' && phoneBoundary()) closeGroup();
          push(k, rest);
          return;
        }
      }

      // 6) 单个值
      if (tb.length === 1) {
        var v = tb[0];
        if (/^(https?:\/\/|www\.)\S+$/i.test(v)) return push('网址', v);
        if (/[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v)) return push(hasKey('邮箱') ? '账号' : '邮箱', v);
        if (/^[+(]/.test(v) && /\d/.test(v)) {
          if (phoneBoundary()) closeGroup();
          return push('电话', v);
        }
        if (/^\d+$/.test(v)) {
          if (!cur) { closeGroup(); newGroup(v); return; }          // 纯数字平台名，比如 12306
          if (!cur.fields.length && !cur.notes.length) {
            if (cur.title && v.length >= 7 && !hasKey('账号')) return push('账号', v);
            closeGroup(); newGroup(v); return;
          }
          var lk2 = lastKey();
          if (/密码|两步验证/.test(lk2)) return push('备注', v);
          if (/邮箱|电话|账号/.test(lk2) && !hasKey('两步验证')) return push('两步验证', v);
          if (!hasKey('账号') && v.length >= 7) return push('账号', v);
          return push('备注', v);
        }
        if (cur && cur.fields.length === 1 && cur.fields[0].k === '账号' && !hasKey('密码')) return push('密码', v);
      }

      // 7) 两列 / 三列：账号 密码
      if (tb.length >= 2 && tb.length <= 3 && !/[\u4e00-\u9fa5]/.test(ln) && /^[\w.@+\-]{3,}$/.test(tb[0])) {
        push('账号', tb[0]);
        push('密码', tb[1]);
        if (tb[2]) push('备注', tb[2]);
        return;
      }

      // 8) 纯文字：标题或备注
      if (!cur || (!cur.fields.length && !cur.notes.length)) {
        if (!cur) newGroup(ln);
        else if (!cur.title) cur.title = ln;
        else cur.notes.push(ln);
        return;
      }
      if (ln.length > 16 || /[。！？；]$/.test(ln)) { cur.notes.push(ln); return; }
      closeGroup();
      newGroup(ln);
    });
    closeGroup();

    var counts = {};
    out.forEach(function (g) { var t = g.title || '记录'; counts[t] = (counts[t] || 0) + 1; });
    var seen = {};
    return out.map(function (g) {
      var base = String(g.title || '记录').replace(/^[·•\-—\s]+/, '').trim() || '记录';
      var tt = base;
      if (counts[g.title || '记录'] > 1) {
        seen[base] = (seen[base] || 0) + 1;
        tt = base + ' ' + seen[base];
      }
      var rec = {
        title: tt,
        cat: guessCat(tt, g.fields),
        fields: g.fields,
        notes: g.notes
      };
      if (!rec.fields.length && rec.notes) {
        rec.fields.push({ k: '内容', v: rec.notes });
        rec.notes = '';
      }
      return rec;
    }).filter(function (r) { return r.fields.length; });
  }

  function openBulkPreview(recs, src) {
    var list = recs.map(function (r) {
      var c = cat(r.cat);
      return '<div class="bulk-item">' +
        '<div class="bi-h">' + iconHTML(r) + '<b>' + esc(r.title) + '</b><span class="bi-c" style="color:' + c.color + '">' + esc(c.name) + '</span></div>' +
        r.fields.map(function (f) {
          var v = String(f.v || '');
          if (v.length > 28) v = v.slice(0, 28) + '…';
          return '<div class="bi-f"><i>' + esc(f.k) + '</i><span>' + esc(v) + '</span></div>';
        }).join('') + '</div>';
    }).join('');
    dialog({
      title: '识别到 ' + recs.length + ' 条',
      desc: '<div class="bulk-src">' + (src === 'AI' ? '由 AI 整理，格式不限' : '本地识别') + '</div><div class="bulk-list">' + list + '</div>',
      actions: [{ label: '取消', value: false }, { label: '全部保存', value: true, cls: 'primary' }]
    }).then(function (r) { if (r.value === true) saveBulk(recs); });
  }
  function saveBulk(recs) {
    var now = Date.now();
    recs.forEach(function (r, i) {
      items.push({
        id: 'bk' + i + now.toString(36).slice(-5),
        title: r.title || '未命名记录',
        cat: cat(r.cat).id,
        fields: r.fields || [],
        notes: r.notes || '',
        photos: [], pinned: false, person: null,
        created: now + i, updated: now + i
      });
    });
    persist();
    renderAll();
    renderRel();
    toast('已保存 ' + recs.length + ' 条', true);
    haptic(14);
    goTab('all');
  }

  /* 原生注入 */
  window.__parseBulk = parseBulk;
  window.__localIntent = localIntent;
  window.__looseFields = looseFields;
  window.__parseAIAction = parseAIAction;
  window.__iconHTML = iconHTML;
  window.__execActs = execActs;
  window.__dbg = function () {
    return {
      persons: persons.map(function (p) { return { n: p.name, r: p.rel }; }),
      items: items.map(function (i) { return { t: i.title, p: i.person, f: i.fields }; })
    };
  };
  var nativeKb = 0, vh0 = 0;
  function kbGap() {
    var vv = window.visualViewport;
    if (!vv) return 0;
    return Math.max(0, Math.round(window.innerHeight - vv.height - (vv.offsetTop || 0)));
  }
  function syncKb() {
    var raw = Math.max(nativeKb, kbGap());
    // 窗口本身被键盘压缩（adjustResize）时，innerHeight 会变小，而 ime inset 依然按全屏算，
    // 两者叠加会把面板推到屏幕中间，看起来就是「页面串了」。这里按压缩量把重复的部分扣掉。
    var shrink = vh0 ? Math.max(0, vh0 - Math.round(window.innerHeight)) : 0;
    var gap = raw;
    if (raw > 0 && shrink > 0) gap = Math.max(0, raw - shrink);
    gap = Math.min(gap, Math.round(window.innerHeight * .62));
    document.documentElement.style.setProperty('--kb', gap + 'px');
    if (gap === 0) vh0 = Math.round(window.innerHeight);
    return gap;
  }
  window.__insets = function (top, bottom, ime) {
    nativeKb = ime || 0;
    document.documentElement.style.setProperty('--safe-top', top + 'px');
    document.documentElement.style.setProperty('--safe-bottom', bottom + 'px');
    syncKb();
  };
  vh0 = Math.round(window.innerHeight);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', syncKb);
    window.visualViewport.addEventListener('scroll', syncKb);
  }
  window.addEventListener('resize', syncKb);
  ['focusin', 'focusout'].forEach(function (ev) {
    document.addEventListener(ev, function () {
      setTimeout(syncKb, 60);
      setTimeout(syncKb, 320);
    }, true);
  });
  window.__back = function () {
    if ($('#viewer').classList.contains('show')) { $('#viewer').classList.remove('show'); return true; }
    if ($('#dialogLayer').classList.contains('show')) {
      $('#dialogLayer').classList.remove('show');
      return true;
    }
    if (activeSheet) { closeSheet(); editing = null; return true; }
    if (currentTab !== 'home') { goTab('home'); return true; }
    return false;
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
