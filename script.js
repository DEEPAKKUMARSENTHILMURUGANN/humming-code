document.addEventListener('DOMContentLoaded', () => {

    // Force clear any stuck overflow from intro
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    // â”€â”€ 1. Lenis smooth scroll â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    let lenis;
    try {
        lenis = new Lenis({
            lerp: 0.1,
            smoothWheel: true
        });
        gsap.registerPlugin(ScrollTrigger);
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
    } catch(e) {
        console.warn('Lenis failed, using native scroll:', e);
        gsap.registerPlugin(ScrollTrigger);
    }

    // â”€â”€ Inline 3D Projects Grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    (function initInlineProjects() {
        const inlineScene = document.querySelector('.inline-scene');
        if (!inlineScene) return;

        const inlineGrid = document.querySelector('.inline-grid-container');
        const modalOverlay = document.querySelector('.modal-overlay');
        const closeBtn = document.querySelector('.close-btn');
        const activeContainer = document.querySelector('.active-card-container');
        const inlineCards = document.querySelectorAll('.inline-scene .card');

        let activeCard = null, floatingAnim = null, overlayCard = null;

        // Title labels on card fronts
        inlineCards.forEach(card => {
            const front = card.querySelector('.card-front');
            if (front) {
                const t = document.createElement('div');
                t.style.cssText = 'position:absolute;bottom:12px;left:10px;right:10px;font-size:0.7rem;font-weight:800;color:rgba(255,255,255,0.9);text-transform:uppercase;line-height:1.2;text-shadow:0 1px 4px rgba(0,0,0,0.8);';
                t.innerText = card.getAttribute('data-title');
                front.style.position = 'relative';
                front.appendChild(t);
            }

            // Hover spring effect
            const wrapper = card.closest('.card-wrapper');
            wrapper.addEventListener('mouseenter', () => {
                if (activeCard) return;
                gsap.to(card, { z: 60, y: -8, boxShadow: '-30px 30px 50px rgba(0,0,0,0.7)', duration: 0.5, ease: 'back.out(2)' });
            });
            wrapper.addEventListener('mouseleave', () => {
                if (activeCard) return;
                gsap.to(card, { z: 0, y: 0, boxShadow: '-10px 10px 20px rgba(0,0,0,0.5)', duration: 0.7, ease: 'elastic.out(1, 0.4)' });
            });

            // Click to open
            card.addEventListener('click', e => { e.stopPropagation(); openCard(card); });
            card.addEventListener('touchend', e => {
                e.preventDefault(); e.stopPropagation(); openCard(card);
            });
        });

        function openCard(card) {
            if (activeCard) return;
            activeCard = card;
            inlineGrid.style.opacity = '0.1';
            inlineGrid.style.pointerEvents = 'none';
            modalOverlay.classList.add('active');
            overlayCard = card.cloneNode(true);
            
            activeContainer.appendChild(overlayCard);
            gsap.to(card, { opacity: 0, duration: 0.3 });
            
            const inner = overlayCard.querySelector('.card-inner');
            if (inner) {
                // Ensure CSS transitions handle the flip
                inner.style.transition = 'transform 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                // Start unflipped
                overlayCard.classList.remove('is-flipped');
                
                // Flip it after a tiny delay so the transition triggers
                setTimeout(() => {
                    overlayCard.classList.add('is-flipped');
                }, 50);
            }
            
            gsap.fromTo(overlayCard,
                { scale: 0.2, opacity: 0, rotationX: 45, rotationY: -45, y: 100 },
                { scale: 1, opacity: 1, rotationX: 0, rotationY: 0, y: 0, duration: 1.2, ease: 'elastic.out(1, 0.6)',
                  onComplete: () => {
                      floatingAnim = gsap.to(overlayCard, { y: '-=15', rotationY: 2, rotationX: -2, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
                  }
                }
            );
        }

        function closeCard() {
            if (!activeCard || !overlayCard) return;
            if (floatingAnim) floatingAnim.kill();
            inlineGrid.style.opacity = '1';
            inlineGrid.style.pointerEvents = 'auto';
            modalOverlay.classList.remove('active');
            
            const inner = overlayCard.querySelector('.card-inner');
            if (inner) {
                overlayCard.classList.remove('is-flipped');
            }

            gsap.to(overlayCard, {
                scale: 0.2, opacity: 0, rotationX: 45, rotationY: -45, y: 100, duration: 0.6, ease: 'power3.in',
                onComplete: () => {
                    overlayCard.remove(); overlayCard = null;
                    gsap.to(activeCard, { opacity: 1, duration: 0.3 });
                    activeCard = null;
                }
            });
        }

        closeBtn.addEventListener('click', closeCard);
        modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeCard(); });

        // Mouse parallax tilt on the scene has been removed to keep the angle perfectly static.

        // ScrollTrigger entrance
        gsap.from('.inline-grid-container', {
            scrollTrigger: { trigger: '.projects-section', start: 'top 80%' },
            y: 80, opacity: 0, duration: 1.2, ease: 'power3.out'
        });
    })();

    // â”€â”€ 2. Navbar scroll class â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    ScrollTrigger.create({
        start: 'top -60',
        end: 99999,
        toggleClass: { className: 'scrolled', targets: '#navbar' }
    });

    // â”€â”€ 3. Hero entrance (runs AFTER intro finishes) â”€â”€â”€â”€â”€â”€â”€â”€
    function waitForIntroEnd(cb) {
        const check = setInterval(() => {
            const overlay = document.getElementById('intro-overlay');
            if (!overlay || overlay.style.display === 'none') {
                clearInterval(check);
                cb();
            }
        }, 100);
    }

    waitForIntroEnd(() => {
        const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        heroTl
            .from('.hero-hello', { x: -20, opacity: 0, duration: 0.7 })
            .from('.hero-name',  { x: -30, opacity: 0, duration: 0.8 }, '-=0.5')
            .from('.hero-desc',  { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
            .from('.view-btn',   { y: 20, opacity: 0, duration: 0.6 }, '-=0.6')
            .from('.hero-social',{ opacity: 0, duration: 0.6 }, '-=0.4')
            
            // Right Side
            .from('.hero-image-wrap', { scale: 1.05, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=1')
            .from('.hero-bg-text',    { opacity: 0, scale: 0.9, duration: 1.5, ease: 'power2.out' }, '-=1.2')
            .from('.hero-glow-blob',  { opacity: 0, duration: 1 }, '-=1')
            .from('.stamp-container', { opacity: 0, rotation: -90, duration: 1, ease: 'back.out(1.5)' }, '-=0.8');
    });

    // â”€â”€ 4. ScrollTrigger reveals â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    document.querySelectorAll('.gsap-reveal').forEach((el) => {
        gsap.set(el, { autoAlpha: 1 });
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 1.1,
            ease: 'power3.out'
        });
    });

    // â”€â”€ 5. Background Text Parallax â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    gsap.to('.hero-bg-text', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 100,
        ease: 'none'
    });

    // â”€â”€ 6. Big card float effect â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    gsap.to('.building-img', {
        y: -15,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
    });

    // â”€â”€ 7. Magnetic buttons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    document.querySelectorAll('.primary-btn, .solid-red-btn, .cta-button').forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top  - r.height / 2;
            gsap.to(btn, { x: x * 0.15, y: y * 0.15, duration: 0.35, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.35)' });
        });
    });

    // â”€â”€ 8. Dynamic Club Info â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const clubData = {
        default: {
            subtitle: "EXPERIENCE & CLUBS",
            title: "Building Communities & Innovative Tech",
            desc: "From publishing an article on Generative AI to leading the Brains Trust Club as Secretary, I actively engage in real-world applications of programming and management.",
            logoImg: null,
            features: [
                { title: "Internships", desc: "Gained hands-on industry experience in IoT development and applications." },
                { title: "Leadership & Clubs", desc: "Led and organized events across multiple campus communities." }
            ]
        },
        csea: {
            subtitle: "CSEA",
            title: "Computer Science & Eng Association",
            desc: "Member (Sep 2025 - Present). Planning and organizing creative non-technical events while building a vibrant student community.",
            logoImg: "images/csea_trans.png",
            features: [
                { title: "Event Planning", desc: "Organizing creative events for the department." },
                { title: "Teamwork", desc: "Collaborating with a talented team of students." }
            ]
        },
        brainstrust: {
            subtitle: "STUDENTS' UNION",
            title: "Brains Trust Club",
            desc: "Served as Joint Secretary (2023 - 2024) and Secretary (2024 - 2025) of the Brains Trust Club under the Studentsâ€™ Union of PSG Polytechnic College, organizing technical workshops and seminars.",
            logoImg: "images/su_logo.png",
            features: [
                { title: "Secretary (2024-25)", desc: "Led the club and enhanced my leadership and organizational skills." },
                { title: "Joint Sec. (2023-24)", desc: "Contributed to successful events and developed strong team coordination." }
            ]
        },
        github: {
            subtitle: "GITHUB CAMPUS CLUB",
            title: "GitHub Campus Club - PSGTECH",
            desc: "Member (Sep 2025 - Present). Contributing to creative event planning, collaboration, and community engagement.",
            logoImg: "images/github_trans.png",
            features: [
                { title: "Event Planning", desc: "Creative event planning and collaboration." },
                { title: "Git & Open Source", desc: "Learning new skills and meeting passionate individuals." }
            ]
        },
        radio: {
            subtitle: "RADIO HUB",
            title: "Administrative Member",
            desc: "Administrative Member (Aug 2025 - Present). Handling administration and team coordination within the hub.",
            logoImg: "images/radio hub logo.png",
            features: [
                { title: "Administration", desc: "Day-to-day administrative tasks for the club." },
                { title: "Team Coordination", desc: "Ensuring smooth communication and operations." }
            ]
        },
        iot: {
            subtitle: "INTERNSHIP",
            title: "A-Tech Computer System",
            desc: "Successfully completed my internship at A-Tech Computer System, Coimbatore in the domain of Internet of Things (IoT) from 06 May 2024 to 03 June 2024.",
            logoImg: "images/iot internship.jpg",
            features: [
                { title: "IoT Development", desc: "Hands-on experience with connected devices." },
                { title: "Real-world Application", desc: "Applied technical concepts to practical solutions." }
            ]
        }
    };

    const dynamicContent = document.getElementById('dynamic-content');
    const spinBadge = document.getElementById('spin-badge');
    const spinBadgeImg = document.getElementById('spin-badge-img');
    const clubLogos = document.querySelectorAll('.club-logo-wrap');
    let activeClub = 'default';

    clubLogos.forEach(logo => {
        logo.addEventListener('click', () => {
            const club = logo.getAttribute('data-club');
            const targetClub = activeClub === club ? 'default' : club;
            activeClub = targetClub;

            const data = clubData[targetClub];

            // ---- Update top-right spin badge ----
            if (data.logoImg) {
                spinBadgeImg.src = data.logoImg;
                spinBadge.classList.remove('hidden');
            } else {
                spinBadge.classList.add('hidden');
            }

            // ---- GSAP Fade Out & In for text content ----
            gsap.to(dynamicContent, {
                opacity: 0,
                y: 10,
                duration: 0.3,
                onComplete: () => {
                    dynamicContent.innerHTML = `
                        <h5 class="section-subtitle">${data.subtitle}</h5>
                        <h2 class="section-title">${data.title}</h2>
                        <p class="section-desc">${data.desc}</p>
                        <div class="features-grid">
                            <div class="feature-item">
                                <div class="feature-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
                                <div class="feature-text">
                                    <h4>${data.features[0].title}</h4>
                                    <p>${data.features[0].desc}</p>
                                </div>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 12l-4-4-4 4M12 8v8"/></svg></div>
                                <div class="feature-text">
                                    <h4>${data.features[1].title}</h4>
                                    <p>${data.features[1].desc}</p>
                                </div>
                            </div>
                        </div>
                    `;
                    gsap.to(dynamicContent, { opacity: 1, y: 0, duration: 0.4 });
                }
            });
            
            // ---- Toggle active style on logos ----
            clubLogos.forEach(l => { l.style.borderColor = '#ff7f50'; l.style.background = 'rgba(255,127,80,0.05)'; });
            if (activeClub !== 'default') {
                logo.style.borderColor = '#ffffff';
                logo.style.background = 'rgba(255,255,255,0.15)';
            }
        });
    });

    // â”€â”€ 9. Smooth scroll for anchor links â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const target = a.getAttribute('href');
            if (target === '#') return;
            e.preventDefault();
            lenis.scrollTo(target, { offset: -80 });
        });
    });

    // â”€â”€ 10. Achievements Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    (function initAchievements() {
        const modal    = document.getElementById('achModal');
        const closeBtn = document.getElementById('achCloseBtn');
        const modalImg   = document.getElementById('achModalImg');
        const modalTag   = document.getElementById('achModalTag');
        const modalTitle = document.getElementById('achModalTitle');
        const modalDesc  = document.getElementById('achModalDesc');
        const trackWrap  = document.querySelector('.ach-track-wrap');
        const cards      = document.querySelectorAll('.ach-card');

        if (!modal || !trackWrap) return;

        let currentImgIndex = 0;
        let currentImgArray = [];

        const prevBtn = document.getElementById('achPrevBtn');
        const nextBtn = document.getElementById('achNextBtn');
        const dotsContainer = document.getElementById('achDots');

        function updateModalImage() {
            if (currentImgArray.length > 0) {
                modalImg.src = currentImgArray[currentImgIndex];
                
                if (dotsContainer) {
                    Array.from(dotsContainer.children).forEach((dot, idx) => {
                        dot.classList.toggle('active', idx === currentImgIndex);
                    });
                }
            }
        }

        if (prevBtn) prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImgIndex = (currentImgIndex - 1 + currentImgArray.length) % currentImgArray.length;
            updateModalImage();
        });

        if (nextBtn) nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImgIndex = (currentImgIndex + 1) % currentImgArray.length;
            updateModalImage();
        });

        // ---- Open modal ----
        function openModal(card) {
            const imgs = card.dataset.img.split(',');
            currentImgArray = imgs;
            currentImgIndex = 0;
            
            modalTag.textContent   = card.dataset.tag;
            modalTitle.textContent = card.dataset.title;
            modalDesc.textContent  = card.dataset.desc;
            
            if (imgs.length > 1) {
                if (prevBtn) prevBtn.style.display = 'block';
                if (nextBtn) nextBtn.style.display = 'block';
                if (dotsContainer) {
                    dotsContainer.style.display = 'flex';
                    dotsContainer.innerHTML = '';
                    imgs.forEach((_, idx) => {
                        const dot = document.createElement('span');
                        dot.className = 'ach-dot';
                        if (idx === 0) dot.classList.add('active');
                        dot.addEventListener('click', (e) => {
                            e.stopPropagation();
                            currentImgIndex = idx;
                            updateModalImage();
                        });
                        dotsContainer.appendChild(dot);
                    });
                }
            } else {
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
                if (dotsContainer) dotsContainer.style.display = 'none';
            }
            
            updateModalImage();
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        // ---- Close modal ----
        function closeModal() {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

        // ---- Single-click to open ----
        cards.forEach(card => {
            // Desktop: single-click
            card.addEventListener('click', e => {
                if(e.target.closest('.view-btn') || e.target.tagName.toLowerCase() === 'a') return;
                e.stopPropagation();
                openModal(card);
            });

            // Mobile: tap
            card.addEventListener('touchend', e => {
                if(e.target.closest('.view-btn') || e.target.tagName.toLowerCase() === 'a') return;
                // Prevent double firing if click also fires
                e.preventDefault();
                openModal(card);
            });
        });

        // ---- GSAP scroll entrance for cards ----
        gsap.from('.ach-card', {
            scrollTrigger: { trigger: '.achievements-section', start: 'top 80%' },
            x: 80,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out'
        });
    })();

    // â”€â”€ UI Interaction Sounds â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    (function initUISounds() {
        let audioCtx = null;
        let audioUnlocked = false;
        
        function initAudio() {
            if (!audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                audioCtx = new AudioContext();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume().then(() => {
                    audioUnlocked = true;
                });
            } else {
                audioUnlocked = true;
            }
        }
        
        // Unlock audio context on first explicit user interaction
        ['click', 'keydown', 'touchstart'].forEach(evt => {
            document.addEventListener(evt, () => {
                initAudio();
            }, { once: true });
        });

        let lastHoverTime = 0;

        function playHoverSound() {
            if (!audioUnlocked || !audioCtx) return;
            
            // Throttle to prevent spamming sounds if moving mouse rapidly
            const now = Date.now();
            if (now - lastHoverTime < 40) return;
            lastHoverTime = now;
            
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            // Slight lookahead ensures precise audio scheduling even if main thread is busy
            const t = audioCtx.currentTime + 0.015;
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, t);
            osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);
            
            // Increased volume by 10x
            gainNode.gain.setValueAtTime(1.5, t);
            gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.start(t);
            osc.stop(t + 0.05);
        }

        function playClickSound() {
            initAudio(); // Force init on click if not already
            if (!audioCtx) return;
            
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            const t = audioCtx.currentTime + 0.015;
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, t); 
            osc.frequency.exponentialRampToValueAtTime(100, t + 0.1);
            
            // Increased volume by 10x
            gainNode.gain.setValueAtTime(4.0, t);
            gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.start(t);
            osc.stop(t + 0.1);
        }

        // Attach sounds to interactive elements
        const selectors = 'a, button, .club-logo-wrap, .ach-card, .info-card, .glass-card, input, textarea, .nav-links li';
        
        setTimeout(() => {
            const interactives = document.querySelectorAll(selectors);
            interactives.forEach(el => {
                el.addEventListener('mouseenter', () => playHoverSound());
                el.addEventListener('mousedown', () => playClickSound());
                el.addEventListener('touchstart', () => playClickSound(), { passive: true });
            });
        }, 1000); // Give DOM time to settle
        
    })();
});
// 3D Book Page Flipping Logic
document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.book-page');
    let currentPage = 0;

    pages.forEach((page, index) => {
        page.addEventListener('click', (e) => {
            // Hide the "Tap to open" hint once the user interacts with the book
            const hint = document.getElementById('tap-to-open-hint');
            if (hint) {
                hint.classList.add('hidden');
            }

            // Determine if clicking left side or right side of the book
            const rect = page.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            
            // In a 3D transformed space, clicking logic can be tricky, 
            // but since pages stack, we just handle state based on whether it's already turned
            
            if (page.classList.contains('page-turned')) {
                // Flip back
                page.classList.remove('page-turned');
                // Adjust z-index after a slight delay so it goes behind properly
                setTimeout(() => {
                    page.style.zIndex = pages.length - index;
                }, 400);
            } else {
                // Flip forward
                page.classList.add('page-turned');
                // Make sure it sits on top of previously turned pages
                page.style.zIndex = index + 10;
            }
        });
    });
});

