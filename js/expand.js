// 解析URL参数函数
function getUrlParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// 展开指定ID的div内所有details
function expandDetailsInDiv(divId) {
  const targetDiv = document.getElementById(divId);
  if (targetDiv) {
    const details = targetDiv.querySelectorAll('details');
    details.forEach(detail => detail.open = true);
  }
}

// 页面加载时执行
window.addEventListener('DOMContentLoaded', () => {
  const targetId = getUrlParam('expand');
  if (targetId) expandDetailsInDiv(targetId);
});