document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const bookFloat  = document.getElementById('book-float');
    const bookCover  = document.getElementById('book-cover');
    const bookInside = bookFloat ? bookFloat.querySelector('.book-inside') : null;

    if (!bookFloat || !bookCover) return;

    // ── State ──────────────────────────────────────────────────────────
    let isOpen      = false;
    let isAnimating = false;
    let isHovered   = false;
    let floatTime   = 0;

    // Base resting 3D orientation
    const BASE_RX = 15, BASE_RY = -25, BASE_RZ = 5;

    // Duration must match CSS transition on .book-cover (1000ms)
    const FLIP_DURATION = 1050;

    // ── Helpers ────────────────────────────────────────────────────────
    function setTransform(rx, ry, rz, ty = 0, scale = 1) {
        bookFloat.style.transform =
            `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) translateY(${ty}px) scale(${scale})`;
    }

    // ── 1. Idle Float ──────────────────────────────────────────────────
    function floatLoop() {
        if (!isHovered && !prefersReducedMotion) {
            floatTime += 0.018;
            const ty = Math.sin(floatTime) * 8;
            setTransform(BASE_RX, BASE_RY, BASE_RZ, ty);
        }
        requestAnimationFrame(floatLoop);
    }
    floatLoop();

    // ── 2. Mouse Parallax Tilt ─────────────────────────────────────────
    const scene = document.getElementById('book-scene');
    if (scene) {
        scene.addEventListener('mousemove', (e) => {
            if (isAnimating || prefersReducedMotion) return;
            isHovered = true;

            const rect = scene.getBoundingClientRect();
            const nx = (e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2);
            const ny = (e.clientY - rect.top   - rect.height / 2) / (rect.height / 2);
            const T  = 10;

            bookFloat.style.transition = 'transform 0.12s ease-out';
            setTransform(BASE_RX - ny * T, BASE_RY + nx * T, BASE_RZ * 0.6, 0, 1.03);
        });

        scene.addEventListener('mouseleave', () => {
            isHovered = false;
            bookFloat.style.transition = 'transform 0.8s ease';
            // floatLoop takes over immediately on next RAF tick
        });
    }

    // ── 3. Open Book ───────────────────────────────────────────────────
    function openBook() {
        if (isOpen || isAnimating) return;
        isAnimating = true;

        bookCover.classList.add('open');
        bookFloat.classList.add('book-is-open');
        isOpen = true;

        setTimeout(() => { isAnimating = false; }, FLIP_DURATION);
    }

    // ── 4. Close Book ──────────────────────────────────────────────────
    function closeBook() {
        if (!isOpen || isAnimating) return;
        isAnimating = true;

        bookCover.classList.remove('open');
        bookFloat.classList.remove('book-is-open');
        isOpen = false;

        setTimeout(() => { isAnimating = false; }, FLIP_DURATION);
    }

    // ── 5. Click Targets ───────────────────────────────────────────────
    // Clicking the cover (front face) when closed → OPEN
    bookCover.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isOpen) openBook();
        // If already open, a click on the flipped cover back-face should also close
        else closeBook();
    });

    // Clicking the inside page when open → CLOSE
    if (bookInside) {
        bookInside.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isOpen) closeBook();
        });
    }

    // Keyboard accessibility
    bookFloat.setAttribute('tabindex', '0');
    bookFloat.setAttribute('role', 'button');
    bookFloat.setAttribute('aria-label', 'Open book');
    bookFloat.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!isOpen) { openBook(); bookFloat.setAttribute('aria-label', 'Close book'); }
            else         { closeBook(); bookFloat.setAttribute('aria-label', 'Open book'); }
        }
    });
});