// Certificates Modal Logic
function openCertModal(imageSrc, transform = 'none') {
    const modal = document.getElementById('certModal');
    const modalImg = document.getElementById('certModalImg');
    modalImg.src = imageSrc;
    modalImg.style.transform = transform;
    
    // Reset any previous max-height/width constraints that might conflict with rotated images
    if (transform !== 'none') {
        // If it's rotated 90 or -90, it will be taller than wide. 
        // So we should bound its height to the screen width and width to screen height
        modalImg.style.maxHeight = '90vw';
        modalImg.style.maxWidth = '90vh';
    } else {
        modalImg.style.maxHeight = '90vh';
        modalImg.style.maxWidth = '90vw';
    }

    modal.classList.add('active');
}

function closeCertModal() {
    const modal = document.getElementById('certModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
    const certModal = document.getElementById('certModal');
    if (certModal) {
        certModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeCertModal();
            }
        });
    }
});


// Handle double click on stacked certificate cards
function handleCertClick(element, imgSrc, transform) {
    // Dim and move the card down
    element.classList.add('active-dimmed');
    
    // Open the modal with the full image
    openCertModal(imgSrc, transform);
    
    // Set a MutationObserver to listen for when the modal is closed
    const modal = document.getElementById('cert-modal');
    if (modal) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // If the modal's display property becomes 'none' again, remove the class
                if (mutation.attributeName === 'style' && modal.style.display === 'none') {
                    element.classList.remove('active-dimmed');
                    observer.disconnect();
                }
            });
        });
        observer.observe(modal, { attributes: true });
    }
}

