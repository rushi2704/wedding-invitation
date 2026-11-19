const fs = require('fs');
const path = require('path');

const dir = __dirname;

let html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

// 1. Replace Hero Names
html = html.replace(/<span class="royale-couple__name" id="ryBrideName">.*?<\/span>/, '<span class="royale-couple__name" id="ryBrideName">Bhakti</span>');
html = html.replace(/<span class="royale-couple__name" id="ryGroomName">.*?<\/span>/, '<span class="royale-couple__name" id="ryGroomName">Rushikesh</span>');

// 2. Replace Opening Gate card names
html = html.replace(/id="ryGuestGreeting">.*?<\/p>/, 'id="ryGuestGreeting">Dear Family & Friends</p>');

// 3. Replace Groom Family Scroll
html = html.replace(/id="ryGroomCardName">.*?<\/h2>/, 'id="ryGroomCardName">Chi. Rushikesh Patil</h2>');
html = html.replace(/id="ryGroomParentA">.*?<\/span>/, 'id="ryGroomParentA">Shri & Smt. Patil</span>');
html = html.replace(/id="ryGroomParentB">.*?<\/span>/, 'id="ryGroomParentB"></span>');
html = html.replace(/id="ryGroomGrandA">.*?<\/span>/, 'id="ryGroomGrandA">Late Shri & Late Smt. Patil</span>');
html = html.replace(/id="ryGroomGrandB">.*?<\/span>/, 'id="ryGroomGrandB"></span>');

// 4. Replace Bride Family Scroll
html = html.replace(/id="ryBrideCardName">.*?<\/h2>/, 'id="ryBrideCardName">Kum. Bhakti</h2>');
html = html.replace(/id="ryBrideParentA">.*?<\/span>/, 'id="ryBrideParentA">Proud Parents</span>');
html = html.replace(/id="ryBrideParentB">.*?<\/span>/, 'id="ryBrideParentB"></span>');
html = html.replace(/id="ryBrideGrandA">.*?<\/span>/, 'id="ryBrideGrandA">Beloved Grandparents</span>');
html = html.replace(/id="ryBrideGrandB">.*?<\/span>/, 'id="ryBrideGrandB"></span>');

// 5. Replace Date Reveal target date to 2027-04-03
html = html.replace(/id="ryDateReveal" data-date=".*?"/, 'id="ryDateReveal" data-date="2027-04-03"');

// 6. Replace Compliments
const newCompliments = `
            <div class="royale-scroll__lines" id="ryComplimentLines">
                <p class="royale-scroll__line">Patil Family & Near Relatives</p>
                <p class="royale-scroll__line">All Friends, Family & Well Wishers</p>
                <p class="royale-scroll__line">Kith & Kin of Rushikesh & Bhakti</p>
            </div>
`;
html = html.replace(/<div class="royale-scroll__lines" id="ryComplimentLines">[\s\S]*?<\/div>/, newCompliments.trim());

// 7. Replace Note From Us
html = html.replace(/id="ryNoteText">[\s\S]*?<\/p>/, 'id="ryNoteText">Complimentary valet parking is available at the main entrance of Guru Lawn for our wedding day.</p>');
html = html.replace(/id="ryNoteLead">.*?<\/h3>/, 'id="ryNoteLead">Things to Note</h3>');

// 8. Replace Outro Easel
html = html.replace(/class="royale-outro__names">.*?<\/p>/, 'class="royale-outro__names">Rushikesh & Bhakti</p>');
html = html.replace(/class="royale-outro__line">.*?<\/p>/, 'class="royale-outro__line">Your Presence Means the World to Us</p>');

