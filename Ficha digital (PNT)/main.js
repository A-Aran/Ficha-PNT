function buildUI() {
  const SEC_CONFIG = [
    { id: 'personagem', icon: '◈', title: 'Re-Timed' },
    { id: 'pericias', icon: '◉', title: 'Perícias', extraBtn: '<button class="sk-info-btn" id="sk-info-toggle" onclick="event.stopPropagation(); togSkInfo()" title="Regras de desenvolvimento">ⓘ</button>' },
    { id: 'modificadores', icon: '⊞', title: 'Modificadores' },
    { id: 'anotacoes', icon: '✎', title: 'Anotações' },
    { id: 'tracos', icon: '◇', title: 'Traços' },
    { id: 'inventario', icon: '⊡', title: 'Inventário' },
    { id: 'equipamentos', icon: '⚙', title: 'Equipamentos Especiais' },
    { id: 'espiritos', icon: '✦', title: 'Espíritos' },
    { id: 'historico', icon: '▤', title: 'Histórico' }
  ];

  const snav = document.getElementById('snav');
  const tabbar = document.getElementById('tabbar-inner');
  if (snav) snav.innerHTML = SEC_CONFIG.map((s, i) => <a href="#+s.id+" class="+(i===0?'act':'')+"><span class="nic">+s.icon+</span><span>+s.title+</span></a>).join('');
  if (tabbar) tabbar.innerHTML = SEC_CONFIG.map((s, i) => <a href="#+s.id+" class="+(i===0?'act':'')+"><span class="tbi">+s.icon+</span><span>+(s.id==='personagem'?'Personagem':(s.id==='equipamentos'?'Equip.':s.title))+</span></a>).join('');

  SEC_CONFIG.forEach((cfg, i) => {
    const bd = document.getElementById('bd-'+cfg.id);
    if(bd) {
      const sec = document.createElement('section');
      sec.id = cfg.id;
      const nStr = (i+1).toString().padStart(2, '0');
      const hd = document.createElement('div');
      hd.className = 'sec-hd';
      hd.onclick = () => togSec(cfg.id);
      hd.innerHTML = '<div class="sec-hd-l"><div class="sec-bar"></div><span class="sec-title">'+cfg.title+'</span><span class="sec-num">'+nStr+'</span>'+(cfg.extraBtn||'')+'</div><span class="sec-arr">▼</span>';
      sec.appendChild(hd);
      bd.parentNode.insertBefore(sec, bd);
      sec.appendChild(bd);
    }
  });

  const vhud = document.getElementById('vhud-container');
  if (vhud) {
    const vitals = [ { id: 'pv', class: 'pv', label: 'PV' }, { id: 'ps', class: 'ps', label: 'PS' }, { id: 'pe', class: 'pe', label: 'PE' } ];
    vhud.innerHTML = vitals.map(v => <div class="hrow"><span class="hlbl">+v.label+</span><div class="hctrl"><button id="ui-+v.id+-sub5" class="hbtn" onclick="modV('+v.label+',-5)">-5</button><button id="ui-+v.id+-sub1" class="hbtn" onclick="modV('+v.label+',-1)">-1</button><div class="htrack"><div class="hfill +v.class+" id="ui-+v.id+-bar"></div></div><div class="hnums"><input type="number" class="hin" id="ui-+v.id+-cur" onchange="setV('+v.label+',this.value)"><span class="hmax">/ <span id="ui-+v.id+-max">0</span></span></div><button id="ui-+v.id+-add1" class="hbtn" onclick="modV('+v.label+',1)">+1</button><button id="ui-+v.id+-add5" class="hbtn" onclick="modV('+v.label+',5)">+5</button></div></div>).join('');
  }
}
    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       STARFIELD
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    (function () {
      const c = document.getElementById('starfield'), ctx = c.getContext('2d');
      let W, H, stars = [];
      function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight }
      function mkStars() {
        stars = []; const n = Math.floor(W * H / 1800);
        for (let i = 0; i < n; i++) {
          const sz = Math.random(), r = sz < .7 ? .4 : sz < .9 ? .8 : 1.3, a = .15 + Math.random() * .7;
          stars.push({ x: Math.random() * W, y: Math.random() * H, r, alpha: a, baseAlpha: a, ts: .003 + Math.random() * .012, tp: Math.random() * Math.PI * 2, hue: Math.random() < .12 ? (Math.random() < .5 ? 195 : 220) : null });
        }
      }
      let frame = 0;
      function draw() {
        ctx.clearRect(0, 0, W, H); frame++;
        for (const s of stars) {
          const tw = Math.sin(frame * s.ts + s.tp), a = Math.max(.05, s.baseAlpha + tw * .2);
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = s.hue !== null ? `hsla(${s.hue},80%,90%,${a})` : `rgba(200,215,240,${a})`;
          ctx.fill();
        }
        requestAnimationFrame(draw);
      }
      window.addEventListener('resize', () => { resize(); mkStars(); });
      resize(); mkStars(); draw();
    })();

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       DATA
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    const DEF_SK = {
      FÃ­sicas: { agilidade: 0, bloquear: 0, escalar: 0, esquivar: 0, furtividade: 0, luta: 0, nataÃ§Ã£o: 0, pontaria: 0, prestidigitaÃ§Ã£o: 0, reflexos: 0 },
      PrÃ¡ticas: { aph: 0, arte: 0, mecÃ¢nica: 0, medicina: 0, psicanÃ¡lise: 0, psicologia: 0 },
      Sociais: { atuaÃ§Ã£o: 0, barganha: 0, intimidaÃ§Ã£o: 0, lÃ¡bia: 0, persuasÃ£o: 0 },
      ConduÃ§Ã£o: { dirigir: 0, navegar: 0, pilotar: 0 },
      Conhecimento: { antropologia: 0, arcano: 0, arqueologia: 0, ciÃªncias: 0, coliso: 0, contabilidade: 0, criptografia: 0, farmÃ¡cia: 0, histÃ³ria: 0, linguagem: 0 },
      Investigativas: { biblioteca: 0, encontrar: 0, ouvir: 0, rastrear: 0, falsificar: 0 },
      EspecÃ­ficas: { sanidade: 0, vontade: 0, sorte: 0, sobrenatural: 0, fortitude: 0 }
    };

    /* Labels extras para perÃ­cias especÃ­ficas */
    const SK_LABELS = {
      'aph': 'Primeiros Socorros',
      'coliso': 'Mitologia Coliso'
    };
    const PALS = [
      { p: '#00e5c8', s: '#005544' }, { p: '#ff4757', s: '#7f1d1d' }, { p: '#FF9F1C', s: '#7c3a08' },
      { p: '#FFD700', s: '#7a6200' }, { p: '#CCFF00', s: '#4c6200' }, { p: '#2ECC71', s: '#0f4d2b' },
      { p: '#3ABEFF', s: '#0e4f70' }, { p: '#3A86FF', s: '#0e2e6e' }, { p: '#7B61FF', s: '#2c1f7a' },
      { p: '#AF52DE', s: '#4a1466' }, { p: '#F012BE', s: '#5e0052' }, { p: '#FF4E9E', s: '#6b0033' },
      { p: '#CD7F32', s: '#5a3310' }, { p: '#EAEAEA', s: '#555' }, { p: '#00FFFF', s: '#006666' },
      { p: '#787880', s: '#303035' }
    ];
    const DEF_ST = {
      name: '', age: '', nationality: '', profession: '', year: '', appearance: '', phobias: '', photo: '', corruption: 0,
      skills: JSON.parse(JSON.stringify(DEF_SK)), skillProgress: {}, vital: { pv: 0, ps: 0, pe: 0 },
      traits: [], inventory: [], equipments: [], spirits: [],
      history: '', notes: '', collapsed: {}, paletteIndex: 0
    };
    /* Default item shapes */
    function newTrait() { return { name: 'Novo TraÃ§o', desc: '', expanded: false } }
    function newInvItem(cat) { return { name: 'Novo Item', category: cat || 'Mochila', qty: 1, desc: '', damage: '', defeito: '', alcance: '', usoPorRodada: '', expanded: false } }
    function newEquip() { return { name: 'Novo Equipamento', element: '', desc: '', descOpen: true, damage: '', dmgOpen: false, defeito: '', alcance: '', usoPorRodada: '', abilities: [], expanded: false } }
    function newSpirit() { return { name: 'Novo EspÃ­rito', element: '', desc: '', descOpen: true, groups: [], expanded: false } }
    function newAbility() { return { name: 'Nova Habilidade', desc: '', open: false } }
    function newGroup() { return { name: 'Grupo', abilities: [newAbility()], open: false } }

    let S = null, invFilters = new Set(['Todos']), palOpen = false;
    const TT = document.getElementById('tt');
    const DEFAULT_SEC_ORDER = ['personagem', 'pericias', 'modificadores', 'anotacoes', 'tracos', 'inventario', 'equipamentos', 'espiritos', 'historico'];
    const SECS = DEFAULT_SEC_ORDER.slice();
    const ICATS = ['Mochila', 'Equipamentos', 'ConsumÃ­veis', 'Utilidades'];

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       INIT
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    buildUI();
    function init() {
      buildUI();
      const raw = localStorage.getItem('rpt_v5')
        || localStorage.getItem('rpt_v4')
        || localStorage.getItem('rpg_sheet_v3')
        || localStorage.getItem('rpg_sheet_data_v2');
      if (raw) {
        try {
          S = JSON.parse(raw);
          for (const c in DEF_SK) {
            if (!S.skills[c]) S.skills[c] = {};
            for (const k in DEF_SK[c]) if (S.skills[c][k] === undefined) S.skills[c][k] = DEF_SK[c][k];
          }
          if (!S.collapsed) S.collapsed = {};
          if (S.paletteIndex === undefined) S.paletteIndex = 0;
          if (typeof S.corruption !== 'number') S.corruption = 0;
          if (!S.equipments) S.equipments = [];
          if (!S.spirits) S.spirits = [];
          // Migrate old equipments/spirits that lack new fields
          S.equipments.forEach(e => { if (e.element === undefined) e.element = ''; if (!e.abilities) e.abilities = []; if (e.descOpen === undefined) e.descOpen = true; if (e.defeito === undefined) e.defeito = ''; if (e.alcance === undefined) e.alcance = ''; if (e.usoPorRodada === undefined) e.usoPorRodada = ''; });
          S.spirits.forEach(sp => { if (sp.element === undefined) sp.element = ''; if (!sp.groups) sp.groups = []; if (sp.descOpen === undefined) sp.descOpen = true; });
          if (!S.skillProgress) S.skillProgress = {};
          for (const c in DEF_SK) {
            if (!S.skillProgress[c]) S.skillProgress[c] = {};
            for (const k in DEF_SK[c]) {
              if (S.skillProgress[c][k] === undefined) S.skillProgress[c][k] = 0;
            }
          }
        } catch { S = JSON.parse(JSON.stringify(DEF_ST)); }
      } else {
        S = JSON.parse(JSON.stringify(DEF_ST));
      }
      renderPal(); applyPal(S.paletteIndex, false);
      bindInputs(); renderCorr(); renderSkills(); calcAll();
      renderDyn('traits'); renderInv(); renderEquipments(); renderSpirits(); renderMod();
      SECS.forEach(applyColl);
      applySavedSectionOrder();
      scrollSpy();
      initSidebarDrag();
      drawRadar();
      // Bind autoResize to main textareas
      ['ui-history', 'ui-notes', 'ui-appearance', 'ui-phobias'].forEach(id => {
        const el = document.getElementById(id);
        if (el) bindAutoResize(el);
      });
      document.addEventListener('click', e => {
        if (!e.target.closest('.srow') && !e.target.closest('.sbase') && !e.target.closest('#tt')) hideTT();
        const fab = document.getElementById('fab');
        if (fab.classList.contains('open') && !fab.contains(e.target)) fab.classList.remove('open');
      });
    }

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       SAVE / LOAD
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    function saveData() {
      ['name', 'age', 'nationality', 'profession', 'year', 'appearance', 'phobias', 'history', 'notes'].forEach(k => {
        const el = document.getElementById('ui-' + k); if (el) S[k] = el.value;
      });
      localStorage.setItem('rpt_v5', JSON.stringify(S));
    }
    function bindInputs() {
      ['name', 'age', 'nationality', 'profession', 'year', 'appearance', 'phobias', 'history', 'notes'].forEach(k => {
        const el = document.getElementById('ui-' + k); if (el && S[k]) el.value = S[k];
      });
      if (S.photo) document.getElementById('ui-photo').src = S.photo;
    }
    function trigLoad() { const i = document.getElementById('file-load'); i.value = ''; i.click(); }
    function loadFile(e) {
      const f = e.target.files && e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = ev => {
        let t = ev.target.result;
        if (t.charCodeAt(0) === 0xFEFF) t = t.slice(1);
        try {
          const d = JSON.parse(t);
          if (d && typeof d === 'object' && !Array.isArray(d)) { localStorage.setItem('rpt_v5', JSON.stringify(d)); setTimeout(() => location.reload(), 80); }
          else alert('Arquivo invÃ¡lido.');
        } catch (err) { alert('Erro ao ler JSON:\n' + err.message); }
      };
      r.onerror = () => alert('Erro ao ler arquivo.');
      r.readAsText(f, 'utf-8');
    }
    function saveFile() {
      const b = new Blob([JSON.stringify(S)], { type: 'application/json' });
      const u = URL.createObjectURL(b), a = document.createElement('a');
      a.href = u; a.download = 'ficha_retimed.json'; document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(u); a.remove(); }, 300);
      document.getElementById('fab').classList.remove('open');
    }

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       AUTO-RESIZE TEXTAREAS
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    function autoResize(el) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
    function bindAutoResize(el) {
      autoResize(el);
      el.addEventListener('input', () => autoResize(el));
    }

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       FAB / PALETTE
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    function togFab() { document.getElementById('fab').classList.toggle('open'); }
    function togSkInfo() {
      const panel = document.getElementById('sk-info-panel');
      const btn   = document.getElementById('sk-info-toggle');
      if (!panel || !btn) return;
      const open = panel.classList.toggle('open');
      btn.classList.toggle('active', open);
    }
    function h2rgb(h) { const c = h.replace('#', ''); return `${parseInt(c.slice(0, 2), 16)},${parseInt(c.slice(2, 4), 16)},${parseInt(c.slice(4, 6), 16)}`; }
    function renderPal() {
      const g = document.getElementById('ui-pal'); g.innerHTML = '';
      PALS.forEach((pal, i) => {
        const d = document.createElement('div');
        d.className = 'cdot' + (i === S.paletteIndex ? ' on' : '');
        d.style.backgroundColor = pal.p; d.dataset.i = i;
        d.onclick = () => applyPal(i); g.appendChild(d);
      });
    }
    function applyPal(i, save = true) {
      const r = document.documentElement, pal = PALS[i], rgb = h2rgb(pal.p);
      r.style.setProperty('--acc', pal.p);
      r.style.setProperty('--acc-dim', `rgba(${rgb},.13)`);
      r.style.setProperty('--acc-glow', `rgba(${rgb},.22)`);
      r.style.setProperty('--border', `rgba(${rgb},.2)`);
      r.style.setProperty('--border2', `rgba(${rgb},.08)`);
      document.querySelectorAll('.cdot').forEach(d => d.classList.toggle('on', +d.dataset.i === i));
      if (save) { S.paletteIndex = i; saveData(); }
    }
    function togPal(e) {
      e.stopPropagation(); palOpen = !palOpen;
      document.getElementById('ui-pal').classList.toggle('open', palOpen);
      document.getElementById('palchev').style.transform = palOpen ? 'rotate(180deg)' : '';
    }

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       VITALS
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    function calcAll() {
      let total = 0;
      for (const cat in S.skills) {
        const vs = Object.values(S.skills[cat]), sum = vs.reduce((a, v) => a + v, 0);
        total += sum;
        const base = Math.floor(Math.floor(sum / vs.length) / 5) * 5;
        const el = document.getElementById('base-' + cat);
        if (el) { el.innerText = 'Base: ' + base; el.dataset.val = base; }
      }
      document.getElementById('ui-total-pts').innerText = total;
      const mp = document.getElementById('mhdr-pts'); if (mp) mp.textContent = total + ' pts';
      const sp = S.skills['EspecÃ­ficas'];
      const mPV = sp.fortitude || 0, mPS = Math.floor(((sp.sanidade || 0) + (sp.vontade || 0)) / 2), mPE = (sp.sobrenatural || 0) * 2;
      if (S.vital.pv > mPV) S.vital.pv = mPV;
      if (S.vital.ps > mPS) S.vital.ps = mPS;
      if (S.vital.pe > mPE) S.vital.pe = mPE;
      updH('PV', S.vital.pv, mPV); updH('PS', S.vital.ps, mPS); updH('PE', S.vital.pe, mPE);
      renderMod();
      drawRadar();
    }
    function getMax(t) {
      const sp = S.skills['EspecÃ­ficas'];
      if (t === 'PV') return sp.fortitude || 0;
      if (t === 'PS') return Math.floor(((sp.sanidade || 0) + (sp.vontade || 0)) / 2);
      if (t === 'PE') return (sp.sobrenatural || 0) * 2; return 0;
    }
    function modV(t, a) {
      const mx = getMax(t), k = t.toLowerCase();
      S.vital[k] = Math.max(0, Math.min(mx, S.vital[k] + a));
      updH(t, S.vital[k], mx); saveData();
    }
    function setV(t, v) {
      const mx = getMax(t), k = t.toLowerCase();
      S.vital[k] = Math.max(0, Math.min(mx, parseInt(v) || 0));
      updH(t, S.vital[k], mx); saveData();
    }
    function updH(t, cur, max) {
      const k = t.toLowerCase();
      const inp = document.getElementById('ui-' + k + '-cur');
      const maxEl = document.getElementById('ui-' + k + '-max');
      const bar = document.getElementById('ui-' + k + '-bar');
      const sub5 = document.getElementById('ui-' + k + '-sub5');
      const sub1 = document.getElementById('ui-' + k + '-sub1');
      const add1 = document.getElementById('ui-' + k + '-add1');
      const add5 = document.getElementById('ui-' + k + '-add5');
      if (!inp || !maxEl || !bar) return;
      inp.value = cur; maxEl.innerText = max;
      bar.style.width = max > 0 ? (cur / max * 100) + '%' : '0%';
      if (sub5) sub5.disabled = (cur <= 0);
      if (sub1) sub1.disabled = (cur <= 0);
      if (add1) add1.disabled = (max > 0 && cur >= max);
      if (add5) add5.disabled = (max > 0 && cur >= max);
    }

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       MODIFICADORES
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    function renderMod() {
      const cont = document.getElementById('ui-mod-list');
      if (!cont) return;
      cont.innerHTML = '';

      const sp = S.skills['EspecÃ­ficas'] || {};
      const pr = S.skills['PrÃ¡ticas'] || {};
      const medVal = pr['medicina'] || 0;
      const fortVal = sp['fortitude'] || 0;
      const sanVal = sp['sanidade'] || 0;
      const volVal = sp['vontade'] || 0;
      const sobrVal = sp['sobrenatural'] || 0;

      /* â”€â”€ Helper: make a mod card â”€â”€ */
      function mkModCard(cfg) {
        const box = document.createElement('div'); box.className = 'mod-item';

        // Title row
        const titleRow = document.createElement('div'); titleRow.style.cssText = 'display:flex;align-items:baseline;gap:8px;margin-bottom:6px';
        const title = document.createElement('span'); title.className = 'mod-title'; title.textContent = cfg.title;
        titleRow.appendChild(title);
        if (cfg.subtitle) {
          const sub = document.createElement('span');
          // subtitle in white
          sub.style.cssText = 'font-family:var(--mono);font-size:.65rem;color:#fff;letter-spacing:.06em;opacity:.85';
          sub.textContent = cfg.subtitle;
          titleRow.appendChild(sub);
        }
        box.appendChild(titleRow);

        // Optional editable field (long rest hours)
        if (cfg.editField) {
          const ef = cfg.editField;
          const row = document.createElement('div'); row.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:8px';
          const lbl = document.createElement('span');
          // "Horas:" in accent color
          lbl.style.cssText = 'font-family:var(--mono);font-size:.68rem;color:var(--acc);letter-spacing:.08em;text-transform:uppercase;flex-shrink:0';
          lbl.textContent = ef.label;
          const inp = document.createElement('input'); inp.type = 'number'; inp.className = 'ibar-dmg-inp';
          inp.style.cssText = 'width:52px;flex-shrink:0';
          inp.value = ef.getValue(); inp.placeholder = '?';
          inp.addEventListener('click', e => e.stopPropagation());
          inp.addEventListener('change', e => { ef.setValue(parseInt(e.target.value) || 0); renderMod(); });
          row.appendChild(lbl); row.appendChild(inp);
          box.appendChild(row);
        }

        // Stat rows
        cfg.rows.forEach(r => {
          const row = document.createElement('div'); row.className = 'mod-row'; row.style.marginBottom = '4px';
          const lbl = document.createElement('span');
          // stat label always in accent color
          lbl.style.cssText = 'font-family:var(--mono);font-size:.72rem;color:var(--acc);font-weight:700;min-width:40px;flex-shrink:0;letter-spacing:.04em';
          lbl.textContent = r.stat;
          row.appendChild(lbl);

          // Formula text
          const fmla = document.createElement('span');
          fmla.style.cssText = 'font-family:var(--mono);font-size:.62rem;color:var(--muted);flex-grow:1;letter-spacing:0';
          fmla.textContent = r.formula;
          row.appendChild(fmla);

          // Computed value box
          const val = document.createElement('span'); val.className = 'mod-val'; val.textContent = r.val;
          row.appendChild(val);
          box.appendChild(row);
        });

        // Tooltip ONLY on hover (mouseenter) and hold (pointerdown) â€” NOT on click
        if (cfg.tooltipVal !== undefined) {
          const tv = cfg.tooltipVal;
          // Hover to show
          box.addEventListener('mouseenter', e => { showTT(tv, { currentTarget: box }); });
          box.addEventListener('mouseleave', hideTT);
          // Hold on mobile (pointerdown)
          let ht = null;
          box.addEventListener('pointerdown', e => { ht = setTimeout(() => showTT(tv, { currentTarget: box }), 400); });
          box.addEventListener('pointerup', () => clearTimeout(ht));
          box.addEventListener('pointercancel', () => clearTimeout(ht));
        }

        cont.appendChild(box);
      }

      /* Long rest variable stored in S */
      if (S.longRestHours === undefined) S.longRestHours = 12;
      const lh = S.longRestHours || 12;

      /* â”€â”€ Teste de Medicina â”€â”€ */
      mkModCard({
        title: 'Teste de Medicina',
        tooltipVal: medVal,
        rows: [
          { stat: 'Normal', formula: 'Ã· 10', val: Math.floor(medVal / 10) },
          { stat: 'Bom', formula: 'Ã· 5', val: Math.floor(medVal / 5) },
          { stat: 'Extremo', formula: 'valor direto', val: medVal },
        ]
      });

      /* â”€â”€ Descanso Curto â”€â”€ */
      mkModCard({
        title: 'Descanso Curto',
        subtitle: '2 a 6 horas',
        rows: [
          { stat: 'PV', formula: '1d4 + FortÃ·15', val: '1d4 + ' + Math.floor(fortVal / 15) },
          { stat: 'PS', formula: '1d4 + (San+Vol)Ã·30', val: '1d4 + ' + Math.floor((sanVal + volVal) / 30) },
          { stat: 'PE', formula: '1d6 + SobrÃ·20', val: '1d6 + ' + Math.floor(sobrVal / 20) },
        ]
      });

      /* â”€â”€ Descanso Normal â”€â”€ */
      mkModCard({
        title: 'Descanso Normal',
        subtitle: '7 a 11 horas',
        rows: [
          { stat: 'PV', formula: '2d6 + FortÃ·15', val: '2d6 + ' + Math.floor(fortVal / 15) },
          { stat: 'PS', formula: '2d6 + (San+Vol)Ã·30', val: '2d6 + ' + Math.floor((sanVal + volVal) / 30) },
          { stat: 'PE', formula: '2d8 + SobrÃ·15', val: '2d8 + ' + Math.floor(sobrVal / 15) },
        ]
      });

      /* â”€â”€ Descanso Longo â”€â”€ */
      mkModCard({
        title: 'Descanso Longo',
        subtitle: '12 a ? horas',
        editField: {
          label: 'Horas:',
          getValue: () => S.longRestHours || 12,
          setValue: v => { S.longRestHours = v; saveData(); }
        },
        rows: [
          {
            stat: 'PV', formula: '3d8 + FortÃ·15 + (hÃ—2)',
            val: '3d8 + ' + (Math.floor(fortVal / 15) + (lh * 2))
          },
          {
            stat: 'PS', formula: '3d8 + (S+V)Ã·30 + (hÃ—2)',
            val: '3d8 + ' + (Math.floor((sanVal + volVal) / 30) + (lh * 2))
          },
          {
            stat: 'PE', formula: '3d10 + SobrÃ·15',
            val: '3d10 + ' + Math.floor(sobrVal / 15)
          },
        ]
      });
    }

    /* â•â•â•â•â•â•â•â• SKILLS â•â•â•â•â•â•â•â• */
    function getBolinhasMax(nivel) {
      if (nivel < 100) return 3;
      if (nivel >= 100 && nivel <= 124) return 5;
      if (nivel >= 125 && nivel <= 139) return 3;
      if (nivel >= 140 && nivel <= 149) return 5;
      return 0; // NÃ­vel MÃ¡ximo
    }

    function clickBolPer(cat, sk, idx) {
      const nivel = S.skills[cat][sk];
      const max = getBolinhasMax(nivel);
      if (max === 0) return;

      let atual = S.skillProgress[cat][sk];

      if (idx === atual - 1) {
        // Permite desmarcar a Ãºltima bolinha preenchida
        S.skillProgress[cat][sk]--;
      } else if (idx === atual) {
        // Permite marcar apenas a prÃ³xima da sequÃªncia
        let novoTotal = atual + 1;
        if (novoTotal === max) {
          if (window.confirm(`VocÃª atingiu os sucessos extremos em ${sk.toUpperCase()}!\nDeseja evoluir a perÃ­cia para o nÃ­vel ${Math.min(nivel + 5, 150)}?`)) {
            chgSk(cat, sk, Math.min(nivel + 5, 150));
            S.skillProgress[cat][sk] = 0; // Zera ao upar
          }
        } else {
          S.skillProgress[cat][sk] = novoTotal;
        }
      }
      saveData();
      renderSkills();
    }

    function chgSk(cat, sk, v) {
      let n = Math.max(0, Math.floor((parseInt(v) || 0) / 5) * 5);
      S.skills[cat][sk] = n;
      const inp = document.getElementById('sk-' + cat + '-' + sk);
      if (inp) inp.value = n;
      if (TT.classList.contains('show') && TT.dataset.aid === 'row-' + cat + '-' + sk) showTT(n, null, true);
      calcAll(); saveData();
    }
        function renderSkills() {
      const cont = document.getElementById('ui-skills-container');
      if (!cont) return;
      const cols = [['Físicas', 'Condução'], ['Práticas', 'Sociais'], ['Conhecimento'], ['Investigativas', 'Específicas']];
      let html = '';
      cols.forEach(catList => {
        html += '<div style="display:flex; flex-direction:column; gap:12px;">';
        catList.forEach(cat => {
          html += '<div class="scat"><div class="scath"><span>'+cat.toUpperCase()+'</span><span class="sbase" id="base-'+cat+'" data-val="0" onmouseenter="showTT(this.dataset.val, event)" onmouseleave="hideTT()" onclick="showTT(this.dataset.val, event)">Base: 0</span></div><div>';
          let keys = Object.keys(S.skills[cat] || {});
          keys.sort().forEach(sk => {
            const v = S.skills[cat][sk];
            const pts = (S.skillProgress[cat] && S.skillProgress[cat][sk]) ? S.skillProgress[cat][sk] : 0;
            const maxBol = getBolinhasMax(v);
            const sub = SK_LABELS[sk] ? '<span style="font-size:.7rem;color:var(--muted);font-weight:400;margin-left:5px;font-family:var(--mono);letter-spacing:0;text-transform:none;">'+SK_LABELS[sk]+'</span>' : '';
            let bolHtml = '<div class="sk-bol-wrap">';
            if (maxBol > 0) {
              for (let i = 0; i < maxBol; i++) bolHtml += '<div class="sk-bol '+(i < pts ? 'on' : '')+'" onclick="event.stopPropagation(); clickBolPer(\''+cat+'\',\''+sk+'\','+i+')"></div>';
            } else {
              bolHtml += '<span class="sk-bol-max">Máximo</span>';
            }
            bolHtml += '</div>';
            html += '<div class="srow" id="row-'+cat+'-'+sk+'" onmouseenter="showTT(S.skills[\''+cat+'\'][\''+sk+'\'], event)" onmouseleave="hideTT()" onclick="showTT(S.skills[\''+cat+'\'][\''+sk+'\'], event)">'+
                    '<div style="flex-grow:1; display:flex; flex-direction:column; justify-content:center; gap:2px;"><span class="skname">'+cap(sk)+sub+'</span>'+bolHtml+'</div>'+
                    '<div class="skinw"><input type="number" class="skinp" id="sk-'+cat+'-'+sk+'" value="'+v+'" onclick="event.stopPropagation()" onchange="chgSk(\''+cat+'\',\''+sk+'\',this.value)" onblur="chgSk(\''+cat+'\',\''+sk+'\',this.value)"></div></div>';
          });
          html += '</div></div>';
        });
        html += '</div>';
      });
      cont.innerHTML = html;
    } else {
            bolHtml += '<span class="sk-bol-max">MÃX</span>';
          }
          bolHtml += '</div>';

          row.innerHTML = '<div style="flex-grow:1; display:flex; flex-direction:column; justify-content:center; gap:2px;"><span class="skname">' + displayName + sublabelHtml + '</span>' + bolHtml + '</div>'
            + '<div class="skinw"><input type="number" class="skinp" id="sk-' + cat + '-' + sk + '" value="' + v + '" onclick="event.stopPropagation()"></div>';
          row.addEventListener('mouseenter', e => showTT(S.skills[cat][sk], e));
          row.addEventListener('mouseleave', hideTT);
          row.addEventListener('click', e => showTT(S.skills[cat][sk], e));
          const inp = row.querySelector('input');
          inp.addEventListener('change', e => chgSk(cat, sk, e.target.value));
          inp.addEventListener('blur', e => chgSk(cat, sk, e.target.value));
          list.appendChild(row);
        });
        const be = hd.querySelector('.sbase');
        be.addEventListener('mouseenter', e => showTT(e.target.dataset.val, e));
        be.addEventListener('mouseleave', hideTT);
        be.addEventListener('click', e => showTT(e.target.dataset.val, e));
        wrap.appendChild(hd); wrap.appendChild(list); return wrap;
      }
      cols.forEach(catList => {
        const col = document.createElement('div');
        col.style.display = 'flex'; col.style.flexDirection = 'column'; col.style.gap = '12px';
        catList.forEach(cat => col.appendChild(mkCat(cat)));
        cont.appendChild(col);
      });
    }

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       D100 TOOLTIP
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    function showTT(P, e = null, keep = false) {
      P = parseInt(P) || 0;
      const ext = Math.floor(P * .1), bon = Math.floor(P / 3), suc = Math.floor(P * .6), ds = P >= 60 ? 96 : 90;
      const fmt = (mn, mx) => mn > mx ? 'â€”' : mn === mx ? pad(mn) : (pad(mn) + 'â€“' + pad(mx));
      document.getElementById('tt-d').innerText = P >= 130 ? 'â€”' : fmt(ds, 100);
      document.getElementById('tt-f').innerText = fmt(suc + 1, ds - 1);
      document.getElementById('tt-s').innerText = fmt(bon + 1, suc);
      document.getElementById('tt-b').innerText = fmt(ext + 1, bon);
      document.getElementById('tt-e').innerText = fmt(1, ext);
      TT.classList.add('show');
      if (!keep && e) {
        if (window.innerWidth <= 767) return;
        // Accept both real DOM events and plain objects {currentTarget:el}
        const el = e.currentTarget || e.target;
        if (!el) return;
        const rc = el.getBoundingClientRect();
        let top = rc.top + window.scrollY, left = rc.right + 14 + window.scrollX;
        if (left + 200 > window.innerWidth) left = rc.left - 200 + window.scrollX;
        if (top + 170 > window.scrollY + window.innerHeight) top = window.scrollY + window.innerHeight - 180;
        TT.style.left = left + 'px'; TT.style.top = top + 'px';
        TT.style.transform = 'scale(1) translateY(0)';
        TT.dataset.aid = el.id || '';
      }
    }
    function hideTT() { TT.classList.remove('show'); TT.dataset.aid = ''; }
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       CORRUPTION
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    function renderCorr() {
      const c = document.getElementById('ui-corruption'); c.innerHTML = '';
      const cur = parseInt(S.corruption) || 0;
      for (let i = 1; i <= 6; i++) {
        const sq = document.createElement('div');
        sq.className = 'csq' + (i <= cur ? ' on' : '');
        sq.addEventListener('click', () => { S.corruption = (parseInt(S.corruption) || 0) === i ? i - 1 : i; saveData(); renderCorr(); });
        c.appendChild(sq);
      }
    }

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       DRAG-TO-REORDER  (shared)
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    let dragSrc = null, dragList = null, dragCat = null;

    function setupCardDrag(card, list, idx) {
      // Drag is initiated from the bottom strip only
      const strip = card.querySelector('.ibar-strip');
      if (!strip) return;
      card.dataset.idx = idx; card.dataset.list = list;

      strip.setAttribute('draggable', 'true');
      strip.addEventListener('dragstart', e => {
        dragSrc = card; dragList = list; dragCat = null;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', idx);
        setTimeout(() => card.classList.add('dragging'), 0);
      });
      strip.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        document.querySelectorAll('.drag-over,.drag-cat-over').forEach(el => el.classList.remove('drag-over', 'drag-cat-over'));
        dragSrc = null;
      });
      card.addEventListener('dragover', e => {
        if (!dragSrc || dragSrc === card) return;
        e.preventDefault(); e.dataTransfer.dropEffect = 'move';
        card.classList.add('drag-over');
      });
      card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
      card.addEventListener('drop', e => {
        e.preventDefault(); card.classList.remove('drag-over');
        if (!dragSrc || dragSrc === card) return;
        const from = parseInt(dragSrc.dataset.idx);
        const to = parseInt(card.dataset.idx);
        const srcList = dragSrc.dataset.list;
        const tgtList = card.dataset.list;
        // Only handle inventory cross-category or same-list reorder
        if (srcList !== 'inventory' || tgtList !== 'inventory') {
          if (srcList !== tgtList) return;
          const arr = S[srcList];
          const [item] = arr.splice(from, 1); arr.splice(to, 0, item);
          saveData();
          if (srcList === 'equipments') renderEquipments();
          else if (srcList === 'spirits') renderSpirits();
          else renderDyn(srcList);
          return;
        }
        // Inventory: check if same or different category
        const srcCat = S.inventory[from]?.category;
        const tgtCat = S.inventory[to]?.category;
        if (srcCat === tgtCat) {
          // Same category â€” reorder
          const [item] = S.inventory.splice(from, 1); S.inventory.splice(to, 0, item);
        } else {
          // Different category â€” move item to target's category
          S.inventory[from].category = tgtCat;
          // Also reorder to sit near the target
          const [item] = S.inventory.splice(from, 1); S.inventory.splice(to, 0, item);
        }
        saveData(); renderInv();
      });
    }

    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       TRAITS
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    function renderDyn(list) {
      const cont = document.getElementById('ui-' + list + '-list'); cont.innerHTML = '';
      S[list].forEach((item, i) => {
        const card = mkBaseCard(item, i, list, { hasDesc: true, hasQty: false });
        cont.appendChild(card); setupCardDrag(card, list, i);
      });
    }
    function addDyn(list) { S[list].unshift(newTrait()); saveData(); renderDyn(list); }
    function delDyn(list, i) { if (confirm('Remover?')) { S[list].splice(i, 1); saveData(); renderDyn(list); } }
    function togDyn(list, i) { S[list][i].expanded = !S[list][i].expanded; saveData(); renderDyn(list); }
    function updDyn(list, i, f, v) { S[list][i][f] = v; saveData(); }

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       BASE CARD BUILDER
       Layout: [name | qty | del]  top bar
               [damage row]        optional, always visible
               [body]              hidden until open
               [== strip]          bottom â€” click=expand, drag=reorder
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    function mkBaseCard(item, i, list, opts = {}) {
      const card = document.createElement('div');
      card.className = 'icard' + (item.expanded ? ' open' : '');

      /* â”€â”€ TOP BAR: name + qty + del â”€â”€ */
      const bar = document.createElement('div'); bar.className = 'ibar';

      const nameInp = document.createElement('input');
      nameInp.type = 'text'; nameInp.className = 'ibar-name-input';
      nameInp.value = item.name || ''; nameInp.placeholder = 'Nome...';
      nameInp.addEventListener('click', e => e.stopPropagation());
      nameInp.addEventListener('change', e => {
        if (list === 'inventory') S.inventory[i].name = e.target.value;
        else if (list === 'equipments') S.equipments[i].name = e.target.value;
        else if (list === 'spirits') S.spirits[i].name = e.target.value;
        else S[list][i].name = e.target.value;
        saveData();
      });
      bar.appendChild(nameInp);

      if (opts.hasQty) {
        const qw = document.createElement('div'); qw.className = 'ibar-qty';
        const qm = document.createElement('button'); qm.className = 'iqbtn'; qm.textContent = 'âˆ’';
        qm.addEventListener('click', e => { e.stopPropagation(); modQ(i, -1); });
        const qn = document.createElement('span'); qn.className = 'iqnum'; qn.textContent = item.qty || 1;
        const qp = document.createElement('button'); qp.className = 'iqbtn'; qp.textContent = '+';
        qp.addEventListener('click', e => { e.stopPropagation(); modQ(i, 1); });
        qw.appendChild(qm); qw.appendChild(qn); qw.appendChild(qp);
        bar.appendChild(qw);
      }

      const del = document.createElement('button'); del.className = 'idel'; del.textContent = 'Ã—'; del.title = 'Remover';
      del.addEventListener('click', e => {
        e.stopPropagation(); if (!confirm('Remover?')) return;
        if (list === 'inventory') { S.inventory.splice(i, 1); saveData(); renderInv(); }
        else if (list === 'equipments') { S.equipments.splice(i, 1); saveData(); renderEquipments(); }
        else if (list === 'spirits') { S.spirits.splice(i, 1); saveData(); renderSpirits(); }
        else { S[list].splice(i, 1); saveData(); renderDyn(list); }
      });
      bar.appendChild(del);
      card.appendChild(bar);

      /* â”€â”€ TOP COLLAPSE STRIP (visible only when open, collapses card) â”€â”€ */
      const topStrip = document.createElement('div'); topStrip.className = 'ibar-top-strip';
      const topArrow = document.createElement('span'); topArrow.className = 'ibar-top-strip-arrow'; topArrow.textContent = 'â–¼';
      topStrip.appendChild(topArrow);
      topStrip.addEventListener('click', () => {
        // Collapse this card
        if (list === 'inventory') { S.inventory[i].expanded = false; saveData(); renderInv(); }
        else if (list === 'equipments') { S.equipments[i].expanded = false; saveData(); renderEquipments(); }
        else if (list === 'spirits') { S.spirits[i].expanded = false; saveData(); renderSpirits(); }
        else { S[list][i].expanded = false; saveData(); renderDyn(list); }
      });
      card.appendChild(topStrip);

      /* â”€â”€ DAMAGE + EXTRA STATS ROW (inventory Equipamentos category) â”€â”€ */
      if (opts.dmgAlwaysVisible) {
        const statsWrap = document.createElement('div');
        statsWrap.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:5px 10px;padding:0 10px 8px';
        const invStatFields = [
          { key: 'damage', lbl: 'Dano', ph: 'Ex: 2d6+3' },
          { key: 'defeito', lbl: 'Defeito', ph: 'Ex: 95' },
          { key: 'alcance', lbl: 'Alcance', ph: 'Ex: 5m' },
          { key: 'usoPorRodada', lbl: 'Uso por Rodada', ph: 'Ex: 1/2' },
        ];
        invStatFields.forEach(f => {
          const cell = document.createElement('div');
          const lbl = document.createElement('span'); lbl.className = 'ibar-dmg-lbl'; lbl.textContent = f.lbl;
          lbl.style.display = 'block'; lbl.style.marginBottom = '2px';
          const inp = document.createElement('input'); inp.type = 'text'; inp.className = 'ibar-dmg-inp';
          inp.value = item[f.key] || ''; inp.placeholder = f.ph;
          inp.addEventListener('click', e => e.stopPropagation());
          inp.addEventListener('change', e => { S.inventory[i][f.key] = e.target.value; saveData(); });
          cell.appendChild(lbl); cell.appendChild(inp);
          statsWrap.appendChild(cell);
        });
        card.appendChild(statsWrap);
      }

      /* â”€â”€ BODY â”€â”€ */
      const body = document.createElement('div'); body.className = 'ibody';

      if (opts.hasDesc) {
        const lbl = document.createElement('span'); lbl.className = 'ifield-lbl'; lbl.textContent = 'DescriÃ§Ã£o';
        const ta = document.createElement('textarea'); ta.className = 'idesc'; ta.placeholder = 'Detalhes...'; ta.value = item.desc || '';
        ta.addEventListener('input', e => {
          autoResize(ta);
          if (list === 'inventory') S.inventory[i].desc = e.target.value;
          else if (list === 'equipments') S.equipments[i].desc = e.target.value;
          else if (list === 'spirits') S.spirits[i].desc = e.target.value;
          else S[list][i].desc = e.target.value;
          saveData();
        });
        body.appendChild(lbl); body.appendChild(ta);
        // autoResize after render
        requestAnimationFrame(() => autoResize(ta));
      }

      if (opts.extraBody) {
        const extra = opts.extraBody();
        body.appendChild(extra);
      }
      card.appendChild(body);

      /* â”€â”€ BOTTOM STRIP: click=expand (one-at-a-time), drag handle â”€â”€ */
      const strip = document.createElement('div'); strip.className = 'ibar-strip';
      strip.title = 'Clique para expandir Â· Arraste para mover';
      const stripIcon = document.createElement('span'); stripIcon.className = 'ibar-strip-icon'; stripIcon.textContent = '= =';
      const stripArrow = document.createElement('span'); stripArrow.className = 'ibar-strip-arrow'; stripArrow.textContent = 'â–¼';
      strip.appendChild(stripIcon); strip.appendChild(stripArrow);

      strip.addEventListener('click', () => {
        const newVal = !item.expanded;
        if (list === 'inventory') { S.inventory[i].expanded = newVal; saveData(); renderInv(); }
        else if (list === 'equipments') { S.equipments[i].expanded = newVal; saveData(); renderEquipments(); }
        else if (list === 'spirits') { S.spirits[i].expanded = newVal; saveData(); renderSpirits(); }
        else { S[list][i].expanded = newVal; saveData(); renderDyn(list); }
      });
      card.appendChild(strip);

      return card;
    }

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       INVENTORY  (sandwich + drag between cats)
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    function renderInv() {
      const cont = document.getElementById('ui-inv-list'); cont.innerHTML = '';
      const showAll = invFilters.has('Todos');
      ICATS.forEach(cat => {
        if (!showAll && !invFilters.has(cat)) return;

        // Category separator (always when showing multiple or all)
        if (showAll || invFilters.size > 1) {
          const sep = document.createElement('div');
          sep.className = 'catsep'; sep.textContent = 'â”€â”€ ' + cat + ' â”€â”€';
          sep.dataset.cat = cat;
          sep.addEventListener('dragover', e => { if (!dragSrc) return; e.preventDefault(); sep.classList.add('drag-cat-over'); });
          sep.addEventListener('dragleave', () => sep.classList.remove('drag-cat-over'));
          sep.addEventListener('drop', e => {
            e.preventDefault(); sep.classList.remove('drag-cat-over');
            if (!dragSrc || dragList !== 'inventory') return;
            const from = parseInt(dragSrc.dataset.idx);
            S.inventory[from].category = cat;
            saveData(); renderInv();
          });
          cont.appendChild(sep);
          const items = S.inventory.filter(it => it.category === cat);
          if (!items.length) { const p = document.createElement('p'); p.className = 'emptyn'; p.textContent = '(Vazio)'; cont.appendChild(p); }
        }

        const items = S.inventory.filter(it => it.category === cat);
        items.forEach(item => {
          const gi = S.inventory.indexOf(item);
          const isDmgItem = (item.category === 'Equipamentos');
          const card = mkBaseCard(item, gi, 'inventory', { hasDesc: true, hasQty: true, dmgAlwaysVisible: isDmgItem });
          cont.appendChild(card); setupCardDrag(card, 'inventory', gi); card.dataset.cat = cat;
        });
      });
    }
    function setF(f) {
      if (f === 'Todos') {
        // Toggle: if Todos already active and alone, do nothing; otherwise set to only Todos
        invFilters = new Set(['Todos']);
      } else {
        // Remove Todos if adding a specific category
        invFilters.delete('Todos');
        if (invFilters.has(f)) {
          invFilters.delete(f);
          // If nothing left, revert to Todos
          if (invFilters.size === 0) invFilters = new Set(['Todos']);
        } else {
          invFilters.add(f);
        }
      }
      document.querySelectorAll('#invfilt .fbtn').forEach(b => {
        const bf = b.dataset.f;
        b.classList.toggle('on', invFilters.has(bf));
      });
      renderInv();
    }
    function addInv() {
      // Pick first active non-Todos category, else Mochila
      const cats = [...invFilters].filter(f => f !== 'Todos');
      const cat = cats.length > 0 ? cats[0] : 'Mochila';
      S.inventory.unshift(newInvItem(cat)); saveData(); renderInv();
    }
    function modQ(i, delta) {
      S.inventory[i].qty = Math.max(0, (parseInt(S.inventory[i].qty) || 0) + delta);
      saveData(); renderInv();
    }

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       EQUIPMENT SPECIAL CARDS
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    function renderEquipments() {
      const cont = document.getElementById('ui-equipments-list'); cont.innerHTML = '';
      S.equipments.forEach((eq, i) => {
        const card = mkBaseCard(eq, i, 'equipments', {
          hasDesc: false,
          extraBody: () => buildEquipBody(eq, i)
        });
        cont.appendChild(card);
        setupCardDrag(card, 'equipments', i);
      });
    }
    function addEquip() { S.equipments.unshift(newEquip()); saveData(); renderEquipments(); }

    function buildEquipBody(eq, i) {
      const wrap = document.createElement('div');

      // Element â€” discrete row
      const elemRow = document.createElement('div'); elemRow.className = 'elem-row';
      const elemLbl = document.createElement('span'); elemLbl.className = 'elem-lbl'; elemLbl.textContent = 'Elemento';
      const elemInp = document.createElement('input'); elemInp.type = 'text'; elemInp.className = 'elem-inp';
      elemInp.value = eq.element || ''; elemInp.placeholder = 'â€”';
      elemInp.addEventListener('click', e => e.stopPropagation());
      elemInp.addEventListener('change', e => { S.equipments[i].element = e.target.value; saveData(); });
      elemRow.appendChild(elemLbl); elemRow.appendChild(elemInp);
      wrap.appendChild(elemRow);

      // Stats block â€” only Dano for equipamentos especiais
      const hasStats = !!(eq.damage);
      const statsTog = document.createElement('button'); statsTog.className = 'desc-tog';
      statsTog.textContent = (eq.statsOpen || hasStats) ? 'â–² Ocultar Dano' : 'â–¼ Dano';
      statsTog.addEventListener('click', e => { e.stopPropagation(); S.equipments[i].statsOpen = !S.equipments[i].statsOpen; saveData(); renderEquipments(); });
      wrap.appendChild(statsTog);
      if (eq.statsOpen || hasStats) {
        const dinp = document.createElement('input'); dinp.type = 'text'; dinp.className = 'ibar-dmg-inp'; dinp.style.marginBottom = '6px';
        dinp.value = eq.damage || ''; dinp.placeholder = 'Ex: 2d6+3';
        dinp.addEventListener('click', e => e.stopPropagation());
        dinp.addEventListener('change', e => { S.equipments[i].damage = e.target.value; saveData(); });
        wrap.appendChild(dinp);
      }

      // Description (collapsible)
      const dtog = document.createElement('button'); dtog.className = 'desc-tog';
      dtog.textContent = eq.descOpen ? 'â–² Ocultar DescriÃ§Ã£o' : 'â–¼ DescriÃ§Ã£o';
      dtog.addEventListener('click', e => { e.stopPropagation(); S.equipments[i].descOpen = !S.equipments[i].descOpen; saveData(); renderEquipments(); });
      wrap.appendChild(dtog);
      if (eq.descOpen) {
        const dta = document.createElement('textarea'); dta.className = 'idesc'; dta.placeholder = 'DescriÃ§Ã£o...'; dta.value = eq.desc || '';
        dta.addEventListener('input', e => { autoResize(dta); S.equipments[i].desc = e.target.value; saveData(); });
        wrap.appendChild(dta);
        requestAnimationFrame(() => autoResize(dta));
      }

      // Abilities
      const ablbl = document.createElement('span'); ablbl.className = 'ifield-lbl'; ablbl.textContent = 'Habilidades';
      wrap.appendChild(ablbl);
      const abWrap = document.createElement('div'); abWrap.className = 'abilities-wrap';

      (eq.abilities || []).forEach((ab, ai) => {
        const abCard = document.createElement('div'); abCard.className = 'ab-card' + (ab.open ? ' open' : '');
        const abBar = document.createElement('div'); abBar.className = 'ab-bar';
        const abName = document.createElement('input'); abName.type = 'text'; abName.className = 'ab-name-inp';
        abName.value = ab.name || ''; abName.placeholder = 'Nome da habilidade...';
        abName.addEventListener('click', e => e.stopPropagation());
        abName.addEventListener('change', e => { S.equipments[i].abilities[ai].name = e.target.value; saveData(); });
        const abDel = document.createElement('button'); abDel.className = 'ab-del'; abDel.textContent = 'Ã—';
        abDel.addEventListener('click', e => { e.stopPropagation(); S.equipments[i].abilities.splice(ai, 1); saveData(); renderEquipments(); });
        abBar.appendChild(abName); abBar.appendChild(abDel); abCard.appendChild(abBar);

        const abBody = document.createElement('div'); abBody.className = 'ab-body';
        const abDesc = document.createElement('textarea'); abDesc.className = 'ab-desc'; abDesc.placeholder = 'DescriÃ§Ã£o...'; abDesc.value = ab.desc || '';
        abDesc.addEventListener('input', e => { autoResize(abDesc); S.equipments[i].abilities[ai].desc = e.target.value; saveData(); });
        abBody.appendChild(abDesc); abCard.appendChild(abBody);
        requestAnimationFrame(() => autoResize(abDesc));

        // Strip â€” expand toggle + pointer drag to reorder
        const abStrip = document.createElement('div'); abStrip.className = 'ab-strip';
        const abArr = document.createElement('span'); abArr.className = 'ab-strip-arrow'; abArr.textContent = 'â–¼';
        if (ab.open) abArr.style.transform = 'rotate(180deg)';
        abStrip.appendChild(abArr);
        abStrip.addEventListener('click', e => {
          if (e.detail === 0) return; // fired by pointer, not a real click
          S.equipments[i].abilities[ai].open = !ab.open; saveData(); renderEquipments();
        });
        setupAbilityDrag(
          abStrip,
          () => ai,
          () => S.equipments[i].abilities,
          arr => { S.equipments[i].abilities = arr; },
          () => { saveData(); renderEquipments(); }
        );
        abCard.appendChild(abStrip);
        abWrap.appendChild(abCard);
      });

      const addAb = document.createElement('button'); addAb.className = 'add-ab-btn'; addAb.textContent = '+'; addAb.title = 'Adicionar Habilidade';
      addAb.addEventListener('click', e => { e.stopPropagation(); S.equipments[i].abilities.push(newAbility()); saveData(); renderEquipments(); });
      abWrap.appendChild(addAb); wrap.appendChild(abWrap);
      return wrap;
    }

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       SPIRIT CARDS  (grouped abilities)
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    function renderSpirits() {
      const cont = document.getElementById('ui-spirits-list'); cont.innerHTML = '';
      S.spirits.forEach((sp, i) => {
        const card = mkBaseCard(sp, i, 'spirits', {
          hasDesc: false,
          extraBody: () => buildSpiritBody(sp, i)
        });
        cont.appendChild(card);
        setupCardDrag(card, 'spirits', i);
      });
    }
    function addSpirit() { S.spirits.unshift(newSpirit()); saveData(); renderSpirits(); }

    function buildSpiritBody(sp, i) {
      const wrap = document.createElement('div');

      // Element â€” discrete
      const elemRow = document.createElement('div'); elemRow.className = 'elem-row';
      const elemLbl = document.createElement('span'); elemLbl.className = 'elem-lbl'; elemLbl.textContent = 'Elemento';
      const elemInp = document.createElement('input'); elemInp.type = 'text'; elemInp.className = 'elem-inp';
      elemInp.value = sp.element || ''; elemInp.placeholder = 'â€”';
      elemInp.addEventListener('click', e => e.stopPropagation());
      elemInp.addEventListener('change', e => { S.spirits[i].element = e.target.value; saveData(); });
      elemRow.appendChild(elemLbl); elemRow.appendChild(elemInp);
      wrap.appendChild(elemRow);

      // Damage (optional)
      const hasDmg = !!(sp.damage);
      const dmgTog = document.createElement('button'); dmgTog.className = 'desc-tog';
      dmgTog.textContent = (sp.dmgOpen || hasDmg) ? 'â–² Ocultar Dano' : 'â–¼ Dano';
      dmgTog.addEventListener('click', e => { e.stopPropagation(); S.spirits[i].dmgOpen = !S.spirits[i].dmgOpen; saveData(); renderSpirits(); });
      wrap.appendChild(dmgTog);
      if (sp.dmgOpen || hasDmg) {
        const dinp = document.createElement('input'); dinp.type = 'text'; dinp.className = 'ibar-dmg-inp'; dinp.style.marginBottom = '4px';
        dinp.value = sp.damage || ''; dinp.placeholder = 'Ex: 2d6+3';
        dinp.addEventListener('click', e => e.stopPropagation());
        dinp.addEventListener('change', e => { S.spirits[i].damage = e.target.value; saveData(); });
        wrap.appendChild(dinp);
      }

      // Description (collapsible)
      const dtog = document.createElement('button'); dtog.className = 'desc-tog';
      dtog.textContent = sp.descOpen ? 'â–² Ocultar DescriÃ§Ã£o' : 'â–¼ DescriÃ§Ã£o';
      dtog.addEventListener('click', e => { e.stopPropagation(); S.spirits[i].descOpen = !S.spirits[i].descOpen; saveData(); renderSpirits(); });
      wrap.appendChild(dtog);
      if (sp.descOpen) {
        const dta = document.createElement('textarea'); dta.className = 'idesc'; dta.placeholder = 'DescriÃ§Ã£o do espÃ­rito...'; dta.value = sp.desc || '';
        dta.addEventListener('input', e => { autoResize(dta); S.spirits[i].desc = e.target.value; saveData(); });
        wrap.appendChild(dta);
        requestAnimationFrame(() => autoResize(dta));
      }

      // Groups
      const glbl = document.createElement('span'); glbl.className = 'ifield-lbl'; glbl.textContent = 'Grupos de Habilidades';
      wrap.appendChild(glbl);
      const groupWrap = document.createElement('div'); groupWrap.className = 'ab-group-wrap';

      (sp.groups || []).forEach((grp, gi) => {
        const grpEl = document.createElement('div'); grpEl.className = 'ab-group' + (grp.open ? ' open' : '');

        // Group header: name + del
        const ghd = document.createElement('div'); ghd.className = 'ab-group-hd';
        const gname = document.createElement('input'); gname.type = 'text'; gname.className = 'ab-group-name';
        gname.value = grp.name || ''; gname.placeholder = 'Nome do grupo...';
        gname.addEventListener('click', e => e.stopPropagation());
        gname.addEventListener('change', e => { S.spirits[i].groups[gi].name = e.target.value; saveData(); });
        const gdel = document.createElement('button'); gdel.className = 'ab-group-del'; gdel.textContent = 'Ã—';
        gdel.addEventListener('click', e => { e.stopPropagation(); S.spirits[i].groups.splice(gi, 1); saveData(); renderSpirits(); });
        ghd.appendChild(gname); ghd.appendChild(gdel); grpEl.appendChild(ghd);

        const gStrip = document.createElement('div'); gStrip.className = 'ab-group-strip';
        const gArr = document.createElement('span'); gArr.className = 'ab-strip-arrow'; gArr.textContent = 'â–¼';
        if (grp.open) gArr.style.transform = 'rotate(180deg)';
        gStrip.appendChild(gArr);
        gStrip.addEventListener('click', () => { S.spirits[i].groups[gi].open = !grp.open; saveData(); renderSpirits(); });
        grpEl.appendChild(gStrip);

        // Group body
        const gbody = document.createElement('div'); gbody.className = 'ab-group-body';
        (grp.abilities || []).forEach((ab, ai) => {
          const abCard = document.createElement('div'); abCard.className = 'ab-card' + (ab.open ? ' open' : '');
          const abBar = document.createElement('div'); abBar.className = 'ab-bar';
          const abName = document.createElement('input'); abName.type = 'text'; abName.className = 'ab-name-inp';
          abName.value = ab.name || ''; abName.placeholder = 'Habilidade...';
          abName.addEventListener('click', e => e.stopPropagation());
          abName.addEventListener('change', e => { S.spirits[i].groups[gi].abilities[ai].name = e.target.value; saveData(); });
          const abDel = document.createElement('button'); abDel.className = 'ab-del'; abDel.textContent = 'Ã—';
          abDel.addEventListener('click', e => { e.stopPropagation(); S.spirits[i].groups[gi].abilities.splice(ai, 1); saveData(); renderSpirits(); });
          abBar.appendChild(abName); abBar.appendChild(abDel); abCard.appendChild(abBar);

          const abBody = document.createElement('div'); abBody.className = 'ab-body';
          const abDesc = document.createElement('textarea'); abDesc.className = 'ab-desc'; abDesc.placeholder = 'DescriÃ§Ã£o...'; abDesc.value = ab.desc || '';
          abDesc.addEventListener('input', e => { autoResize(abDesc); S.spirits[i].groups[gi].abilities[ai].desc = e.target.value; saveData(); });
          abBody.appendChild(abDesc); abCard.appendChild(abBody);
          requestAnimationFrame(() => autoResize(abDesc));

          const abStrip = document.createElement('div'); abStrip.className = 'ab-strip';
          const abArr = document.createElement('span'); abArr.className = 'ab-strip-arrow'; abArr.textContent = 'â–¼';
          if (ab.open) abArr.style.transform = 'rotate(180deg)';
          abStrip.appendChild(abArr);
          abStrip.addEventListener('click', e => {
            if (e.detail === 0) return;
            S.spirits[i].groups[gi].abilities[ai].open = !ab.open; saveData(); renderSpirits();
          });
          setupAbilityDrag(
            abStrip,
            () => ai,
            () => S.spirits[i].groups[gi].abilities,
            arr => { S.spirits[i].groups[gi].abilities = arr; },
            () => { saveData(); renderSpirits(); }
          );
          abCard.appendChild(abStrip);
          gbody.appendChild(abCard);
        });

        const addAb = document.createElement('button'); addAb.className = 'add-ab-btn'; addAb.textContent = '+'; addAb.title = 'Adicionar Habilidade';
        addAb.addEventListener('click', e => { e.stopPropagation(); S.spirits[i].groups[gi].abilities.push(newAbility()); saveData(); renderSpirits(); });
        gbody.appendChild(addAb); grpEl.appendChild(gbody);
        groupWrap.appendChild(grpEl);
      });

      const addGrp = document.createElement('button'); addGrp.className = 'add-ab-btn'; addGrp.textContent = '+'; addGrp.title = 'Adicionar Grupo';
      addGrp.addEventListener('click', e => { e.stopPropagation(); S.spirits[i].groups.push(newGroup()); saveData(); renderSpirits(); });
      groupWrap.appendChild(addGrp); wrap.appendChild(groupWrap);
      return wrap;
    }

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       IMAGE UPLOAD
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    function handleImg(e) {
      const f = e.target.files && e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = ev => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height, M = 500;
          if (w > h) { if (w > M) { h *= M / w; w = M; } } else { if (h > M) { w *= M / h; h = M; } }
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          const url = canvas.toDataURL('image/jpeg', .82);
          document.getElementById('ui-photo').src = url; S.photo = url; saveData();
          // Radar needs photo dimensions â€” redraw after image settles
          setTimeout(drawRadar, 100);
        };
        img.src = ev.target.result;
      };
      r.readAsDataURL(f);
    }

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       SECTIONS
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    function togSec(id) { S.collapsed[id] = !S.collapsed[id]; saveData(); applyColl(id); }
    function applyColl(id) {
      document.getElementById('bd-' + id).classList.toggle('hidden', !!S.collapsed[id]);
      document.querySelector('#' + id + ' .sec-hd').classList.toggle('closed', !!S.collapsed[id]);
    }

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       NAVIGATION
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    function togMenu() {
      document.getElementById('sidebar').classList.toggle('open');
      document.getElementById('overlay').classList.toggle('open');
    }
    function setActiveNav(id) {
      document.querySelectorAll('#snav a,#tabbar a').forEach(l => l.classList.toggle('act', l.getAttribute('href') === '#' + id));
    }
    document.querySelectorAll('#snav a').forEach(a => {
      a.addEventListener('click', () => { if (window.innerWidth < 768) togMenu(); setActiveNav(a.getAttribute('href').slice(1)); });
    });
    document.querySelectorAll('#tabbar a').forEach(a => {
      a.addEventListener('click', () => setActiveNav(a.getAttribute('href').slice(1)));
    });
    function scrollSpy() {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveNav(e.target.id); });
      }, { rootMargin: '-20% 0px -60% 0px' });
      document.querySelectorAll('section').forEach(s => obs.observe(s));
    }

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       RADAR CHART
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    function drawRadar() {
      const canvas = document.getElementById('radar-canvas');
      if (!canvas) return;
      const wrap = canvas.parentElement;
      if (!wrap) return;

      // Use wrapper's actual pixel size (it's square via aspect-ratio:1/1)
      const dpr = window.devicePixelRatio || 1;
      const cssW = wrap.clientWidth || wrap.offsetWidth || 200;
      const cssH = wrap.clientHeight || wrap.offsetHeight || cssW; // should be square
      canvas.style.width = cssW + 'px';
      canvas.style.height = cssH + 'px';
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);

      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);

      // â”€â”€ Sample the live starfield canvas as background â”€â”€
      const sf = document.getElementById('starfield');
      if (sf) {
        try {
          const rect = wrap.getBoundingClientRect();
          // starfield canvas is drawn in CSS pixel space (no DPR in starfield)
          ctx.save();
          ctx.drawImage(sf, rect.left, rect.top, rect.width, rect.height, 0, 0, cssW, cssH);
          ctx.restore();
        } catch (e) { }
      }

      const W = cssW, H = cssH;
      const cats = ['FÃ­sicas', 'PrÃ¡ticas', 'Sociais', 'ConduÃ§Ã£o', 'Conhecimento', 'Investigativas', 'EspecÃ­ficas'];
      const labels = ['FÃ­sicas', 'PrÃ¡ticas', 'Sociais', 'ConduÃ§Ã£o', 'Conhec.', 'Invest.', 'EspecÃ­f.'];
      const N = cats.length;
      const cx = W / 2, cy = H / 2;
      const maxR = Math.min(W, H) / 2 - 28;
      const maxVal = 150;
      const ringSteps = [30, 60, 90, 120, 150];

      const vals = cats.map(cat => {
        const sk = S.skills[cat]; if (!sk) return 0;
        const vs = Object.values(sk);
        const avg = vs.reduce((a, v) => a + v, 0) / vs.length;
        return Math.min(maxVal, Math.max(0, Math.floor(avg / 5) * 5));
      });

      const style = getComputedStyle(document.documentElement);
      const acc = (style.getPropertyValue('--acc') || '#00e5c8').trim();
      function hexRgb(h) {
        h = h.replace('#', '');
        if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
        return { r: parseInt(h.slice(0, 2), 16) || 0, g: parseInt(h.slice(2, 4), 16) || 0, b: parseInt(h.slice(4, 6), 16) || 0 };
      }
      const ac = hexRgb(acc);

      function angle(i) { return (Math.PI * 2 / N) * i - Math.PI / 2; }
      function pt(i, r) { return { x: cx + Math.cos(angle(i)) * r, y: cy + Math.sin(angle(i)) * r }; }

      // Subtle dark overlay so data is readable against starfield
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < N; i++) { const p = pt(i, maxR); i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); }
      ctx.closePath();
      ctx.fillStyle = 'rgba(3,6,15,0.45)';
      ctx.fill();
      ctx.restore();

      // Grid rings
      ringSteps.forEach(step => {
        const r = (step / maxVal) * maxR;
        ctx.beginPath();
        for (let i = 0; i < N; i++) { const p = pt(i, r); i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 1; ctx.stroke();
        // ring value label
        const fs = Math.max(7, Math.round(W / 30));
        ctx.fillStyle = 'rgba(255,255,255,.35)';
        ctx.font = `${fs}px monospace`;
        ctx.textAlign = 'left';
        ctx.fillText(step, cx + 4, cy - r + fs * 0.4);
      });

      // Axes
      for (let i = 0; i < N; i++) {
        const p = pt(i, maxR);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 1; ctx.stroke();
      }

      // Data polygon
      ctx.beginPath();
      vals.forEach((v, i) => { const r = (v / maxVal) * maxR; const p = pt(i, r); i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); });
      ctx.closePath();
      ctx.fillStyle = `rgba(${ac.r},${ac.g},${ac.b},0.18)`; ctx.fill();
      ctx.strokeStyle = `rgba(${ac.r},${ac.g},${ac.b},0.9)`; ctx.lineWidth = 2; ctx.stroke();

      // Data points
      vals.forEach((v, i) => {
        const r = (v / maxVal) * maxR; const p = pt(i, r);
        ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = acc; ctx.fill();
        ctx.strokeStyle = 'rgba(3,6,15,0.6)'; ctx.lineWidth = 1; ctx.stroke();
      });

      // Labels
      const fs = Math.max(9, Math.round(W / 20));
      ctx.font = `600 ${fs}px sans-serif`;
      ctx.textAlign = 'center';
      labels.forEach((lbl, i) => {
        const p = pt(i, maxR + fs + 5);
        ctx.fillStyle = 'rgba(205,214,232,0.9)';
        ctx.fillText(lbl, p.x, p.y + 3);
      });
    }

    /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       SECTION REORDER â€” sidebar nav (desktop) + tabbar (mobile)
       Mesmo sistema dos cards de inventÃ¡rio: pointer events,
       segure 1,5 s para ativar o arrasto. Funciona em mouse e toque.
    â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    function initSidebarDrag() {
      _initNavDrag(document.getElementById('snav'), false);
      _initNavDrag(document.querySelector('#tabbar .tbinner'), true);
    }

    function _initNavDrag(navEl, isTabbar) {
      if (!navEl) return;
      let dragEl = null, lastOver = null;

      navEl.addEventListener('contextmenu', e => e.preventDefault());

      function links() { return [...navEl.querySelectorAll('a')]; }

      links().forEach(a => {
        a.addEventListener('contextmenu', e => e.preventDefault());
        a.addEventListener('pointerdown', e => {
          clearTimeout(a._navDt);
          a._navDt = setTimeout(() => {
            dragEl = a;
            a.classList.add('nav-dragging');
            try { navEl.setPointerCapture(e.pointerId); } catch (_) { }
            e.preventDefault();
          }, 1500);
        });
        a.addEventListener('click', () => clearTimeout(a._navDt));
        a.addEventListener('pointerup', () => clearTimeout(a._navDt));
      });

      navEl.addEventListener('pointermove', e => {
        if (!dragEl) return;
        e.preventDefault();
        let over = null;
        links().forEach(l => {
          const r = l.getBoundingClientRect();
          if (isTabbar ? e.clientX >= r.left && e.clientX <= r.right
            : e.clientY >= r.top && e.clientY <= r.bottom) over = l;
        });
        if (over && over !== dragEl && over !== lastOver) {
          links().forEach(l => l.classList.remove('drag-over-nav'));
          over.classList.add('drag-over-nav');
          lastOver = over;
        }
      });

      navEl.addEventListener('pointerup', e => {
        links().forEach(a => clearTimeout(a._navDt));
        if (!dragEl) return;
        let target = null;
        links().forEach(l => {
          const r = l.getBoundingClientRect();
          if (isTabbar ? e.clientX >= r.left && e.clientX <= r.right
            : e.clientY >= r.top && e.clientY <= r.bottom) target = l;
        });
        if (target && target !== dragEl) {
          const ls = links();
          const fi = ls.indexOf(dragEl), ti = ls.indexOf(target);
          if (fi < ti) navEl.insertBefore(dragEl, target.nextSibling);
          else navEl.insertBefore(dragEl, target);
          _syncNavOrder(isTabbar ? 'sidebar' : 'tabbar');
          reorderSectionsFromNav();
          saveSectionOrder();
        }
        dragEl.classList.remove('nav-dragging');
        links().forEach(l => l.classList.remove('drag-over-nav'));
        dragEl = null; lastOver = null;
      });

      navEl.addEventListener('pointercancel', () => {
        links().forEach(a => { clearTimeout(a._navDt); a.classList.remove('nav-dragging', 'drag-over-nav'); });
        dragEl = null; lastOver = null;
      });
    }

    /* MantÃ©m sidebar e tabbar sincronizados apÃ³s reordenaÃ§Ã£o */
    function _syncNavOrder(syncTarget) {
      const sideEl = document.getElementById('snav');
      const tabEl = document.querySelector('#tabbar .tbinner');
      if (!sideEl || !tabEl) return;
      const src = syncTarget === 'tabbar' ? sideEl : tabEl;
      const dst = syncTarget === 'tabbar' ? tabEl : sideEl;
      [...src.querySelectorAll('a')].forEach(a => {
        const href = a.getAttribute('href');
        const mirror = dst.querySelector('a[href="' + href + '"]');
        if (mirror) dst.appendChild(mirror);
      });
    }

    function reorderSectionsFromNav() {
      const main = document.getElementById('main');
      const nav = document.getElementById('snav');
      const order = [...nav.querySelectorAll('a')].map(a => a.getAttribute('href').slice(1));
      order.forEach(id => {
        const sec = document.getElementById(id);
        if (sec) main.appendChild(sec);
      });
      // Update scroll spy
      scrollSpy();
    }

    function saveSectionOrder() {
      const nav = document.getElementById('snav');
      const order = [...nav.querySelectorAll('a')].map(a => a.getAttribute('href').slice(1));
      S.sectionOrder = order;
      saveData();
    }

    function applySavedSectionOrder() {
      const order = S.sectionOrder;
      if (!order || !Array.isArray(order)) return;
      const nav = document.getElementById('snav');
      const tabEl = document.querySelector('#tabbar .tbinner');
      const main = document.getElementById('main');
      // Reorder sidebar nav links
      order.forEach(id => {
        const link = nav.querySelector('a[href="#' + id + '"]');
        if (link) nav.appendChild(link);
      });
      // Sync tabbar order to match sidebar
      if (tabEl) {
        order.forEach(id => {
          const link = tabEl.querySelector('a[href="#' + id + '"]');
          if (link) tabEl.appendChild(link);
        });
      }
      // Reorder sections
      order.forEach(id => {
        const sec = document.getElementById(id);
        if (sec) main.appendChild(sec);
      });
    }

    /* â”€â”€ ABILITY REORDER via pointer events â€” mesmo sistema dos cards de inventÃ¡rio â”€â”€ */
    function setupAbilityDrag(strip, getIdx, getArr, setArr, rerender) {
      strip.addEventListener('contextmenu', e => e.preventDefault());
      let dragging = false, timer = null;

      strip.addEventListener('pointerdown', e => {
        dragging = false;
        timer = setTimeout(() => {
          dragging = true;
          try { strip.setPointerCapture(e.pointerId); } catch (_) { }
          const card = strip.closest('.ab-card');
          if (card) card.style.opacity = '.4';
        }, 1500);
      });
      strip.addEventListener('pointermove', e => {
        if (!dragging) return;
        e.preventDefault();
      });
      strip.addEventListener('pointerup', e => {
        clearTimeout(timer);
        const card = strip.closest('.ab-card');
        if (card) card.style.opacity = '';
        if (!dragging) return;
        dragging = false;
        const endY = e.clientY;
        const cards = [...strip.closest('.abilities-wrap,.ab-group-body').querySelectorAll('.ab-card')];
        let targetIdx = getIdx();
        cards.forEach((c, ci) => {
          const r = c.getBoundingClientRect();
          if (endY >= r.top && endY <= r.bottom && ci !== getIdx()) targetIdx = ci;
        });
        if (targetIdx !== getIdx()) {
          const arr = getArr();
          const [item] = arr.splice(getIdx(), 1); arr.splice(targetIdx, 0, item);
          setArr(arr); rerender();
        }
      });
      strip.addEventListener('click', () => clearTimeout(timer));
      strip.addEventListener('pointercancel', () => {
        clearTimeout(timer); dragging = false;
        const card = strip.closest('.ab-card'); if (card) card.style.opacity = '';
      });
    }

    // Redraw radar when window resizes
    window.addEventListener('resize', () => drawRadar());

    window.onload = init;




