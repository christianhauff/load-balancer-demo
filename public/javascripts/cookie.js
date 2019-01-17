function getCookieToken() {
  return getCookieEntry('token');
}

function getCookieEntry(entry) {
  var name = `${entry}=`;
  var decodedCookie = decodeURIComponent(document.cookie);
  var cSplit = decodedCookie.split(';');
  for (var i = 0; i < cSplit.length; i++) {
    var c = cSplit[i];
    while (c.charAt(0) == ' ') { c = c.substring(1) }
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return '';
}

function writeCookie(id = 'testing') {
  if (getCookieToken().length > 0) return;
  var expDate = new Date();
  expDate.setHours(expDate.getHours() + 6);
  document.cookie = `token=${id};expires=${expDate.toUTCString()};path=/`;
}

/* debug use only! */

function removeCookie() {
  document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
}

function setDebugCookie() {
  var expDate = new Date();
  expDate.setFullYear(expDate.getFullYear() + 1);
  document.cookie = `token=debug;expires=${expDate.toUTCString()};path=/;`;
}

function setNormalCookie() {
  removeCookie();
  writeCookie(Math.random().toString(36).substring(2, 15));
}