// 9. Replace Ceremonies with the Exact 6 Ceremonies
const newCeremoniesGrid = `
        <div class="ryc-grid">
            <!-- 1. Ring Ceremony -->
            <article class="ryc-card" data-offset="-1" data-time="18:00">
                <div class="ryc-card__inner">
                    <div class="ryc-card__artwell">
                        <img class="ryc-card__art" src="media/ring_ceremony.webp" alt="" aria-hidden="true" loading="lazy" decoding="async">
                    </div>
                    <h3 class="ryc-card__name">Ring Ceremony</h3>
                    <div class="ryc-card__foot">
                        <div class="ryc-card__where">
                            <p class="ryc-card__venue">Guru Lawn, Chh. Sambhajinagar</p>
                            <a class="ryc-card__map" href="https://maps.app.goo.gl/BL4yUzY11Fpd2zbA7" target="_blank" rel="noopener" aria-label="Guru Lawn on map">
                                <img src="media/location.svg" alt="" aria-hidden="true" loading="lazy" decoding="async">
                            </a>
                        </div>
                        <p class="ryc-card__when">
                            <span class="ryc-card__date">Fri, 2 Apr 2027</span>
                            <span class="ryc-card__time">6:00 PM</span>
                        </p>
                    </div>
                </div>
            </article>

            <img class="ryc-divider" src="media/divider2.png" alt="" aria-hidden="true" loading="lazy" decoding="async">

            <!-- 2. Haldi -->
            <article class="ryc-card" data-offset="-1" data-time="19:00">
                <div class="ryc-card__inner">
                    <div class="ryc-card__artwell">
                        <img class="ryc-card__art" src="media/haldi.webp" alt="" aria-hidden="true" loading="lazy" decoding="async">
                    </div>
                    <h3 class="ryc-card__name">Haldi</h3>
                    <div class="ryc-card__foot">
                        <div class="ryc-card__where">
                            <p class="ryc-card__venue">Guru Lawn, Chh. Sambhajinagar</p>
                            <a class="ryc-card__map" href="https://maps.app.goo.gl/BL4yUzY11Fpd2zbA7" target="_blank" rel="noopener" aria-label="Guru Lawn on map">
                                <img src="media/location.svg" alt="" aria-hidden="true" loading="lazy" decoding="async">
                            </a>
                        </div>
                        <p class="ryc-card__when">
                            <span class="ryc-card__date">Fri, 2 Apr 2027</span>
                            <span class="ryc-card__time">7:00 PM</span>
                        </p>
                    </div>
                </div>
            </article>

            <img class="ryc-divider" src="media/divider2.png" alt="" aria-hidden="true" loading="lazy" decoding="async">

            <!-- 3. Sangeet -->
            <article class="ryc-card" data-offset="-1" data-time="20:00">
                <div class="ryc-card__inner">
                    <div class="ryc-card__artwell">
                        <img class="ryc-card__art" src="media/sangeet.webp" alt="" aria-hidden="true" loading="lazy" decoding="async">
                    </div>
                    <h3 class="ryc-card__name">Sangeet</h3>
                    <div class="ryc-card__foot">
                        <div class="ryc-card__where">
                            <p class="ryc-card__venue">Guru Lawn, Chh. Sambhajinagar</p>
                            <a class="ryc-card__map" href="https://maps.app.goo.gl/BL4yUzY11Fpd2zbA7" target="_blank" rel="noopener" aria-label="Guru Lawn on map">
                                <img src="media/location.svg" alt="" aria-hidden="true" loading="lazy" decoding="async">
                            </a>
                        </div>
                        <p class="ryc-card__when">
                            <span class="ryc-card__date">Fri, 2 Apr 2027</span>
                            <span class="ryc-card__time">8:00 PM</span>
                        </p>
                    </div>
                </div>
            </article>

            <img class="ryc-divider ryc-divider--row" src="media/divider2.png" alt="" aria-hidden="true" loading="lazy" decoding="async">

            <!-- 4. Vivaah (Muhurat) -->
            <article class="ryc-card" data-offset="0" data-time="07:00">
                <div class="ryc-card__inner">
                    <div class="ryc-card__artwell">
                        <img class="ryc-card__art" src="media/vivaah.webp" alt="" aria-hidden="true" loading="lazy" decoding="async">
                    </div>
                    <h3 class="ryc-card__name">Vivaah (Muhurat)</h3>
                    <div class="ryc-card__foot">
                        <div class="ryc-card__where">
                            <p class="ryc-card__venue">Guru Lawn, Chh. Sambhajinagar</p>
                            <a class="ryc-card__map" href="https://maps.app.goo.gl/BL4yUzY11Fpd2zbA7" target="_blank" rel="noopener" aria-label="Guru Lawn on map">
                                <img src="media/location.svg" alt="" aria-hidden="true" loading="lazy" decoding="async">
                            </a>
                        </div>
                        <p class="ryc-card__when">
                            <span class="ryc-card__date">Sat, 3 Apr 2027</span>
                            <span class="ryc-card__time">7:00 AM Onwards</span>
                        </p>
                    </div>
                </div>
            </article>

            <img class="ryc-divider" src="media/divider2.png" alt="" aria-hidden="true" loading="lazy" decoding="async">

            <!-- 5. Reception -->
            <article class="ryc-card" data-offset="0" data-time="12:30">
                <div class="ryc-card__inner">
                    <div class="ryc-card__artwell">
                        <img class="ryc-card__art" src="media/reception.webp" alt="" aria-hidden="true" loading="lazy" decoding="async">
                    </div>
                    <h3 class="ryc-card__name">Reception</h3>
                    <div class="ryc-card__foot">
                        <div class="ryc-card__where">
                            <p class="ryc-card__venue">Guru Lawn, Chh. Sambhajinagar</p>
                            <a class="ryc-card__map" href="https://maps.app.goo.gl/BL4yUzY11Fpd2zbA7" target="_blank" rel="noopener" aria-label="Guru Lawn on map">
                                <img src="media/location.svg" alt="" aria-hidden="true" loading="lazy" decoding="async">
                            </a>
                        </div>
                        <p class="ryc-card__when">
                            <span class="ryc-card__date">Sat, 3 Apr 2027</span>
                            <span class="ryc-card__time">12:30 PM</span>
                        </p>
                    </div>
                </div>
            </article>

            <img class="ryc-divider" src="media/divider2.png" alt="" aria-hidden="true" loading="lazy" decoding="async">

            <!-- 6. Preeti Bhoj (Grand Lunch) -->
            <article class="ryc-card" data-offset="0" data-time="13:00">
                <div class="ryc-card__inner">
                    <div class="ryc-card__artwell">
                        <img class="ryc-card__art" src="media/mehendi.webp" alt="" aria-hidden="true" loading="lazy" decoding="async">
                    </div>
                    <h3 class="ryc-card__name">Preeti Bhoj (Grand Lunch)</h3>
                    <div class="ryc-card__foot">
                        <div class="ryc-card__where">
                            <p class="ryc-card__venue">Dining Hall, Guru Lawn</p>
                            <a class="ryc-card__map" href="https://maps.app.goo.gl/BL4yUzY11Fpd2zbA7" target="_blank" rel="noopener" aria-label="Guru Lawn on map">
                                <img src="media/location.svg" alt="" aria-hidden="true" loading="lazy" decoding="async">
                            </a>
                        </div>
                        <p class="ryc-card__when">
                            <span class="ryc-card__date">Sat, 3 Apr 2027</span>
                            <span class="ryc-card__time">1:00 PM Onwards</span>
                        </p>
                    </div>
                </div>
            </article>
        </div>
`;

