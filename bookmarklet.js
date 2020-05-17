javascript:(function(){
    var wiki = window.location.href.split('/').slice(-1)[0];
    var url = "http://localhost:3000/".concat(wiki);
    window.open(url)
    document.body.style.background = 'pink';
})();