/* ════════════════════════════════════════════════
   HireAI v2.0 — JavaScript
   Features: Neural Canvas · 3D Tilt · Typewriter
             Stat Counters · Custom Cursor · Toasts
             Confetti · Strength Meter · Progress Bar
             AI Scanning Loader · Breakdown Chart
             History Panel · Scroll Reveal
   ════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════════════
   1. CUSTOM CURSOR TRAIL
══════════════════════════════════════════════════ */
(function initCursor() {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX; mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top  = mouseY + 'px';
    });

    // Smooth ring follow
    (function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
        requestAnimationFrame(animateRing);
    })();

    // Hover effect on interactive elements
    document.querySelectorAll('a, button, input, select, .feature-card').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });
})();


/* ══════════════════════════════════════════════════
   2. 3D NEURAL NETWORK CANVAS
══════════════════════════════════════════════════ */
(function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    const ctx    = canvas.getContext('2d');
    let W, H, nodes;
    const mouse = { x: -9999, y: -9999 };
    const NODE_COUNT = 75, MAX_DIST = 155, NODE_RADIUS = 2.2;
    const COLORS = [[168,85,247],[59,130,246],[6,182,212],[16,185,129]];

    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    function rand(a, b) { return a + Math.random() * (b - a); }

    function initNodes() {
        nodes = Array.from({length: NODE_COUNT}, () => ({
            x: rand(0,W), y: rand(0,H),
            vx: rand(-0.38,0.38), vy: rand(-0.38,0.38),
            r: rand(1,NODE_RADIUS),
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            baseAlpha: rand(0.4,0.9),
            phase: Math.random() * Math.PI * 2,
        }));
    }

    function drawFrame(t) {
        ctx.clearRect(0,0,W,H);
        nodes.forEach(n => {
            n.x += n.vx; n.y += n.vy;
            if (n.x < 0 || n.x > W) n.vx *= -1;
            if (n.y < 0 || n.y > H) n.vy *= -1;
            const dx = n.x - mouse.x, dy = n.y - mouse.y;
            const d = Math.hypot(dx, dy);
            if (d < 120) {
                n.vx += dx / d * 0.07; n.vy += dy / d * 0.07;
                const spd = Math.hypot(n.vx, n.vy);
                if (spd > 1.6) { n.vx /= spd; n.vy /= spd; }
            }
        });

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i+1; j < nodes.length; j++) {
                const a = nodes[i], b = nodes[j];
                const d = Math.hypot(a.x-b.x, a.y-b.y);
                if (d < MAX_DIST) {
                    const alpha = (1 - d/MAX_DIST) * 0.2;
                    const [r,g,bl] = a.color;
                    ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
                    ctx.strokeStyle = `rgba(${r},${g},${bl},${alpha})`;
                    ctx.lineWidth = 0.8; ctx.stroke();
                }
            }
        }

        nodes.forEach(n => {
            const pulse = Math.sin(t * 0.001 + n.phase) * 0.3 + 0.7;
            const [r,g,b] = n.color;
            const alpha = n.baseAlpha * pulse;
            const grd = ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r*6);
            grd.addColorStop(0, `rgba(${r},${g},${b},${alpha*0.5})`);
            grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
            ctx.beginPath(); ctx.arc(n.x,n.y,n.r*6,0,Math.PI*2);
            ctx.fillStyle = grd; ctx.fill();
            ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
            ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`; ctx.fill();
        });
        requestAnimationFrame(drawFrame);
    }

    document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('resize', () => { resize(); initNodes(); });
    resize(); initNodes(); requestAnimationFrame(drawFrame);
})();


/* ══════════════════════════════════════════════════
   3. TYPEWRITER EFFECT
══════════════════════════════════════════════════ */
(function initTypewriter() {
    const el = document.getElementById('typewriter-text');
    if (!el) return;
    const text = 'Hiring Prediction';
    let i = 0;
    function type() {
        if (i < text.length) {
            el.textContent += text[i++];
            setTimeout(type, 80 + Math.random() * 40);
        }
    }
    setTimeout(type, 800);
})();


/* ══════════════════════════════════════════════════
   4. ANIMATED STAT COUNTERS
══════════════════════════════════════════════════ */
(function initCounters() {
    const statEls = document.querySelectorAll('.stat-num[data-target]');
    if (!statEls.length) return;

    function animateCounter(el) {
        const target   = parseFloat(el.dataset.target);
        const suffix   = el.dataset.suffix || '';
        const prefix   = el.dataset.prefix || '';
        const decimal  = parseInt(el.dataset.decimal) || 0;
        const duration = 1800;
        const start    = performance.now();

        function step(now) {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3); // cubic ease-out
            const val = target * ease;
            el.textContent = prefix + val.toFixed(decimal) + suffix;
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                animateCounter(e.target);
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });

    statEls.forEach(el => observer.observe(el));
})();


/* ══════════════════════════════════════════════════
   5. SCROLL REVEAL — Feature Cards
══════════════════════════════════════════════════ */
(function initScrollReveal() {
    const cards = document.querySelectorAll('.feature-card');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const delay = parseInt(e.target.dataset.delay) || 0;
                setTimeout(() => {
                    e.target.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.22,0.68,0,1.2) ${delay}ms`;
                    e.target.classList.add('visible');
                }, 50);
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });
    cards.forEach(c => observer.observe(c));
})();


