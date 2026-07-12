// Auto-scroll for Milestones
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

        function autoScroll() {
            if (!isHovered) {
                scrollAmount += 1.5; // Adjust speed here
                
                // If scrolled past the original set of cards, reset
                if (scrollAmount >= track.scrollWidth / 2) {
                    scrollAmount = 0;
                }
                
                trackWrap.scrollLeft = scrollAmount;
            }
            requestAnimationFrame(autoScroll);
        }
        
        autoScroll();
    }
});
