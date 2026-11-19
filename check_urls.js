const fs = require('fs');
const css = fs.readFileSync('styles.css', 'utf8');
const regex = /url\(['"]?([^'")]+)['"]?\)/g;
const urls = new Set();
let match;
while ((match = regex.exec(css)) !== null) {
    if (!match[1].startsWith('data:')) {
        urls.add(match[1]);
    }
}
console.log(Array.from(urls));