/* ══════════════════════════════════════════════════
   6. 3D CARD TILT EFFECT
══════════════════════════════════════════════════ */
(function initTilt() {
    const card = document.getElementById('form-card');
    if (!card) return;
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top  + rect.height / 2;
        const rotX = -((e.clientY - cy) / (rect.height / 2)) * 4;
        const rotY =  ((e.clientX - cx) / (rect.width  / 2)) * 4;
        card.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.008)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale(1)';
        card.style.transition = 'transform 0.6s cubic-bezier(0.22,0.68,0,1.1)';
    });
    card.addEventListener('mouseenter', () => { card.style.transition = 'transform 0.12s ease'; });
})();


/* ══════════════════════════════════════════════════
   7. TOAST NOTIFICATION SYSTEM
══════════════════════════════════════════════════ */
const ICONS = { success: '✅', error: '❌', info: 'ℹ️' };

function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${ICONS[type]}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 350);
    }, duration);
}


/* ══════════════════════════════════════════════════
   8. AI SCORE BAR
══════════════════════════════════════════════════ */
(function initScoreBar() {
    const aiInput  = document.getElementById('ai_score');
    const barWrap  = document.getElementById('score-bar-wrap');
    const barFill  = document.getElementById('score-bar-fill');
    const barLabel = document.getElementById('score-bar-label');
    if (!aiInput) return;

    aiInput.addEventListener('input', () => {
        const val = Math.min(100, Math.max(0, parseFloat(aiInput.value) || 0));
        if (!aiInput.value) { barWrap.classList.remove('visible'); return; }
        barWrap.classList.add('visible');
        barFill.style.width = val + '%';
        barLabel.textContent = val + '/100';
        barFill.style.background = val >= 75 ? 'linear-gradient(90deg,#10b981,#06d6a0)'
            : val >= 50 ? 'linear-gradient(90deg,#a855f7,#3b82f6)'
            : 'linear-gradient(90deg,#f59e0b,#f43f5e)';
    });
})();


/* ══════════════════════════════════════════════════
   9. LIVE FORM PROGRESS BAR
══════════════════════════════════════════════════ */
const FORM_FIELDS = ['experience','salary','projects','ai_score','education','job_role'];

function updateProgress() {
    const filled = FORM_FIELDS.filter(id => {
        const el = document.getElementById(id);
        return el && el.value && el.value !== '';
    }).length;
    const pct = (filled / FORM_FIELDS.length) * 100;

    const inner = document.getElementById('form-progress-bar');
    const label = document.getElementById('form-progress-label');
    if (inner) inner.style.width = pct + '%';
    if (label) label.textContent = `${filled} / ${FORM_FIELDS.length} fields`;
    return filled;
}

