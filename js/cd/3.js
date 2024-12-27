// Countdown

const targetDate3 = new Date("June 1, 2025 00:00:00").getTime();

function updateCountdown3() {
    const currentDate3 = new Date().getTime();
    const distance3 = targetDate3 - currentDate3;
    const days3 = Math.floor(distance3 / (1000 * 60 * 60 * 24));
    const hours3 = Math.floor((distance3 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes3 = Math.floor((distance3 % (1000 * 60 * 60)) / (1000 * 60));
    const seconds3 = Math.floor((distance3 % (1000 * 60)) / 1000);
    
    document.getElementById("countdown-text-3").innerHTML = `距离儿童节还有：<br /><span style="color: tan;">${days3}天 ${hours3}小时 ${minutes3}分钟 ${seconds3}秒</span>`;

    if (distance3 < 0) {
        clearInterval(countdownInterval3);
        document.getElementById("countdown-text-3").innerHTML = `<b style="color: orangered; text-align: center;">孩子们，儿童节快乐！</b>`;
    }
}

const countdownInterval3 = setInterval(updateCountdown3, 1000);
