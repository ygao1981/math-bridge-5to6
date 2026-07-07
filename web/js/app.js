const DATA = window.MATH_BRIDGE_DATA;
let state = window.MathBridgeStorage.load();
state.completedKnowledge ||= [];
state.solvedExercises ||= {};
state.wrongExercises ||= {};
state.studyDays ||= {};
state.notes ||= '';

const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
let currentExerciseList = [];

function gcd(a, b) { return b ? gcd(b, a % b) : Math.abs(a); }
function frac(n, d) { const g = gcd(n, d); n /= g; d /= g; return d === 1 ? String(n) : `${n}/${d}`; }
function unique(list) { return [...new Set(list)]; }
function shuffle(list) { return [...list].sort(() => Math.random() - 0.5); }
function difficultyStars(n) { return '★'.repeat(n) + '☆'.repeat(Math.max(0, 5 - n)); }
function save() { window.MathBridgeStorage.save(state); renderProgress(); }
function markToday() { state.studyDays[new Date().toISOString().slice(0, 10)] = true; }

function normalizeAnswer(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[，、]/g, ',')
    .replace(/：/g, ':')
    .replace(/％/g, '%')
    .replace(/／/g, '/')
    .replace(/平方厘米|平方分米|平方米|立方厘米|立方分米|立方米|厘米|分米|米|页|人|元|kg|千克|cm³|cm3|dm³|dm3|cm²|cm2|dm²|dm2/g, '')
    .replace(/百分之/g, '')
    .replace(/％/g, '%');
}
function isCorrect(user, item) {
  const u = normalizeAnswer(user);
  return (item.accepted || [item.answer]).some(ans => normalizeAnswer(ans) === u);
}

function pushExercise(item) {
  if (DATA.exercises.some(x => x.id === item.id)) return;
  DATA.exercises.push({
    unit: item.unit || item.module,
    accepted: item.accepted || [item.answer],
    trap: item.trap || '',
    source: item.source || '原创模板生成题',
    ...item
  });
}