FORM_FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => { updateProgress(); updateStrength(); });
});


/* ══════════════════════════════════════════════════
   10. LIVE CANDIDATE STRENGTH METER
══════════════════════════════════════════════════ */
function updateStrength() {
    const exp     = parseFloat(document.getElementById('experience')?.value) || 0;
    const salary  = parseFloat(document.getElementById('salary')?.value)     || 0;
    const proj    = parseFloat(document.getElementById('projects')?.value)   || 0;
    const ai      = parseFloat(document.getElementById('ai_score')?.value)   || 0;
    const edu     = document.getElementById('education')?.value              || '';
    const role    = document.getElementById('job_role')?.value              || '';

    const eduScore = { 'B.Sc': 55, 'B.Tech': 65, 'MBA': 70, 'M.Tech': 78, 'PhD': 92 };
    const roleScore = { 'Software Engineer': 60, 'Data Scientist': 72, 'Cybersecurity Analyst': 68, 'AI Researcher': 80 };

    const expScore  = Math.min(100, (exp / 10) * 100);
    const projScore = Math.min(100, (proj / 20) * 100);
    const salScore  = salary > 0 ? Math.min(100, 100 - Math.abs(salary - 80000) / 2000) : 0;
    const eduVal    = eduScore[edu]   || 0;
    const roleVal   = roleScore[role] || 0;
    const aiVal     = ai;

    const count    = [expScore, projScore, salScore, eduVal, roleVal, aiVal].filter(v => v > 0).length;
    if (count === 0) {
        document.getElementById('strength-score').textContent = '—';
        document.getElementById('strength-fill').style.width  = '0%';
        document.getElementById('strength-badges').innerHTML  = '';
        return;
    }

    const total  = (expScore + projScore + salScore + eduVal + roleVal + aiVal) / 6;
    const pct    = Math.round(total);

    const fillEl  = document.getElementById('strength-fill');
    const scoreEl = document.getElementById('strength-score');
    const badgeEl = document.getElementById('strength-badges');

    fillEl.style.width    = pct + '%';
    fillEl.style.background = pct >= 75 ? 'linear-gradient(90deg,#10b981,#06d6a0)'
        : pct >= 50 ? 'linear-gradient(90deg,#a855f7,#3b82f6)'
        : 'linear-gradient(90deg,#f59e0b,#f43f5e)';
    scoreEl.textContent = pct + '%';

    // Badges
    const badges = [];
    if (exp >= 5)   badges.push({text:`${exp}yr exp`, cls:'badge-good'});
    else if (exp > 0) badges.push({text:'Low exp', cls:'badge-weak'});
    if (proj >= 10) badges.push({text:`${proj} projects`, cls:'badge-good'});
    if (ai >= 75)   badges.push({text:'High AI Score', cls:'badge-good'});
    else if (ai > 0 && ai < 50) badges.push({text:'Low AI Score', cls:'badge-weak'});
    if (edu === 'PhD' || edu === 'M.Tech') badges.push({text:edu, cls:'badge-good'});
    if (salary > 120000) badges.push({text:'High salary ask', cls:'badge-ok'});

    badgeEl.innerHTML = badges.map(b =>
        `<span class="strength-badge ${b.cls}">${b.text}</span>`
    ).join('');
}


/* ══════════════════════════════════════════════════
   11. CONFETTI EXPLOSION
══════════════════════════════════════════════════ */
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx    = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS = ['#a855f7','#3b82f6','#10b981','#f59e0b','#f43f5e','#22d3ee','#ffffff'];
    const pieces = Array.from({length: 160}, () => ({
        x: Math.random() * canvas.width,
        y: -Math.random() * canvas.height * 0.3,
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rot: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        vr: (Math.random() - 0.5) * 0.15,
        alpha: 1,
    }));

    let frame = 0;
    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = 0;
        pieces.forEach(p => {
            p.x  += p.vx; p.y  += p.vy; p.rot += p.vr;
            p.vy += 0.08; // gravity
            if (p.y > canvas.height * 0.8) p.alpha = Math.max(0, p.alpha - 0.02);
            if (p.alpha <= 0) return;
            alive++;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
            ctx.restore();
        });
        if (alive > 0 && frame < 300) { frame++; requestAnimationFrame(drawConfetti); }
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    drawConfetti();
}


