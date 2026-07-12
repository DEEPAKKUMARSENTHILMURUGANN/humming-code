const fs = require('fs');

// Read current styles.css
let css = fs.readFileSync('styles.css', 'utf8');

// Find where tech-marquee-wrap ends
const marker = 'mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);\r\n}';
let idx = css.indexOf(marker);

if (idx === -1) {
    const fallbackMarker = 'mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);\n}';
    idx = css.indexOf(fallbackMarker);
}

if (idx === -1) {
    console.log("Could not find marker");
    process.exit(1);
}

// Slice to keep everything before and including the marker
let topPart = css.substring(0, idx + marker.length);

// Reconstruct the missing tech-marquee animation
const missingTechMarquee = `

.tech-marquee {
    display: flex;
    width: max-content;
    animation: tech-scroll 30s linear infinite;
    gap: 4rem;
}
.tech-marquee i {
    font-size: 4rem;
    color: var(--text-muted);
    transition: transform 0.3s ease, filter 0.3s ease;
    filter: grayscale(100%);
}
.tech-marquee i:hover {
    transform: scale(1.2);
    filter: grayscale(0%);
}
@keyframes tech-scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(-50% - 2rem)); }
}
`;

// Read restored mobile css
let mobileCss = fs.readFileSync('restored_clean.css', 'utf8');

// Combine
let finalCss = topPart + missingTechMarquee + '\n' + mobileCss;

fs.writeFileSync('styles.css', finalCss, 'utf8');
console.log("Reconstructed styles.css!");
