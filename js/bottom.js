// Bottom Navigation Bar

document.addEventListener("DOMContentLoaded", function() {
    var lastScrollTop = 0;
    var footer = document.getElementById("footer");

    window.addEventListener("scroll", function() {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            footer.style.bottom = "-65px";
        } else {
            footer.style.bottom = "5px";
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
});
