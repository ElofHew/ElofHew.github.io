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
// 3. 底部浮动导航栏（含滚动隐藏）
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
