// const lines = require('fs').readFileSync(0, 'utf8').split('\n');
// 01 - Request Line
// const METHODS = new Set(["GET","POST","PUT","DELETE","HEAD","OPTIONS","PATCH"]);

// function isVersion(s) {
//   let matchResult = s.search(/^HTTP\/\d+\.\d+$/);
//   return matchResult !== -1;
// }

// for (const raw of lines) {
//   const line = raw.replace(/\r$/, "");
//   if (!line) continue;
//   const parts = line.split(" ");
//   if (parts.length !== 3 || !METHODS.has(parts[0]) || !parts[1].startsWith("/") || !isVersion(parts[2])) {
//     console.log("INVALID");
//     continue;
//   }
//   console.log(`METHOD=${parts[0]} PATH=${parts[1]} VERSION=${parts[2]}`);
// }

// 02 - Request Headers
// for (const raw of lines) {
//   const line = raw.replace(/\r$/, "");
//   if (!line) break;

//   if(!line.includes(":")) {
//     console.log(`ERR malformed: ${line}`);
//     continue;
//   }

//   const idx = line.indexOf(":");
//   const name = line.slice(0, idx);
//   const value = line.slice(idx+1);

//   const formattedName = name.toLocaleLowerCase().trim();
//   const formattedValue = value.trim();

//   console.log(`${formattedName}: ${formattedValue}`);

// }

// 03 - Request Body
// const data = require('fs').readFileSync(0, 'utf8').split('\n');
// const out = [];
// let i = 0;
// while (i < data.length) {
//   const sizeLine = data[i].trim();
//   if (!sizeLine) { i++; continue; }
//   const size = parseInt(sizeLine, 16);
//   if (isNaN(size)) { i++; continue; }
//   if (size === 0 ) break;
//   out.push(data[i+1].slice(0, size));
//   i += 2;
// }
// process.stdout.write(out.join("") + "\n");

// 04 - Build response
// const data = require('fs').readFileSync(0, 'utf8').split('\n');
// const STATUS_TEXT = { 200: "OK", 201: "Created", 204: "No Content", 301: "Moved Permanently", 302: "Found", 304: "Not Modified", 400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found", 405: "Method Not Allowed", 500: "Internal Server Error" };
// if (!data[0] || !data[0].trim()) process.exit(0);
// const [status, hc] = data[0].split(' ').map(Number);
// const headers = data.slice(1, 1 + hc);
// let body = data.slice(1 + hc).join('\n');
// while (body.endsWith('\n')) body = body.slice(0, -1);

// const hasCL = headers.some(h => h.toLocaleLowerCase().startsWith('content-length'));
// const parts = [`HTTP/1.1 ${status} ${STATUS_TEXT[status] || 'Unknown'}`, ...headers];
// if (!hasCL) parts.push(`Content-Length: ${Buffer.byteLength(body)}`);
// parts.push("", body);
// // CRLF, not LF
// process.stdout.write(parts.join("\r\n"));

// 05 - Static Routing
const data = require('fs').readFileSync(0, 'utf8').split('\n');
const blankIdx = data.indexOf("");

const routes = new Map();
const allow = new Map();

for (const line of data.slice(0, blankIdx)) {
  if (!line) continue;
  const parts = line.split(' ');
  if (parts.length < 3) continue;

  const method = parts[0];
  const path = parts[1];
  const handler = parts[2];

  routes.set(method + ' ' + path, handler);

  if (!allow.has(path)) allow.set(path, new Set());

  allow.get(path).add(method);
}

for (const line of data.slice(blankIdx + 1)) {
  if (!line) continue;
  const parts = line.split(' ');

  const method = parts[0];
  const path = parts.length < 2 ? '/' : parts[1].split('?')[0];
  
  // Check if path is in allow - 404
  if (!allow.has(path)) {
    console.log(404);
    continue;
  }

  // Check if method is allowed - 405
  if (!allow.get(path).has(method)) {
    console.log(405);
    continue;
  }

  // get handler
  console.log(`200 ${routes.get(method + ' ' + path)}`);
}
