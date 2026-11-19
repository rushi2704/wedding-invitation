/**
 * Royal Mobile Wedding Invitation — Rushikesh & Bhakti
 * Interactions, Mobile Audio Controller, Canvas Particles
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- Element References ---
  const envelopeGate = document.getElementById('envelopeGate');
  const openInviteBtn = document.getElementById('openInviteBtn');
  const bgAudioVideo = document.getElementById('bgAudioVideo');
  const bgAudioFallback = document.getElementById('bgAudioFallback');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const revealBtn = document.getElementById('revealBtn');
  const valDate = document.getElementById('valDate');
  const valMonth = document.getElementById('valMonth');
  const valYear = document.getElementById('valYear');
  const followModal = document.getElementById('followModal');
  const openInstagramBtn = document.getElementById('openInstagramBtn');
  const notNowBtn = document.getElementById('notNowBtn');
  const petalCanvas = document.getElementById('petalCanvas');

  let isPlaying = false;

  // =========================================================================
  // 1. AUDIO PLAYBACK (FROM EXACT VIDEO SONG)
  // =========================================================================
  function playSong() {
    let playPromise = null;
    try {
      if (bgAudioVideo) {
        bgAudioVideo.muted = false;
        playPromise = bgAudioVideo.play();
      }
    } catch (e) {}

    if (playPromise !== null) {
      playPromise.then(() => {
        isPlaying = true;
        document.body.classList.add('music-playing');
      }).catch(() => {
        // Fallback to audio element
        if (bgAudioFallback) {
          bgAudioFallback.play().then(() => {
            isPlaying = true;
            document.body.classList.add('music-playing');
          }).catch(err => console.log('Audio autoplay blocked:', err));
        }
      });
    } else if (bgAudioFallback) {
      bgAudioFallback.play().then(() => {
        isPlaying = true;
        document.body.classList.add('music-playing');
      }).catch(err => console.log('Audio error:', err));
    }
  }

  function pauseSong() {
    if (bgAudioVideo) bgAudioVideo.pause();
    if (bgAudioFallback) bgAudioFallback.pause();
    isPlaying = false;
    document.body.classList.remove('music-playing');
  }

  musicToggleBtn.addEventListener('click', () => {
    if (isPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  });

  // =========================================================================
  // 2. ENVELOPE OPENING ANIMATION (EXACT VIDEO 00:01)
  // =========================================================================
  openInviteBtn.addEventListener('click', () => {
    // 1. Play song immediately upon user tap
    playSong();

    // 2. Animate envelope open
    envelopeGate.classList.add('opened');

    // 3. Trigger celebratory rose petal burst
    burstConfetti();

    // 4. Scroll smoothly to top of mandap
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Show follow modal after user scrolls a bit
    let modalShown = false;
    window.addEventListener('scroll', () => {
      if (!modalShown && window.scrollY > 1200) {
        modalShown = true;
        setTimeout(() => {
          followModal.classList.add('active');
        }, 800);
      }
    });
  });

  // =========================================================================
  // 3. "REVEAL THE DATE" COUNTER ANIMATION & CONFETTI
  // =========================================================================
  revealBtn.addEventListener('click', () => {
    burstConfetti();
    
    // Quick number roll effect
    let count = 0;
    const interval = setInterval(() => {
      count++;
      valDate.textContent = String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0');
      if (count > 8) {
        clearInterval(interval);
        valDate.textContent = "03";
        valMonth.textContent = "APR";
        valYear.textContent = "2027";
      }
    }, 60);

    revealBtn.textContent = "✦ Date Revealed! ✦";
    setTimeout(() => {
      revealBtn.textContent = "Reveal the Date";
    }, 2500);
  });

  // =========================================================================
  // 4. MODAL INTERACTIONS (EXACT VIDEO 00:38)
  // =========================================================================
  notNowBtn.addEventListener('click', () => {
    followModal.classList.remove('active');
  });

  openInstagramBtn.addEventListener('click', () => {
    window.open('https://instagram.com', '_blank');
    followModal.classList.remove('active');
  });

  followModal.addEventListener('click', (e) => {
    if (e.target === followModal) followModal.classList.remove('active');
  });

  // =========================================================================
  // 5. CANVAS PARTICLES: FLOATING ROSE PETALS & GOLD SPARKLES
  // =========================================================================
  const ctx = petalCanvas.getContext('2d');
  let width = petalCanvas.width = window.innerWidth;
  let height = petalCanvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = petalCanvas.width = window.innerWidth;
    height = petalCanvas.height = window.innerHeight;
  });

  const particles = [];
  const maxParticles = 35;

  class Petal {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * -height;
      this.size = Math.random() * 8 + 5;
      this.speedY = Math.random() * 1.6 + 0.8;
      this.speedX = Math.sin(Math.random() * 2) * 0.6;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 2;
      this.isPetal = Math.random() > 0.35;
      this.color = this.isPetal ? (Math.random() > 0.5 ? '#991B1B' : '#E11D48') : '#F59E0B';
      this.opacity = Math.random() * 0.6 + 0.35;
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.01) * 0.7 + this.speedX;
      this.rotation += this.rotSpeed;

      if (this.y > height + 20) {
        this.reset();
        this.y = -10;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;

      if (this.isPetal) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.6, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < maxParticles; i++) {
    const p = new Petal();
    p.y = Math.random() * height;
    particles.push(p);
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(loop);
  }
  loop();

  function burstConfetti() {
    for (let i = 0; i < 45; i++) {
      const p = new Petal();
      p.x = width / 2 + (Math.random() - 0.5) * 250;
      p.y = height * 0.45 + (Math.random() - 0.5) * 80;
      p.speedY = (Math.random() - 0.3) * 6;
      p.speedX = (Math.random() - 0.5) * 7;
      p.opacity = 0.95;
      particles.push(p);
    }
    setTimeout(() => {
      while (particles.length > maxParticles) {
        particles.pop();
      }
    }, 3500);
  }

});