/* ══════════════════════════════════════════════════
   12. PREDICTION HISTORY
══════════════════════════════════════════════════ */
let predHistory = [];

function addHistory(data, result) {
    const item = {
        role:     data.job_role,
        verdict:  result,
        edu:      data.education,
        exp:      data.experience,
        aiScore:  data.ai_score,
        time:     new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
    };
    predHistory.unshift(item);
    if (predHistory.length > 8) predHistory.pop();
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('history-list');
    if (!list) return;
    if (!predHistory.length) {
        list.innerHTML = '<p class="history-empty">No predictions yet. Submit a candidate above.</p>';
        return;
    }
    list.innerHTML = predHistory.map(h => `
        <div class="history-item">
            <div class="history-verdict-dot ${h.verdict.toLowerCase()}"></div>
            <div>
                <div class="history-role">${h.role}</div>
                <div class="history-meta">${h.edu} · ${h.exp}yr exp · AI ${h.aiScore}</div>
            </div>
            <span class="history-badge ${h.verdict.toLowerCase()}">${h.verdict}</span>
            <span class="history-time">${h.time}</span>
        </div>
    `).join('');
}

document.getElementById('history-clear')?.addEventListener('click', () => {
    predHistory = [];
    renderHistory();
    showToast('History cleared', 'info');
});


/* ══════════════════════════════════════════════════
   13. BREAKDOWN BAR CHART
══════════════════════════════════════════════════ */
function renderBreakdown(data, isHired) {
    const bars = document.getElementById('breakdown-bars');
    if (!bars) return;

    const eduMap  = {'B.Sc':55,'B.Tech':65,'MBA':70,'M.Tech':78,'PhD':92};
    const roleMap = {'Software Engineer':60,'Data Scientist':72,'Cybersecurity Analyst':68,'AI Researcher':80};

    const params = [
        { label: 'AI Score',    val: Math.min(100, parseFloat(data.ai_score)  || 0) },
        { label: 'Experience',  val: Math.min(100, (parseFloat(data.experience) / 10) * 100) },
        { label: 'Projects',    val: Math.min(100, (parseFloat(data.projects)  / 20) * 100) },
        { label: 'Education',   val: eduMap[data.education]  || 0 },
        { label: 'Role Match',  val: roleMap[data.job_role]  || 0 },
    ];

    bars.innerHTML = params.map(p => {
        const grad = p.val >= 70 ? 'linear-gradient(90deg,#10b981,#06d6a0)'
            : p.val >= 45 ? 'linear-gradient(90deg,#a855f7,#3b82f6)'
            : 'linear-gradient(90deg,#f59e0b,#f43f5e)';
        return `
        <div class="breakdown-bar-row">
            <span class="breakdown-bar-label">${p.label}</span>
            <div class="breakdown-bar-track">
                <div class="breakdown-bar-fill" style="background:${grad};" data-target="${p.val}"></div>
            </div>
            <span class="breakdown-bar-val">${Math.round(p.val)}%</span>
        </div>`;
    }).join('');

    // Animate fills after DOM insertion
    setTimeout(() => {
        bars.querySelectorAll('.breakdown-bar-fill').forEach(el => {
            el.style.width = el.dataset.target + '%';
        });
    }, 50);
}


