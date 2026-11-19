const fs = require('fs');
const path = require('path');

let html = fs.readFileSync(path.join(__dirname, 'template_royale.html'), 'utf8');

// Replace relative paths to local
html = html.replace(/\.\.\/_platform\//g, '_platform/');
html = html.replace(/\.\.\/symbols\//g, 'symbols/');

// Set page title
html = html.replace(/<title>.*?<\/title>/, '<title>Rushikesh & Bhakti — Wedding Invitation</title>');

// Set guest greeting fallback
html = html.replace('Mr. Patidar and Family', 'Dear Family & Friends');
html = html.replace('Mr. Patidar and Family', 'Dear Family & Friends');

// Remove the external /try/royale/draft.js trial script
html = html.replace(/<script>if\s*\(location\.search\.indexOf\('trial=1'\)[^<]+<\/script>/, '');

// Save as index.html
fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
console.log("index.html created successfully from official Balcony Royale template!");
