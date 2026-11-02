const header = 'splnu=1; domain=seesp-my.sharepoint.com; path=/; SameSite=None; Secure, FedAuth=77u/PD94b...; path=/; secure; HttpOnly, rtFa=abc...; path=/; secure; HttpOnly';

console.log('Old way:', header.split(';')[0]);

function extrairCookiesSharepoint(setCookie) {
  if (!setCookie) return "";
  if (Array.isArray(setCookie)) {
    return setCookie.map(function(c) { return String(c).split(";")[0].trim(); }).join("; ");
  }
  var str = String(setCookie);
  // Divide por quebras de linha ou vírgulas seguidas de nome_cookie=
  var parts = str.split(/,(?=\s*[A-Za-z0-9_.-]+=)/);
  return parts.map(function(p) { return p.split(";")[0].trim(); }).filter(Boolean).join("; ");
}

console.log('New robust way:', extrairCookiesSharepoint(header));