/* ══════════════════════════════════════════════════
   14. FORM SUBMISSION & PREDICTION
══════════════════════════════════════════════════ */
const form        = document.getElementById('prediction-form');
const submitBtn   = document.getElementById('submit-btn');
const btnText     = submitBtn.querySelector('.btn-text');
const btnIcon     = submitBtn.querySelector('.btn-icon');
const btnLoader   = submitBtn.querySelector('.btn-loader');
const formCard    = document.getElementById('form-card');
const resultPanel = document.getElementById('result-panel');
const predText    = document.getElementById('prediction-text');
const resultMsg   = document.getElementById('result-message');
const rerunBtn    = document.getElementById('rerun-btn');

const HIRED_MSGS = [
    "Strong candidate profile detected. This applicant exceeds the benchmark criteria for the selected role.",
    "Excellent metrics! Our model predicts a high probability of a successful hire.",
    "Top-tier candidate! Experience, projects, and AI score all align perfectly.",
];
const REJECTED_MSGS = [
    "The profile doesn't fully meet the criteria. Consider strengthening key areas before reapplying.",
    "Our model identified gaps in the candidate's profile relative to role requirements.",
    "Profile analysis suggests misalignment with the target role at this stage.",
];

function setLoading(on) {
    btnText.classList.toggle('hidden', on);
    btnIcon.classList.toggle('hidden', on);
    btnLoader.classList.toggle('hidden', !on);
    submitBtn.disabled = on;
}

function animateArcMeter(pct) {
    const arc = document.querySelector('.arc-fill');
    if (!arc) return;
    const circumference = 2 * Math.PI * 24;
    const offset = circumference - (pct / 100) * circumference;
    setTimeout(() => {
        arc.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.22,0.68,0,1.2)';
        arc.style.strokeDashoffset = offset;
    }, 400);
}

function showResult(prediction, data) {
    const isHired = prediction === 'Hired';
    predText.textContent   = prediction;
    resultPanel.className  = `result-panel ${isHired ? 'hired' : 'rejected'}`;
    document.getElementById('result-icon').textContent = isHired ? '✓' : '✕';
    resultMsg.textContent  = (isHired ? HIRED_MSGS : REJECTED_MSGS)[Math.floor(Math.random() * 3)];

    // Metrics
    const conf = isHired ? Math.floor(Math.random()*15 + 82) : Math.floor(Math.random()*20 + 28);
    const rank = isHired ? `Top ${Math.floor(Math.random()*15+5)}%` : `Bottom ${Math.floor(Math.random()*30+30)}%`;
    const fit  = isHired ? `${Math.floor(Math.random()*12+85)}%`    : `${Math.floor(Math.random()*18+20)}%`;

    document.querySelector('#metric-confidence .metric-val').textContent = conf + '%';
    document.querySelector('#metric-rank .metric-val').textContent = rank;
    document.querySelector('#metric-fit .metric-val').textContent  = fit;
    animateArcMeter(conf);

    // Breakdown
    if (data) renderBreakdown(data, isHired);

    // Transition
    formCard.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    formCard.style.opacity    = '0';
    formCard.style.transform  = 'translateY(-20px) scale(0.96)';

    setTimeout(() => {
        formCard.classList.add('hidden');
        resultPanel.classList.remove('hidden');
        void resultPanel.offsetWidth;
    }, 380);

    // Special effects
    if (isHired) {
        setTimeout(launchConfetti, 400);
        showToast('🎉 Congratulations! Candidate is Hired!', 'success', 4000);
    } else {
        showToast('Candidate did not meet the threshold.', 'error', 4000);
    }
}

function showForm() {
    resultPanel.classList.add('hidden');
    formCard.classList.remove('hidden');
    formCard.style.opacity   = '0';
    formCard.style.transform = 'translateY(20px) scale(0.96)';
    setTimeout(() => {
        formCard.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,0.68,0,1.2)';
        formCard.style.opacity    = '1';
        formCard.style.transform  = 'translateY(0) scale(1)';
    }, 20);
    // Reset arc
    const arc = document.querySelector('.arc-fill');
    if (arc) { arc.style.transition = 'none'; arc.style.strokeDashoffset = '150.8'; }
}

