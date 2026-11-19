const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.js');
let configCode = fs.readFileSync(configPath, 'utf8');

// Replace DEFAULTS in config.js
const newDefaults = `
  const VIVAAH_ISO = '2027-04-03';

  const GALLERY_STARTERS = [
    { type: 'portrait', image: 'couple-1.jpg', placeholder: false, caption: '#shadesofeternal', hang: 118 },
    { type: 'landscape', image: 'couple-2.jpg', placeholder: false, caption: '#endlessromance', hang: 150 },
    { type: 'story', text: 'Some stories begin with grand gestures. Ours started with a simple conversation.', hang: 86 },
    { type: 'portrait', image: 'couple-1.jpg', placeholder: false, caption: '#howitstarted', hang: 132 },
    { type: 'story', text: "Friendship grew into something more, and we realized life's best moments were the ones we shared together.", hang: 120 },
    { type: 'landscape', image: 'couple-2.jpg', placeholder: false, caption: '#foreverbegins', hang: 100 },
  ];

  const DEFAULTS = {
    version: 1,
    finalized: true,

    invocation: { symbol: 'ganesha', religion: 'hindu', script: 'devanagari', custom: '' },

    brideName: 'Bhakti',
    groomName: 'Rushikesh',
    title: 'Rushikesh & Bhakti',
    hostNames: ['Rushikesh', 'Bhakti'],

    introNote: 'we cordially invite you to grace the auspicious occasion of the marriage of…',

    eventISO: '2027-04-03',
    revealButton: 'Reveal the Date',
    revealAfter: 'Save the Date',

    groomFamily: {
      enabled: true,
      name: 'Chi. Rushikesh Patil',
      relLabel: 'Son of',
      parentA: 'Shri & Smt. Patil',
      parentB: '',
      parentJoin: '&',
      grandLabel: 'Grandson of',
      grandA: 'Late Shri & Late Smt. Patil',
      grandB: '',
      grandJoin: '&',
    },
    brideFamily: {
      enabled: true,
      name: 'Kum. Bhakti',
      relLabel: 'Daughter of',
      parentA: 'Proud Parents',
      parentB: '',
      parentJoin: '&',
      grandLabel: 'Granddaughter of',
      grandA: 'Beloved Grandparents',
      grandB: '',
      grandJoin: '&',
    },

    gallery: {
      enabled: true,
      items: GALLERY_STARTERS,
    },

    ceremonies: [
      { name: 'Ring Ceremony', art: 'media/ring_ceremony.webp', date: '2027-04-02', time: '18:00', venue: 'Guru Lawn, Chh. Sambhajinagar', mapUrl: 'https://maps.app.goo.gl/BL4yUzY11Fpd2zbA7', enabled: true },
      { name: 'Haldi', art: 'media/haldi.webp', date: '2027-04-02', time: '19:00', venue: 'Guru Lawn, Chh. Sambhajinagar', mapUrl: 'https://maps.app.goo.gl/BL4yUzY11Fpd2zbA7', enabled: true },
      { name: 'Sangeet', art: 'media/sangeet.webp', date: '2027-04-02', time: '20:00', venue: 'Guru Lawn, Chh. Sambhajinagar', mapUrl: 'https://maps.app.goo.gl/BL4yUzY11Fpd2zbA7', enabled: true },
      { name: 'Vivaah', art: 'media/vivaah.webp', date: '2027-04-03', time: '07:00', venue: 'Guru Lawn, Chh. Sambhajinagar', mapUrl: 'https://maps.app.goo.gl/BL4yUzY11Fpd2zbA7', enabled: true },
      { name: 'Reception', art: 'media/reception.webp', date: '2027-04-03', time: '12:30', venue: 'Guru Lawn, Chh. Sambhajinagar', mapUrl: 'https://maps.app.goo.gl/BL4yUzY11Fpd2zbA7', enabled: true },
      { name: 'Preeti Bhoj (Lunch)', art: 'media/mehendi.webp', date: '2027-04-03', time: '13:00', venue: 'Dining Hall, Guru Lawn, Chh. Sambhajinagar', mapUrl: 'https://maps.app.goo.gl/BL4yUzY11Fpd2zbA7', enabled: true },
    ],

    compliments: {
      enabled: true,
      lead: 'With Best Compliments From:',
      lines: [
        'Patil Family & Near Relatives',
        'All Friends, Family & Well Wishers',
        'Kith & Kin of Rushikesh & Bhakti'
      ],
    },

    note: {
      enabled: true,
      lead: 'Things to Note',
      text: 'Complimentary valet parking is available at the main entrance of Guru Lawn for our wedding day.',
    },

    farewell: { line: 'Your Presence Means the World to Us' },

    social: { instagram: true, instagramUrl: 'https://instagram.com' },

    music: { enabled: true, src: 'music/Jashn-e-bahara Instrumental.mp3', volume: 0.8 },
  };
`;

// Replace from 'function isoDaysFromNow' to 'const DEFAULTS = {' up to the end of DEFAULTS
const startIdx = configCode.indexOf('function isoDaysFromNow');
const endIdx = configCode.indexOf('function deepMerge');

if (startIdx !== -1 && endIdx !== -1) {
    configCode = configCode.substring(0, startIdx) + newDefaults + '\n  ' + configCode.substring(endIdx);
    fs.writeFileSync(configPath, configCode, 'utf8');
    console.log("config.js updated successfully!");
} else {
    console.log("Indices not found for replacing DEFAULTS:", startIdx, endIdx);
}
