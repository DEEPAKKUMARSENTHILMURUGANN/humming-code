const fs = require('fs');

// 1. REBUILD PROJECTS.HTML
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deepakkumar's Projects - 3D Grid</title>
    <link rel="stylesheet" href="projects.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="bg-grid-pattern"></div>
    <nav class="navbar">
        <a href="index.html" class="back-link">&larr; Back to Portfolio</a>
        <div class="logo">Projects.</div>
    </nav>

    <div class="scene">
        <div class="grid-container">

            <div class="card-wrapper">
                <div class="card" data-title="Schedulix AI" data-desc="AI Timetable Scheduler">
                    <div class="card-inner">
                        <div class="card-front"><div class="card-content img-1"></div></div>
                        <div class="card-back">
                            <h3>Schedulix AI</h3>
                            <p>An intelligent AI-powered timetable scheduler.<br><br><a href="https://github.com/aishwarya-r29/schedulix-ai-timetable-scheduler" target="_blank" class="github-btn">View on GitHub</a></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card" data-title="Academic Authenticity" data-desc="Validator Project">
                    <div class="card-inner">
                        <div class="card-front"><div class="card-content img-2"></div></div>
                        <div class="card-back">
                            <h3>Authenticity Validator</h3>
                            <p>Academic authenticity validator.<br><br><a href="https://github.com/Pravinthaa/Academic-authenticity-validator" target="_blank" class="github-btn">View on GitHub</a></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card" data-title="SKYE" data-desc="Project SKYE">
                    <div class="card-inner">
                        <div class="card-front"><div class="card-content img-3"></div></div>
                        <div class="card-back">
                            <h3>SKYE</h3>
                            <p>An innovative software project by Deepak.<br><br><a href="https://github.com/DEEPAKKUMARSENTHILMURUGANN/SKYE" target="_blank" class="github-btn">View on GitHub</a></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card" data-title="Modern Life Feud" data-desc="Feud Game Project">
                    <div class="card-inner">
                        <div class="card-front"><div class="card-content img-4"></div></div>
                        <div class="card-back">
                            <h3>Modern Life Feud</h3>
                            <p>A fun and interactive feud game project.<br><br><a href="https://github.com/DEEPAKKUMARSENTHILMURUGANN/modernlifefeud" target="_blank" class="github-btn">View on GitHub</a></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card" data-title="CSEA-VR" data-desc="Virtual Reality Project">
                    <div class="card-inner">
                        <div class="card-front"><div class="card-content img-5"></div></div>
                        <div class="card-back">
                            <h3>CSEA-VR</h3>
                            <p>An immersive virtual reality project.<br><br><a href="https://github.com/DEEPAKKUMARSENTHILMURUGANN/CSEA-VR" target="_blank" class="github-btn">View on GitHub</a></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card" data-title="Technical Skills" data-desc="Java, Python, C, MySQL, HTML, CSS.">
                    <div class="card-inner">
                        <div class="card-front"><div class="card-content img-6"></div></div>
                        <div class="card-back"><h3>Technical Skills</h3><p>Java, Python, C, MySQL, HTML, CSS.</p></div>
                    </div>
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card" data-title="Brains Trust Club" data-desc="Secretary & Joint Secretary (3 Years).">
                    <div class="card-inner">
                        <div class="card-front"><div class="card-content img-7"></div></div>
                        <div class="card-back"><h3>Brains Trust Club</h3><p>Secretary & Joint Secretary (3 Years).</p></div>
                    </div>
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card" data-title="GitHub Campus Club" data-desc="Member • Event Planning & Git.">
                    <div class="card-inner">
                        <div class="card-front"><div class="card-content img-8"></div></div>
                        <div class="card-back"><h3>GitHub Campus Club</h3><p>Member • Event Planning & Git.</p></div>
                    </div>
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card" data-title="Education" data-desc="Diploma IT (Grad) & B.E. CSE (Pursuing).">
                    <div class="card-inner">
                        <div class="card-front"><div class="card-content img-9"></div></div>
                        <div class="card-back"><h3>Education</h3><p>Diploma in IT (Graduated)<br/>B.E. CSE — Pursuing Second Year</p></div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- Fullscreen Overlay for Active Card -->
    <div class="active-card-container"></div>
    <div class="modal-overlay">
        <button class="close-btn">&times;</button>
    </div>

    <!-- Local Libraries -->
    <script src="libs/gsap.min.js"></script>
    <script src="libs/Flip.min.js"></script>
    
    <!-- Custom Script -->
    <script src="projects.js"></script>
</body>
</html>`;

fs.writeFileSync('projects.html', html);

// 2. REBUILD PROJECTS.JS
const js = `document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.querySelector('.grid-container');
    const scene = document.querySelector('.scene');
    const cards = document.querySelectorAll('.card');
    const modalOverlay = document.querySelector('.modal-overlay');
    const closeBtn = document.querySelector('.close-btn');
    const activeContainer = document.querySelector('.active-card-container');
    
    let activeCard = null;
    let overlayCard = null;
    let floatingAnim = null;

    // Mouse movement parallax effect on the grid
    document.addEventListener('mousemove', (e) => {
        if (activeCard) return; // Don't move grid when reading a card
        const x = (e.clientX / window.innerWidth - 0.5) * 20; 
        const y = (e.clientY / window.innerHeight - 0.5) * 20;

        gsap.to(gridContainer, {
            rotationY: x,
            rotationX: -y,
            duration: 1,
            ease: 'power2.out'
        });
    });

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
        card.addEventListener('dblclick', (e) => {
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

        // Animate the overlay card popping up and flipping!
        gsap.fromTo(overlayCard, 
            { 
                scale: 0.5, 
                opacity: 0,
                rotationY: 0
            },
            {
                scale: 1,
                opacity: 1,
                rotationY: 180, // Flip it
                duration: 1,
                ease: 'back.out(1.2)',
                onComplete: () => {
                    overlayCard.classList.add('is-flipped');
                    
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
                    floatingAnim = gsap.to(overlayCard, {
                        y: "-=20",
                        duration: 2,
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
        
        // Animate the overlay card away
        gsap.to(overlayCard, {
            scale: 0.5,
            opacity: 0,
            rotationY: 0,
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
});`;

fs.writeFileSync('projects.js', js);

// 3. REVERT PROJECTS.CSS
let css = fs.readFileSync('projects.css', 'utf8');

// Strip out any custom additions we made at the bottom
const cleanCss = css.replace(/\/\* Enhanced Active Card Styling for About Section \*\/[\s\S]*$/, '')
                    .replace(/\/\* GitHub Button directly on the front of the card \*\/[\s\S]*$/, '')
                    .replace(/\.is-active-popup \{[\s\S]*$/, '');

// Ensure pointer-events is none on active-card-container
const fixedCss = cleanCss.replace('pointer-events: auto;\n    z-index: 2000;', 'pointer-events: none;\n    z-index: 2000;');

fs.writeFileSync('projects.css', fixedCss);

console.log('Rollback complete');
