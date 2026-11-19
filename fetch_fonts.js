const fs = require('fs');
const path = require('path');
const https = require('https');

const base = 'https://www.itsbalcony.com/templates/_platform/vendor/fonts/';
const dest = path.resolve(__dirname, '../_platform/vendor/fonts');

const fonts = [
    'cormorant-garamond-italic-latin-ext.woff2',
    'cormorant-garamond-italic-latin.woff2',
    'cormorant-garamond-latin-ext.woff2',
    'cormorant-garamond-latin.woff2',
    'fraunces-latin-ext.woff2',
    'fraunces-latin.woff2',
    'sora-latin-ext.woff2',
    'sora-latin.woff2'
];

async function run() {
    for (const f of fonts) {
        await new Promise((resolve) => {
            const outPath = path.join(dest, f);
            https.get(base + f, (res) => {
                if (res.statusCode === 200) {
                    const file = fs.createWriteStream(outPath);
                    res.pipe(file);
                    file.on('finish', () => { file.close(); console.log("Font downloaded: " + f); resolve(); });
                } else {
                    console.log("Failed font: " + f + " status: " + res.statusCode);
                    resolve();
                }
            }).on('error', () => resolve());
        });
    }
}
run();
