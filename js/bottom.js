// Bottom Navigation Bar

document.getElementById("footer-prt").innerHTML = `
<div class="footer" id="footer">
    <a href="https://elofhew.github.io/"><img src="icons/main.svg" width="30" height="30" /></a>
    <a href="https://elofhew.github.io/download.html"><img src="icons/dl.svg" width="30" height="30" /></a>
    <a href="https://elofhew.github.io/Blogs/" target="_blank"><img src="icons/blog.svg" width="30" height="30" /></a>
    <a href="https://elofhew.github.io/friendlink.html"><img src="icons/link.svg" width="30" height="30" /></a>
    <a href="https://elofhew.github.io/music.html"><img src="icons/music.svg" width="30" height="30" /></a>
    <a href="https://elofhew.github.io/game.html"><img src="icons/game.svg" width="30" height="30" /></a>
</div>
`

document.addEventListener("DOMContentLoaded", function () {
    var lastScrollTop = 0;
    var footer = document.getElementById("footer");

    window.addEventListener("scroll", function () {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            footer.style.bottom = "-65px";
        } else {
            footer.style.bottom = "5px";
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
});
