/**
 * functions.js - 功能实现模块
 * 必应搜索、网易云音乐加载、底部浮动导航栏
 */

// ============================================
// 1. 必应搜索
// ============================================
(function initSearch() {
    window.search = function () {
        var input = document.querySelector('.search-input');
        if (input && input.value) {
            window.open('https://www.bing.com/search?q=' + encodeURIComponent(input.value), '_blank');
        }
    };
    var inputEl = document.getElementById('searchInput');
    if (inputEl) {
        inputEl.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') window.search();
        });
    }
})();

// ============================================
// 2. 网易云音乐加载
// ============================================
(function initMusic() {
    var container = document.getElementById('music-tiles');
    if (!container) return;

    fetch('info/music.json')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            container.innerHTML = '';   // 清掉占位提示
            var keys = Object.keys(data);

            keys.forEach(function (key, idx) {
                var item = data[key];
                if (!item || !item['data-id']) return;

                var div = document.createElement('div');
                div.className = 'music-divs';

                var p = document.createElement('p');
                p.innerHTML = '<b>' + item.song + '</b><br />' + item.singer;
                div.appendChild(p);

                var btn = document.createElement('button');
                btn.className = 'load-music';
                btn.setAttribute('data-id', item['data-id']);
                btn.textContent = '播放音乐';
                div.appendChild(btn);

                var iframeContainer = document.createElement('div');
                iframeContainer.className = 'iframe-container';
                iframeContainer.id = 'load-iframe_' + (idx + 1);
                div.appendChild(iframeContainer);

                container.appendChild(div);

                // 点击按钮，插入网易云播放器 iframe
                btn.addEventListener('click', function () {
                    var musicId = this.getAttribute('data-id');
                    var iframe = document.createElement('iframe');
                    iframe.frameBorder = "no";
                    iframe.border = "0";
                    iframe.marginWidth = "0";
                    iframe.marginHeight = "0";
                    iframe.width = "320";
                    iframe.height = "86";
                    iframe.src = 'https://music.163.com/outchain/player?type=2&id=' + musicId + '&auto=0&height=66';

                    this.remove();
                    iframeContainer.appendChild(iframe);
                });
            });
        })
        .catch(function (err) { console.error('音乐列表加载失败:', err); });
})();

// ============================================
// 3. 友情链接列表（从 info/friend.json 生成）
// ============================================
(function initFriendList() {
    var container = document.getElementById('frdlnk-container');
    if (!container) return;

    fetch('info/friend.json')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            container.innerHTML = '';   // 清掉占位提示

            var categoryLabel = { 'website': '个人网站', 'bilibili': '哔哩哔哩' };

            Object.keys(data).forEach(function (key) {
                var item = data[key];
                if (!item || !item.name) return;

                var div = document.createElement('div');
                div.className = 'frdlnkdivs';

                var dt = document.createElement('dt');
                dt.className = 'fldt';

                var img = document.createElement('img');
                img.src = 'https://q1.qlogo.cn/g?b=qq&nk=' + item.qqid + '&s=640';
                img.alt = 'QQ头像';
                img.className = 'qqava';
                dt.appendChild(img);

                var a = document.createElement('a');
                a.href = item.link;
                a.target = '_blank';
                a.textContent = item.name;
                dt.appendChild(a);

                var dd = document.createElement('dd');
                dd.className = 'fldd';

                var label = categoryLabel[item.category] || '其他';
                var p = document.createElement('p');
                p.textContent = '（' + label + '）';
                dd.appendChild(p);
                dd.appendChild(document.createTextNode(item.description || ''));

                div.appendChild(dt);
                div.appendChild(dd);
                container.appendChild(div);
            });
        })
        .catch(function (err) { console.error('友链加载失败:', err); });
})();

// ============================================
// 4. 底部浮动导航栏（含滚动隐藏）
// ============================================
(function initFooter() {
    fetch('info/info.json')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            // 底部 dock 按钮列表从 info.json 的 bottom-button 读取
            var btn = data['bottom-button'] || {};
            var links = Object.keys(btn).map(function (key) { return btn[key]; });

            var html = '<div class="footer" id="footer">';
            links.forEach(function (item) {
                if (item && item.link && item.icon) {
                    var target = item.target ? ' target="' + item.target + '"' : '';
                    html += '<a href="' + item.link + '"' + target + '><img src="' + item.icon + '" /></a>';
                }
            });
            html += '</div>';

            var container = document.getElementById("footer-prt");
            if (container) container.innerHTML = html;

            // 滚动隐藏（footer 已渲染，直接绑定即可）
            var footer = document.getElementById("footer");
            if (!footer) return;
            var lastScrollTop = 0;
            window.addEventListener("scroll", function () {
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                if (scrollTop > lastScrollTop) {
                    footer.style.bottom = "-65px";
                } else {
                    footer.style.bottom = "5px";
                }

                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            }, false);
        })
        .catch(function (err) { console.error('底部导航栏加载失败:', err); });
})();

// ============================================
// 5. 主站信息（联系方式 / 开源项目）从 info/main.json 生成
// ============================================
(function initMainInfo() {
    var contactsEl = document.getElementById('contacts-list');
    var osEl = document.getElementById('opensource-list');
    if (!contactsEl && !osEl) return;

    fetch('info/main.json')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            // 联系方式
            if (contactsEl && data.contacts) {
                contactsEl.innerHTML = '';
                Object.keys(data.contacts).forEach(function (key) {
                    var c = data.contacts[key];
                    if (!c || !c.link) return;

                    var li = document.createElement('li');
                    var img = document.createElement('img');
                    img.src = c.icon;
                    img.alt = c.name;
                    img.className = 'contact-icon';
                    li.appendChild(img);
                    li.appendChild(document.createTextNode(' ' + c.name + '：'));

                    var a = document.createElement('a');
                    a.href = c.link;
                    a.target = '_blank';
                    a.textContent = c.text || c.name;
                    li.appendChild(a);

                    contactsEl.appendChild(li);
                });
            }

            // 开源项目（语言图标：icons/language/<languages>.svg）
            if (osEl && data.opensource) {
                osEl.innerHTML = '';
                Object.keys(data.opensource).forEach(function (key) {
                    var o = data.opensource[key];
                    if (!o || !o.repo) return;

                    var li = document.createElement('li');
                    var img = document.createElement('img');
                    img.src = 'icons/language/' + o.languages + '.svg';
                    img.alt = o.languages;
                    img.className = 'lang-icon';
                    li.appendChild(img);
                    li.appendChild(document.createTextNode(' '));

                    var a = document.createElement('a');
                    a.href = o.repo;
                    a.target = '_blank';
                    a.textContent = o.name;
                    li.appendChild(a);

                    li.appendChild(document.createElement('br'));
                    li.appendChild(document.createTextNode(o.description || ''));

                    osEl.appendChild(li);
                });
            }
        })
        .catch(function (err) { console.error('主站信息加载失败:', err); });
})();
