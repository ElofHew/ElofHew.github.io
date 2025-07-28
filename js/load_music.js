// Load 163 Music iframe

document.addEventListener('DOMContentLoaded', function() {
    // 获取所有的加载音乐按钮
    var buttons = document.querySelectorAll('.load-music');

    // 为每个按钮设置点击事件监听器
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // 获取按钮对应的音乐ID
            var musicId = this.getAttribute('data-id');
            // 获取按钮对应的iframe容器
            var iframeContainer = this.nextElementSibling;

            // 创建一个新的iframe元素
            var iframe = document.createElement('iframe');
            iframe.frameBorder = "no";
            iframe.border = "0";
            iframe.marginWidth = "0";
            iframe.marginHeight = "0";
            iframe.width = "320";
            iframe.height = "86";
            iframe.src = `https://music.163.com/outchain/player?type=2&id=${musicId}&auto=0&height=66`;

            // 移除按钮并添加iframe到容器中
            this.remove();
            iframeContainer.appendChild(iframe);
        });
    });
});
