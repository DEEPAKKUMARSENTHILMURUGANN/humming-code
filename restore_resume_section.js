const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const modalStart = html.indexOf('<!-- ============ RESUME MACHINE MODAL ============ -->');
if (modalStart > -1) {
    html = html.substring(0, modalStart) + '\n</body>\n</html>';
}

const contactStr = '<!-- ============ CONTACT SECTION ============ -->';
const resumeSection = `    <!-- ==========================================
         RESUME / INTERACTIVE MACHINE SECTION
         ========================================== -->
    <section id="resume" class="resume-section">
        <div class="resume-container">
            <div class="resume-header gsap-reveal">
                <h2 class="section-title">INTERACTIVE RESUME</h2>
                <p class="section-subtitle">Initialize the data sequence</p>
            </div>
            <div class="retro-mobile-wrapper">
                <div class="retro-frame" id="retro-frame-container">
                    <div class="screw top-left"></div>
                    <div class="screw top-right"></div>
                    <div class="retro-screen-bezel">
                        <div class="retro-screen">
                            <div class="machine-container">
                                <!-- Data Nodes that will fly in -->
                                <div class="data-node" id="node-info">Personal Info</div>
                                <div class="data-node" id="node-edu">Education</div>
                                <div class="data-node" id="node-exp">Experience</div>
                                <div class="data-node" id="node-proj">Projects</div>
                                <div class="data-node" id="node-ach">Achievements</div>

                                <!-- The Machine Core -->
                                <div class="machine-core" id="machine-core">
                                    <div class="ring ring-1"></div>
                                    <div class="ring ring-2"></div>
                                    <div class="ring ring-3"></div>
                                    <div class="core-center"></div>
                                    
                                    <!-- Final Button inside the core -->
                                    <a href="resume.pdf" target="_blank" id="final-resume-btn" class="final-resume-btn hidden">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                            <line x1="12" y1="18" x2="12" y2="12"></line>
                                            <polyline points="9 15 12 18 15 15"></polyline>
                                        </svg>
                                        OPEN RESUME
                                    </a>
                                </div>
                                
                                <div class="machine-status" id="machine-status">SYSTEM IDLE...</div>
                            </div>
                        </div>
                    </div>

                    <div class="retro-bottom-area">
                        <div class="screw bottom-left"></div>
                        <div class="retro-bottom-panel">
                            <div class="retro-pill"></div>
                            <div class="retro-pill"></div>
                        </div>
                        <div class="screw bottom-right"></div>
                    </div>
                </div>
            </div>
            
            <!-- START BUTTON -->
            <div style="text-align:center; margin-top: 2rem;" class="gsap-reveal">
                <button id="build-resume-btn" class="pink-pill-btn resume-btn" onclick="startResumeAnimation()">
                    INITIALIZE SEQUENCE
                </button>
            </div>
        </div>
    </section>

`;

html = html.replace(contactStr, resumeSection + contactStr);
fs.writeFileSync('index.html', html);
console.log('Fixed index.html');
