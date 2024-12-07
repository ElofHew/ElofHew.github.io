// Date

const dateDiv = document.getElementById('date');

const currentDate = new Date();

dateDiv.innerText = `今天是：${currentDate.toLocaleDateString()}`;
