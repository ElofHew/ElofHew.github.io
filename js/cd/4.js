// Countdown

const targetDate4 = new Date("June 10, 2025 00:00:00").getTime();

function updateCountdown4() {
    const currentDate4 = new Date().getTime();
    const distance4 = targetDate4 - currentDate4;
    const days4 = Math.floor(distance4 / (1000 * 60 * 60 * 24));
    const hours4 = Math.floor((distance4 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes4 = Math.floor((distance4 % (1000 * 60 * 60)) / (1000 * 60));
    const seconds4 = Math.floor((distance4 % (1000 * 60)) / 1000);
    
    document.getElementById("countdown-text-4").innerHTML = `距离2025年中考还有：<br /><span style="color: tan;">${days4}天 ${hours4}小时 ${minutes4}分钟 ${seconds4}秒</span>`;

    if (distance4 < 0) {
        clearInterval(countdownInterval4);
        document.getElementById("countdown-text-4").innerHTML = `<b style="color: orangered; text-align: center;">中考必胜！</b>`;
    }
}

const countdownInterval4 = setInterval(updateCountdown4, 1000);
