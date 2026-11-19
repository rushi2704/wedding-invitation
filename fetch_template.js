const fs = require('fs');
const path = require('path');
const https = require('https');

const baseRoyale = 'https://www.itsbalcony.com/templates/royale/';
const baseTemplates = 'https://www.itsbalcony.com/templates/';

const destDir = __dirname;

const filesToDownload = [
    // CSS
    'styles.css',
    'editor.css',
    '../_platform/toolbar.css',
    '../_platform/rsvp.css',
    '../_platform/music.css',
    '../_platform/vendor/fonts/fonts.css',
    
    // JS
    'config.js',
    'platform-adapter.js',
    'render.js',
    'app.js',
    'date-reveal.js',
    'gallery.js',
    'social.js',
    'scroll.js',
    'outro.js',
    'editor.js',
    '../_platform/fit-text.js',
    '../_platform/vendor/gsap.min.js',
    '../_platform/vendor/ScrollTrigger.min.js',
    '../_platform/vendor/lenis.min.js',
    '../_platform/toolbar.js',
    '../_platform/rsvp.js',
    '../_platform/date-display.js',
    '../_platform/editor-kit.js',
    '../_platform/music.js',

    // Symbols & Media
    '../symbols/_ganesha.svg',
    'media/garden_palace_poster.webp',
    'media/mandap_dusk.webp',
    'media/garden_close.webp',
    'media/garden_close_tall.webp',
    'media/floral1.png',
    'media/elephant.png',
    'media/section_divider.svg',
    'media/knob-left%201.svg',
    'media/roll-top1.svg',
    'media/knob%203.svg',
    'media/Wrapper_P.svg',
    'media/Wrapper_D.svg'
];

function downloadFile(relPath) {
    return new Promise((resolve) => {
        let fullUrl;
        let localRel = relPath;
        if (relPath.startsWith('../')) {
            fullUrl = new URL(relPath, baseRoyale).href;
        } else {
            fullUrl = baseRoyale + relPath;
        }

        const outPath = path.resolve(destDir, relPath.replace(/\%20/g, ' '));
        const outDir = path.dirname(outPath);
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }

        https.get(fullUrl, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                // follow redirect
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
    for (const file of filesToDownload) {
        await downloadFile(file);
    }
    console.log("Download complete!");
}

run();