html = html.replace(/<div class="ryc-grid">[\s\S]*?<\/section>/, newCeremoniesGrid.trim() + '\n    </section>');

// 10. Update Gallery: Centered swipe hint on top of frames + Real Couple Photos
const newGallerySection = `
    <section class="royale-gallery" aria-label="Our story in pictures">
        <img class="royale-gallery__divider" src="media/divider3.png" alt="" aria-hidden="true" loading="lazy" decoding="async">

        <div class="royale-gallery__scroll" id="ryGalleryScroll">
            <div class="royale-gallery__track">
                <div class="royale-gallery__rail" aria-hidden="true"></div>

                <!-- Frame 1: Couple 1 Portrait -->
                <div class="gframe gframe--portrait" style="--hang: 118px;">
                    <span class="gframe__hook" aria-hidden="true"></span>
                    <svg class="gframe__cord" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                        <path d="M50 0L0 100M50 0L100 100" /><path class="gframe__twist" d="M50 0L0 100M50 0L100 100" />
                    </svg>
                    <div class="gframe__body">
                        <span class="gframe__side gframe__side--top"></span><span class="gframe__side gframe__side--right"></span>
                        <span class="gframe__side gframe__side--bottom"></span><span class="gframe__side gframe__side--left"></span>
                        <div class="gframe__face"><div class="gframe__lip">
                            <div class="gframe__mat">
                                <div class="gframe__viewport">
                                    <img class="gframe__img" src="couple-1.jpg" alt="Rushikesh & Bhakti" style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                            </div>
                            <span class="gframe__tag">#RushikeshWedsBhakti</span>
                        </div></div>
                    </div>
                </div>

                <!-- Frame 2: Story Card 1 -->
                <div class="gframe gframe--story" style="--hang: 86px;">
                    <span class="gframe__hook" aria-hidden="true"></span>
                    <svg class="gframe__cord" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                        <path d="M50 0L0 100M50 0L100 100" /><path class="gframe__twist" d="M50 0L0 100M50 0L100 100" />
                    </svg>
                    <div class="gframe__body">
                        <span class="gframe__side gframe__side--top"></span><span class="gframe__side gframe__side--right"></span>
                        <span class="gframe__side gframe__side--bottom"></span><span class="gframe__side gframe__side--left"></span>
                        <div class="gframe__face"><div class="gframe__lip">
                            <div class="gframe__mat gframe__story">
                                <p>Some stories begin with grand gestures. Ours started with a simple conversation.</p>
                            </div>
                        </div></div>
                    </div>
                </div>

                <!-- Frame 3: Couple 2 Landscape (Sunset Swing) -->
                <div class="gframe gframe--landscape" style="--hang: 140px;">
                    <span class="gframe__hook" aria-hidden="true"></span>
                    <svg class="gframe__cord" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                        <path d="M50 0L0 100M50 0L100 100" /><path class="gframe__twist" d="M50 0L0 100M50 0L100 100" />
                    </svg>
                    <div class="gframe__body">
                        <span class="gframe__side gframe__side--top"></span><span class="gframe__side gframe__side--right"></span>
                        <span class="gframe__side gframe__side--bottom"></span><span class="gframe__side gframe__side--left"></span>
                        <div class="gframe__face"><div class="gframe__lip">
                            <div class="gframe__mat">
                                <div class="gframe__viewport">
                                    <img class="gframe__img" src="couple-2.jpg" alt="Rushikesh & Bhakti" style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                            </div>
                            <span class="gframe__tag">#ForeverBegins</span>
                        </div></div>
                    </div>
                </div>

                <!-- Frame 4: Story Card 2 -->
                <div class="gframe gframe--story" style="--hang: 110px;">
                    <span class="gframe__hook" aria-hidden="true"></span>
                    <svg class="gframe__cord" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                        <path d="M50 0L0 100M50 0L100 100" /><path class="gframe__twist" d="M50 0L0 100M50 0L100 100" />
                    </svg>
                    <div class="gframe__body">
                        <span class="gframe__side gframe__side--top"></span><span class="gframe__side gframe__side--right"></span>
                        <span class="gframe__side gframe__side--bottom"></span><span class="gframe__side gframe__side--left"></span>
                        <div class="gframe__face"><div class="gframe__lip">
                            <div class="gframe__mat gframe__story">
                                <p>Friendship grew into something more, and we realized life's best moments were the ones we shared together.</p>
                            </div>
                        </div></div>
                    </div>
                </div>

                <!-- Frame 5: Couple 1 Portrait -->
                <div class="gframe gframe--portrait" style="--hang: 130px;">
                    <span class="gframe__hook" aria-hidden="true"></span>
                    <svg class="gframe__cord" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                        <path d="M50 0L0 100M50 0L100 100" /><path class="gframe__twist" d="M50 0L0 100M50 0L100 100" />
                    </svg>
                    <div class="gframe__body">
                        <span class="gframe__side gframe__side--top"></span><span class="gframe__side gframe__side--right"></span>
                        <span class="gframe__side gframe__side--bottom"></span><span class="gframe__side gframe__side--left"></span>
                        <div class="gframe__face"><div class="gframe__lip">
                            <div class="gframe__mat">
                                <div class="gframe__viewport">
                                    <img class="gframe__img" src="couple-1.jpg" alt="Rushikesh & Bhakti" style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                            </div>
                            <span class="gframe__tag">#TogetherForever</span>
                        </div></div>
                    </div>
                </div>

            </div>
        </div>
    </section>
`;

html = html.replace(/<section class="royale-gallery"[\s\S]*?<\/section>/, newGallerySection.trim());

// 11. Background music is provided by _platform/music.js; keep the shared
// circular icon control and do not inject a duplicate text player.

fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
console.log("index.html fully updated and baked with all couple details!");
