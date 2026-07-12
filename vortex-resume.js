/**
 * vortex-resume.js
 * Premium Glowing Vortex Resume Animation
 * Rendered on Canvas with vanilla JS.
 */

window.startVortexAnimation = function () {
    const overlay = document.getElementById('vortex-overlay');
    const canvas = document.getElementById('vortex-canvas');
    const statusEl = document.getElementById('vortex-status');
    const progressEl = document.getElementById('vortex-progress');
    const outputBtn = document.getElementById('vortex-output-btn');

    if (window.isProcessingResume) return;
    window.isProcessingResume = true;

    // Reset overlay UI
    overlay.classList.remove('hidden');
    outputBtn.classList.add('hidden');
    outputBtn.style.opacity = '0';
    outputBtn.style.transform = 'translate(-50%, -50%) scale(0)';
    progressEl.innerText = '0%';
    statusEl.innerText = 'INITIALIZING...';
    
    // Give it a tiny delay to allow display:block to apply before fading in
    setTimeout(() => overlay.classList.add('active'), 20);

    // Canvas setup
    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const CX = W / 2;
    const CY = H / 2;

    /* ── State ────────────────────────────────────────────── */
    let raf;
    let tick = 0;
    let phase = 'INIT'; // INIT -> SUCK -> COMPUTE -> DONE
    let overallProgress = 0; // 0 to 1
    
    // Vortex state
    let vortexAngle = 0;
    let vortexSpeed = 0.02;
    let vortexRadius = 50; // Base core radius
    let vortexGlow = 0;
    
    // Particles for background & vortex
    const particles = [];
    for (let i = 0; i < 200; i++) {
        particles.push({
            angle: Math.random() * Math.PI * 2,
            radius: Math.random() * Math.max(W, H),
            speed: Math.random() * 2 + 0.5,
            size: Math.random() * 2 + 0.5,
            color: Math.random() > 0.8 ? '#ffffff' : '#ff3c3c'
        });
    }

    // Data Nodes (Personal Info, Achievements, etc.)
    const dataLabels = ['PERSONAL INFO', 'ACHIEVEMENTS', 'EXPERIENCE', 'CERTIFICATIONS', 'PROJECTS'];
    const dataNodes = dataLabels.map((label, i) => {
        const angle = (i / dataLabels.length) * Math.PI * 2 - Math.PI / 2;
        const dist = Math.min(W, H) * 0.4;
        return {
            label,
            startX: CX + Math.cos(angle) * dist,
            startY: CY + Math.sin(angle) * dist,
            x: CX + Math.cos(angle) * dist,
            y: CY + Math.sin(angle) * dist,
            active: false,
            sucked: false,
            suckProgress: 0,
            delay: i * 60 // staggered start in ticks
        };
    });

    /* ── Render Loop ──────────────────────────────────────── */
    function render() {
        if (phase === 'STOPPED') return;
        
        raf = requestAnimationFrame(render);
        tick++;
        
        // Motion blur fade
        ctx.fillStyle = 'rgba(10, 2, 3, 0.2)';
        ctx.fillRect(0, 0, W, H);
        
        /* UPDATE PHASE & PROGRESS */
        if (phase === 'INIT') {
            overallProgress += 0.005;
            if (overallProgress > 0.1) {
                phase = 'SUCK';
                statusEl.innerText = 'IMPORTING DATA...';
            }
        } else if (phase === 'SUCK') {
            overallProgress += 0.0025;
            vortexSpeed += 0.001; // spin faster
            
            // Activate nodes based on tick
            let allSucked = true;
            dataNodes.forEach(node => {
                if (tick > node.delay && !node.sucked) {
                    node.active = true;
                    node.suckProgress += 0.015; // Move towards center
                    
                    // Bezier path towards center (spiral effect)
                    const t = node.suckProgress;
                    const spiralOffsetX = Math.cos(t * Math.PI * 4) * (1-t) * 100;
                    const spiralOffsetY = Math.sin(t * Math.PI * 4) * (1-t) * 100;
                    
                    node.x = node.startX + (CX - node.startX) * t + spiralOffsetX;
                    node.y = node.startY + (CY - node.startY) * t + spiralOffsetY;
                    
                    if (t >= 1) {
                        node.sucked = true;
                        node.active = false;
                        vortexGlow += 0.2; // pulse core
                        spawnBurst(CX, CY, 15);
                    } else {
                        allSucked = false;
                    }
                }
            });
            
            if (allSucked && overallProgress > 0.5) {
                phase = 'COMPUTE';
                statusEl.innerText = 'COMPILING RESUME...';
            }
        } else if (phase === 'COMPUTE') {
            overallProgress += 0.01;
            vortexSpeed += 0.005;
            vortexGlow = Math.min(2, vortexGlow + 0.05);
            
            if (overallProgress >= 1) {
                overallProgress = 1;
                phase = 'DONE';
                statusEl.innerText = 'RESUME READY.';
                progressEl.style.opacity = '0'; // hide progress
                
                // Massive burst
                spawnBurst(CX, CY, 100);
                
                // Show PDF button
                outputBtn.classList.remove('hidden');
                requestAnimationFrame(() => {
                    outputBtn.style.opacity = '1';
                    outputBtn.style.transform = 'translate(-50%, -50%) scale(1)';
                });
                
                // Slow down and let it loop beautifully
                setTimeout(() => {
                    vortexSpeed = 0.01;
                    window.isProcessingResume = false;
                }, 1000);
            }
        }
        
        // Update progress text
        if (phase !== 'DONE') {
            progressEl.innerText = Math.floor(overallProgress * 100) + '%';
        }
        
        /* DRAW PARTICLES (Vortex) */
        vortexAngle += vortexSpeed;
        vortexGlow = Math.max(0, vortexGlow - 0.02); // decay glow
        
        const coreIntensity = (phase === 'COMPUTE') ? vortexGlow : (0.5 + vortexGlow);
        
        particles.forEach(p => {
            // Spiral inwards
            p.angle += (p.speed * 0.01) + vortexSpeed * 0.5;
            p.radius -= p.speed;
            
            if (p.radius < vortexRadius) {
                p.radius = Math.max(W, H) * (Math.random() * 0.5 + 0.5);
                p.angle = Math.random() * Math.PI * 2;
            }
            
            const px = CX + Math.cos(p.angle) * p.radius;
            const py = CY + Math.sin(p.angle) * p.radius;
            
            ctx.beginPath();
            ctx.arc(px, py, p.size, 0, Math.PI * 2);
            // Opacity based on distance to center
            const distAlpha = Math.max(0, 1 - (p.radius / (Math.max(W,H)*0.6)));
            ctx.fillStyle = p.color + Math.floor(distAlpha * 255).toString(16).padStart(2, '0');
            ctx.fill();
        });
        
        /* DRAW VORTEX CORE */
        ctx.save();
        const coreGradient = ctx.createRadialGradient(CX, CY, 0, CX, CY, vortexRadius * 3);
        coreGradient.addColorStop(0, `rgba(255, 60, 60, ${Math.min(1, coreIntensity)})`);
        coreGradient.addColorStop(0.3, `rgba(255, 60, 60, ${Math.min(0.5, coreIntensity * 0.5)})`);
        coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(CX, CY, vortexRadius * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        /* DRAW DATA NODES */
        dataNodes.forEach(node => {
            if (node.active && !node.sucked) {
                // Draw trailing line to start
                ctx.beginPath();
                ctx.moveTo(node.startX, node.startY);
                ctx.lineTo(node.x, node.y);
                ctx.strokeStyle = 'rgba(255, 60, 60, 0.3)';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                // Draw node spark
                ctx.beginPath();
                ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
                
                ctx.beginPath();
                ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 60, 60, 0.8)';
                ctx.fill();
                
                // Draw Label
                ctx.font = 'bold 10px Inter, sans-serif';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.textAlign = 'center';
                ctx.fillText(node.label, node.x, node.y - 15);
            }
        });
        
        /* DRAW BURSTS */
        updateBursts();
    }
    
    const bursts = [];
    function spawnBurst(cx, cy, count) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 2;
            bursts.push({
                x: cx,
                y: cy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                color: Math.random() > 0.5 ? '#ff3c3c' : '#ffffff'
            });
        }
    }
    
    function updateBursts() {
        for (let i = bursts.length - 1; i >= 0; i--) {
            const b = bursts[i];
            ctx.beginPath();
            ctx.arc(b.x, b.y, 2 * b.life, 0, Math.PI * 2);
            ctx.fillStyle = b.color + Math.floor(b.life * 255).toString(16).padStart(2, '0');
            ctx.fill();
            b.x += b.vx;
            b.y += b.vy;
            b.life -= 0.02;
            if (b.life <= 0) bursts.splice(i, 1);
        }
    }
    
    // Start loop
    render();
};

window.closeVortex = function () {
    const overlay = document.getElementById('vortex-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.classList.add('hidden');
            window.isProcessingResume = false;
        }, 500);
    }
};
