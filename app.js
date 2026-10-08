/**
 * YOGA INNER POWER — HOME SANCTUARY
 * Interactive Client Logic & Experience Enhancements
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initAmbientChime();
  initPranayamaGuide();
  initChakraSanctuary();
  initStyleFilters();
  initScheduleTabs();
  initBookingModal();
  initSutraRotation();
  initSmoothScroll();
});

/* ==========================================================================
   1. Sticky Header & Scroll Spy
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   2. Web Audio API — Tibetan Singing Bowl Chime (432Hz Healing Frequency)
   ========================================================================== */
function initAmbientChime() {
  const chimeBtn = document.getElementById('chime-btn');
  if (!chimeBtn) return;

  let audioCtx = null;

  chimeBtn.addEventListener('click', () => {
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      playSingingBowl(audioCtx);

      // Button feedback
      const label = chimeBtn.querySelector('.chime-label');
      if (label) {
        const originalText = label.textContent;
        label.textContent = 'Harmonizing...';
        setTimeout(() => {
          label.textContent = originalText;
        }, 3000);
      }
    } catch (e) {
      console.warn('Web Audio API not supported or user blocked audio.', e);
    }
  });
}

function playSingingBowl(ctx) {
  const now = ctx.currentTime;
  const fundamental = 432; // Meditative natural frequency

  // Overtones characteristic of singing bowls
  const harmonics = [
    { freq: fundamental, gain: 0.35, decay: 4.5 },
    { freq: fundamental * 2.76, gain: 0.12, decay: 3.8 },
    { freq: fundamental * 5.4, gain: 0.05, decay: 2.5 },
    { freq: fundamental * 0.5, gain: 0.18, decay: 5.0 } // Deep warm undertone
  ];

  harmonics.forEach(h => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(h.freq, now);

    // Warm soft attack
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(h.gain, now + 0.15);
    // Smooth resonant decay
    gain.gain.exponentialRampToValueAtTime(0.0001, now + h.decay);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + h.decay);
  });
}

/* ==========================================================================
   3. Pranayama Breathing Sanctuary Widget (Guided Breathwork)
   ========================================================================== */
function initPranayamaGuide() {
  const circle = document.getElementById('breath-circle');
  const phaseLabel = document.getElementById('breath-phase');
  const secLabel = document.getElementById('breath-seconds');
  const toggleBtn = document.getElementById('breath-toggle');

  if (!circle || !phaseLabel || !secLabel || !toggleBtn) return;

  let isRunning = false;
  let intervalId = null;
  let countdownId = null;

  // Box Breathing cycle: Inhale (4s) -> Hold (4s) -> Exhale (4s) -> Rest (2s)
  const phases = [
    { name: 'Inhale', className: 'inhale', duration: 4 },
    { name: 'Hold', className: 'hold', duration: 4 },
    { name: 'Exhale', className: 'exhale', duration: 4 },
    { name: 'Rest', className: 'exhale', duration: 2 }
  ];

  let currentPhaseIndex = 0;
  let currentCountdown = phases[0].duration;

  function updatePhase() {
    const phase = phases[currentPhaseIndex];
    phaseLabel.textContent = phase.name;
    circle.className = `breath-circle ${phase.className}`;
    currentCountdown = phase.duration;
    secLabel.textContent = `${currentCountdown}s`;

    clearInterval(countdownId);
    countdownId = setInterval(() => {
      currentCountdown--;
      if (currentCountdown > 0) {
        secLabel.textContent = `${currentCountdown}s`;
      }
    }, 1000);

    intervalId = setTimeout(() => {
      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      updatePhase();
    }, phase.duration * 1000);
  }

  function startBreathing() {
    isRunning = true;
    toggleBtn.textContent = 'Pause Breath';
    toggleBtn.style.background = 'var(--primary-container)';
    toggleBtn.style.color = 'var(--surface)';
    currentPhaseIndex = 0;
    updatePhase();
  }

  function stopBreathing() {
    isRunning = false;
    clearTimeout(intervalId);
    clearInterval(countdownId);
    toggleBtn.textContent = 'Begin Practice';
    toggleBtn.style.background = '';
    toggleBtn.style.color = '';
    circle.className = 'breath-circle';
    phaseLabel.textContent = 'Breathe';
    secLabel.textContent = '4s';
  }

  toggleBtn.addEventListener('click', () => {
    if (isRunning) {
      stopBreathing();
    } else {
      startBreathing();
    }
  });
}

