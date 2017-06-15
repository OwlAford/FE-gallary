var setClient = function () {
  var doc = document.documentElement;
  var clientWidth = doc.clientWidth;
  doc.style.fontSize = 100 * clientWidth / 750 + 'px';
}
setClient()
window.addEventListener('resize', setClient, false)