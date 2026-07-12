/**
 * Professional Multilingual Intro Splash
 * Clip-path word reveal + split-panel dismiss
 */
(function () {

    const greetings = [
        { word: 'Hello',        lang: 'English'   },
        { word: '\u0BB5\u0BA3\u0B95\u0BCD\u0B95\u0BAE\u0BCD',     lang: 'Tamil'     },
        { word: '\u0C28\u0C2E\u0C38\u0C4D\u0C15\u0C3E\u0C30\u0C02',  lang: 'Telugu'    },
        { word: '\u0D28\u0D2E\u0D38\u0D4D\u0D15\u0D3E\u0D30\u0D02', lang: 'Malayalam' },
        { word: '\u0928\u092E\u0938\u094D\u0924\u0947',      lang: 'Hindi'     },
        { word: '\u0CA8\u0CAE\u0CB8\u0CCD\u0C95\u0CBE\u0CB0',   lang: 'Kannada'   },
        { word: '\u09A8\u09AE\u09B8\u09CD\u0995\u09BE\u09B0',    lang: 'Bengali'   },
    ];

    var overlay = document.getElementById('intro-overlay');
    if (!overlay) return;

    if (sessionStorage.getItem('introPlayed')) {
        overlay.style.display = 'none';
        overlay.style.pointerEvents = 'none';
        return;
    }

    // Enable pointer-events ONLY while intro is playing
    overlay.style.pointerEvents = 'all';
    
    var wordEl     = document.getElementById('intro-word');
    var labelEl    = document.getElementById('intro-lang-label');
    var progressEl = document.getElementById('intro-progress');
    var panelTop   = document.querySelector('.intro-panel-top');
    var panelBot   = document.querySelector('.intro-panel-bottom');

    var IN_DUR   = 0.55;
    var HOLD     = 0.28;
    var OUT_DUR  = 0.38;
    var STEP     = IN_DUR + HOLD + OUT_DUR;
    var TOTAL    = greetings.length * STEP + 0.6;

    gsap.to(progressEl, { width: '100%', duration: TOTAL, ease: 'none' });

    var master = gsap.timeline({ onComplete: dismissIntro });

    greetings.forEach(function(g, i) {
        var startAt = i * STEP;
        master.call(function() { wordEl.textContent = g.word; labelEl.textContent = g.lang; }, [], startAt);
        master.to(wordEl, { y: '0%', duration: IN_DUR, ease: 'expo.out' }, startAt);
        master.to(labelEl, { opacity: 1, y: 0, duration: IN_DUR * 0.8, ease: 'power2.out' }, startAt);
        master.to(wordEl, { y: '-110%', duration: OUT_DUR, ease: 'expo.in' }, startAt + IN_DUR + HOLD);
        master.to(labelEl, { opacity: 0, y: -8, duration: OUT_DUR * 0.7, ease: 'power2.in' }, startAt + IN_DUR + HOLD);
        if (i < greetings.length - 1) {
            master.set(wordEl, { y: '110%' }, startAt + IN_DUR + HOLD + OUT_DUR);
        }
    });

    function dismissIntro() {
        sessionStorage.setItem('introPlayed', 'true');
        var tl = gsap.timeline({
            onComplete: function() {
                overlay.style.display = 'none';
                overlay.style.pointerEvents = 'none';
            }
        });
        tl.to('#intro-stage', { opacity: 0, duration: 0.2, ease: 'power2.in' });
        tl.to(panelTop, { yPercent: -100, duration: 0.85, ease: 'power4.inOut' }, '-=0.05');
        tl.to(panelBot, { yPercent: 100, duration: 0.85, ease: 'power4.inOut' }, '<');
    }

    gsap.set(wordEl, { y: '110%' });
    gsap.set(labelEl, { opacity: 0, y: 8 });

})();
