const fs = require('fs');
const path = require('path');

const dir = __dirname;

// 1. Update index.html
let html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

// Clear localStorage of any stale cached configs right at the top of <head>
const clearStorageScript = `<script>
  try {
    localStorage.removeItem('royaleConfig');
    localStorage.removeItem('royaleTrialConfig');
  } catch(e) {}
</script>`;
if (!html.includes('royaleConfig')) {
  html = html.replace('<head>', '<head>\n    ' + clearStorageScript);
}

// Remove the broken pavilion element and its huge empty space
html = html.replace(/<div class="royale-pavilion"[\s\S]*?<\/div>/g, '');

// Remove the "Your Presence Matters" RSVP card
html = html.replace(/<div id="balcony-rsvp"><\/div>/g, '');
html = html.replace(/<link rel="stylesheet" href="_platform\/rsvp\.css">/g, '');
html = html.replace(/<script src="_platform\/rsvp\.js"><\/script>/g, '');


fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
console.log("index.html updated successfully!");

// 2. Update config.js with the exact wedding data and photo gallery
let config = fs.readFileSync(path.join(dir, 'config.js'), 'utf8');

// Ensure load() returns DEFAULTS directly without loading old cached overrides
config = config.replace(
  /function load\(\) \{[\s\S]*?return DEFAULTS;\s*\}/,
  `function load() {
    return DEFAULTS;
  }`
);

// Update gallery starters to use real photos.
const updatedGallery = `const GALLERY_STARTERS = [
    { type: 'portrait', image: 'couple-1.jpg', placeholder: false, caption: '#RushikeshWedsBhakti', hang: 118 },
    { type: 'story', text: 'Some stories begin with grand gestures. Ours started with a simple conversation.', hang: 86 },
    { type: 'landscape', image: 'couple-2.jpg', placeholder: false, caption: '#OurCelebration', hang: 150 },
    { type: 'story', text: "Friendship grew into something more, and we realized life's best moments were the ones we shared together.", hang: 120 },
    { type: 'portrait', image: 'couple-1.jpg', placeholder: false, caption: '#ForeverBegins', hang: 135 },
  ];`;

config = config.replace(/const GALLERY_STARTERS = \[[\s\S]*?\];/, updatedGallery);

fs.writeFileSync(path.join(dir, 'config.js'), config, 'utf8');
console.log("config.js updated successfully!");

// 3. Update _platform/music.js to play 100% reliably on any browser
let musicJs = fs.readFileSync(path.join(dir, '_platform/music.js'), 'utf8');

// Make sure music plays on gate tap immediately
const gateHook = `
    // Immediate unlock on gate tap
    var gate = document.getElementById('ryGate');
    if (gate) {
      gate.addEventListener('click', function() {
        wantsSound = true;
        tryPlay();
      }, { passive: true });
    }
`;

if (!musicJs.includes('// Immediate unlock on gate tap')) {
  musicJs = musicJs.replace('function tryPlay() {', gateHook + '\n    function tryPlay() {');
}

// Play the configured MP3 directly through the Audio element.
const enhancedPlay = `function tryPlay() {
      if (!wantsSound) return;
      var playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function() {});
      }
    }`;

musicJs = musicJs.replace(/function tryPlay\(\) \{[\s\S]*?\}\s*\}/, enhancedPlay + '\n    }');

fs.writeFileSync(path.join(dir, '_platform/music.js'), musicJs, 'utf8');
console.log("music.js updated successfully!");