// ==========================================
// RESUME MACHINE ANIMATION
// ==========================================
window.startResumeAnimation = function() {
    const machineCore = document.getElementById('machine-core');
    const machineStatus = document.getElementById('machine-status');
    const finalResumeBtn = document.getElementById('final-resume-btn');
    const dataNodes = document.querySelectorAll('.data-node');

    if (window.isProcessingResume) return;
    
    window.isProcessingResume = true;
    
    // Reset states
    machineCore.classList.remove('processing', 'finished');
    finalResumeBtn.classList.add('hidden');
    dataNodes.forEach(n => n.classList.remove('spawned', 'absorbed'));
    machineStatus.innerText = "INITIALIZING SYSTEM...";
    
    // Step 1: Spawn nodes
    setTimeout(() => {
        machineStatus.innerText = "GATHERING DATA...";
        dataNodes.forEach((node, idx) => {
            setTimeout(() => {
                node.classList.add('spawned');
            }, idx * 300);
        });
    }, 500);

    // Step 2: Absorb nodes into machine
    setTimeout(() => {
        machineStatus.innerText = "PROCESSING EXPERIENCE...";
        machineCore.classList.add('processing');
        
        dataNodes.forEach((node, idx) => {
            setTimeout(() => {
                node.classList.add('absorbed');
            }, idx * 200);
        });
    }, 3000);

    // Step 3: Finish and Output Resume
    setTimeout(() => {
        machineStatus.innerText = "RESUME COMPILED SUCCESSFULLY.";
        machineCore.classList.remove('processing');
        machineCore.classList.add('finished');
        
        // Show final button
        setTimeout(() => {
            finalResumeBtn.classList.remove('hidden');
            window.isProcessingResume = false;
        }, 500);
    }, 6500);
};

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('build-resume-btn');
    if (btn) btn.addEventListener('click', window.startResumeAnimation);

    // Mobile Hamburger Menu Logic
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');

    function toggleMenu() {
        if (!hamburger || !navLinks) return;
        hamburger.classList.toggle('toggle');
        navLinks.classList.toggle('nav-active');
        
        // Prevent body scroll when menu is open
        if (navLinks.classList.contains('nav-active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    // Close menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('nav-active')) {
                toggleMenu();
            }
        });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('nav-active')) {
            toggleMenu();
        }
    });
});// Auto-scroll for Milestones
document.addEventListener('DOMContentLoaded', () => {
    const trackWrap = document.querySelector('.ach-track-wrap');
    const track = document.querySelector('.ach-track');
    
    if (trackWrap && track) {
        // Clone cards for infinite effect
        const cards = Array.from(track.children);
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            track.appendChild(clone);
        });

        let scrollAmount = 0;
        let isHovered = false;

        trackWrap.addEventListener('mouseenter', () => isHovered = true);
        trackWrap.addEventListener('mouseleave', () => isHovered = false);

        
    }
});

