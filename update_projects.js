const fs = require('fs');

let html = fs.readFileSync('projects.html', 'utf8');

// The new cards to insert:
const newCards = `
            <div class="card-wrapper">
                <div class="card" data-title="Schedulix AI" data-desc="AI Timetable Scheduler">
                    <div class="card-inner">
                        <div class="card-front"><div class="card-content img-1"></div></div>
                        <div class="card-back">
                            <h3>Schedulix AI</h3>
                            <p>An intelligent AI-powered timetable scheduler.<br><br><a href="https://github.com/aishwarya-r29/schedulix-ai-timetable-scheduler" target="_blank" style="color: #fff; text-decoration: underline; pointer-events: auto; position: relative; z-index: 10;">View on GitHub</a></p>
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
                            <p>Academic authenticity validator.<br><br><a href="https://github.com/Pravinthaa/Academic-authenticity-validator" target="_blank" style="color: #fff; text-decoration: underline; pointer-events: auto; position: relative; z-index: 10;">View on GitHub</a></p>
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
                            <p>An innovative software project by Deepak.<br><br><a href="https://github.com/DEEPAKKUMARSENTHILMURUGANN/SKYE" target="_blank" style="color: #fff; text-decoration: underline; pointer-events: auto; position: relative; z-index: 10;">View on GitHub</a></p>
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
                            <p>A fun and interactive feud game project.<br><br><a href="https://github.com/DEEPAKKUMARSENTHILMURUGANN/modernlifefeud" target="_blank" style="color: #fff; text-decoration: underline; pointer-events: auto; position: relative; z-index: 10;">View on GitHub</a></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-wrapper">
                <div class="card" data-title="GENLEARN AI" data-desc="AI-Based 3D Projection Technology (Published).">
                    <div class="card-inner">
                        <div class="card-front"><div class="card-content img-5"></div></div>
                        <div class="card-back"><h3>GENLEARN AI</h3><p>AI-Based 3D Projection Technology (Published Research).</p></div>
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
`;

// replace everything between <div class="grid-container"> and </div>\n    </div>\n\n    <!-- Fullscreen Overlay
html = html.replace(/<div class="grid-container">[\s\S]*?<\/div>\s*<\/div>\s*<!-- Fullscreen/, '<div class="grid-container">\n' + newCards + '\n        </div>\n    </div>\n\n    <!-- Fullscreen');

fs.writeFileSync('projects.html', html);
console.log('Updated projects.html');
