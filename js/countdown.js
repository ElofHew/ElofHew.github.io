// Countdown

const targetDate = new Date("December 25, 2024 00:00:00").getTime();

function updateCountdown() {
    const currentDate = new Date().getTime();
    const distance = targetDate - currentDate;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById("countdown-text").innerHTML = `距离圣诞节还有：<br /><span style="color: tan;">${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒</span>`;

    if (distance < 0) {
        clearInterval(countdownInterval);
        document.getElementById("countdown").innerHTML = `<b style="color: orangered;">圣诞节快乐！</b>`;
    }
}

const countdownInterval = setInterval(updateCountdown, 1000);
