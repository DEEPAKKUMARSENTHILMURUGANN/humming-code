const fs = require('fs');

const achievements = [
    {
        title: "Byte & Betrayal",
        tag: "CSEA PSG Tech",
        desc: "We did it! 🎉 So proud to announce the successful conduction of our first event after being recruited: 'Byte & Betrayal: Logic Meets Lies' in collaboration with the PSG College of Technology Computer Science and Engineering Association (CSEA PSG Tech)!",
        img: "images/csea event.jpg,images/csea event 2.jpg"
    },
    {
        title: "RJ Hunt — Radio Hub",
        tag: "Event · Oct 2025",
        desc: "Exciting Milestone! Our Radio Hub Team of 2025 at PSG College of Technology successfully conducted our first event of this academic year 'RJ Hunt' on October 25, 2025! Being part of the preparation was such a great experience.",
        img: "images/radio hub.jpg,images/radio hub logo.png"
    },
    {
        title: "AI on the Edge",
        tag: "Workshop · IEEE",
        desc: "Had the opportunity to attend a workshop on 'AI on the Edge' organized by the IEEE Students Chapter 12951 at PSG College of Technology, as part of the national-level symposium SRiSHTi. An inspiring and knowledge-rich experience!",
        img: "images/shristi 1.jpg,images/shristi 2.jpg"
    },
    {
        title: "Teachers Day 2024",
        tag: "IT Association",
        desc: "Excited to share that I had the opportunity to be part of the organizing committee for the event conducted by the IT Association in collaboration with SU of PSG Polytechnic College for Teachers day 2024.",
        img: "images/enadhu chalk 1.jpg,images/enaku chalk 2.jpg"
    },
    {
        title: "Speech at PSG Polytechnic",
        tag: "Speech",
        desc: "Honoured to Share My Speech at PSG Polytechnic College. Had the wonderful opportunity to present a speech highlighting the activities of the IT Association of the Students’ Union covering achievements of 2024 and plans for 2025.",
        img: "images/presentation dit.jpg,images/presntation of dit.jpg,images/presenation dit 3.jpg"
    },
    {
        title: "Presentation to PSG Tech Crew",
        tag: "Presentation",
        desc: "I and Manisha Subramanian had the wonderful opportunity to present in front of the PSG Tech crew, and we are truly humbled to have received appreciation for our presentation. It was an amazing experience to share ideas!",
        img: "images/interact section with dignity panel 1.jpg,images/interact section with dignity panel 2.jpg"
    },
    {
        title: "IoT Internship",
        tag: "A-Tech Computer System",
        desc: "Grateful to share that I have successfully completed my internship at A-Tech Computer System, Coimbatore in the domain of Internet of Things (IoT) from 06 May 2024 to 03 June 2024.",
        img: "images/iot internship.jpg"
    },
    {
        title: "Graduation Day!",
        tag: "Diploma in IT",
        desc: "Graduation Day Memories! Feeling incredibly proud to have completed my Diploma in Information Technology at PSG Polytechnic College, Coimbatore. MISS YOU DIT's 🖤",
        img: "images/graduation 2.jpg,images/graduation rh.jpg"
    },
    {
        title: "Excellent Dynamic Volunteer",
        tag: "IT Association",
        desc: "Proud to have been an active member of the IT Association at PSG Polytechnic College throughout all three years of my academic journey. Honored with the 'Excellent Dynamic Volunteer' award for my dedication and contributions.",
        img: "images/excellet dynamic volunteer 1.jpg,images/dynamic voluneetr 2.jpg"
    },
    {
        title: "Secretary — Brains Trust Club",
        tag: "Leadership",
        desc: "Honored to have served as the Secretary of the Brains Trust Club under the Students’ Union of PSG Polytechnic College for the academic year 2024–2025. This role helped me enhance my leadership and organizational skills.",
        img: "images/BRAINS TRUST SECRETARY.jpg,images/BRAINS TRUST SECRETARY2.jpg,images/BRAINS TRUST SECRETARY3.jpg"
    },
    {
        title: "Joint Secretary — Brains Trust Club",
        tag: "Leadership",
        desc: "Served as the Joint Secretary of the Brains Trust Club under the Students’ Union of PSG Polytechnic College, contributing to successful events and developing strong organizational skills.",
        img: "images/BRAINS TRUST JOINT SECRETARY1.jpg,images/BRAINS TRUST JOINT SECRETARY2.jpg"
    },
    {
        title: "First Prize — TECH VISION 2025",
        tag: "Achievement",
        desc: "Proud to share that my teammate Atchaya Kumar.S and I participated in TECH VISION 2025, a State-Level Technical Symposium conducted by Christ the King Polytechnic College. We secured the First Prize 🏆 in the PPT Contest!",
        img: "images/CHRIST.jpg,images/CHRIST2.jpg"
    },
    {
        title: "Second Prize — HINSPECTRA 2K25",
        tag: "Achievement",
        desc: "Participated in HINSPECTRA 2K25, a State-Level Symposium conducted by Hindustan Polytechnic College. We secured the Second Prize 🥈 in the PPT Contest! Our achievement was proudly featured in The Kovai Mail.",
        img: "images/HINDUS 1.jpg,images/HINDUS2.jpg"
    },
    {
        title: "Third Place — Paper Presentation",
        tag: "Achievement",
        desc: "Participated in the One-Day Paper Presentation for Polytechnic Students organized by Sri Ramakrishna Engineering College, Coimbatore. We are delighted to have secured the 3rd Place 🥉 in this event!",
        img: "images/RAMAKRISHNA1.jpg,images/RAMAKRISHNA2.jpg"
    },
    {
        title: "Robotics and AI Workshop",
        tag: "Workshop",
        desc: "Thrilled to share that I have successfully completed the 'Unlocking the Future with Robotics and AI' workshop held on 30th August 2024 at PSG Polytechnic College, certified by i-Robochakra. It was an incredible learning experience exploring how these technologies are shaping the future. Grateful for the insights and hands-on knowledge gained!",
        img: "images/robo chakra 1.jpg,images/robo chakra 2.jpg,images/robochakra 2.jpg"
    }
];