function addLargeExerciseBank() {
  if (DATA.__largeBankAdded) return;
  DATA.__largeBankAdded = true;

  [[12,18],[16,24],[21,28],[27,36],[35,49],[42,56],[45,60],[54,72],[30,48],[63,81],[72,96],[84,108],[90,120],[105,140],[126,168],[132,176],[150,210],[180,240],[198,264],[216,288]].forEach((p,i)=>{
    pushExercise({id:`bank-frac-simp-${i+1}`,module:'分数基础',difficulty:i<10?'基础':'提高',title:'约分专项',question:`把 ${p[0]}/${p[1]} 化成最简分数。`,answer:frac(p[0],p[1]),explanation:`同时除以最大公因数 ${gcd(p[0],p[1])}，得到 ${frac(p[0],p[1])}。`,trap:'必须化成最简分数。'});
  });
  [[2,5,3,10],[4,9,5,12],[5,6,7,9],[3,8,4,11],[7,12,5,8],[9,14,2,3],[11,18,3,5],[13,20,5,8],[5,7,7,10],[8,15,3,5]].forEach((p,i)=>{
    const ans=p[0]/p[1]>p[2]/p[3]?`${p[0]}/${p[1]}`:`${p[2]}/${p[3]}`;
    pushExercise({id:`bank-frac-compare-${i+1}`,module:'分数基础',difficulty:'提高',title:'分数比较',question:`比较 ${p[0]}/${p[1]} 和 ${p[2]}/${p[3]}，哪个更大？`,answer:ans,explanation:`通分或化成小数比较，较大的是 ${ans}。`,trap:'不能只看分子或只看分母。'});
  });

  [[2,5,19],[3,8,35],[4,7,43],[5,6,41],[6,9,75],[7,4,39],[8,5,77],[9,3,66],[4,11,59],[6,13,85],[7,12,82],[9,15,123],[5,17,92],[8,14,118],[6,21,135],[11,9,130],[12,7,151],[13,5,161],[14,8,190],[15,10,205]].forEach((p,i)=>{
    const ans=(p[2]-p[1])/p[0];
    pushExercise({id:`bank-eq-${i+1}`,module:'简易方程',difficulty:i<8?'基础':'提高',title:'简易方程',question:`解方程：${p[0]}x + ${p[1]} = ${p[2]}。x = ?`,answer:String(ans),explanation:`${p[0]}x=${p[2]-p[1]}，x=${ans}。`,trap:'先移加减，再除以系数。'});
  });

  [[4,3,2],[5,4,3],[6,5,2],[8,6,3],[10,7,4],[12,8,5],[7,5,4],[9,7,5],[11,8,6],[13,9,4]].forEach((p,i)=>{
    const v=p[0]*p[1]*p[2]; const s=2*(p[0]*p[1]+p[0]*p[2]+p[1]*p[2]); const open=p[0]*p[1]+2*p[0]*p[2]+2*p[1]*p[2];
    pushExercise({id:`bank-cube-v-${i+1}`,module:'长方体正方体',difficulty:'基础',title:'体积计算',question:`长方体长 ${p[0]} cm，宽 ${p[1]} cm，高 ${p[2]} cm，体积是多少？`,answer:String(v),explanation:`体积=长×宽×高=${v} cm³。`,trap:'体积单位是立方单位。'});
    pushExercise({id:`bank-cube-s-${i+1}`,module:'长方体正方体',difficulty:'提高',title:'表面积计算',question:`长方体长 ${p[0]} cm，宽 ${p[1]} cm，高 ${p[2]} cm，表面积是多少？`,answer:String(s),explanation:`表面积=2×(长×宽+长×高+宽×高)=${s} cm²。`,trap:'表面积是外面六个面的总面积。'});
    pushExercise({id:`bank-cube-open-${i+1}`,module:'长方体正方体',difficulty:'提高',title:'无盖盒子',question:`做无盖长方体盒子，长 ${p[0]} dm，宽 ${p[1]} dm，高 ${p[2]} dm，需要多少平方分米材料？`,answer:String(open),explanation:`无盖=底面+四个侧面，结果 ${open}。`,trap:'无盖少算上面。'});
  });
  [[1.5,1500],[2.4,2400],[3.2,3200],[0.8,800],[4.05,4050],[6.7,6700],[9.01,9010],[0.36,360],[12.5,12500],[0.075,75]].forEach((p,i)=>{
    pushExercise({id:`bank-unit-${i+1}`,module:'长方体正方体',difficulty:'基础',title:'容积单位换算',question:`${p[0]} L 等于多少 mL？`,answer:String(p[1]),explanation:`1L=1000mL，所以答案是 ${p[1]}。`,trap:'容积单位 L 到 mL 乘 1000。'});
  });

  [[48,3,4],[64,5,8],[72,2,3],[96,7,12],[150,3,5],[180,4,9],[240,5,6],[360,7,10],[420,2,7],[560,3,8],[720,5,9],[840,7,12],[960,11,16],[1080,5,18],[1260,4,15],[1440,7,24],[1680,3,10],[1920,5,12],[2160,2,9],[2400,7,20]].forEach((p,i)=>{
    const ans=p[0]*p[1]/p[2];
    pushExercise({id:`bank-mul-${i+1}`,module:'分数乘法',difficulty:i<10?'基础':'提高',title:'求一个数的几分之几',question:`${p[0]} 的 ${p[1]}/${p[2]} 是多少？`,answer:String(ans),explanation:`求一个数的几分之几，用乘法：${p[0]}×${p[1]}/${p[2]}=${ans}。`,trap:'看到“的几分之几”，优先想到乘法。'});
  });
  [[36,1,3,1,4],[60,2,5,1,3],[84,3,7,1,2],[96,1,4,2,5],[120,3,8,2,3],[150,2,5,3,10],[180,1,6,5,12],[240,5,8,1,5]].forEach((p,i)=>{
    const remain=p[0]*(1-p[1]/p[2]); const ans=remain*p[3]/p[4];
    pushExercise({id:`bank-mul-chain-${i+1}`,module:'分数乘法',difficulty:'挑战',title:'连续求几分之几',question:`一根绳子长 ${p[0]} m，第一次用去 ${p[1]}/${p[2]}，第二次用去剩下的 ${p[3]}/${p[4]}，第二次用去多少米？`,answer:String(ans),explanation:`第一次后剩下 ${remain} m，第二次用去 ${remain}×${p[3]}/${p[4]}=${ans} m。`,trap:'“剩下的”说明单位1变了。'});
  });

  [[30,4,5],[42,2,7],[56,3,8],[63,5,9],[84,7,12],[99,2,11],[125,3,5],[144,5,6],[162,3,4],[180,5,8],[210,7,10],[240,4,9],[270,3,5],[315,7,12],[360,9,16],[420,5,14],[480,8,15],[540,9,20],[600,4,25],[660,11,30]].forEach((p,i)=>{
    const ans=p[0]/p[1]*p[2];
    pushExercise({id:`bank-div-whole-${i+1}`,module:'分数除法',difficulty:i<10?'基础':'提高',title:'已知分率求整体',question:`一个数的 ${p[1]}/${p[2]} 是 ${p[0]}，这个数是多少？`,answer:String(ans),explanation:`对应量÷对应分率=${p[0]}÷${p[1]}/${p[2]}=${ans}。`,trap:'已知部分求整体，用除法。'});
  });
  [[3,4,2,5],[5,6,3,7],[7,8,4,9],[9,10,3,5],[11,12,5,6],[13,15,2,3],[15,16,5,8],[17,20,7,10]].forEach((p,i)=>{
    const ans=frac(p[0]*p[3],p[1]*p[2]);
    pushExercise({id:`bank-div-calc-${i+1}`,module:'分数除法',difficulty:'基础',title:'分数除法计算',question:`计算：${p[0]}/${p[1]} ÷ ${p[2]}/${p[3]}。`,answer:ans,explanation:`除以一个分数，等于乘它的倒数，结果 ${ans}。`,trap:'只倒除数，不倒被除数。'});
  });

  [[12,18],[20,30],[24,36],[28,42],[32,48],[45,60],[54,72],[63,84],[72,96],[81,108],[90,120],[105,135],[120,180],[144,192],[168,224],[180,240],[198,264],[210,280],[225,300],[240,320]].forEach((p,i)=>{
    const g=gcd(p[0],p[1]);
    pushExercise({id:`bank-ratio-simple-${i+1}`,module:'比',difficulty:i<12?'基础':'提高',title:'化简比',question:`把 ${p[0]}:${p[1]} 化成最简整数比。`,answer:`${p[0]/g}:${p[1]/g}`,explanation:`同时除以最大公因数 ${g}，得到 ${p[0]/g}:${p[1]/g}。`,trap:'化简比的结果仍是比。'});
  });
  [[2,3,100],[3,5,160],[4,7,220],[5,6,330],[7,8,450],[2,5,280],[5,9,420],[6,7,520],[8,9,680],[9,11,800]].forEach((p,i)=>{
    const each=p[2]/(p[0]+p[1]); const ans=p[0]*each;
    pushExercise({id:`bank-ratio-share-${i+1}`,module:'比',difficulty:'提高',title:'按比分配',question:`甲、乙按 ${p[0]}:${p[1]} 分 ${p[2]} 元，甲分多少元？`,answer:String(ans),explanation:`总份数 ${p[0]+p[1]}，每份 ${each}，甲 ${p[0]} 份=${ans}。`,trap:'先求总份数和每份量。'});
  });

  [[0.25,'25%'],[0.4,'40%'],[0.625,'62.5%'],[0.75,'75%'],[1.2,'120%'],[0.08,'8%'],[0.125,'12.5%'],[0.05,'5%'],[0.375,'37.5%'],[0.875,'87.5%']].forEach((p,i)=>{
    pushExercise({id:`bank-percent-conv-${i+1}`,module:'百分数',difficulty:'基础',title:'小数化百分数',question:`把 ${p[0]} 化成百分数。`,answer:p[1],accepted:[p[1],p[1].replace('%','')],explanation:`小数点向右移动两位，加百分号：${p[0]}=${p[1]}。`,trap:'百分号不要漏。'});
  });
  [[25,40],[36,45],[42,60],[51,75],[68,80],[72,90],[81,100],[96,120],[114,150],[136,160]].forEach((p,i)=>{
    const rate=p[0]/p[1]*100;
    pushExercise({id:`bank-percent-rate-${i+1}`,module:'百分数',difficulty:'提高',title:'百分率',question:`一共 ${p[1]} 题，做对 ${p[0]} 题，正确率是多少？`,answer:`${rate}%`,accepted:[`${rate}%`,String(rate)],explanation:`正确率=${p[0]}÷${p[1]}×100%=${rate}%。`,trap:'标准量是总题数。'});
  });
  [[80,100],[120,150],[160,200],[90,120],[75,100],[180,240],[200,260],[240,300],[300,360],[500,650]].forEach((p,i)=>{
    const rate=(p[1]-p[0])/p[0]*100;
    pushExercise({id:`bank-percent-grow-${i+1}`,module:'百分数',difficulty:'挑战',title:'增长率',question:`从 ${p[0]} 增加到 ${p[1]}，增长了百分之几？`,answer:`${rate}%`,accepted:[`${rate}%`,String(rate)],explanation:`增长率=增加量÷原来量×100%=${p[1]-p[0]}÷${p[0]}×100%=${rate}%。`,trap:'增长率看原来量。'});
  });

  [[12,8],[15,11],[18,14],[20,16],[23,19],[26,24],[30,27],[35,31],[42,38],[50,45],[16,22],[19,25],[24,28],[31,33],[37,44],[45,50]].forEach((p,i)=>{
    pushExercise({id:`bank-stat-sum-${i+1}`,module:'统计与概率',difficulty:i<10?'基础':'提高',title:'统计表合计',question:`男生有 ${p[0]} 人选择篮球，女生有 ${p[1]} 人选择篮球，一共有多少人选择篮球？`,answer:String(p[0]+p[1]),explanation:`同一项目合计：${p[0]}+${p[1]}=${p[0]+p[1]}。`,trap:'统计题先看清行列。'});
  });

  [[45,1,4],[60,2,5],[72,3,8],[90,1,3],[120,3,5],[150,2,5],[180,5,9],[240,7,12],[300,1,4],[420,3,7],[560,2,7],[720,5,8]].forEach((p,i)=>{
    const remainFracNum=p[2]-p[1]; const remain=p[0]; const whole=remain*p[2]/remainFracNum;
    pushExercise({id:`bank-strategy-remain-${i+1}`,module:'解决问题策略',difficulty:i<6?'提高':'挑战',title:'剩下对应量',question:`一袋大米用去 ${p[1]}/${p[2]} 后还剩 ${p[0]} kg，原来有多少 kg？`,answer:String(whole),explanation:`剩下 ${remainFracNum}/${p[2]} 对应 ${remain}kg，整体=${remain}÷${remainFracNum}/${p[2]}=${whole}kg。`,trap:'先找剩下对应的分率。'});
  });
}

