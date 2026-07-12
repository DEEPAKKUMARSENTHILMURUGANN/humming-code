document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const bookFloat  = document.getElementById('book-float');
    if (!bookFloat) return;

    // ── State ──────────────────────────────────────────────────────────
    let isHovered   = false;
    let floatTime   = 0;

    // Base resting 3D orientation
    const BASE_RX = 15, BASE_RY = -25, BASE_RZ = 5;

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
            if (prefersReducedMotion) return;
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

    // ── 3. Page Flipping Logic ─────────────────────────────────────────
    window.flipPage = function(pageNumber, event) {
        if (event) event.stopPropagation();
        const page = document.getElementById(`page-${pageNumber}`);
        if (page) {
            page.classList.add('flipped');
            // Change z-index halfway through the animation (1000ms total) to prevent clipping
            setTimeout(() => {
                page.style.zIndex = pageNumber;
                if (pageNumber === 1) {
                    bookFloat.classList.add('book-is-open');
                    const tapText = document.getElementById('tap-to-open-text');
                    if(tapText) tapText.style.opacity = '0';
                }
            }, 300); // 300ms is when it crosses the 90 degree mark roughly
        }
    }

    window.unflipPage = function(pageNumber, event) {
        if (event) event.stopPropagation();
        const page = document.getElementById(`page-${pageNumber}`);
        if (page) {
            page.classList.remove('flipped');
            setTimeout(() => {
                page.style.zIndex = 5 - pageNumber; // Reset back to initial stacking (4 pages total)
                if (pageNumber === 1) {
                    bookFloat.classList.remove('book-is-open');
                    const tapText = document.getElementById('tap-to-open-text');
                    if(tapText) tapText.style.opacity = '1';
                }
            }, 300);
        }
    }

    // Optionally allow closing the whole book by clicking outside the pages
    scene.addEventListener('click', (e) => {
        // If they click the scene background, unflip everything
        if (e.target === scene) {
            for (let i = 4; i >= 1; i--) {
                window.unflipPage(i);
            }
        }
    });
});