/* ==========================================================================
   4. Styles of Practice Filters
   ========================================================================== */
function initStyleFilters() {
  const chips = document.querySelectorAll('.style-filter-chip');
  const cards = document.querySelectorAll('.style-card');

  if (!chips.length || !cards.length) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filterValue = chip.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-style');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

window.filterStyle = function(styleKey) {
  const chip = document.querySelector(`.style-filter-chip[data-filter="${styleKey}"]`);
  if (chip) {
    chip.click();
  }
};

/* ==========================================================================
   5. Weekly Class Schedule Tabs
   ========================================================================== */
const scheduleData = {
  mon: [
    { time: '06:30 AM — 07:45 AM', title: 'Classical Hatha Awakening', teacher: 'Dr. Shikha Arya', level: 'All Levels', spots: 3 },
    { time: '08:15 AM — 09:30 AM', title: 'Dynamic Vinyasa Flow', teacher: 'Studio Master', level: 'Intermediate', spots: 5 },
    { time: '05:30 PM — 06:45 PM', title: 'Therapeutic Spinal Alignment', teacher: 'Dr. Shikha Arya', level: 'Gentle & Healing', spots: 2 },
    { time: '07:15 PM — 08:15 PM', title: 'Yin & Deep Restorative', teacher: 'Senior Guide', level: 'Restorative', spots: 4 }
  ],
  tue: [
    { time: '06:30 AM — 07:45 AM', title: 'Ashtanga Primary Series', teacher: 'Studio Master', level: 'Dynamic Practice', spots: 4 },
    { time: '09:00 AM — 10:15 AM', title: 'Gentle Pranayama & Meditation', teacher: 'Dr. Shikha Arya', level: 'All Levels', spots: 6 },
    { time: '06:00 PM — 07:15 PM', title: 'Kundalini Energy Activation', teacher: 'Dr. Shikha Arya', level: 'Spiritual', spots: 3 }
  ],
  wed: [
    { time: '06:30 AM — 07:45 AM', title: 'Hatha Prana Alignment', teacher: 'Dr. Shikha Arya', level: 'All Levels', spots: 2 },
    { time: '08:30 AM — 09:45 AM', title: 'Core Vinyasa Flow', teacher: 'Studio Master', level: 'Intermediate', spots: 4 },
    { time: '05:30 PM — 06:45 PM', title: 'Back Care & Posture Therapy', teacher: 'Dr. Shikha Arya', level: 'Therapeutic', spots: 1 },
    { time: '07:00 PM — 08:00 PM', title: 'Chakra Meditation & Sound Bath', teacher: 'Dr. Shikha Arya', level: 'Meditative', spots: 5 }
  ],
  thu: [
    { time: '06:30 AM — 07:45 AM', title: 'Dynamic Ashtanga Flow', teacher: 'Studio Master', level: 'Intermediate', spots: 4 },
    { time: '09:00 AM — 10:15 AM', title: 'Women’s Hormonal & Pelvic Yoga', teacher: 'Dr. Shikha Arya', level: 'Specialized', spots: 3 },
    { time: '06:00 PM — 07:15 PM', title: 'Yin Yoga & Myofascial Release', teacher: 'Senior Guide', level: 'Deep Calm', spots: 5 }
  ],
  fri: [
    { time: '06:30 AM — 07:45 AM', title: 'Sun Salutation & Hatha Flow', teacher: 'Dr. Shikha Arya', level: 'All Levels', spots: 3 },
    { time: '08:15 AM — 09:30 AM', title: 'Vitality Vinyasa', teacher: 'Studio Master', level: 'All Levels', spots: 4 },
    { time: '06:00 PM — 07:15 PM', title: 'Restorative Weekend Winddown', teacher: 'Dr. Shikha Arya', level: 'Restorative', spots: 2 }
  ],
  sat: [
    { time: '07:00 AM — 08:30 AM', title: 'Masterclass: Prana & Bandha', teacher: 'Dr. Shikha Arya', level: 'Immersive', spots: 2 },
    { time: '09:00 AM — 10:30 AM', title: 'Community Weekend Flow', teacher: 'Senior Guide', level: 'Open to All', spots: 6 },
    { time: '05:00 PM — 06:30 PM', title: 'Kundalini Awakening & Kriya', teacher: 'Dr. Shikha Arya', level: 'Transformative', spots: 3 }
  ],
  sun: [
    { time: '07:30 AM — 09:00 AM', title: 'Sunday Morning Silent Practice', teacher: 'Dr. Shikha Arya', level: 'Silent Sanctuary', spots: 4 },
    { time: '09:30 AM — 11:00 AM', title: 'Holistic Yoga & Breath Retreat', teacher: 'Dr. Shikha Arya', level: 'Sanctuary Workshop', spots: 2 }
  ]
};

function renderScheduleDay(dayKey) {
  const container = document.getElementById('schedule-table-body');
  if (!container) return;

  const classes = scheduleData[dayKey] || scheduleData.mon;

  container.innerHTML = classes.map(c => `
    <div class="schedule-row">
      <div class="schedule-time">${c.time}</div>
      <div class="schedule-title">
        <h4>${c.title}</h4>
        <span class="schedule-instructor">Led by ${c.teacher}</span>
      </div>
      <div>
        <span class="schedule-level">${c.level}</span>
      </div>
      <div>
        <div class="capacity-dots">
          ${Array.from({ length: 5 }, (_, i) => `<span class="dot ${i < c.spots ? '' : 'empty'}"></span>`).join('')}
        </div>
        <div class="capacity-label">${c.spots} mats left</div>
      </div>
      <div>
        <button class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.78rem;" onclick="openBookingWithClass('${c.title}')">
          Reserve Mat
        </button>
      </div>
    </div>
  `).join('');
}

function initScheduleTabs() {
  const dayPills = document.querySelectorAll('.day-pill');
  if (!dayPills.length) return;

  renderScheduleDay('mon');

  dayPills.forEach(pill => {
    pill.addEventListener('click', () => {
      dayPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const day = pill.getAttribute('data-day');
      renderScheduleDay(day);
    });
  });
}

/* ==========================================================================
   6. Interactive Sanctuary Booking Modal
   ========================================================================== */
function initBookingModal() {
  const modal = document.getElementById('booking-modal');
  const closeBtns = document.querySelectorAll('.close-modal-trigger');
  const openBtns = document.querySelectorAll('.open-booking-trigger');
  const bookingForm = document.getElementById('booking-form');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('book-name').value;
      const phone = document.getElementById('book-phone').value;
      const type = document.getElementById('book-type').value;

      modal.classList.remove('active');
      bookingForm.reset();

      showToast(`Namaste, ${name}! Your ${type} inquiry has been registered. Shikha Arya’s team will connect with you via WhatsApp (${phone}).`);
    });
  }
}

