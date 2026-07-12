document.addEventListener('DOMContentLoaded', () => {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* =====================================================================
       1. INTERSECTION OBSERVER (REVEAL ANIMATION)
       ===================================================================== */
    const certCards = document.querySelectorAll('.cert-card');
    
    if (!prefersReducedMotion) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Stagger the reveal based on horizontal position or just add class
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, Math.random() * 300); // Simple random stagger for natural feel
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        certCards.forEach(card => observer.observe(card));
    } else {
        // If reduced motion, reveal immediately
        certCards.forEach(card => card.classList.add('revealed'));
    }


    /* =====================================================================
       2. CONTINUOUS SCROLLING, DRAG & WHEEL (MARQUEE)
       ===================================================================== */
    const track = document.getElementById('cert-track');
    const wrapper = document.getElementById('cert-track-wrapper');
    
    // Duplicate the content to create a seamless loop
    const originalCards = Array.from(track.children);
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        // Remove revealed classes from clones so they also trigger observers if needed,
        // or just reveal them immediately since they are offscreen
        clone.classList.add('revealed'); 
        track.appendChild(clone);
    });

    let isScrolling = true;
    let scrollPos = 0;
    const speed = 0.5; // pixels per frame
    let animationFrameId;
    let resumeTimeout;

    let isDragging = false;
    let startX = 0;
    let dragScrollLeft = 0;

    // Track total width of original items to know when to loop
    // Wait for images to load or use fixed CSS dimensions
    let halfWidth = 0;
    
    function calculateWidths() {
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        const cardWidth = originalCards[0].getBoundingClientRect().width;
        halfWidth = (cardWidth + gap) * originalCards.length;
    }
    
    // Initial calc
    calculateWidths();
    window.addEventListener('resize', calculateWidths);

    function autoScroll() {
        if (!isScrolling || isDragging || prefersReducedMotion) {
            animationFrameId = requestAnimationFrame(autoScroll);
            return;
        }

        scrollPos += speed;

        // Loop seamlessly
        if (scrollPos >= halfWidth) {
            scrollPos -= halfWidth;
        } else if (scrollPos <= 0) {
            scrollPos += halfWidth;
        }

        track.style.transform = `translate3d(-${scrollPos}px, 0, 0)`;
        animationFrameId = requestAnimationFrame(autoScroll);
    }

    if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(autoScroll);
    }

    function pauseScroll() {
        isScrolling = false;
        clearTimeout(resumeTimeout);
    }

    function resumeScroll() {
        clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(() => {
            isScrolling = true;
        }, 500); // 500ms delay before resuming
    }

    // Hover to pause
    wrapper.addEventListener('mouseenter', pauseScroll);
    wrapper.addEventListener('mouseleave', resumeScroll);
    wrapper.addEventListener('touchstart', pauseScroll, { passive: true });
    wrapper.addEventListener('touchend', resumeScroll);

    // Mouse Wheel scrolling
    wrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        pauseScroll();
        scrollPos += e.deltaY + e.deltaX;
        
        // Boundaries for looping
        if (scrollPos >= halfWidth) scrollPos -= halfWidth;
        if (scrollPos <= 0) scrollPos += halfWidth;
        
        track.style.transform = `translate3d(-${scrollPos}px, 0, 0)`;
        resumeScroll();
    }, { passive: false });

    // Drag / Swipe functionality
    wrapper.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
        dragScrollLeft = scrollPos;
        wrapper.style.cursor = 'grabbing';
        pauseScroll();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX;
        const walk = (startX - x); // Drag distance
        scrollPos = dragScrollLeft + walk;
        
        if (scrollPos >= halfWidth) scrollPos -= halfWidth;
        if (scrollPos <= 0) scrollPos += halfWidth;

        track.style.transform = `translate3d(-${scrollPos}px, 0, 0)`;
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            wrapper.style.cursor = 'grab';
            resumeScroll();
        }
    });


    /* =====================================================================
       3. LIGHTBOX & FLIP ANIMATION
       ===================================================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    let activeElementBeforeLightbox = null;
    let clickedRect = null;
    let isLightboxOpen = false;

    // Attach click listeners to all cards (including clones)
    track.addEventListener('click', (e) => {
        const btn = e.target.closest('.cert-card');
        if (!btn) return;
        
        e.preventDefault();
        openLightbox(btn);
    });

    function openLightbox(btn) {
        if (isLightboxOpen) return;
        isLightboxOpen = true;
        activeElementBeforeLightbox = document.activeElement;
        
        const img = btn.querySelector('img');
        clickedRect = img.getBoundingClientRect();
        
        // 1. Set the high-res image (using same source for now)
        lightboxImg.src = img.src;
        
        // 2. Initial state for FLIP (match the clicked image position & size)
        // Temporarily turn off transitions
        lightboxImg.style.transition = 'none';
        
        // We must show the lightbox immediately but at 0 opacity to measure
        lightbox.classList.add('active');
        
        // Measure the final target size (which is what CSS dictates inside the lightbox)
        const targetRect = lightboxImg.getBoundingClientRect();
        
        // Calculate the transforms needed to move the target back to the clicked image's position
        const scaleX = clickedRect.width / targetRect.width;
        const scaleY = clickedRect.height / targetRect.height;
        const translateX = clickedRect.left - targetRect.left;
        const translateY = clickedRect.top - targetRect.top;
        
        // Apply the inverted transform
        lightboxImg.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scaleX}, ${scaleY})`;
        
        // Force reflow
        lightboxImg.offsetHeight; 
        
        // 3. Animate to final state
        // Turn transitions back on
        lightboxImg.style.transition = prefersReducedMotion ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
        
        // Remove the transform to allow it to snap to its natural CSS position (centered)
        lightboxImg.style.transform = 'translate3d(0,0,0) scale(1,1)';
        
        pauseScroll();
        
        // Focus trap
        lightboxClose.focus();
    }

    function closeLightbox() {
        if (!isLightboxOpen) return;
        isLightboxOpen = false;

        // Animate back to original position (FLIP invert)
        if (!prefersReducedMotion && clickedRect) {
            const currentRect = lightboxImg.getBoundingClientRect();
            const scaleX = clickedRect.width / currentRect.width;
            const scaleY = clickedRect.height / currentRect.height;
            const translateX = clickedRect.left - currentRect.left;
            const translateY = clickedRect.top - currentRect.top;

            lightboxImg.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scaleX}, ${scaleY})`;
        }
        
        // Fade out backdrop
        lightbox.classList.remove('active');

        // Restore focus
        if (activeElementBeforeLightbox) {
            activeElementBeforeLightbox.focus();
        }

        resumeScroll();
        
        // Cleanup after transition
        setTimeout(() => {
            lightboxImg.style.transform = '';
            lightboxImg.src = '';
        }, 400); // match CSS transition duration
    }

    lightboxClose.addEventListener('click', closeLightbox);
    
    // Click outside to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    // Keyboard support (Escape to close)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isLightboxOpen) {
            closeLightbox();
        }
    });
});