function renderBridge() {
  const blocks = DATA.learningBlocks.map(block => `
    <article class="card block-card ${block.color}"><div class="block-icon">${block.icon}</div><h3>${block.name}</h3><p>${block.summary}</p><div class="card-tags">${block.units.map(u => `<span class="badge">${u}</span>`).join('')}</div></article>
  `).join('');
  const analysis = DATA.bridgeAnalysis.map(item => `<article class="card"><h3>${item.title}</h3><p>${item.body}</p></article>`).join('');
  $('#bridgeCards').innerHTML = blocks + analysis;
}
function renderPlan() {
  $('#weeklyPlan').innerHTML = DATA.weeklyPlan.map(item => `<article class="card week-card"><div class="week-num">第${item.week}周</div><div><h3>${item.title}</h3><p><strong>学习重点：</strong>${item.focus}</p><p><strong>达成目标：</strong>${item.outcome}</p></div></article>`).join('');
}
function renderKnowledgeMap() {
  const grouped = DATA.knowledgeMap.reduce((acc, item) => { (acc[item.module] ||= []).push(item); return acc; }, {});
  $('#knowledgeMap').innerHTML = Object.entries(grouped).map(([module, items]) => `<div class="map-group"><h3>${module}</h3><div class="map-group-grid">${items.map(renderKnowledgeCard).join('')}</div></div>`).join('');
  $$('[data-knowledge]').forEach(input => input.addEventListener('change', e => {
    const id = e.target.dataset.knowledge;
    state.completedKnowledge = e.target.checked ? unique([...state.completedKnowledge, id]) : state.completedKnowledge.filter(x => x !== id);
    save();
  }));
}
function renderKnowledgeCard(item) {
  const checked = state.completedKnowledge.includes(item.id) ? 'checked' : '';
  return `<article class="card knowledge-card"><div class="card-tags"><span class="badge">${item.module}</span><span class="badge difficulty ${item.difficulty >= 4 ? 'hard' : ''}">难度 ${difficultyStars(item.difficulty)}</span><span class="badge">${item.level}</span></div><h3>${item.name}</h3><p class="connection">${item.connection}</p><p><strong>前置：</strong>${item.prerequisites.join('、')}</p><p><strong>通向：</strong>${item.next.join('、')}</p><div class="card-tags">${item.keywords.map(k => `<span class="badge">${k}</span>`).join('')}</div><strong>自查清单</strong><ul class="checklist">${item.checkpoints.map(c => `<li>${c}</li>`).join('')}</ul><label class="done-check"><input type="checkbox" data-knowledge="${item.id}" ${checked}> 我已掌握这一块</label></article>`;
}
function renderUnitFormulaCards() {
  if ($('#unitCards')) return;
  const section = document.createElement('section');
  section.className = 'section';
  section.id = 'unitCards';
  const grouped = DATA.formulas.reduce((acc, row) => { (acc[row.module] ||= []).push(row); return acc; }, {});
  section.innerHTML = `<h2>单元核心概念速查卡</h2><p class="section-desc">每个单元一张速查卡：先看一句话解释，再看公式和例子。</p><div class="grid two">${Object.entries(grouped).map(([module, rows]) => `<article class="card unit-card"><span class="badge">${module}</span><h3>${module}核心卡</h3>${rows.slice(0,5).map(r => `<p><strong>${r.concept}：</strong>${r.note}<br><span class="muted small">${r.formula}；例：${r.example || ''}</span></p>`).join('')}</article>`).join('')}</div>`;
  $('#formulas').insertAdjacentElement('beforebegin', section);
}
function renderFormulas() {
  $('#formulaBody').innerHTML = DATA.formulas.map(row => `<tr><td>${row.module}</td><td><strong>${row.concept}</strong></td><td>${row.formula}</td><td><span class="badge">${row.must}</span></td><td>${row.note}<br><span class="small muted">例：${row.example || ''}</span></td></tr>`).join('');
}
function renderTodayTasks() {
  if ($('#todayTasks')) return;
  const section = document.createElement('section');
  section.className = 'section';
  section.id = 'todayTasks';
  section.innerHTML = `<h2>今日任务</h2><p class="section-desc">按时间选择任务，适合暑假每天打卡。</p><div class="grid three"><article class="card task-card"><h3>10 分钟快练</h3><p>8 道基础题，保持手感。</p><button class="btn" data-task="light">开始</button></article><article class="card task-card"><h3>20 分钟标准练</h3><p>12 道基础+提高题，最推荐。</p><button class="btn" data-task="normal">开始</button></article><article class="card task-card"><h3>40 分钟深度练</h3><p>20 道混合题，含挑战题和错题复盘。</p><button class="btn" data-task="deep">开始</button></article></div>`;
  $('#progress').insertAdjacentElement('afterend', section);
  $$('[data-task]').forEach(btn => btn.addEventListener('click', () => drawTodayTask(btn.dataset.task)));
}
function drawTodayTask(mode) {
  const all = DATA.exercises;
  let list;
  if (mode === 'light') list = shuffle(all.filter(x => x.difficulty === '基础')).slice(0, 8);
  else if (mode === 'normal') list = shuffle(all.filter(x => x.difficulty !== '挑战')).slice(0, 12);
  else {
    const wrong = Object.keys(state.wrongExercises).map(id => all.find(x => x.id === id)).filter(Boolean);
    list = [...shuffle(wrong).slice(0, 5), ...shuffle(all).slice(0, 15)];
  }
  renderExercises(list);
  $('#practice').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function populateFilters() {
  const modules = ['全部', ...unique(DATA.exercises.map(x => x.module))];
  $('#moduleFilter').innerHTML = modules.map(m => `<option value="${m}">${m}</option>`).join('');
  $('#difficultyFilter').innerHTML = ['全部','基础','提高','挑战'].map(d => `<option value="${d}">${d}</option>`).join('');
  $('#moduleFilter').value = state.lastModule || '全部';
  $('#difficultyFilter').value = state.lastDifficulty || '全部';
}
function getFilteredExercises() {
  const module = $('#moduleFilter').value;
  const difficulty = $('#difficultyFilter').value;
  state.lastModule = module; state.lastDifficulty = difficulty; window.MathBridgeStorage.save(state);
  return DATA.exercises.filter(item => (module === '全部' || item.module === module) && (difficulty === '全部' || item.difficulty === difficulty));
}
function renderExercises(list = getFilteredExercises()) {
  currentExerciseList = list;
  $('#exerciseCount').textContent = `${list.length} 道题库题`;
  $('#exerciseList').innerHTML = list.length ? list.map((item, index) => renderExerciseCard(item, index)).join('') : '<article class="card"><h3>暂无题目</h3><p>当前筛选条件下没有题，换个板块或难度试试。</p></article>';
  bindExerciseEvents(); updateBatchScore();
}
function renderExerciseCard(item, index) {
  const solved = state.solvedExercises[item.id] ? '<span class="badge">已做对</span>' : '';
  const wrong = state.wrongExercises[item.id] ? '<span class="badge hard">错题</span>' : '';
  return `<article class="card exercise-card" data-card="${item.id}"><div class="card-tags"><span class="badge">第${index + 1}题</span><span class="badge">${item.module}</span><span class="badge difficulty ${item.difficulty === '挑战' ? 'hard' : ''}">${item.difficulty}</span>${solved}${wrong}</div><h3>${item.title}</h3><div class="question">${item.question}</div><div class="answer-row"><input class="answer-input" data-input="${item.id}" placeholder="输入答案，如 3/4、85%、120"><button class="btn" data-check="${item.id}">核对答案</button></div><div class="feedback" id="feedback-${item.id}"></div><button class="btn secondary compact" data-show-answer="${item.id}">显示讲解</button><div class="answer-box" id="answer-${item.id}"><p><strong>答案：</strong>${item.answer}</p><p><strong>讲解：</strong>${item.explanation}</p>${item.trap ? `<p><strong>避坑：</strong>${item.trap}</p>` : ''}</div><div class="exercise-actions"><button class="btn secondary" data-right="${item.id}">我做对了</button><button class="btn warning" data-wrong="${item.id}">加入错题</button></div></article>`;
}
function bindExerciseEvents() {
  $$('[data-show-answer]').forEach(btn => btn.addEventListener('click', () => $(`#answer-${btn.dataset.showAnswer}`).classList.toggle('show')));
  $$('[data-check]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.check, item = DATA.exercises.find(x => x.id === id), input = $(`[data-input="${id}"]`).value, feedback = $(`#feedback-${id}`);
    markToday();
    if (isCorrect(input, item)) { state.solvedExercises[id] = true; delete state.wrongExercises[id]; feedback.className = 'feedback ok'; feedback.textContent = '回答正确！'; }
    else { state.wrongExercises[id] = true; feedback.className = 'feedback bad'; feedback.textContent = `还不对。正确答案：${item.answer}`; $(`#answer-${id}`).classList.add('show'); }
    save(); updateBatchScore();
  }));
  $$('[data-right]').forEach(btn => btn.addEventListener('click', () => { state.solvedExercises[btn.dataset.right] = true; delete state.wrongExercises[btn.dataset.right]; markToday(); save(); renderExercises(currentExerciseList); }));
  $$('[data-wrong]').forEach(btn => btn.addEventListener('click', () => { state.wrongExercises[btn.dataset.wrong] = true; markToday(); save(); renderExercises(currentExerciseList); }));
}
function updateBatchScore() {
  const right = currentExerciseList.filter(item => state.solvedExercises[item.id]).length;
  const wrong = currentExerciseList.filter(item => state.wrongExercises[item.id] && !state.solvedExercises[item.id]).length;
  const label = $('#batchScore'); if (label) label.textContent = `本组：正确 ${right}/${currentExerciseList.length}，错题 ${wrong}`;
}
function drawRandomExercise() { const list = getFilteredExercises(); if (list.length) renderExercises([shuffle(list)[0]]); }
function drawBatch(count = 10) { renderExercises(shuffle(getFilteredExercises()).slice(0, count)); $('#practice').scrollIntoView({ behavior:'smooth', block:'start' }); }
function drawWrongBook() {
  const ids = Object.keys(state.wrongExercises).filter(id => !state.solvedExercises[id]);
  const list = ids.map(id => DATA.exercises.find(x => x.id === id)).filter(Boolean);
  renderExercises(list.length ? list : []);
  $('#practice').scrollIntoView({ behavior:'smooth', block:'start' });
}
function renderLifeCases() { $('#lifeCases').innerHTML = DATA.lifeCases.map(item => `<article class="card life-card"><div class="scene">${item.module} · ${item.scene}</div><h3>${item.story}</h3><p><strong>数学表达：</strong>${item.math}</p><p><strong>孩子要明白：</strong>${item.takeaway}</p></article>`).join(''); }
function renderPitfalls() { const target = $('#pitfallList') || $('#pitfalls .grid') || $('#pitfalls'); target.innerHTML = DATA.pitfalls.map(item => `<article class="card pitfall-card"><span class="badge hard">${item.module}</span><h3>${item.title}</h3><p class="wrong"><strong>错误示范：</strong>${item.wrong}</p><p class="correct"><strong>正确做法：</strong>${item.correct}</p><p class="tip">${item.tip}</p></article>`).join(''); }
function renderProgress() {
  const knowledgeDone = state.completedKnowledge.length, knowledgeTotal = DATA.knowledgeMap.length, solved = Object.keys(state.solvedExercises).length, wrong = Object.keys(state.wrongExercises).filter(id => !state.solvedExercises[id]).length, days = Object.keys(state.studyDays).length;
  const percent = Math.min(100, Math.round(((knowledgeDone + solved) / (knowledgeTotal + Math.min(DATA.exercises.length, 120))) * 100));
  $('#progressText').textContent = `${percent}%`; $('#progressBar').style.width = `${percent}%`;
  $('#dashboard').innerHTML = `<article class="card stat-card"><h3>${knowledgeDone}/${knowledgeTotal}</h3><p>知识点已掌握</p></article><article class="card stat-card"><h3>${solved}</h3><p>累计做对题目</p></article><article class="card stat-card"><h3>${wrong}</h3><p>当前错题数</p></article><article class="card stat-card"><h3>${days}</h3><p>累计学习天数</p></article>`;
}
function bindEvents() {
  $('#moduleFilter').addEventListener('change', () => renderExercises());
  $('#difficultyFilter').addEventListener('change', () => renderExercises());
  $('#randomBtn').addEventListener('click', drawRandomExercise);
  if (!$('#batchBtn')) { const b=document.createElement('button'); b.className='btn'; b.id='batchBtn'; b.textContent='随机抽 10 题'; b.onclick=()=>drawBatch(10); $('#randomBtn').after(b); }
  if (!$('#wrongBookBtn')) { const b=document.createElement('button'); b.className='btn warning'; b.id='wrongBookBtn'; b.textContent='错题本模式'; b.onclick=drawWrongBook; $('#batchBtn').after(b); }
  if (!$('#batchScore')) { const s=document.createElement('span'); s.className='badge score-badge'; s.id='batchScore'; s.textContent='本组：正确 0/0，错题 0'; $('.filters').appendChild(s); }
  $('#printBtn').addEventListener('click', () => window.print());
  $('#resetBtn').addEventListener('click', () => { if (confirm('确定清空本地学习进度吗？')) { state = window.MathBridgeStorage.reset(); location.reload(); } });
  $('#notes').value = state.notes || ''; $('#notes').addEventListener('input', e => { state.notes = e.target.value; window.MathBridgeStorage.save(state); });
}
function init() {
  addLargeExerciseBank(); renderBridge(); renderTodayTasks(); renderPlan(); renderKnowledgeMap(); renderUnitFormulaCards(); renderFormulas(); populateFilters(); renderExercises(shuffle(getFilteredExercises()).slice(0, 10)); renderLifeCases(); renderPitfalls(); renderProgress(); bindEvents();
}
init();
