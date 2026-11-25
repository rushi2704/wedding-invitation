// Royale - the invitation's config: the single source of truth for everything
// a host can edit. Loads their saved edits over the template defaults and
// exposes the shared helpers render.js / editor.js / ceremonies.js use.
//
// Modes (from the URL), as papercut and rose-invitation:
//   ?edit=1     - the host edits the invitation in place
//   ?preview=1  - the host previews it as a guest sees it
//   (nothing)   - the final invitation; ?to=Guest%20Name personalises it
(function () {
  const params = new URLSearchParams(location.search);
  const mode = params.has('edit') ? 'edit' : params.has('preview') ? 'preview' : 'view';

  // Trial (?trial=1) - the "try before you buy" sandbox on the marketplace.
  // The shopper gets the real editor, but only the opening card is unlocked:
  // the invocation and the couple's names. Everything past them is visible and
  // locked - enough to prove the experience, not enough to walk away with a
  // finished invitation. TRIAL_EDITABLE is the whole allowlist, and canEdit
  // below is the only thing that consults it.
  const trial = params.has('trial');
  const TRIAL_EDITABLE = ['invocation.religion', 'brideName', 'groomName'];

  // The trial gets its own storage key: it still has to persist (tapping
  // Preview navigates the page and the config is re-read on load), but it must
  // not write over the real key, or a shopper's trial edits would bleed into
  // the marketplace preview everyone else sees.
  const STORAGE_KEY = trial ? 'royaleTrialConfig' : 'royaleConfig';

  // ---- Opening invocation ----------------------------------------------
  // The same table papercut and rose-invitation offer, so a host meets the
  // identical choice in every template. Add a tradition, script or symbol in
  // one and add it to the others.
  const SYMBOLS = [
    { id: 'ganesha', label: 'Ganesha', src: '../symbols/_ganesha.svg' },
    { id: 'buddha', label: 'Buddha', src: '../symbols/_buddha.svg' },
    { id: 'sindhi', label: 'Jhulelal', src: '../symbols/_sindhi.svg' },
    { id: 'sikh', label: 'Ik Onkar', src: '../symbols/_sikh.svg' },
    { id: 'jain', label: 'Ahimsa symbol', src: '../symbols/_jain.svg' },
    { id: 'buddhist', label: 'Dharma wheel', src: '../symbols/_buddhist.svg' },
    { id: 'parsi', label: 'Faravahar', src: '../symbols/_parsi.svg' },
    { id: 'christian', label: 'Cross', src: '../symbols/_christian.svg' },
    { id: 'none', label: 'None', src: '' },
  ];

  const INVOCATIONS = {
    hindu: {
      label: 'Hindu',
      english: 'Shri Ganeshaya Namah',
      scripts: {
        devanagari: { label: 'Devanagari (Hindi/Marathi/Sanskrit/Nepali)', text: 'श्री गणेशाय नमः', font: 'Tiro Devanagari Sanskrit' },
        bengali: { label: 'Bengali', text: 'শ্রী গণেশায় নমঃ', font: 'Noto Sans Bengali' },
        gujarati: { label: 'Gujarati', text: 'શ્રી ગણેશાય નમઃ', font: 'Noto Sans Gujarati' },
        gurmukhi: { label: 'Gurmukhi (Punjabi)', text: 'ਸ਼੍ਰੀ ਗਣੇਸ਼ਾਯ ਨਮਃ', font: 'Noto Sans Gurmukhi' },
        odia: { label: 'Odia', text: 'ଶ୍ରୀ ଗଣେଶାୟ ନମଃ', font: 'Noto Sans Oriya' },
        tamil: { label: 'Tamil', text: 'ஸ்ரீ கணேசாய நமஹ', font: 'Noto Sans Tamil' },
        telugu: { label: 'Telugu', text: 'శ్రీ గణేశాయ నమః', font: 'Noto Sans Telugu' },
        kannada: { label: 'Kannada', text: 'ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ', font: 'Noto Sans Kannada' },
        malayalam: { label: 'Malayalam', text: 'ശ്രീ ഗണേശായ നമഃ', font: 'Noto Sans Malayalam' },
      },
    },
    sikh: {
      label: 'Sikh',
      english: 'Ik Onkar, Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh',
      scripts: {
        gurmukhi: { label: 'Gurmukhi', text: 'ੴ ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖ਼ਾਲਸਾ, ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ', font: 'Noto Sans Gurmukhi' },
      },
    },
    sindhi: {
      label: 'Sindhi',
      english: 'Jay Jhulelal',
      scripts: {
        devanagari: { label: 'Devanagari', text: 'जय झूलेलाल', font: 'Tiro Devanagari Sanskrit' },
        sindhi: { label: 'Sindhi', text: 'جھولےلال جي', font: 'Noto Naskh Arabic', rtl: true },
      },
    },
    jain: {
      label: 'Jain',
      english: 'Namo Arihantanam',
      scripts: {
        devanagari: { label: 'Devanagari', text: 'णमो अरिहंताणं', font: 'Tiro Devanagari Sanskrit' },
      },
    },
    buddhist: {
      label: 'Buddhist',
      english: 'Buddham Sharanam Gachhami',
      scripts: {
        devanagari: { label: 'Devanagari', text: 'बुद्धं शरणं गच्छामि', font: 'Tiro Devanagari Sanskrit' },
      },
    },
    christian: {
      label: 'Christian',
      english: 'In the name of the Father, the Son, and the Holy Spirit',
      scripts: {},
    },
    muslim: {
      label: 'Muslim',
      english: 'Bismillah ir-Rahman ir-Raheem',
      scripts: {
        arabic: { label: 'Arabic', text: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', font: 'Noto Naskh Arabic', rtl: true },
      },
    },
    parsi: {
      label: 'Parsi',
      english: 'Humata, Hukhta, Hvarshta',
      scripts: {},
    },
  };

  function symbolById(id) {
    for (let i = 0; i < SYMBOLS.length; i++) if (SYMBOLS[i].id === id) return SYMBOLS[i];
    return SYMBOLS[SYMBOLS.length - 1]; // 'none' - never the first artwork
  }

  /**
   * The one line the opening card shows, resolved from { religion, script }.
   * 'custom' is the host's own words; 'blank' is no line at all. A saved
   * religion or script that no longer exists falls back to the tradition's
   * first script rather than breaking the card.
   */
  function invocationLines(inv) {
    const sel = inv && inv.script;

    if (sel === 'custom') {
      return {
        religion: (inv && inv.religion) || 'hindu', script: 'custom',
        text: (inv && inv.custom) || '', font: '', rtl: false, isEnglish: false, isCustom: true,
      };
    }
    if (sel === 'blank') {
      return {
        religion: (inv && inv.religion) || 'hindu', script: 'blank',
        text: '', font: '', rtl: false, isEnglish: false, isBlank: true,
      };
    }

    const religion = INVOCATIONS[(inv && inv.religion)] ? inv.religion : 'hindu';
    const rel = INVOCATIONS[religion];
    const scriptKeys = Object.keys(rel.scripts);

    let chosen;
    if (sel === 'english') chosen = 'english';
    else if (sel && rel.scripts[sel]) chosen = sel;
    else chosen = scriptKeys.length ? scriptKeys[0] : 'english';

    if (chosen === 'english') {
      return { religion: religion, script: 'english', text: rel.english || '', font: '', rtl: false, isEnglish: true };
    }
    const scr = rel.scripts[chosen];
    return { religion: religion, script: chosen, text: scr.text, font: scr.font, rtl: !!scr.rtl, isEnglish: false };
  }

  // ---- Default wedding date ---------------------------------------------
  // 15 days out from whenever the invitation is created, as papercut: a fixed
  // date would eventually be in the past, and the date reveal and the ceremony
  // schedule would both open looking stale.
  
  const VIVAAH_ISO = '2027-04-03';

  function addDaysISO(iso, days) {
    const date = new Date(iso + 'T00:00:00');
    date.setDate(date.getDate() + Number(days || 0));
    return date.toISOString().slice(0, 10);
  }

  const GALLERY_STARTERS = [
    { type: 'portrait', image: 'couple-1.jpg', placeholder: false, caption: '#RushikeshWedsBhakti', hang: 118 },
    { type: 'story', text: 'Some stories begin with grand gestures. Ours started with a simple conversation.', hang: 86 },
    { type: 'landscape', image: 'couple-2.jpg', placeholder: false, caption: '#OurCelebration', hang: 150 },
    { type: 'story', text: "Friendship grew into something more, and we realized life's best moments were the ones we shared together.", hang: 120 },
    { type: 'portrait', image: 'couple-1.jpg', placeholder: false, caption: '#ForeverBegins', hang: 135 },
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

    social: {
      instagram: true,
      instagramUrl: 'https://www.instagram.com/rushikesh_patil.4/',
      groomInstagramUrl: 'https://www.instagram.com/rushikesh_patil.4/',
      brideInstagramUrl: '',
    },

    music: { enabled: true, src: 'music/Jashn-e-bahara Instrumental.mp3', volume: 0.8 },
  };

  function deepMerge(base, over) {
    if (Array.isArray(base) || Array.isArray(over)) return over !== undefined ? over : base;
    if (typeof base !== 'object' || base === null) return over !== undefined ? over : base;
    if (typeof over !== 'object' || over === null) return base;
    const out = {};
    Object.keys(base).forEach((k) => { out[k] = deepMerge(base[k], over[k]); });
    Object.keys(over).forEach((k) => { if (!(k in base)) out[k] = over[k]; });
    return out;
  }

  // Trial editing persists to the SERVER (a trial_drafts row keyed by the
  // shopper's browser), injected synchronously as window.__balconyTrial by
  // /try/royale/draft.js. Non-trial standalone editing uses localStorage
  // (dev/preview only; a purchased host saves over the platform bridge, which
  // platform-adapter.js installs in place of save() below).
  function load() {
    if (trial) {
      const t = window.__balconyTrial;
      return deepMerge(DEFAULTS, (t && t.draft) || {});
    }
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved) return deepMerge(DEFAULTS, saved);
    } catch (_) { /* unreadable storage - fall through to the defaults */ }
    return deepMerge(DEFAULTS, {});
  }

  // The flat fields the platform reads (see RoyaleRuntime) are derived from
  // the couple's names on every save, so they can never drift from them.
  function syncDerived() {
    const cfg = window.Royale.config;
    const bride = (cfg.brideName || '').trim();
    const groom = (cfg.groomName || '').trim();
    cfg.title = [bride, groom].filter(Boolean).join(' & ');
    cfg.hostNames = [bride, groom].filter(Boolean);
  }

  function save() {
    syncDerived();
    if (trial) {
      const t = window.__balconyTrial;
      if (!t || !t.saveUrl) return Promise.resolve(false);
      // `config`, and an Accept of JSON: the endpoint validates on that field
      // name, and without the header a validation failure comes back as a
      // redirect rather than a 422 - a silent no-save.
      return fetch(t.saveUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': t.csrf || '',
        },
        body: JSON.stringify({ config: window.Royale.config }),
        credentials: 'same-origin',
      }).then((r) => r.ok).catch(() => false);
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(window.Royale.config));
      return true;
    } catch (_) {
      return false;
    }
  }

  function reset() {
    if (trial) {
      const t = window.__balconyTrial;
      if (t && t.saveUrl) {
        fetch(t.saveUrl, {
          method: 'DELETE',
          headers: { 'X-CSRF-TOKEN': t.csrf || '' },
          credentials: 'same-origin',
        }).catch(() => {});
      }
      return;
    }
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) { /* ignore */ }
  }

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
  ));

  const nl2br = (s) => esc(s).replace(/\n/g, '<br />');

  function guestName() {
    return (params.get('to') || '').trim().slice(0, 80);
  }

  // '2026-02-08' -> 'Sun, 8 Feb 2026' / '19:30' -> '7:30 PM', for the ceremony
  // cards and anything else that prints one of them.
  function fmtDate(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return '';
    const d = new Date(+m[1], +m[2] - 1, +m[3]);
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  }

  function fmtTime(hhmm) {
    const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm || ''));
    if (!m) return '';
    return new Date(2000, 0, 1, +m[1], +m[2])
      .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  /** An explicit maps link if the host set one, else a search for the venue. */
  function mapLink(c) {
    const own = ((c && c.mapUrl) || '').trim();
    if (own) return own;
    const venue = ((c && c.venue) || '').trim();
    return venue ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(venue) : '';
  }

  // ---- Ceremonies the couple adds themselves -------------------------------
  // Beyond the six rites the template ships with, a host may add up to this
  // many of their own (custom: true), each with a photo they upload in place
  // of the template's artwork. Keep in step with CUSTOM_CEREMONY_MAX in
  // EventEditorController, which refuses a save carrying more.
  //
  // An added ceremony carries a permanent `id`, which is its RSVP key (see
  // RoyaleRuntime::rsvpEvents). The six built-in ones keep the array position
  // they have always been keyed by, so nothing already replied to moves.
  const CUSTOM_CEREMONY_MAX = 5;

  // How far an added ceremony's photo may be zoomed out: below 1 it no
  // longer covers its area, so a cut-out picture can be shown whole. (Zooming
  // in stops at 3, as a gallery picture's does.)
  const CEREMONY_ZOOM_MIN = 0.3;

  /**
   * Does a guest see this ceremony? A built-in one unless the host switched it
   * off. An added one also needs its name and its photo: it has no artwork of
   * its own to fall back on, so until both are in it stays on the host's side.
   * The cards, the locations and calendar popups and the RSVP list all ask
   * this same question (the last in RoyaleRuntime, in PHP).
   */
  function ceremonyLive(c) {
    if (!c || c.enabled === false) return false;
    if (!c.custom) return true;
    return !!((c.art || '').trim() && (c.name || '').trim());
  }

  /**
   * The ceremonies in the order they happen - by date, then time - which is
   * how they are drawn. A copy: the stored array keeps its own order, since
   * that order is what the built-in ceremonies' RSVP keys are. No date sorts
   * last, no time first on its day; equal ones keep their stored order.
   */
  function ceremoniesByDate(list) {
    const when = (c) => (/^\d{4}-\d{2}-\d{2}$/.test(c.date || '') ? c.date : '9999-99-99') + ' ' + (c.time || '');
    return (Array.isArray(list) ? list : []).slice().sort((a, b) => when(a).localeCompare(when(b)));
  }

  window.Royale = {
    mode,
    trial,
    TRIAL_EDITABLE,
    /** Can this config path be edited in the current mode? */
    canEdit: function (path) {
      if (mode !== 'edit') return false;
      return trial ? TRIAL_EDITABLE.indexOf(path) !== -1 : true;
    },
    config: load(),
    DEFAULTS,
    SYMBOLS,
    INVOCATIONS,
    symbolById,
    invocationLines,
    STORAGE_KEY,
    addDaysISO,
    save,
    reset,
    syncDerived,
    esc,
    nl2br,
    guestName,
    fmtDate,
    fmtTime,
    mapLink,
    CUSTOM_CEREMONY_MAX,
    CEREMONY_ZOOM_MIN,
    ceremonyLive,
    ceremoniesByDate,
  };

  if (mode === 'edit') document.body.classList.add('is-editing');
  if (mode === 'preview') document.body.classList.add('is-previewing');
  if (trial) document.body.classList.add('is-trial');
})();
