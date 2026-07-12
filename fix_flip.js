const fs = require('fs');
let js = fs.readFileSync('projects.js', 'utf8');

js = js.replace(/function openCard[\s\S]*?function closeCard[\s\S]*?modalOverlay\.addEventListener\('click', closeCard\);/m, `function openCard(card) {
    if (activeCard) return;
    activeCard = card;
    
    // Dim the background grid
    gridContainer.classList.add('dimmed');
    modalOverlay.classList.add('active');
    
    // Save the wrapper to return the card later
    activeCard.dataset.parentIndex = Array.from(document.querySelectorAll('.card-wrapper')).indexOf(card.parentElement);
    
    // Get state for Flip
    const state = Flip.getState(activeCard);
    
    // Move to active container
    activeContainer.appendChild(activeCard);
    
    // Make the card look like the active card
    activeCard.classList.add('is-active-popup');
    
    Flip.from(state, {
        duration: 0.8,
        ease: 'power3.inOut',
        scale: true,
        onComplete: () => {
            // Fix link clickability
            const gitLink = activeCard.querySelector('a');
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
            floatingAnim = gsap.to(activeCard, {
                y: "-=20",
                duration: 2,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut'
            });
        }
    });
}

function closeCard() {
    if (!activeCard) return;
    
    // Stop floating animation
    if (floatingAnim) floatingAnim.kill();
    gsap.set(activeCard, { y: 0 }); // reset y
    
    gridContainer.classList.remove('dimmed');
    modalOverlay.classList.remove('active');
    
    // Get state before moving back
    const state = Flip.getState(activeCard);
    
    // Remove popup styles
    activeCard.classList.remove('is-active-popup');
    
    // Move back to original wrapper
    const wrappers = document.querySelectorAll('.card-wrapper');
    const wrapper = wrappers[parseInt(activeCard.dataset.parentIndex)];
    if(wrapper) {
        wrapper.appendChild(activeCard);
    }
    
    Flip.from(state, {
        duration: 0.8,
        ease: 'power3.inOut',
        scale: true,
        onComplete: () => {
            activeCard = null;
        }
    });
}

closeBtn.addEventListener('click', closeCard);
modalOverlay.addEventListener('click', closeCard);`);

fs.writeFileSync('projects.js', js);
console.log('Replaced with Flip logic');
