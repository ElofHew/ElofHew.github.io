// Countdown

const countdownTarget = new Date("2024-12-14T00:00:00").getTime();

const countdownFunction = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownTarget - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("countdown-text").innerHTML = `距离我的生日还有：<br /><span style="color: tan;">${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒</span>`;
    
    if (distance < 0) {
        clearInterval(countdownFunction);
        document.getElementById("countdown-text").innerHTML = '<span>祝我<br /><b style="color: orangered;">15岁生日快乐</b></span>';
    }
}, 1000);