window.openBookingWithClass = function(className) {
  const modal = document.getElementById('booking-modal');
  const classSelect = document.getElementById('book-type');
  if (classSelect) {
    classSelect.value = 'Studio Group Class';
  }
  const notesField = document.getElementById('book-notes');
  if (notesField) {
    notesField.value = `Reserving: ${className}`;
  }
  if (modal) {
    modal.classList.add('active');
  }
};

function showToast(message) {
  const toast = document.getElementById('toast-notice');
  if (!toast) return;

  toast.querySelector('.toast-text').textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);
}

/* ==========================================================================
   7. Daily Sutra & Reflection Rotation
   ========================================================================== */
const sutras = [
  { text: "“Yoga is the journey of the self, through the self, to the self.”", author: "The Bhagavad Gita" },
  { text: "“Yogas chitta vritti nirodha — Yoga is the calming of the fluctuations of consciousness.”", author: "Patanjali Yoga Sutras 1.2" },
  { text: "“When the breath wanders the mind also is unsteady. But when the breath is calmed the mind too will be still.”", author: "Hatha Yoga Pradipika" },
  { text: "“The body benefits from movement, and the mind benefits from stillness.”", author: "Ancient Yogic Wisdom" }
];

function initSutraRotation() {
  const sutraTextEl = document.getElementById('rotating-sutra-text');
  const sutraAuthorEl = document.getElementById('rotating-sutra-author');
  if (!sutraTextEl || !sutraAuthorEl) return;

  let index = 0;
  setInterval(() => {
    index = (index + 1) % sutras.length;
    sutraTextEl.style.opacity = '0';
    sutraAuthorEl.style.opacity = '0';

    setTimeout(() => {
      sutraTextEl.textContent = sutras[index].text;
      sutraAuthorEl.textContent = `— ${sutras[index].author}`;
      sutraTextEl.style.opacity = '1';
      sutraAuthorEl.style.opacity = '1';
    }, 400);
  }, 7000);
}

