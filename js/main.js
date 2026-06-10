/**
 * main.js - 主页核心功能模块
 * 整合: 时间/日期、公告、一言、搜索、倒计时、赞助列表、URL参数展开
 */

// ============================================
// 1. 公告栏（顶部警告 + 滚动公告）
// ============================================
(function initHead() {
    var warnEl = document.getElementById("warn-top");
    if (warnEl) {
        warnEl.innerHTML = '<p>即日起，个人网站域名调整为：www.danevan.top</p>';
    }
    var headEl = document.getElementById("head-top");
    if (headEl) {
        headEl.innerHTML = '<p>哎呦我，不是这2026怎么都过去一大半了，亦无颜。</p>';
    }
})();

// ============================================
// 2. 实时时钟
// ============================================
(function initClock() {
    function updateTime() {
        var now = new Date();
        var h = String(now.getHours()).padStart(2, '0');
        var m = String(now.getMinutes()).padStart(2, '0');
        var s = String(now.getSeconds()).padStart(2, '0');
        var el = document.getElementById('time');
        if (el) el.innerText = '当前时间：' + h + ':' + m + ':' + s;
    }
    setInterval(updateTime, 1000);
    updateTime();
})();

// ============================================
// 3. 日期显示
// ============================================
(function initDate() {
    var el = document.getElementById('date');
    if (el) {
        var now = new Date();
        el.innerText = '今天是：' + now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日';
    }
})();

// ============================================
// 4. 一言（Hitokoto）
// ============================================
(function initHitokoto() {
    fetch('https://v1.hitokoto.cn')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            var el = document.querySelector('#hitokoto_text');
            if (el) {
                el.href = 'https://hitokoto.cn/?uuid=' + data.uuid;
                el.innerText = data.hitokoto;
            }
        })
        .catch(function (err) { console.error('一言加载失败:', err); });
})();

// ============================================
// 5. 必应搜索
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
// 6. 新年倒计时
// ============================================
(function initCountdown() {
    var target = new Date("July 9, 2026 00:00:00").getTime();
    var el = document.getElementById("countdown-text");
    if (!el) return;

    function update() {
        var now = new Date().getTime();
        var dist = target - now;

        if (dist < 0) {
            el.innerHTML = '<b style="color: orangered; text-align: center;">放暑假了爽死我了😍</b>';
            return;
        }

        var days = Math.floor(dist / (1000 * 60 * 60 * 24));
        var hours = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var mins = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
        var secs = Math.floor((dist % (1000 * 60)) / 1000);

        el.innerHTML = '距离主播放暑假还有：<br /><span style="color: tan;">' +
            days + '天 ' + hours + '小时 ' + mins + '分钟 ' + secs + '秒</span>';
    }

    setInterval(update, 1000);
    update();
})();

// ============================================
// 7. 赞助列表
// ============================================
(function initDonate() {
    var el = document.getElementById("donate-list");
    if (el) {
        el.innerHTML =
            '<table class="cn-table">' +
            '<caption><b>赞助列表</b></caption>' +
            '<tbody>' +
            '<tr><td><b>赞助人</b></td><td><b>时间</b></td><td><b>金额</b></td></tr>' +
            '<tr><td>lu</td><td>25-02-01</td><td>￥3.09</td></tr>' +
            '<tr><td>graphic</td><td>25-02-01</td><td>￥1.63</td></tr>' +
            '<tr><td>lu</td><td>25-01至25-05</td><td>总共16个月QQ超级会员</td></tr>' +
            '</tbody></table>';
    }
})();

// ============================================
// 8. URL参数展开（?expand=divId）
// ============================================
(function initExpand() {
    var params = new URLSearchParams(window.location.search);
    var targetId = params.get('expand');
    if (targetId) {
        var div = document.getElementById(targetId);
        if (div) {
            div.querySelectorAll('details').forEach(function (d) { d.open = true; });
        }
    }
})();
