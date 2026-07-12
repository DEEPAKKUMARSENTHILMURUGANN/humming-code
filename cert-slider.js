document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* =====================================================================
       1. SEAMLESS MARQUEE AUTO-SCROLL
       ===================================================================== */
    const viewports = document.querySelectorAll('.cert-scroll-viewport');
    
    viewports.forEach((viewport, index) => {
        const track = viewport.querySelector('.cert-scroll-track');
        if (!track) return;
        
        let isPaused = false;
        let isDragging = false;
        let startX;
        let scrollLeftPos = 0;
        let animationId;
        const baseSpeed = 0.5; // pixels per frame
        const isReverse = index % 2 !== 0; // Second row goes opposite
        const speed = isReverse ? -baseSpeed : baseSpeed;

        // Clone items for seamless loop
        const originalItems = Array.from(track.children);
        
        // Clone 4 times to ensure we have enough width to scroll safely
        for(let i=0; i<4; i++) {
            originalItems.forEach(item => {
                const clone = item.cloneNode(true);
                track.appendChild(clone);
            });
        }

        // We scroll until 1/5th of the total scroll width (since 5 copies total)
        
        // Initialize position for reverse track
        if (isReverse) {
            scrollLeftPos = track.scrollWidth / 5;
            viewport.scrollLeft = scrollLeftPos;
        }

        function scrollLoop() {
            if (!isPaused && !isDragging && !prefersReducedMotion) {
                scrollLeftPos += speed;
                
                const segmentWidth = track.scrollWidth / 5;
                
                if (!isReverse) {
                    if (scrollLeftPos >= segmentWidth) {
                        scrollLeftPos = 0;
                    }
                } else {
                    if (scrollLeftPos <= 0) {
                        scrollLeftPos = segmentWidth;
                    }
                }
                
                viewport.scrollLeft = scrollLeftPos;
            } else if (prefersReducedMotion) {
                return; 
            }
            animationId = requestAnimationFrame(scrollLoop);
        }

        // Start loop
        if (!prefersReducedMotion) {
            scrollLoop();
        }

        // Pause on hover
        viewport.addEventListener('mouseenter', () => isPaused = true);
        viewport.addEventListener('mouseleave', () => {
            if (!isDragging) isPaused = false;
        });
        
        viewport.addEventListener('touchstart', () => isPaused = true, { passive: true });
        viewport.addEventListener('touchend', () => {
            if (!isDragging) {
                setTimeout(() => { isPaused = false; }, 500);
            }
        });

        // Manual Dragging
        viewport.addEventListener('mousedown', (e) => {
            isDragging = true;
            isPaused = true;
            startX = e.pageX - viewport.offsetLeft;
            scrollLeftPos = viewport.scrollLeft;
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                isPaused = false;
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - viewport.offsetLeft;
            const walk = (startX - x) * 2;
            viewport.scrollLeft = scrollLeftPos + walk;
            scrollLeftPos = viewport.scrollLeft;
            
            const segmentWidth = track.scrollWidth / 5;
            if (scrollLeftPos >= segmentWidth) {
                scrollLeftPos -= segmentWidth;
                startX = e.pageX - viewport.offsetLeft;
            } else if (scrollLeftPos <= 0) {
                scrollLeftPos += segmentWidth;
                startX = e.pageX - viewport.offsetLeft;
            }
        });
    });

    /* =====================================================================
       2. LIGHTBOX VIEWER
       ===================================================================== */
    const lightbox = document.getElementById('cert-lightbox');
    const lightboxImg = document.getElementById('cert-lightbox-img');
    const closeBtn = document.getElementById('cert-lightbox-close');
    const pubSection = document.getElementById('publications'); // For canvas background z-index fix

    if (lightbox && lightboxImg) {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.cert-item');
            if (!btn) return;

            const img = btn.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                
                // Carry over rotation to lightbox if needed
                if (img.dataset.rotated === "true") {
                    lightboxImg.style.transform = "scale(1.2) rotate(-90deg)";
                } else {
                    lightboxImg.style.transform = "scale(1)";
                }
                
                lightbox.classList.add('active');
                
                // Hide canvas temporarily so it doesn't overlap lightbox
                const canvasBg = document.getElementById('pub-canvas-bg');
                if (canvasBg) canvasBg.style.display = 'none';
            }
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            
            // Show canvas again
            const canvasBg = document.getElementById('pub-canvas-bg');
            if (canvasBg) canvasBg.style.display = 'block';
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', closeLightbox);
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
});