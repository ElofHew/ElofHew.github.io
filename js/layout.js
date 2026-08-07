/**
 * layout.js - 磁贴瀑布流布局模块
 * PC 端各列独立堆叠、不锁死行高（砖墙效果），磁贴位置平滑过渡。
 * 手机端（<900px）自动恢复为普通流式布局，与 style.css 断点保持一致。
 * 通过 window.masonryLayout 暴露，供 animation.js 的 details 动画结束后重排。
 */
(function () {
    'use strict';

    var DESKTOP_MIN = 900;   // 与 style.css 媒体查询断点一致
    var TILE_W = 380;        // 磁贴宽度，与 style.css 一致
    var GAP = 18;            // 间距，与 style.css 一致

    // 首次布局不带动画，避免初始位置跳变；后续布局带动画平滑移动
    var firstLayout = true;

    function isDesktop() {
        return window.innerWidth >= DESKTOP_MIN;
    }

    function layout() {
        var tiles = document.querySelector('.tiles');
        if (!tiles) return;

        var items = Array.prototype.slice.call(
            tiles.querySelectorAll('.block-divs, .music-divs')
        );
        if (!items.length) return;

        // 非桌面端：清除 JS 内联样式，交还给 CSS 流式布局
        if (!isDesktop()) {
            items.forEach(function (it) {
                it.style.transition = '';
                it.style.position = '';
                it.style.top = '';
                it.style.left = '';
                it.style.width = '';
            });
            tiles.style.height = '';
            tiles.style.position = '';
            return;
        }

        // 计算列数：容器宽度能放下几列
        var width = tiles.clientWidth;
        var cols = Math.max(1, Math.floor((width + GAP) / (TILE_W + GAP)));

        // 首行实际占用的列数（磁贴少于整行时按实际数量居中，避免单块/少块靠左）
        var usedCols = Math.min(items.length, cols);

        // 水平居中偏移（按首行实际列数计算）
        var totalW = usedCols * (TILE_W + GAP) - GAP;
        var offsetX = Math.max(0, Math.floor((width - totalW) / 2));

        var heights = new Array(cols).fill(0);

        items.forEach(function (it) {
            it.style.transition = firstLayout ? 'none' : '';
            it.style.position = 'absolute';
            it.style.width = TILE_W + 'px';

            // 找到当前最短的一列，把磁贴放进去
            var minCol = 0;
            for (var i = 1; i < cols; i++) {
                if (heights[i] < heights[minCol]) minCol = i;
            }
            it.style.left = (offsetX + minCol * (TILE_W + GAP)) + 'px';
            it.style.top = heights[minCol] + 'px';
            heights[minCol] += it.offsetHeight + GAP;
        });

        tiles.style.position = 'relative';
        tiles.style.height = (Math.max.apply(null, heights) - GAP) + 'px';

        // 首次布局完成后，后续布局启用过渡动画
        firstLayout = false;
    }

    // 暴露给外部（animation.js 的 details 动画）触发重排
    window.masonryLayout = layout;

    // 图片 / 字体等资源加载完成后多校准几次，保证高度准确
    window.addEventListener('load', layout);
    window.addEventListener('resize', layout);
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', layout);
    } else {
        layout();
    }
    setTimeout(layout, 120);
    setTimeout(layout, 600);

    // 磁贴内容变化（如音乐室点击后插入 iframe）时重新布局
    var tiles = document.querySelector('.tiles');
    if (tiles && window.MutationObserver) {
        var timer = null;
        var observer = new MutationObserver(function () {
            clearTimeout(timer);
            timer = setTimeout(layout, 60);
        });
        observer.observe(tiles, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });
    }
})();
