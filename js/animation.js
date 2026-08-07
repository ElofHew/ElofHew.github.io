/**
 * animation.js - 动画实现模块
 * 点击粒子特效 + details 展开/折叠平滑动画
 */

// ============================================
// 1. 点击粒子特效
// Copyed from https://github.com/chiyao6840/chiyao6840.github.io/blob/main/index.html
// ============================================
function clickEffect() {
    let balls = [];
    let longPressed = false;
    let longPress;
    let multiplier = 0;
    let width, height;
    let origin;
    let normal;
    let ctx;
    let running = false;            // 动画循环是否在运行（无粒子时停止，省电）
    const MAX_BALLS = 120;          // 粒子总数上限，防止长按时无限累积
    const colours = ["#0C2875", "#05688D", "#028090", "#00A896", "#02C39A"];
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.setAttribute("style", "width: 100%; height: 100%; top: 0; left: 0; z-index: 99999; position: fixed; pointer-events: none;");
    const pointer = document.createElement("span");
    pointer.classList.add("pointer");
    document.body.appendChild(pointer);

    if (canvas.getContext && window.addEventListener) {
        ctx = canvas.getContext("2d");
        updateSize();
        window.addEventListener('resize', updateSize, false);
        window.addEventListener("mousedown", function (e) {
            pushBalls(randBetween(5, 10), e.clientX, e.clientY);
            document.body.classList.add("is-pressed");
            longPress = setTimeout(function () {
                document.body.classList.add("is-longpress");
                longPressed = true;
            }, 500);
        }, false);
        window.addEventListener("mouseup", function (e) {
            clearTimeout(longPress);
            if (longPressed == true) {
                document.body.classList.remove("is-longpress");
                pushBalls(randBetween(20, 40), e.clientX, e.clientY);
                longPressed = false;
            }
            document.body.classList.remove("is-pressed");
        }, false);
        window.addEventListener("mousemove", function (e) {
            pointer.style.top = e.clientY + "px";
            pointer.style.left = e.clientX + "px";
        }, false);
    } else {
        console.log("canvas or addEventListener is unsupported!");
    }

    function updateSize() {
        // 用 devicePixelRatio（上限 2）代替固定 2x，减少高 DPI 下像素填充开销
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(window.innerWidth * dpr);
        canvas.height = Math.floor(window.innerHeight * dpr);
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        width = window.innerWidth;
        height = window.innerHeight;
        origin = {
            x: width / 2,
            y: height / 2
        };
        normal = {
            x: width / 2,
            y: height / 2
        };
    }
    class Ball {
        constructor(x = origin.x, y = origin.y) {
            this.x = x;
            this.y = y;
            this.angle = Math.PI * 2 * Math.random();
            if (longPressed == true) {
                this.multiplier = randBetween(10 + multiplier, 11 + multiplier);
            } else {
                this.multiplier = randBetween(4, 8);
            }
            this.vx = (this.multiplier + Math.random() * 0.5) * Math.cos(this.angle);
            this.vy = (this.multiplier + Math.random() * 0.5) * Math.sin(this.angle);
            this.r = randBetween(5, 8) + 2 * Math.random();
            this.color = colours[Math.floor(Math.random() * colours.length)];
        }
        update() {
            this.x += this.vx - normal.x;
            this.y += this.vy - normal.y;
            normal.x = -2 / width * Math.sin(this.angle);
            normal.y = -2 / height * Math.cos(this.angle);
            this.r -= 0.3;
            this.vx *= 0.9;
            this.vy *= 0.9;
        }
    }

    function pushBalls(count = 1, x = origin.x, y = origin.y) {
        for (let i = 0; i < count; i++) {
            if (balls.length >= MAX_BALLS) return;   // 达到上限不再添加
            balls.push(new Ball(x, y));
        }
        if (!running) {                              // 有粒子时才启动动画循环
            running = true;
            requestAnimationFrame(loop);
        }
    }

    function randBetween(min, max) {
        return Math.floor(Math.random() * max) + min;
    }

    function loop() {
        ctx.clearRect(0, 0, width, height);

        // 反向遍历：绘制的同时就地清理出界的/消失的粒子
        for (let i = balls.length - 1; i >= 0; i--) {
            let b = balls[i];
            if (b.r <= 0 || b.x + b.r < 0 || b.x - b.r > width || b.y + b.r < 0 || b.y - b.r > height) {
                balls.splice(i, 1);
                continue;
            }
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2, false);
            ctx.fill();
            b.update();
        }

        if (longPressed == true) {
            multiplier += 0.2;
        } else if (!longPressed && multiplier >= 0) {
            multiplier -= 0.4;
        }

        if (balls.length > 0) {
            requestAnimationFrame(loop);
        } else {
            // 粒子全部消失：停止动画循环，释放空闲帧
            running = false;
            multiplier = 0;
            ctx.clearRect(0, 0, width, height);
        }
    }
}
clickEffect();

// ============================================
// 2. details 展开 / 收起平滑动画
// 依赖 layout.js 暴露的 window.masonryLayout 在动画结束后重排
// ============================================
function initDetails() {
    var list = document.querySelectorAll('.tiles details');
    Array.prototype.forEach.call(list, function (d) {
        var body = d.querySelector('.details-body');
        if (!body) return;

        // 动画结束后重新布局，保证磁贴位置准确
        body.addEventListener('transitionend', function () {
            if (window.masonryLayout) window.masonryLayout();
        });

        // 自定义展开 / 收起，实现平滑动画（原生 open 会瞬间显隐，故需拦截）
        d.addEventListener('click', function (e) {
            if (!e.target.closest('summary')) return;
            e.preventDefault(); // 阻止原生瞬间开合

            var willOpen = !d.open;
            if (willOpen) {
                // 展开：先确保内容可见，再动画到实际高度
                d.open = true;
                body.style.maxHeight = '0px';
                void body.offsetHeight;
                body.style.maxHeight = body.scrollHeight + 'px';
            } else {
                // 收起：先动画到 0，动画结束后再隐藏内容
                body.style.maxHeight = body.scrollHeight + 'px';
                void body.offsetHeight;
                body.style.maxHeight = '0px';
                setTimeout(function () {
                    d.open = false;
                }, 360);
            }
        });
    });
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDetails);
} else {
    initDetails();
}