/* ==========================================================================
   8. Smooth Anchor Navigation
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   9. Chakra Energy Sanctuary & Kundalini Audio/Visual Animations
   ========================================================================== */
const chakraData = {
  crown: {
    key: 'crown',
    chakraNum: '7',
    name: 'Crown Chakra',
    glyph: 'ॐ',
    bijaChant: 'AUM',
    bija: 'ॐ (AUM)',
    sanskritDevanagari: 'सहस्रार',
    sanskritRoman: 'Sahasrara',
    sanskrit: 'सहस्रार (Sahasrara)',
    meaning: 'Thousand-Petaled Lotus of Divine Unity',
    color: '#9b59b6',
    badge: 'Cosmic Consciousness',
    freq: 963,
    location: 'Crown of head / Fontanelle',
    element: 'Cosmic Thought & Pure Light',
    affirmation: '“I am connected to the infinite stillness, wisdom, and unity of the universe.”',
    practice: 'Silent Vipassana contemplation, Sirsasana (Headstand), Nadi Shodhana Pranayama.',
    description: 'The highest energetic vortex where individual awareness merges into universal peace. Harmonizing Sahasrara dissolves existential anxiety and brings deep meditative clarity.'
  },
  thirdeye: {
    key: 'thirdeye',
    chakraNum: '6',
    name: 'Third Eye Chakra',
    glyph: 'ॐ',
    bijaChant: 'KSHAM',
    bija: 'ॐ / क्षं (Ksham)',
    sanskritDevanagari: 'आज्ञा',
    sanskritRoman: 'Ajna',
    sanskrit: 'आज्ञा (Ajna)',
    meaning: 'Center of Command & Inner Sight',
    color: '#3867d6',
    badge: 'Intuitive Perception',
    freq: 852,
    location: 'Between eyebrows (Bhrumadhya)',
    element: 'Light & Subtle Intuition (Tejas)',
    affirmation: '“I trust my intuition, inner vision, and the clarity of my higher wisdom.”',
    practice: 'Trataka (Candle flame focus), Balasana (Child’s Pose), Shambhavi Mudra.',
    description: 'The seat of discernment, spiritual insight, and quiet focus. Balancing Ajna regulates the pineal gland and quiets repetitive mental chatter.'
  },
  throat: {
    key: 'throat',
    chakraNum: '5',
    name: 'Throat Chakra',
    glyph: 'हं',
    bijaChant: 'HAM',
    bija: 'हं (HAM)',
    sanskritDevanagari: 'विशुद्ध',
    sanskritRoman: 'Vishuddha',
    sanskrit: 'विशुद्ध (Vishuddha)',
    meaning: 'Center of Purity & Authentic Voice',
    color: '#0fb9b1',
    badge: 'Expression & Truth',
    freq: 741,
    location: 'Throat & vocal plexus',
    element: 'Ether / Space (Akasha)',
    affirmation: '“I speak my truth with calm courage, clarity, and compassionate presence.”',
    practice: 'Sarvangasana (Shoulder Stand), Matsyasana (Fish Pose), Ujjayi & Bhramari Breath.',
    description: 'The sacred gateway between heart and mind. Releases neck stiffness, thyroid imbalances, and fear of honest self-expression.'
  },
  heart: {
    key: 'heart',
    chakraNum: '4',
    name: 'Heart Chakra',
    glyph: 'यं',
    bijaChant: 'YAM',
    bija: 'यं (YAM)',
    sanskritDevanagari: 'अनाहत',
    sanskritRoman: 'Anahata',
    sanskrit: 'अनाहत (Anahata)',
    meaning: 'Unstruck Sound of Compassion',
    color: '#20bf6b',
    badge: 'Compassion & Healing',
    freq: 639,
    location: 'Center of chest / Cardiac plexus',
    element: 'Air (Vayu)',
    affirmation: '“I give and receive boundless love, forgiveness, and unconditional peace.”',
    practice: 'Ustrasana (Camel Pose), Bhujangasana (Cobra), Anahatasana (Melting Heart).',
    description: 'The vital core of emotional healing. Transmutes grief and guardedness into expansive empathy, lightness, and deep inner forgiveness.'
  },
  solar: {
    key: 'solar',
    chakraNum: '3',
    name: 'Solar Plexus Chakra',
    glyph: 'रं',
    bijaChant: 'RAM',
    bija: 'रं (RAM)',
    sanskritDevanagari: 'मणिपूर',
    sanskritRoman: 'Manipura',
    sanskrit: 'मणिपूर (Manipura)',
    meaning: 'City of Jewels & Inner Fire',
    color: '#f7b731',
    badge: 'Vital Power & Will',
    freq: 528,
    location: 'Upper abdomen / Navel center',
    element: 'Fire (Agni)',
    affirmation: '“I am confident, powerful, resilient, and master of my inner vitality.”',
    practice: 'Navasana (Boat Pose), Kapalabhati Pranayama, Virabhadrasana (Warrior Flow).',
    description: 'Ignites metabolic fire (Jatharagni), physical strength, and willpower. Dissolves self-doubt and replaces fatigue with steady enthusiasm.'
  },
  sacral: {
    key: 'sacral',
    chakraNum: '2',
    name: 'Sacral Chakra',
    glyph: 'वं',
    bijaChant: 'VAM',
    bija: 'वं (VAM)',
    sanskritDevanagari: 'स्वाधिष्ठान',
    sanskritRoman: 'Svadhisthana',
    sanskrit: 'स्वाधिष्ठान (Svadhisthana)',
    meaning: 'Where the Self Abides in Flow',
    color: '#fa8231',
    badge: 'Creativity & Flow',
    freq: 417,
    location: 'Pelvic bowl & lower abdomen',
    element: 'Water (Jala)',
    affirmation: '“I embrace creativity, joyful ease, and emotional fluid balance.”',
    practice: 'Baddha Konasana (Butterfly), Eka Pada Rajakapotasana (Pigeon), Hip Openers.',
    description: 'Governs emotional fluidity, creative inspiration, and pelvic ease. Clears lower-back tightness and restores natural joy.'
  },
  root: {
    key: 'root',
    chakraNum: '1',
    name: 'Root Chakra',
    glyph: 'लं',
    bijaChant: 'LAM',
    bija: 'लं (LAM)',
    sanskritDevanagari: 'मूलाधार',
    sanskritRoman: 'Muladhara',
    sanskrit: 'मूलाधार (Muladhara)',
    meaning: 'Root Foundation of Earth & Safety',
    color: '#eb3b5a',
    badge: 'Grounding & Foundation',
    freq: 396,
    location: 'Base of spine / Perineum',
    element: 'Earth (Prithvi)',
    affirmation: '“I am grounded, safe, supported by the earth, and deeply at peace in my body.”',
    practice: 'Tadasana (Mountain Pose), Malasana (Garland Pose), Virabhadrasana I & II.',
    description: 'Our foundational survival anchor. Releases chronic adrenaline rush, physical anxiety, and provides steady stability to the entire nervous system.'
  }
};

