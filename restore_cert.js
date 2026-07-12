const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// The block to replace
const start = html.indexOf('<div class="certificates-grid">');
const end = html.indexOf('<!-- ============ CONTACT SECTION ============ -->');

const carouselHtml = `
            <!-- Right Side: Certifications Carousel -->
            <div class="cert-carousel">
                <h3 style="position: absolute; top: 20px; left: 50px; z-index: 100; font-size: 2rem; color: #fff;">MILESTONES</h3>
                <div class="list">
                    <div class="item">
                        <img src="images/interact section with dignity panel 1.jpg">
                        <div class="introduce">
                            <div class="title">INTERACTION SESSION</div>
                            <div class="topic">WITH DIGNITIES</div>
                            <div class="des">Presenting and interacting with the panel members during the session.</div>
                            <button class="seeMore">SEE MORE &#8599;</button>
                        </div>
                    </div>
                    <div class="item">
                        <img src="images/presenation dit 3.jpg">
                        <div class="introduce">
                            <div class="title">PRESENTATION</div>
                            <div class="topic">DEPARTMENT OF IT</div>
                            <div class="des">Presenting our ideas and concepts to the Department of IT panel.</div>
                            <button class="seeMore">SEE MORE &#8599;</button>
                        </div>
                    </div>
                    <div class="item">
                        <img src="images/robo chakra 1.jpg">
                        <div class="introduce">
                            <div class="title">ROBO CHAKRA</div>
                            <div class="topic">ROBOTICS EVENT</div>
                            <div class="des">Participating and showcasing innovations in the Robo Chakra event.</div>
                            <button class="seeMore">SEE MORE &#8599;</button>
                        </div>
                    </div>
                    <div class="item">
                        <img src="images/shristi 1.jpg">
                        <div class="introduce">
                            <div class="title">SHRISTI</div>
                            <div class="topic">PROJECT EXPO</div>
                            <div class="des">Demonstrating our technical projects at Shristi.</div>
                            <button class="seeMore">SEE MORE &#8599;</button>
                        </div>
                    </div>
                    <div class="item">
                        <img src="images/csea event.jpg">
                        <div class="introduce">
                            <div class="title">CSEA EVENT</div>
                            <div class="topic">ASSOCIATION MEET</div>
                            <div class="des">Active participation in Computer Science and Engineering Association events.</div>
                            <button class="seeMore">SEE MORE &#8599;</button>
                        </div>
                    </div>
                </div>
                <div class="arrows" style="position: absolute; bottom: 20px; right: 20px; z-index: 100;">
                    <button id="cert-prev" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 10px 15px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; margin-right: 10px;"><</button>
                    <button id="cert-next" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 10px 15px; border-radius: 50%; font-size: 1.2rem; cursor: pointer;">></button>
                </div>
                <div class="backButton" style="position: absolute; top: 20px; right: 20px; z-index: 100;">
                    <button id="cert-back" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; display: none;">BACK</button>
                </div>
            </div>
`;

if(start > -1 && end > start) {
    html = html.substring(0, start) + carouselHtml + '\n\n' + html.substring(end);
    
    // ensure cert-slider.js is included at the end of body
    if (!html.includes('<script src="cert-slider.js"></script>')) {
        html = html.replace('</body>', '    <script src="cert-slider.js"></script>\n</body>');
    }
    
    fs.writeFileSync('index.html', html);
    console.log('Restored cert-carousel HTML');
} else {
    console.log('Could not find certificates-grid block');
}

// Append CSS
let cssTxt = fs.readFileSync('cert_css.txt', 'utf8');
let mainCss = fs.readFileSync('style.css', 'utf8');

if (!mainCss.includes('.cert-carousel{')) {
    fs.appendFileSync('style.css', '\n\n' + cssTxt);
    console.log('Appended cert CSS to style.css');
}

// Update cert-slider.js to show/hide the back button based on showDetail class
let jsTxt = fs.readFileSync('cert-slider.js', 'utf8');
if (!jsTxt.includes('backButton.style.display')) {
    jsTxt = jsTxt.replace('carousel.classList.add(\'showDetail\');', 'carousel.classList.add(\'showDetail\');\n        if(backButton) backButton.style.display = "block";');
    jsTxt = jsTxt.replace('carousel.classList.remove(\'showDetail\');', 'carousel.classList.remove(\'showDetail\');\n    if(backButton) backButton.style.display = "none";');
    fs.writeFileSync('cert-slider.js', jsTxt);
}

