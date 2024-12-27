// Countdown

const targetDate1 = new Date("January 1, 2025 00:00:00").getTime();

function updateCountdown1() {
    const currentDate1 = new Date().getTime();
    const distance1 = targetDate1 - currentDate1;
    const days1 = Math.floor(distance1 / (1000 * 60 * 60 * 24));
    const hours1 = Math.floor((distance1 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes1 = Math.floor((distance1 % (1000 * 60 * 60)) / (1000 * 60));
    const seconds1 = Math.floor((distance1 % (1000 * 60)) / 1000);
    
    document.getElementById("countdown-text-1").innerHTML = `距离2025年还有：<br /><span style="color: tan;">${days1}天 ${hours1}小时 ${minutes1}分钟 ${seconds1}秒</span>`;

    if (distance1 < 0) {
        clearInterval(countdownInterval1);
        document.getElementById("countdown-text-1").innerHTML = `<b style="color: orangered; text-align: center;">2025年，新年快乐！</b>`;
    }
}

const countdownInterval1 = setInterval(updateCountdown1, 1000);
