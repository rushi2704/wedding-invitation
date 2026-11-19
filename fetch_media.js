const fs = require('fs');
const path = require('path');
const https = require('https');

const baseRoyale = 'https://www.itsbalcony.com/templates/royale/';
const destDir = __dirname;

const files = [
    'media/border_element.svg',
    'media/motif_tile.svg',
    'media/border_element_h.svg',
    'media/date_window.svg',
    'media/gallery_bg.webp',
    'media/corner.png',
    'media/ceremony_card.svg',
    'media/easel.webp',
    'media/easel_wide.webp',
    'media/star.svg',
    'media/instagram.webp',
    'media/location.webp',
    'media/calendar.webp',
    'media/location.svg',
    'media/divider2.png',
    'media/ring_ceremony.webp',
    'media/mehendi.webp',
    'media/haldi.webp',
    'media/sangeet.webp',
    'media/vivaah.webp',
    'media/reception.webp',
    'media/garden_close.webp',
    'media/garden_close_tall.webp',
    'media/garden_palace.mp4',
    'media/garden_palace_poster.webp',
    'media/mandap_dusk.webp'
];

function downloadFile(relPath) {
    return new Promise((resolve) => {
        const fullUrl = baseRoyale + relPath;
        const outPath = path.resolve(destDir, relPath.replace(/\%20/g, ' '));
        const outDir = path.dirname(outPath);
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }

        https.get(fullUrl, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                https.get(res.headers.location, (redRes) => {
                    const file = fs.createWriteStream(outPath);
                    redRes.pipe(file);
                    file.on('finish', () => { file.close(); resolve(true); });
                }).on('error', () => resolve(false));
                return;
            }
            if (res.statusCode !== 200) {
                console.log(`Failed (${res.statusCode}): ${fullUrl}`);
                resolve(false);
                return;
            }
            const file = fs.createWriteStream(outPath);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${relPath}`);
                resolve(true);
            });
        }).on('error', (err) => {
            console.log(`Error on ${fullUrl}:`, err.message);
            resolve(false);
        });
    });
}

async function run() {
    for (const f of files) {
        await downloadFile(f);
    }
    console.log("All media downloaded!");
}

run();
