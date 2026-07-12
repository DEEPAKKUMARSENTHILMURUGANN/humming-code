const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

// Remove the incorrect modal (if it was added near logos-card)
c = c.replace(/<div id="achModal" class="ach-modal">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<div class="club-logo-wrap"/, '<div class="club-logo-wrap"');

// Ensure there is no achModal in the file before we append
if (!c.includes('<div id="achModal" class="ach-modal">')) {
    const modalHTML = `
    <!-- Achievements Modal -->
    <div id="achModal" class="ach-modal">
        <div class="ach-modal-content">
            <button class="ach-close-btn" id="achCloseBtn">&times;</button>
            <div class="ach-modal-body">
                <div class="ach-modal-img-col">
                    <img id="achModalImg" src="" alt="Achievement" />
                    <button id="achPrevBtn" class="ach-nav-btn prev-btn" style="display:none;">&#10094;</button>
                    <button id="achNextBtn" class="ach-nav-btn next-btn" style="display:none;">&#10095;</button>
                    <div id="achDots" class="ach-dots" style="display:none;"></div>
                </div>
                <div class="ach-modal-text-col">
                    <span class="ach-modal-tag" id="achModalTag"></span>
                    <h3 id="achModalTitle"></h3>
                    <p id="achModalDesc"></p>
                </div>
            </div>
        </div>
    </div>
    `;
    c = c.replace('</body>', modalHTML + '\n</body>');
}

fs.writeFileSync('index.html', c);
console.log("Modal fixed successfully.");
