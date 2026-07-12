/**
 * contact-bg.js
 * Flowing red wave ribbons — same colour palette as pub-bg.js (rgba 255,60,60)
 * but a completely different visual: layered sine-wave lines that breathe and
 * warp toward the mouse cursor.
 */
document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById('contact');
    if (!section) return;

    /* ── Canvas ── */
    const canvas = document.createElement('canvas');
    canvas.id = 'contact-bg-canvas';
    Object.assign(canvas.style, {
        position: 'absolute',
        top: '0', left: '0',
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: '1',
    });
    section.style.position = 'relative';
    section.insertBefore(canvas, section.firstChild);

    /* Mac window card stays on top */
    const win = section.querySelector('.contact-mac-window');
    if (win) { win.style.position = 'relative'; win.style.zIndex = '2'; }

    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;
    let mouse = { x: -9999, y: -9999 };
    let t = 0;

    function resize() {
        W = canvas.width  = section.offsetWidth;
        H = canvas.height = section.offsetHeight;
    }

    section.addEventListener('mousemove', e => {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
    });
    section.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    /* ── Wave ribbon config ── */
    const WAVES = [
        { amp: 55,  freq: 0.010, speed: 0.008,  offset: 0,    alpha: 0.12, width: 2.5 },
        { amp: 40,  freq: 0.014, speed: 0.012,  offset: 1.2,  alpha: 0.09, width: 1.5 },
        { amp: 70,  freq: 0.007, speed: 0.006,  offset: 2.4,  alpha: 0.08, width: 3.5 },
        { amp: 30,  freq: 0.018, speed: 0.015,  offset: 0.6,  alpha: 0.06, width: 1.0 },
        { amp: 90,  freq: 0.005, speed: 0.004,  offset: 3.6,  alpha: 0.06, width: 4.0 },
        { amp: 25,  freq: 0.022, speed: 0.018,  offset: 1.8,  alpha: 0.07, width: 1.2 },
        { amp: 60,  freq: 0.009, speed: 0.007,  offset: 4.8,  alpha: 0.07, width: 2.0 },
        { amp: 45,  freq: 0.012, speed: 0.010,  offset: 5.5,  alpha: 0.08, width: 1.8 },
    ];

    /* ── Mouse glow ── */
    function drawGlow() {
        if (mouse.x < 0) return;
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 280);
        g.addColorStop(0,   'rgba(255, 60, 60, 0.14)');
        g.addColorStop(0.5, 'rgba(200, 30, 30, 0.05)');
        g.addColorStop(1,   'rgba(255, 60, 60, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
    }

    /* ── Draw one wave ribbon ── */
    function drawWave(wave, baseY) {
        // Mouse influence: the wave bends toward the cursor
        const mouseInfluence = mouse.x > 0
            ? Math.exp(-Math.pow(baseY - mouse.y, 2) / (H * H * 0.04)) * 40
            : 0;

        ctx.beginPath();
        ctx.lineWidth = wave.width;

        // Gradient stroke: red → dark red → transparent at edges
        const grad = ctx.createLinearGradient(0, 0, W, 0);
        grad.addColorStop(0,    `rgba(255, 60, 60, 0)`);
        grad.addColorStop(0.15, `rgba(255, 60, 60, ${wave.alpha})`);
        grad.addColorStop(0.5,  `rgba(255, 80, 80, ${wave.alpha * 1.4})`);
        grad.addColorStop(0.85, `rgba(255, 60, 60, ${wave.alpha})`);
        grad.addColorStop(1,    `rgba(255, 60, 60, 0)`);
        ctx.strokeStyle = grad;

        const step = 4;
        for (let x = 0; x <= W; x += step) {
            const nx = x / W; // 0-1
            // Mouse horizontal pull
            const mxDist = mouse.x > 0 ? Math.exp(-Math.pow(x - mouse.x, 2) / (W * W * 0.015)) * 18 : 0;
            const y = baseY
                + Math.sin(x * wave.freq + t * wave.speed * 60 + wave.offset) * (wave.amp + mxDist)
                + Math.sin(x * wave.freq * 0.5 + t * wave.speed * 30) * (wave.amp * 0.3)
                + mouseInfluence;

            if (x === 0) ctx.moveTo(x, y);
            else         ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    /* ── Pulsing dot grid (very subtle) ── */
    function drawDots() {
        const spacing = 55;
        const pulse = (Math.sin(t * 0.4) + 1) / 2; // 0→1
        ctx.fillStyle = `rgba(255, 60, 60, ${0.04 + pulse * 0.04})`;
        for (let y = spacing / 2; y < H; y += spacing) {
            for (let x = spacing / 2; x < W; x += spacing) {
                // Mouse repel
                const dx = x - mouse.x, dy = y - mouse.y;
                const d  = Math.sqrt(dx*dx + dy*dy);
                if (d < 80) continue; // hide dots near cursor
                ctx.beginPath();
                ctx.arc(x, y, 1.2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    /* ── Main loop ── */
    function animate() {
        t += 0.016;

        ctx.clearRect(0, 0, W, H);

        /* Subtle vignette */
        const vig = ctx.createRadialGradient(W/2, H/2, H * 0.2, W/2, H/2, H * 0.85);
        vig.addColorStop(0,   'rgba(0,0,0,0)');
        vig.addColorStop(1,   'rgba(0,0,0,0.45)');
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, W, H);

        /* Mouse glow */
        drawGlow();

        /* Wave ribbons — evenly spread vertically */
        WAVES.forEach((wave, i) => {
            const baseY = (H / (WAVES.length + 1)) * (i + 1);
            drawWave(wave, baseY);
        });

        /* Dot grid */
        drawDots();

        /* Top fade — blends seamlessly with publications section above */
        const topFade = ctx.createLinearGradient(0, 0, 0, 180);
        topFade.addColorStop(0,   'rgba(10, 10, 10, 1)');
        topFade.addColorStop(1,   'rgba(10, 10, 10, 0)');
        ctx.fillStyle = topFade;
        ctx.fillRect(0, 0, W, 180);

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
});
