/**
 * info.js - 实时信息获取模块
 * 公告栏、实时时钟、日期、一言、倒计时、赞助列表、URL 参数展开
 */

// ============================================
// 1. 站点信息（公告/标语/倒计时）从 info/info.json 加载
// ============================================
(function initSiteInfo() {
    fetch('info/info.json')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            var warnEl = document.getElementById("warn-top");
            if (warnEl && data['warn-top']) {
                warnEl.innerHTML = '<p>' + data['warn-top'] + '</p>';
            }

            var headEl = document.getElementById("head-top");
            if (headEl && data['head-top']) {
                headEl.innerHTML = '<p>' + data['head-top'] + '</p>';
            }

            var homeEl = document.getElementById("home-info");
            if (homeEl && data['home-info']) {
                homeEl.innerHTML = data['home-info'];
            }

            // 其它页面顶部滚动公告（other-top），id 形如 scroll-download / scroll-donate ...
            var others = data['other-top'] || {};
            Object.keys(others).forEach(function (key) {
                var oEl = document.getElementById('scroll-' + key);
                if (oEl && others[key]) {
                    oEl.innerHTML = others[key];
                }
            });

            // 倒计时配置到位后再初始化
            if (data.countdown) {
                initCountdown(data.countdown);
            }
        })
        .catch(function (err) { console.error('站点信息加载失败:', err); });
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
// 5. 倒计时（配置由 initSiteInfo 从 info.json 传入）
// ============================================
function initCountdown(cfg) {
    var el = document.getElementById("countdown-text");
    if (!el || !cfg || !cfg.targetDate) return;

    var d = cfg.targetDate;

    // 尝试从 timezone 解析 UTC 偏移（如 "UTC+8"），使不同时区访客看到一致的倒计时
    function parseUtcOffset(tz) {
        if (!tz) return null;
        if (Object.prototype.toString.call(tz) === '[object Array]') {
            for (var i = 0; i < tz.length; i++) {
                var m = String(tz[i]).match(/UTC([+-]\d{1,2})(?::(\d{2}))?/i);
                if (m) {
                    var h = parseInt(m[1], 10);
                    var min = m[2] ? parseInt(m[2], 10) : 0;
                    return h * 60 + (h >= 0 ? min : -min); // 分钟
                }
            }
        }
        return null;
    }

    var offsetMin = parseUtcOffset(cfg.timezone);
    var target;
    if (offsetMin !== null) {
        // 目标时间按指定时区的“墙上时间”换算为 UTC 时间戳
        target = Date.UTC(d.year, d.month - 1, d.day, d.hour || 0, d.minute || 0, d.second || 0) - offsetMin * 60000;
    } else {
        // 未提供时区信息：按访客本地时间解释
        target = new Date(d.year, d.month - 1, d.day, d.hour || 0, d.minute || 0, d.second || 0).getTime();
    }
    var tip = cfg.targetTip || '距离目标时间还有';
    var successTip = cfg.successTip || '倒计时已完成';

    function update() {
        var now = new Date().getTime();
        var dist = target - now;

        if (dist < 0) {
            el.innerHTML = '<b style="color: orangered; text-align: center;">' + successTip + '</b>';
            return;
        }

        var days = Math.floor(dist / (1000 * 60 * 60 * 24));
        var hours = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var mins = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
        var secs = Math.floor((dist % (1000 * 60)) / 1000);

        el.innerHTML = tip + '：<br /><span style="color: tan;">' +
            days + '天 ' + hours + '小时 ' + mins + '分钟 ' + secs + '秒</span>';
    }

    setInterval(update, 1000);
    update();
}

// ============================================
// 6. 赞助列表
// ============================================
(function initDonate() {
    var el = document.getElementById("donate-list");
    if (!el) return;

    // 类别翻译：donate=赞助，charge=充电，other 及其他未知值=其他
    var categoryMap = { 'donate': '赞助', 'charge': '充电' };

    fetch('info/donate.json')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            // 依键序（0001、0002...）顺序输出
            var rows = Object.keys(data).map(function (key) { return data[key]; });

            // 直接收益总计：仅统计 donate 和 charge 类别的数值型 value
            var total = 0;
            rows.forEach(function (item) {
                if (item.category === 'donate' || item.category === 'charge') {
                    var v = parseFloat(item.value);
                    if (!isNaN(v)) total += v;
                }
            });
            var totalEl = document.getElementById('donate-total');
            if (totalEl) {
                totalEl.innerHTML = '<p><b>直接收益总计：￥' + total.toFixed(2) + '</b></p>';
            }

            var html = '<table class="cn-table">' +
                '<caption><b>赞助列表</b></caption>' +
                '<thead><tr>' +
                '<th class="col-name">赞助人</th>' +
                '<th class="col-uid">UID</th>' +
                '<th class="col-date">时间</th>' +
                '<th class="col-cat">类别</th>' +
                '<th class="col-value">金额</th>' +
                '<th class="col-note">备注</th>' +
                '</tr></thead><tbody>';

            rows.forEach(function (item) {
                var category = categoryMap[item.category] || '其他';
                // 仅 charge 类别显示 UID，其余留空
                var uid = (item.category === 'charge') ? (item.uid || '') : '';

                html += '<tr>' +
                    '<td class="col-name">' + (item.name || '') + '</td>' +
                    '<td class="col-uid">' + uid + '</td>' +
                    '<td class="col-date">' + (item.date || '') + '</td>' +
                    '<td class="col-cat">' + category + '</td>' +
                    '<td class="col-value">' + (item.value || '') + '</td>' +
                    '<td class="col-note">' + (item.note || '') + '</td>' +
                    '</tr>';
            });

            html += '</tbody></table>';
            el.innerHTML = html;
        })
        .catch(function (err) {
            el.innerHTML = '<p>赞助列表加载失败。</p>';
            console.error('赞助列表加载失败:', err);
        });
})();

// ============================================
// 7. Vercount 浏览量千分位格式化
// ============================================
(function initVercountFmt() {
    var el = document.getElementById('vercount_value_site_pv');
    if (!el) return;
    function fmt() {
        var n = el.textContent.trim();
        if (n.indexOf(',') !== -1) return;   // 已带千分位，直接跳过，防止死循环
        if (!/^\d+$/.test(n)) return;        // 非纯数字（如 Loading...），跳过
        var formatted = Number(n).toLocaleString('en-US');
        if (formatted !== el.textContent) el.textContent = formatted;
    }
    new MutationObserver(fmt).observe(el, { childList: true, characterData: true, subtree: true });
    fmt();
})();

// ============================================
// 8. URL 参数展开（?expand=divId）
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
