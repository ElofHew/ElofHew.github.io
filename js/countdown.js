// Countdown

const targetDate = new Date("October 1, 2025 00:00:00").getTime();

function updateCountdown() {
    const currentDate = new Date().getTime();
    const distance = targetDate - currentDate;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById("countdown-text").innerHTML = `距离2025年最后一个小长假还有：<br /><span style="color: tan;">${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒</span>`;

    if (distance < 0) {
        clearInterval(countdownInterval);
        document.getElementById("countdown-text").innerHTML = `<b style="color: orangered;
    text-align: center;">孩子们，国庆节假期快乐</b>`;
    }
}

const countdownInterval = setInterval(updateCountdown, 1000);