let chakraAudioCtx = null;

function getChakraAudioContext() {
  if (!chakraAudioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    chakraAudioCtx = new AudioContext();
  }
  if (chakraAudioCtx.state === 'suspended') {
    chakraAudioCtx.resume();
  }
  return chakraAudioCtx;
}

function playSolfeggioTone(freq, duration = 3.5) {
  try {
    const ctx = getChakraAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq * 0.5, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    subOsc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + duration);
    subOsc.stop(now + duration);
  } catch (err) {
    console.warn('Audio tone error', err);
  }
}

function renderChakraDetails(key) {
  const data = chakraData[key];
  const panel = document.getElementById('chakra-card-panel');
  if (!data || !panel) return;

  panel.innerHTML = `
    <div class="chakra-card-compact-header">
      <div class="chakra-header-main-col">
        <!-- Top Bīja Mantra Tag & Level Pill -->
        <div class="chakra-bija-pill-row">
          <span class="chakra-bija-tag" style="background: ${data.color}22; color: ${data.color}; border: 1.5px solid ${data.color}66;">
            <span class="bija-glyph-tiny">${data.glyph}</span>
            <span class="bija-sound-label">Bīja: <strong>${data.bija}</strong></span>
          </span>
          <span class="chakra-level-pill">Center #${data.chakraNum}</span>
        </div>

        <!-- Prominent Title & High-Contrast Sanskrit -->
        <div class="chakra-title-row">
          <div class="chakra-glyph-circle" style="background: ${data.color}; box-shadow: 0 4px 14px ${data.color}50;">
            ${data.glyph}
          </div>
          <div class="chakra-names-block">
            <h3 class="chakra-compact-name">${data.name}</h3>
            <div class="chakra-compact-sanskrit">
              <span class="sanskrit-native">${data.sanskritDevanagari}</span>
              <span class="sanskrit-translit">(${data.sanskritRoman})</span>
            </div>
          </div>
        </div>
      </div>

      <div class="chakra-compact-freq" style="border-color: ${data.color};">
        <span class="freq-val" style="color: ${data.color};">${data.freq} Hz</span>
        <span class="freq-sub">Solfeggio Tone</span>
      </div>
    </div>

    <div class="chakra-pills-row">
      <span class="chakra-tag-item">📍 ${data.location}</span>
      <span class="chakra-tag-item">🌿 ${data.element}</span>
      <span class="chakra-tag-item">✨ ${data.meaning}</span>
    </div>

    <div class="chakra-compact-affirmation" style="border-left-color: ${data.color};">
      <div class="affirmation-badge-line" style="color: ${data.color};">Affirmation:</div>
      <p class="affirmation-quote">${data.affirmation}</p>
    </div>

    <div class="chakra-compact-focus">
      <div class="focus-title">Yogic Focus & Alignment</div>
      <p class="focus-text">${data.description}</p>
      <div class="asana-line"><strong>Key Asanas:</strong> ${data.practice}</div>
    </div>

    <div class="chakra-compact-actions">
      <button class="btn-sound-frequency" onclick="playSolfeggioTone(${data.freq})">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
        Play ${data.freq}Hz Harmonics
      </button>

      <button class="btn-primary" style="padding: 0.6rem 1.15rem; font-size: 0.8rem;" onclick="openBookingWithClass('${data.name} Alignment')">
        Book Session
      </button>
    </div>
  `;
}