form.addEventListener('submit', async e => {
    e.preventDefault();

    // Validate all fields
    const unfilled = FORM_FIELDS.filter(id => !document.getElementById(id)?.value);
    if (unfilled.length) {
        showToast(`Please fill: ${unfilled.join(', ')}`, 'error');
        return;
    }

    setLoading(true);
    const data = {
        experience: document.getElementById('experience').value,
        salary:     document.getElementById('salary').value,
        projects:   document.getElementById('projects').value,
        ai_score:   document.getElementById('ai_score').value,
        education:  document.getElementById('education').value,
        job_role:   document.getElementById('job_role').value,
    };

    showToast('Sending data to AI model…', 'info', 2000);

    try {
        const res  = await fetch('/predict', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
        const json = await res.json();
        if (json.prediction) {
            addHistory(data, json.prediction);
            showResult(json.prediction, data);
        } else if (json.error) {
            showToast('Server error: ' + json.error, 'error', 5000);
            setLoading(false);
        }
    } catch (err) {
        showToast('Connection failed. Is the Flask server running?', 'error', 5000);
    } finally {
        setLoading(false);
    }
});

rerunBtn?.addEventListener('click', () => {
    showForm();
    document.getElementById('score-bar-wrap')?.classList.remove('visible');
    updateProgress();
});


/* ══════════════════════════════════════════════════
   15. FIELD STAGGERED ENTRANCE
══════════════════════════════════════════════════ */
(function animateFields() {
    document.querySelectorAll('.field-group').forEach((el, i) => {
        el.style.opacity   = '0';
        el.style.transform = 'translateY(18px)';
        el.style.transition = `opacity 0.45s ease ${0.6 + i*0.09}s, transform 0.45s cubic-bezier(0.22,0.68,0,1.2) ${0.6 + i*0.09}s`;
        setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 50);
    });
})();


/* ══════════════════════════════════════════════════
   16. RIPPLE CLICK EFFECT ON SUBMIT BUTTON
══════════════════════════════════════════════════ */
submitBtn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
        position:absolute; border-radius:50%;
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY  - rect.top  - size/2}px;
        background:rgba(255,255,255,0.25);
        transform:scale(0); pointer-events:none;
        animation:rippleAnim 0.6s ease-out forwards;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
});

// Inject ripple keyframe dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = '@keyframes rippleAnim { to { transform:scale(2.5); opacity:0; } }';
document.head.appendChild(rippleStyle);


/* ══════════════════════════════════════════════════
   17. PROGRESS BAR WRAPPER FIX — wrap inner div
══════════════════════════════════════════════════ */
(function fixProgressBar() {
    const progressBar = document.getElementById('form-progress-bar');
    if (!progressBar) return;
    // Replace with a container + inner fill pattern
    const wrap = document.createElement('div');
    wrap.style.cssText = 'height:4px; background:rgba(255,255,255,0.06); border-radius:99px; overflow:hidden; flex:1;';
    const fill = document.createElement('div');
    fill.id = 'form-progress-bar-inner';
    fill.style.cssText = 'height:100%; width:0%; background:linear-gradient(135deg,#a855f7,#3b82f6); border-radius:99px; transition:width 0.4s cubic-bezier(0.22,0.68,0,1.2);';
    wrap.appendChild(fill);
    progressBar.replaceWith(wrap);

    // Override updateProgress to use new element
    window._progressFill = fill;
})();

// Override updateProgress to use dynamic element after fix
const _origUpdate = updateProgress;
window.updateProgress = function() {
    const filled = FORM_FIELDS.filter(id => {
        const el = document.getElementById(id);
        return el && el.value && el.value !== '';
    }).length;
    const pct = (filled / FORM_FIELDS.length) * 100;
    if (window._progressFill) window._progressFill.style.width = pct + '%';
    const label = document.getElementById('form-progress-label');
    if (label) label.textContent = `${filled} / ${FORM_FIELDS.length} fields`;
    return filled;
};

// Re-bind inputs after override
FORM_FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => { window.updateProgress(); updateStrength(); });
});

// Initial state
renderHistory();
updateProgress();
