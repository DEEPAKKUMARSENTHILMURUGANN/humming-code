const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const start = html.indexOf('<!-- ============ PROJECTS SECTION (Inline) ============ -->');
const end = html.indexOf('</section>', start) + 10;

const newProjects = `    <!-- ============ PROJECTS SECTION ============ -->
    <section class="projects-section" id="projects">
        <div class="contact-bg-text" style="font-size: clamp(5rem, 11vw, 20rem); white-space: nowrap; color: rgba(255, 255, 255, 0.1); z-index: -1;">PROJECTS</div>
        <div class="projects-header gsap-reveal">
            <p class="section-desc" style="max-width:600px; margin: 0 auto;">Double-click any card to explore. Hover to preview.</p>
        </div>

        <div class="scene">
            <div class="grid-container">
                <div class="card-wrapper">
                    <div class="card" data-title="PSG COLLEGE OF TECHNOLOGY" data-desc="Institutional Portal">
                        <div class="card-inner">
                            <div class="card-front"><div class="card-content img-1"></div></div>
                            <div class="card-back"><h3>PSG COLLEGE</h3><p>Institutional Portal<br><br><a href="#" target="_blank" class="github-btn">View</a></p></div>
                        </div>
                    </div>
                </div>
                <div class="card-wrapper">
                    <div class="card" data-title="MODERN LIFE FEUD" data-desc="Game Show">
                        <div class="card-inner">
                            <div class="card-front"><div class="card-content img-2"></div></div>
                            <div class="card-back"><h3>MODERN LIFE FEUD</h3><p>Game Show<br><br><a href="https://github.com/DEEPAKKUMARSENTHILMURUGANN/modernlifefeud" target="_blank" class="github-btn">View on GitHub</a></p></div>
                        </div>
                    </div>
                </div>
                <div class="card-wrapper">
                    <div class="card" data-title="SCHEDULE IT" data-desc="AI Timetable Scheduler">
                        <div class="card-inner">
                            <div class="card-front"><div class="card-content img-3"></div></div>
                            <div class="card-back"><h3>SCHEDULE IT</h3><p>AI Timetable Scheduler<br><br><a href="#" target="_blank" class="github-btn">View</a></p></div>
                        </div>
                    </div>
                </div>
                <div class="card-wrapper">
                    <div class="card" data-title="VERI-CHAIN" data-desc="Govt of Jharkhand">
                        <div class="card-inner">
                            <div class="card-front"><div class="card-content img-4"></div></div>
                            <div class="card-back"><h3>VERI-CHAIN</h3><p>Govt of Jharkhand<br><br><a href="#" target="_blank" class="github-btn">View</a></p></div>
                        </div>
                    </div>
                </div>
                <div class="card-wrapper">
                    <div class="card" data-title="AI DIAGNOSTICS" data-desc="Vehicle Health Monitoring">
                        <div class="card-inner">
                            <div class="card-front"><div class="card-content img-5"></div></div>
                            <div class="card-back"><h3>AI DIAGNOSTICS</h3><p>Vehicle Health Monitoring<br><br><a href="#" target="_blank" class="github-btn">View</a></p></div>
                        </div>
                    </div>
                </div>
                <div class="card-wrapper">
                    <div class="card" data-title="SKYE" data-desc="Cloud Solutions">
                        <div class="card-inner">
                            <div class="card-front"><div class="card-content img-6"></div></div>
                            <div class="card-back"><h3>SKYE</h3><p>Cloud Solutions<br><br><a href="#" target="_blank" class="github-btn">View</a></p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>`;

if(start > -1 && end > start) {
    html = html.substring(0, start) + newProjects + html.substring(end);
    fs.writeFileSync('index.html', html);
    console.log('Replaced Projects Section');
} else {
    console.log('Could not find projects section block');
}

let css = fs.readFileSync('projects.css', 'utf8');
// Fix img classes in projects.css to point to correct images
css = css.replace('.img-1 { background-image: url(\'images/Picture1.jpg\'); } /* Schedulix AI */', '.img-1 { background-image: url(\'images/su_logo.png\'); }');
css = css.replace('.img-2 { background-image: url(\'images/ACADEMIC VALIDATOR.jpg\'); }', '.img-2 { background-image: url(\'images/MODERN LIFE FUED PROJECT CARD IMAGE.jpg\'); }');
css = css.replace('.img-3 { background-image: url(\'images/skye front page.png\'); }', '.img-3 { background-image: url(\'images/SCHEDULIX TIMETABLER PROJECT CARD IMAGE.jpg\'); }');
css = css.replace('.img-4 { background-image: url(\'images/modernlifefued.jpg\'); }', '.img-4 { background-image: url(\'images/VERICHAIN PROJECT CARD IMAGE.jpg\'); }');
css = css.replace('.img-5 { background-image: url(\'images/CSEA VR.jpg\'); }', '.img-5 { background-image: url(\'images/ACADEMIC VALIDATOR.jpg\'); }');
css = css.replace('.img-6 { background-image: url(\'images/Picture1.jpg\'); } /* Fallback */', '.img-6 { background-image: url(\'images/SKYE PROJECT CARD IMAGE.png\'); }');
css = css.replace('.img-7 { background-image: url(\'images/Picture1.jpg\'); }', '');
css = css.replace('.img-8 { background-image: url(\'images/Picture1.jpg\'); }', '');
css = css.replace('.img-9 { background-image: url(\'images/Picture1.jpg\'); }', '');
fs.writeFileSync('projects.css', css);
console.log('Updated projects.css');
