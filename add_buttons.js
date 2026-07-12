const fs = require('fs');

// 1. Update HTML
let html = fs.readFileSync('projects.html', 'utf8');

html = html.replace(/<div class="card-front"><div class="card-content (img-\d+)"><\/div><\/div>\s*<div class="card-back">([\s\S]*?)<a href="([^"]+)"[^>]*>View on GitHub<\/a><\/p>\s*<\/div>/g, (match, imgClass, backContentText, githubLink) => {
    return `<div class="card-front">
                            <div class="card-content ${imgClass}"></div>
                            <div class="card-buttons">
                                <button class="about-btn">About</button>
                                <a href="${githubLink}" target="_blank" class="github-btn-front">
                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                    GitHub
                                </a>
                            </div>
                        </div>
                        <div class="card-back">
                            ${backContentText}</p>
                            <button class="close-about-btn">Back</button>
                        </div>`;
});

// For cards without github links
html = html.replace(/<div class="card-front"><div class="card-content (img-\d+)"><\/div><\/div>\s*<div class="card-back">([\s\S]*?)<\/div>/g, (match, imgClass, backContent) => {
    if(match.includes('card-buttons')) return match; 
    return `<div class="card-front">
                            <div class="card-content ${imgClass}"></div>
                            <div class="card-buttons">
                                <button class="about-btn">About</button>
                            </div>
                        </div>
                        <div class="card-back">
                            ${backContent.trim()}
                            <br><br><button class="close-about-btn">Back</button>
                        </div>`;
});

fs.writeFileSync('projects.html', html);

// 2. Update CSS
let css = fs.readFileSync('projects.css', 'utf8');
css += `
/* Card Buttons on Front */
.card-front {
    position: relative;
}
.card-buttons {
    position: absolute;
    bottom: 20px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 15px;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    transform: translateY(10px);
}
.card:hover .card-buttons {
    opacity: 1;
    transform: translateY(0);
}

.about-btn {
    background: #1a73e8;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(26, 115, 232, 0.4);
    transition: background 0.2s;
    pointer-events: auto;
}
.about-btn:hover {
    background: #1557b0;
}

.github-btn-front {
    background: transparent;
    color: #1a73e8;
    border: 2px solid #1a73e8;
    border-radius: 20px;
    padding: 8px 18px;
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
    pointer-events: auto;
    background: rgba(255,255,255,0.9);
}
.github-btn-front:hover {
    background: #e8f0fe;
}

.close-about-btn {
    background: transparent;
    color: #fff;
    border: 1px solid rgba(255,255,255,0.5);
    border-radius: 20px;
    padding: 8px 20px;
    cursor: pointer;
    margin-top: 15px;
    transition: all 0.2s;
}
.close-about-btn:hover {
    background: rgba(255,255,255,0.1);
}
`;
fs.writeFileSync('projects.css', css);

// 3. Update JS
let js = fs.readFileSync('projects.js', 'utf8');

js = js.replace(/card\.addEventListener\('dblclick', \(e\) => \{[\s\S]*?\}\);/g, `// Handle About Button
        const aboutBtn = card.querySelector('.about-btn');
        if (aboutBtn) {
            aboutBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openCard(card);
            });
        }
        
        // Double click still works
        card.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            openCard(card);
        });`);

// In openCard onComplete, we need to add the close handler
js = js.replace(/floatingAnim = gsap\.to\(overlayCard, \{/g, `const closeAboutBtn = overlayCard.querySelector('.close-about-btn');
                    if (closeAboutBtn) {
                        closeAboutBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            closeCard();
                        });
                    }
                    
                    floatingAnim = gsap.to(overlayCard, {`);

fs.writeFileSync('projects.js', js);
console.log('Done script');
