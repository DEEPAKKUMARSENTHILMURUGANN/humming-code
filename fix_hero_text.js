const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const newHeroText = `
        <!-- Left Column -->
        <div class="hero-left">
            <h1 class="hero-name">
                Deepak Kumar S.,<br>
                IT & <span class="highlight-red">CSE Student</span>
            </h1>
            <p class="hero-desc">
                IT graduate pursuing B.E. Computer Science at PSG College of Technology. Passionate about <span class="highlight-red">programming, AI</span>, and networking, balancing academics with strong leadership and volunteering.
            </p>
`;

html = html.replace(/<!-- Left Column -->\s*<div class="hero-left">\s*<p class="hero-hello">I A M<\/p>\s*<h1 class="hero-name">[\s\S]*?<\/h1>\s*<p class="hero-desc">[\s\S]*?<\/p>/m, newHeroText.trim());

fs.writeFileSync('index.html', html);
console.log('Fixed hero text');
