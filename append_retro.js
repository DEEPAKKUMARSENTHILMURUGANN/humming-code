const fs = require('fs');

const css = `
/* --- Retro Frame CSS --- */
.retro-frame {
    width: 90vw;
    max-width: 650px;
    height: 90vh;
    max-height: 650px;
    background: #95999b;
    border-radius: clamp(30px, 8vw, 60px);
    padding: clamp(15px, 4vw, 30px);
    position: relative;
    box-shadow: 
        inset 3px 3px 15px rgba(255,255,255,0.4),
        inset -6px -6px 20px rgba(0,0,0,0.2),
        0 40px 80px rgba(0,0,0,0.6);
    display: flex;
    flex-direction: column;
}

.screw {
    width: clamp(16px, 4vw, 24px);
    height: clamp(16px, 4vw, 24px);
    background: #8b8f91;
    border-radius: 50%;
    position: absolute;
    box-shadow: 
        inset 1px 1px 4px rgba(0,0,0,0.4),
        inset -2px -2px 5px rgba(255,255,255,0.4),
        1px 1px 3px rgba(255,255,255,0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #6e7274;
    font-size: clamp(12px, 3vw, 16px);
    font-family: sans-serif;
    font-weight: bold;
}
.screw::after { content: '+'; }
.screw.top-left { top: clamp(15px, 4vw, 30px); left: clamp(15px, 4vw, 30px); transform: rotate(15deg); }
.screw.top-right { top: clamp(15px, 4vw, 30px); right: clamp(15px, 4vw, 30px); transform: rotate(75deg); }
.screw.bottom-left { bottom: clamp(15px, 4vw, 30px); left: clamp(15px, 4vw, 30px); transform: rotate(45deg); }
.screw.bottom-right { bottom: clamp(15px, 4vw, 30px); right: clamp(15px, 4vw, 30px); transform: rotate(-20deg); }

.retro-screen-bezel {
    width: 100%;
    flex: 1;
    background: #828688;
    margin-top: 10px;
    margin-bottom: clamp(15px, 4vw, 30px);
    position: relative;
    padding: clamp(6px, 1.5vw, 10px);
    box-shadow: inset 3px 3px 15px rgba(0,0,0,0.4), inset -3px -3px 15px rgba(255,255,255,0.2);
    clip-path: polygon(4% 0, 96% 0, 100% 4%, 100% 100%, 0 100%, 0 4%);
}

.retro-screen {
    width: 100%;
    height: 100%;
    background: #eef1f5;
    position: relative;
    overflow: hidden;
    box-shadow: inset 0 0 30px rgba(0,0,0,0.15);
    clip-path: polygon(3.5% 0, 96.5% 0, 100% 3.5%, 100% 100%, 0 100%, 0 3.5%);
    display: flex;
    justify-content: center;
    align-items: center;
}

.retro-bottom-area {
    height: clamp(60px, 15vh, 90px);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
}

.retro-bottom-panel {
    width: 60%;
    height: 80%;
    background: #95999b;
    position: relative;
    box-shadow: 
        -3px -3px 8px rgba(255,255,255,0.3),
        4px 4px 12px rgba(0,0,0,0.2);
    border-top: 2px solid rgba(255,255,255,0.3);
    clip-path: polygon(10% 0, 90% 0, 100% 100%, 0% 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: clamp(10px, 4vw, 30px);
}

.retro-pill {
    width: clamp(30px, 8vw, 60px);
    height: clamp(12px, 3vw, 25px);
    background: #85898b;
    border-radius: 12px;
    box-shadow: 
        inset 2px 2px 6px rgba(0,0,0,0.4),
        inset -2px -2px 4px rgba(255,255,255,0.2);
}

.retro-screen .machine-container { 
    width: 100%;
    height: 100%;
    transform: scale(0.85); 
}
.retro-screen .data-node { 
    background: #222; 
    color: #fff; 
    border: 1px solid #444; 
    box-shadow: 0 5px 15px rgba(0,0,0,0.4); 
}
.retro-screen .machine-status { 
    color: #111; 
    text-shadow: none; 
    font-weight: 800; 
}
`;

fs.appendFileSync('styles.css', css, 'utf8');
console.log('Appended successfully');