function initChakraSanctuary() {
  const nodeButtons = document.querySelectorAll('.chakra-node-btn');
  const sideLabels = document.querySelectorAll('.chakra-side-label');
  const kundaliniBtn = document.getElementById('btn-kundalini-flow');
  const particle = document.getElementById('kundalini-particle');

  if (!nodeButtons.length) return;

  function selectChakra(chakraKey) {
    nodeButtons.forEach(b => b.classList.remove('active'));
    sideLabels.forEach(l => l.classList.remove('active'));

    const activeBtn = document.querySelector(`.chakra-node-btn[data-chakra="${chakraKey}"]`);
    const activeLabel = document.querySelector(`.chakra-side-label[data-chakra="${chakraKey}"]`);

    if (activeBtn) activeBtn.classList.add('active');
    if (activeLabel) activeLabel.classList.add('active');

    const data = chakraData[chakraKey];
    if (data) {
      renderChakraDetails(chakraKey);
      playSolfeggioTone(data.freq, 3.5);
    }
  }

  // Render initial default chakra
  renderChakraDetails('crown');

  nodeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const chakraKey = btn.getAttribute('data-chakra');
      selectChakra(chakraKey);
    });
  });

  sideLabels.forEach(lbl => {
    lbl.addEventListener('click', () => {
      const chakraKey = lbl.getAttribute('data-chakra');
      selectChakra(chakraKey);
    });
  });

  // Kundalini Rising Prana Flow Animation
  if (kundaliniBtn) {
    kundaliniBtn.addEventListener('click', () => {
      const order = ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown'];
      let idx = 0;

      kundaliniBtn.disabled = true;
      kundaliniBtn.style.opacity = '0.7';

      function playNextChakra() {
        if (idx < order.length) {
          const key = order[idx];
          const targetBtn = document.querySelector(`.chakra-node-btn[data-chakra="${key}"]`);
          const targetLbl = document.querySelector(`.chakra-side-label[data-chakra="${key}"]`);
          
          nodeButtons.forEach(b => b.classList.remove('active'));
          sideLabels.forEach(l => l.classList.remove('active'));
          if (targetBtn) targetBtn.classList.add('active');
          if (targetLbl) targetLbl.classList.add('active');

          const data = chakraData[key];
          if (data) {
            renderChakraDetails(key);
            playSolfeggioTone(data.freq, 1.2);
          }

          // Move the animated SVG particle
          if (particle) {
            const yPositions = { root: 502, sacral: 422, solar: 342, heart: 268, throat: 200, thirdeye: 136, crown: 72 };
            particle.setAttribute('cy', yPositions[key]);
            particle.setAttribute('fill', data.color);
          }

          idx++;
          setTimeout(playNextChakra, 650);
        } else {
          // Finished: celebrate with final radiant chord
          kundaliniBtn.disabled = false;
          kundaliniBtn.style.opacity = '1';
          playSolfeggioTone(963, 4.0);
          showToast('✨ Kundalini Prana awakened! Energy flows freely from Root to Crown.');
        }
      }

      playNextChakra();
    });
  }
}

/* ==========================================================================
   10. Responsive Mobile Drawer Navigation
   ========================================================================== */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  const backdrop = document.getElementById('mobile-nav-backdrop');
  const closeBtn = document.getElementById('mobile-nav-close-btn');
  const navLinks = document.querySelectorAll('.mobile-nav-link, .mobile-subnav-link');
  const accordionToggle = document.getElementById('mobile-accordion-toggle');
  const accordionItem = accordionToggle ? accordionToggle.closest('.mobile-accordion-item') : null;

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('is-open');
    toggleBtn.classList.add('is-active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    toggleBtn.classList.remove('is-active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    if (drawer.classList.contains('is-open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  if (accordionToggle && accordionItem) {
    accordionToggle.addEventListener('click', (e) => {
      e.preventDefault();
      accordionItem.classList.toggle('is-open');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });
}

