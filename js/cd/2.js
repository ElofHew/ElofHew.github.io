// Countdown

const targetDate2 = new Date("January 29, 2025 00:00:00").getTime();

function updateCountdown2() {
    const currentDate2 = new Date().getTime();
    const distance2 = targetDate2 - currentDate2;
    const days2 = Math.floor(distance2 / (1000 * 60 * 60 * 24));
    const hours2 = Math.floor((distance2 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes2 = Math.floor((distance2 % (1000 * 60 * 60)) / (1000 * 60));
    const seconds2 = Math.floor((distance2 % (1000 * 60)) / 1000);
    
    document.getElementById("countdown-text-2").innerHTML = `距离春节还有：<br /><span style="color: tan;">${days2}天 ${hours2}小时 ${minutes2}分钟 ${seconds2}秒</span>`;

    if (distance2 < 0) {
        clearInterval(countdownInterval2);
        document.getElementById("countdown-text-2").innerHTML = `<b style="color: orangered; text-align: center;">祝你新年快乐！</b>`;
    }
}

const countdownInterval2 = setInterval(updateCountdown2, 1000);
