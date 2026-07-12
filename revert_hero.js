const fs = require('fs');

// 1. Revert HTML
let html = fs.readFileSync('index.html', 'utf8');

const oldHero = `        <!-- Left Column -->
        <div class="hero-left">
            <p class="hero-hello">I A M</p>
            <h1 class="hero-name">
                Deepakkumar Senthilmurugan, an Diploma IT & <span class="highlight-red">BE CSE Student</span>
            </h1>
            <p class="hero-desc">
                An enthusiastic IT graduate pursuing B.E. Computer Science at PSG College of Technology. Passionate
                about <span class="highlight-red">programming, AI</span>, and networking, balancing academics with
                strong leadership and volunteering.
            </p>`;

html = html.replace(/<!-- Left Column -->\s*<div class="hero-left">\s*<h1 class="hero-name">[\s\S]*?<\/p>/m, oldHero);
fs.writeFileSync('index.html', html);
console.log('Reverted hero HTML');

// 2. Revert CSS
let css = fs.readFileSync('styles.css', 'utf8');
const overrideIndex = css.indexOf('/* HERO SECTION REBUILD */');
if (overrideIndex !== -1) {
    css = css.substring(0, overrideIndex).trim();
    fs.writeFileSync('styles.css', css);
    console.log('Reverted hero CSS');
}
