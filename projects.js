document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.querySelector('.grid-container');
    const scene = document.querySelector('.scene');
    const cards = document.querySelectorAll('.scene .card');
    const modalOverlay = document.querySelector('.modal-overlay');
    const closeBtn = document.querySelector('.close-btn');
    const activeContainer = document.querySelector('.active-card-container');
    
    let activeCard = null;
    let overlayCard = null;
    let floatingAnim = null;

    // Mouse movement parallax effect on the grid has been removed as requested to keep the angle perfectly static.

    cards.forEach((card, index) => {
        const wrapper = card.parentElement;
        
        // Stagger entrance animation for cards
        gsap.from(wrapper, {
            z: -1000,
            opacity: 0,
            rotationX: 45,
            duration: 1.5,
            delay: index * 0.1,
            ease: 'expo.out'
        });

        // Hover Effect using GSAP (floating off the grid)
        wrapper.addEventListener('mouseenter', () => {
            if (activeCard) return;
            gsap.to(card, {
                z: 50,
                y: -10,
                boxShadow: '-20px 20px 30px rgba(0,0,0,0.6)',
                duration: 0.5,
                ease: 'power3.out'
            });
        });
        wrapper.addEventListener('mouseleave', () => {
            if (activeCard) return;
            gsap.to(card, {
                z: 0,
                y: 0,
                boxShadow: '-15px 15px 25px rgba(0,0,0,0.4)',
                duration: 0.7,
                ease: 'elastic.out(1, 0.4)'
            });
        });
        
        // Add overlay titles based on data attributes
        const front = card.querySelector('.card-front');
        if(front) {
            front.setAttribute('data-title', card.getAttribute('data-title'));
            const titleEl = document.createElement('div');
            titleEl.className = 'card-title-overlay';
            titleEl.innerText = card.getAttribute('data-title');
            front.appendChild(titleEl);
        }

        // Double click to open card
        // Handle About Button
        const aboutBtn = card.querySelector('.about-btn');
        if (aboutBtn) {
            aboutBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openCard(card);
            });
        }
        
        // Single click to open card
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            openCard(card);
        });
    });

    function openCard(card) {
        if (activeCard) return;
        activeCard = card;
        
        // Dim the background grid
        gridContainer.classList.add('dimmed');
        modalOverlay.classList.add('active');
        
        // Create a visual clone to be our centered popup card
        overlayCard = card.cloneNode(true);
        activeContainer.appendChild(overlayCard);
        
        // Make the original card invisible while we are reading it
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

        // Animate the overlay card popping up
        gsap.fromTo(overlayCard, 
            { 
                scale: 0.2, 
                opacity: 0,
                rotationX: 45,
                rotationY: -45,
                y: 100
            },
            {
                scale: 1,
                opacity: 1,
                rotationX: 0,
                rotationY: 0,
                y: 0,
                duration: 1.2,
                ease: 'elastic.out(1, 0.6)',
                onComplete: () => {
                    // Fix link clickability programmatically
                    const gitLink = overlayCard.querySelector('a');
                    if (gitLink) {
                        gitLink.addEventListener('mousedown', (e) => {
                            e.stopPropagation();
                            window.open(gitLink.href, '_blank');
                        }, { once: true });
                        gitLink.addEventListener('click', (e) => {
                            e.stopPropagation();
                        }, { once: true });
                    }
                    
                    // Add continuous floating effect
                    const closeAboutBtn = overlayCard.querySelector('.close-about-btn');
                    if (closeAboutBtn) {
                        closeAboutBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            closeCard();
                        });
                    }
                    
                    floatingAnim = gsap.to(overlayCard, {
                        y: "-=15",
                        duration: 2.5,
                        yoyo: true,
                        repeat: -1,
                        ease: 'sine.inOut'
                    });
                }
            }
        );
    }

    function closeCard() {
        if (!activeCard || !overlayCard) return;
        
        // Stop floating animation
        if (floatingAnim) floatingAnim.kill();
        
        gridContainer.classList.remove('dimmed');
        modalOverlay.classList.remove('active');
        
        const inner = overlayCard.querySelector('.card-inner');
        if (inner) {
            overlayCard.classList.remove('is-flipped');
        }

        // Animate the overlay card away
        gsap.to(overlayCard, {
            scale: 0.2,
            opacity: 0,
            rotationX: 45,
            rotationY: -45,
            y: 100,
            duration: 0.6,
            ease: 'power3.in',
            onComplete: () => {
                overlayCard.remove();
                overlayCard = null;
                
                // Bring the original grid card back
                gsap.to(activeCard, { opacity: 1, duration: 0.3 });
                activeCard = null;
            }
        });
    }

    closeBtn.addEventListener('click', closeCard);
    modalOverlay.addEventListener('click', closeCard);
});