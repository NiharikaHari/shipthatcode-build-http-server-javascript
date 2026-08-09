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
const data = require('fs').readFileSync(0, 'utf8').split('\n');
const out = [];
let i = 0;
while (i < data.length) {
  const sizeLine = data[i].trim();
  if (!sizeLine) { i++; continue; }
  const size = parseInt(sizeLine, 16);
  if (isNaN(size)) { i++; continue; }
  if (size === 0 ) break;
  out.push(data[i+1].slice(0, size));
  i += 2;
}
process.stdout.write(out.join("") + "\n");