const fs = require('fs');
let code = fs.readFileSync('Código.gs', 'utf8');

// Robust cookie extraction function
const newCookieFn = `function extrairCookiesSharepoint(headers) {
  if (!headers) return "";
  var setCookie = headers["Set-Cookie"] || headers["set-cookie"];
  if (!setCookie) return "";
  if (Array.isArray(setCookie)) {
    return setCookie.map(function(c) { return String(c).split(";")[0].trim(); }).join("; ");
  }
  var str = String(setCookie);
  var parts = str.split(/,(?=\\s*[A-Za-z0-9_.-]+=)/);
  return parts.map(function(p) { return p.split(";")[0].trim(); }).filter(Boolean).join("; ");
}`;

// Robust isZipXlsx check
// Returns true if the byte array starts with PK\\x03\\x04
const isXlsxCheck = `function verificarSeBytesSaoXlsx(bytes) {
  return (bytes && bytes.length >= 4 && bytes[0] === 80 && bytes[1] === 75 && bytes[2] === 3 && bytes[3] === 4);
}`;

console.log('Script helper functions prepared');
