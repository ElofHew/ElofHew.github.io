// Bing Search


function search() {
    const query = document.querySelector('.search-input').value;
    if (query) {
        window.open(`https://www.bing.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }
}

document.getElementById('searchInput').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        search();
    }
});
