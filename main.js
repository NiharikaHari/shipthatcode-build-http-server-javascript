const lines = require('fs').readFileSync(0, 'utf8').split('\n');
const METHODS = new Set(["GET","POST","PUT","DELETE","HEAD","OPTIONS","PATCH"]);

function isVersion(s) {
  let matchResult = s.search(/^HTTP\/\d+\.\d+$/);
  return matchResult !== -1;
}

for (const raw of lines) {
  const line = raw.replace(/\r$/, "");
  if (!line) continue;
  const parts = line.split(" ");
  if (parts.length !== 3 || !METHODS.has(parts[0]) || !parts[1].startsWith("/") || !isVersion(parts[2])) {
    console.log("INVALID");
    continue;
  }
  console.log(`METHOD=${parts[0]} PATH=${parts[1]} VERSION=${parts[2]}`);
}
