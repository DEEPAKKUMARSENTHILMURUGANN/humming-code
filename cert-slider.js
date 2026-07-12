document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* =====================================================================
       1. SEAMLESS MARQUEE AUTO-SCROLL
       ===================================================================== */
    const track = document.getElementById('cert-scroll-track');
    const viewport = document.getElementById('cert-scroll-viewport');
    
    if (track && viewport) {
        let isPaused = false;
        let isDragging = false;
        let startX;
        let scrollLeftPos = 0;
        let animationId;
        const speed = 0.5; // pixels per frame

        // Clone items for seamless loop
        const originalItems = Array.from(track.children);
        
        // Clone 2 times to ensure we have enough width to scroll
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });

        // The track now contains 3x the original items.
        // We will scroll until we hit 1/3 of the total scroll width, then reset.
        
        function scrollLoop() {
            if (!isPaused && !isDragging && !prefersReducedMotion) {
                scrollLeftPos += speed;
                
                // If we've scrolled past the first set of items (1/3 of the track), reset to 0
                if (scrollLeftPos >= track.scrollWidth / 3) {
                    scrollLeftPos = 0;
                }
                
                viewport.scrollLeft = scrollLeftPos;
            } else if (prefersReducedMotion) {
                // If reduced motion, just allow manual scrolling, don't auto animate
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
                setTimeout(() => { isPaused = false; }, 500); // Small delay before resuming
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
            const walk = (startX - x) * 2; // scroll-fast multiplier
            viewport.scrollLeft = scrollLeftPos + walk;
            scrollLeftPos = viewport.scrollLeft;
            
            // Loop adjustment during drag
            if (scrollLeftPos >= track.scrollWidth / 3) {
                scrollLeftPos -= track.scrollWidth / 3;
                startX = e.pageX - viewport.offsetLeft; // reset origin
            } else if (scrollLeftPos <= 0) {
                scrollLeftPos += track.scrollWidth / 3;
                startX = e.pageX - viewport.offsetLeft; // reset origin
            }
        });
        
        // Touch Dragging
        viewport.addEventListener('touchstart', (e) => {
            isDragging = true;
            isPaused = true;
            startX = e.touches[0].pageX - viewport.offsetLeft;
            scrollLeftPos = viewport.scrollLeft;
        }, { passive: true });

        window.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                setTimeout(() => { isPaused = false; }, 500);
            }
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX - viewport.offsetLeft;
            const walk = (startX - x) * 2;
            viewport.scrollLeft = scrollLeftPos + walk;
            scrollLeftPos = viewport.scrollLeft;
            
            if (scrollLeftPos >= track.scrollWidth / 3) {
                scrollLeftPos -= track.scrollWidth / 3;
                startX = e.touches[0].pageX - viewport.offsetLeft;
            } else if (scrollLeftPos <= 0) {
                scrollLeftPos += track.scrollWidth / 3;
                startX = e.touches[0].pageX - viewport.offsetLeft;
            }
        }, { passive: true });
        
        // Sync scrollLeftPos with manual wheel scrolling
        viewport.addEventListener('scroll', () => {
            if (!isDragging && isPaused) {
                scrollLeftPos = viewport.scrollLeft;
            }
        }, { passive: true });
    }

    /* =====================================================================
       2. LIGHTBOX & FLIP ANIMATION
       ===================================================================== */
    const lightbox = document.getElementById('cert-lightbox');
    const lightboxImg = document.getElementById('cert-lightbox-img');
    const lightboxClose = document.getElementById('cert-lightbox-close');
    let activeElementBeforeLightbox = null;
    let clickedRect = null;
    let isLightboxOpen = false;

    // Attach click listeners to the viewport instead of the old grid
    if (viewport) {
        viewport.addEventListener('click', (e) => {
            const btn = e.target.closest('.cert-item');
            if (!btn) return;
            
            e.preventDefault();
            openLightbox(btn);
        });
    }

    function openLightbox(btn) {
        if (isLightboxOpen) return;
        isLightboxOpen = true;
        activeElementBeforeLightbox = document.activeElement;
        
        const img = btn.querySelector('img');
        clickedRect = img.getBoundingClientRect();
        
        lightboxImg.src = img.src;
        lightboxImg.style.transition = 'none';
        
        lightbox.classList.add('active');
        const targetRect = lightboxImg.getBoundingClientRect();
        
        const scaleX = clickedRect.width / targetRect.width;
        const scaleY = clickedRect.height / targetRect.height;
        const translateX = clickedRect.left - targetRect.left;
        const translateY = clickedRect.top - targetRect.top;
        
        lightboxImg.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scaleX}, ${scaleY})`;
        
        lightboxImg.offsetHeight; // Force reflow
        
        lightboxImg.style.transition = prefersReducedMotion ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
        lightboxImg.style.transform = 'translate3d(0,0,0) scale(1,1)';
        
        lightboxClose.focus();
    }

    function closeLightboxFunc() {
        if (!isLightboxOpen) return;
        isLightboxOpen = false;
        
        if (prefersReducedMotion) {
            lightbox.classList.remove('active');
            if (activeElementBeforeLightbox) activeElementBeforeLightbox.focus();
            return;
        }

        const targetRect = lightboxImg.getBoundingClientRect();
        
        const scaleX = clickedRect.width / targetRect.width;
        const scaleY = clickedRect.height / targetRect.height;
        const translateX = clickedRect.left - targetRect.left;
        const translateY = clickedRect.top - targetRect.top;
        
        lightboxImg.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scaleX}, ${scaleY})`;
        
        lightbox.style.opacity = '0';
        
        setTimeout(() => {
            lightbox.classList.remove('active');
            lightbox.style.opacity = ''; 
            lightboxImg.style.transform = ''; 
            if (activeElementBeforeLightbox) activeElementBeforeLightbox.focus();
        }, 400); 
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightboxFunc);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightbox.querySelector('.cert-lightbox-content')) {
                closeLightboxFunc();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isLightboxOpen) {
            closeLightboxFunc();
        }
    });
});