let html = `<div class="ach-track">\n`;
achievements.forEach((ach, index) => {
    // Extract first image to use for thumbnail
    let firstImg = ach.img.split(',')[0];
    html += `
                <!-- Card ${index + 1} -->
                <div class="ach-card" data-index="${index}"
                    data-title="${ach.title.replace(/"/g, '&quot;')}"
                    data-tag="${ach.tag.replace(/"/g, '&quot;')}"
                    data-desc="${ach.desc.replace(/"/g, '&quot;')}"
                    data-img="${ach.img}">
                    <div class="ach-img-wrap">
                        <img src="${firstImg}" alt="${ach.title.replace(/"/g, '&quot;')}" loading="lazy" />
                        <div class="ach-overlay-label"><span class="ach-tag">${ach.tag}</span>
                            <h3>${ach.title}</h3>
                        </div>
                    </div>
                </div>\n`;
});
achievements.forEach((ach, index) => {
    let firstImg = ach.img.split(',')[0];
    html += `
                <!-- Card ${index + 1} (Duplicated) -->
                <div class="ach-card" data-index="${index}"
                    data-title="${ach.title.replace(/"/g, '&quot;')}"
                    data-tag="${ach.tag.replace(/"/g, '&quot;')}"
                    data-desc="${ach.desc.replace(/"/g, '&quot;')}"
                    data-img="${ach.img}">
                    <div class="ach-img-wrap">
                        <img src="${firstImg}" alt="${ach.title.replace(/"/g, '&quot;')}" loading="lazy" />
                        <div class="ach-overlay-label"><span class="ach-tag">${ach.tag}</span>
                            <h3>${ach.title}</h3>
                        </div>
                    </div>
                </div>\n`;
});
html += `            </div>`;

let content = fs.readFileSync('index.html', 'utf8');

// Using regex to replace the ach-track
const updatedContent = content.replace(/<div class="ach-track">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/, html + '\n        </div>\n    </section>');

fs.writeFileSync('index.html', updatedContent);
console.log("HTML replaced successfully with multiple images.");
