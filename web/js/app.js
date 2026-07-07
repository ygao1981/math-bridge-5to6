const DATA = window.MATH_BRIDGE_DATA;
let state = window.MathBridgeStorage.load();
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
let currentExerciseList = [];

function addExtraExercises() {
  if (!DATA || DATA.__extraAdded) return;
  DATA.__extraAdded = true;
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const push = (item) => DATA.exercises.push({
    id: item.id,
    module: item.module,
    unit: item.unit || item.module,
    difficulty: item.difficulty,
    title: item.title,
    question: item.question,
    answer: item.answer,
    accepted: item.accepted || [item.answer],
    explanation: item.explanation,
    trap: item.trap || '',
    source: '原创模板生成题'
  });
  [[1.5,1500],[2.4,2400],[3.2,3200],[0.8,800],[4.05,4050],[6.7,6700],[9.01,9010],[0.36,360]].forEach((p,i)=>push({id:`extra-unit-l-${i+1}`,module:'长方体正方体',difficulty:'基础',title:'容积单位换算',question:`${p[0]} L 等于多少 mL？`,answer:String(p[1]),explanation:`1 L = 1000 mL，所以 ${p[0]} L = ${p[1]} mL。`,trap:'L 到 mL 要乘 1000。'}));
  [[5,4,3],[8,5,4],[10,6,5],[12,8,6],[7,5,4],[9,7,5]].forEach((p,i)=>{const ans=p[0]*p[1]+2*p[0]*p[2]+2*p[1]*p[2];push({id:`extra-open-box-${i+1}`,module:'长方体正方体',difficulty:'提高',title:'无盖盒子表面积',question:`做一个无盖长方体盒子，长 ${p[0]} dm，宽 ${p[1]} dm，高 ${p[2]} dm，需要材料多少平方分米？`,answer:String(ans),explanation:`无盖盒子=底面+四个侧面，结果是 ${ans} 平方分米。`,trap:'无盖少算上面。'});});
  [[2,5,3,10],[4,9,5,12],[5,6,7,9],[3,8,4,11],[7,12,5,8],[9,14,2,3],[11,18,3,5],[13,20,5,8]].forEach((p,i)=>{const ans=p[0]/p[1]>p[2]/p[3]?`${p[0]}/${p[1]}`:`${p[2]}/${p[3]}`;push({id:`extra-frac-compare-${i+1}`,module:'分数基础',difficulty:'提高',title:'分数大小比较',question:`比较 ${p[0]}/${p[1]} 和 ${p[2]}/${p[3]}，哪个更大？`,answer:ans,explanation:`可以通分比较，也可以化成小数比较。较大的是 ${ans}。`,trap:'不能只看分子或分母。'});});
  [[0.25,'25%'],[0.4,'40%'],[0.625,'62.5%'],[0.75,'75%'],[1.2,'120%'],[0.08,'8%'],[0.125,'12.5%'],[0.05,'5%']].forEach((p,i)=>push({id:`extra-percent-conv-${i+1}`,module:'百分数',difficulty:'基础',title:'小数化百分数',question:`把 ${p[0]} 化成百分数。`,answer:p[1],accepted:[p[1],p[1].replace('%','')],explanation:`小数化百分数，小数点向右移动两位，加百分号：${p[0]}=${p[1]}。`,trap:'百分号不要漏。'}));
  [[6,8],[9,12],[15,20],[21,28],[24,30],[35,42],[48,60],[54,81]].forEach((p,i)=>{const a=p[0]/gcd(p[0],p[1]),b=p[1]/gcd(p[0],p[1]);push({id:`extra-ratio-value-${i+1}`,module:'比',difficulty:'基础',title:'比值与化简比',question:`把 ${p[0]}:${p[1]} 化简成最简整数比。`,answer:`${a}:${b}`,explanation:`同时除以最大公因数 ${gcd(p[0],p[1])}，得到 ${a}:${b}。`,trap:'比值是一个数，化简比仍是一个比。'});});
  [[240,3,8],[320,5,8],[180,2,5],[420,5,7],[560,3,4],[720,7,9]].forEach((p,i)=>{const ans=p[0]*p[1]/p[2];push({id:`extra-real-part-${i+1}`,module:'分数乘法',difficulty:'提高',title:'生活中的分数乘法',question:`妈妈买东西花了 ${p[0]} 元，其中 ${p[1]}/${p[2]} 用来买学习用品，学习用品花了多少元？`,answer:String(ans),explanation:`求 ${p[0]} 的 ${p[1]}/${p[2]}，用乘法，结果是 ${ans} 元。`,trap:'“其中几分之几”通常是求部分量。'});});
}

function save() {
  window.MathBridgeStorage.save(state);
  renderProgress();
}
function difficultyStars(n) { return '★'.repeat(n) + '☆'.repeat(Math.max(0, 5 - n)); }
function unique(list) { return [...new Set(list)]; }
function markToday() {
  const today = new Date().toISOString().slice(0, 10);
  state.studyDays[today] = true;
}
function normalizeAnswer(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[，、]/g, ',')
    .replace(/：/g, ':')
    .replace(/％/g, '%')
    .replace(/／/g, '/')
    .replace(/平方厘米|平方分米|平方米|立方厘米|立方分米|立方米|厘米|分米|米|页|人|元|kg|千克|cm³|cm3|dm³|dm3|cm²|cm2|dm²|dm2|%/g, match => match === '%' ? '%' : '');
}
function isCorrect(user, item) {
  const u = normalizeAnswer(user);
  return (item.accepted || [item.answer]).some(ans => normalizeAnswer(ans) === u);
}
function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function renderBridge() {
  const blocks = DATA.learningBlocks.map(block => `
    <article class="card block-card ${block.color}">
      <div class="block-icon">${block.icon}</div>
      <h3>${block.name}</h3>
      <p>${block.summary}</p>
      <div class="card-tags">${block.units.map(u => `<span class="badge">${u}</span>`).join('')}</div>
    </article>
  `).join('');
  const analysis = DATA.bridgeAnalysis.map(item => `
    <article class="card"><h3>${item.title}</h3><p>${item.body}</p></article>
  `).join('');
  $('#bridgeCards').innerHTML = blocks + analysis;
}
function renderPlan() {
  $('#weeklyPlan').innerHTML = DATA.weeklyPlan.map(item => `
    <article class="card week-card">
      <div class="week-num">第${item.week}周</div>
      <div><h3>${item.title}</h3><p><strong>学习重点：</strong>${item.focus}</p><p><strong>达成目标：</strong>${item.outcome}</p></div>
    </article>
  `).join('');
}
function renderKnowledgeMap() {
  const grouped = DATA.knowledgeMap.reduce((acc, item) => {
    acc[item.module] = acc[item.module] || [];
    acc[item.module].push(item);
    return acc;
  }, {});
  $('#knowledgeMap').innerHTML = Object.entries(grouped).map(([module, items]) => `
    <div class="map-group">
      <h3>${module}</h3>
      <div class="map-group-grid">
        ${items.map(item => renderKnowledgeCard(item)).join('')}
      </div>
    </div>
  `).join('');
  $$('[data-knowledge]').forEach(input => {
    input.addEventListener('change', (event) => {
      const id = event.target.dataset.knowledge;
      state.completedKnowledge = event.target.checked ? unique([...state.completedKnowledge, id]) : state.completedKnowledge.filter(x => x !== id);
      save();
    });
  });
}
function renderKnowledgeCard(item) {
  const checked = state.completedKnowledge.includes(item.id) ? 'checked' : '';
  const hardClass = item.difficulty >= 4 ? 'hard' : '';
  return `
    <article class="card knowledge-card">
      <div class="card-tags">
        <span class="badge">${item.module}</span>
        <span class="badge difficulty ${hardClass}">难度 ${difficultyStars(item.difficulty)}</span>
        <span class="badge">${item.level}</span>
      </div>
      <h3>${item.name}</h3>
      <p class="connection">${item.connection}</p>
      <p><strong>前置：</strong>${item.prerequisites.join('、')}</p>
      <p><strong>通向：</strong>${item.next.join('、')}</p>
      <div class="card-tags">${item.keywords.map(k => `<span class="badge">${k}</span>`).join('')}</div>
      <strong>自查清单</strong>
      <ul class="checklist">${item.checkpoints.map(c => `<li>${c}</li>`).join('')}</ul>
      <label class="done-check"><input type="checkbox" data-knowledge="${item.id}" ${checked}> 我已掌握这一块</label>
    </article>`;
}
function renderFormulas() {
  $('#formulaBody').innerHTML = DATA.formulas.map(row => `
    <tr><td>${row.module}</td><td><strong>${row.concept}</strong></td><td>${row.formula}</td><td><span class="badge">${row.must}</span></td><td>${row.note}<br><span class="small muted">例：${row.example || ''}</span></td></tr>
  `).join('');
}
function populateFilters() {
  const modules = ['全部', ...unique(DATA.exercises.map(x => x.module))];
  const difficulties = ['全部', '基础', '提高', '挑战'];
  $('#moduleFilter').innerHTML = modules.map(m => `<option value="${m}">${m}</option>`).join('');
  $('#difficultyFilter').innerHTML = difficulties.map(d => `<option value="${d}">${d}</option>`).join('');
  $('#moduleFilter').value = state.lastModule || '全部';
  $('#difficultyFilter').value = state.lastDifficulty || '全部';
}
function getFilteredExercises() {
  const module = $('#moduleFilter').value;
  const difficulty = $('#difficultyFilter').value;
  state.lastModule = module;
  state.lastDifficulty = difficulty;
  window.MathBridgeStorage.save(state);
  return DATA.exercises.filter(item => (module === '全部' || item.module === module) && (difficulty === '全部' || item.difficulty === difficulty));
}
function renderExercises(list = getFilteredExercises()) {
  currentExerciseList = list;
  $('#exerciseCount').textContent = `${list.length} 道题库题`;
  $('#exerciseList').innerHTML = list.map((item, index) => renderExerciseCard(item, index)).join('');
  bindExerciseEvents();
  updateBatchScore();
}
function renderExerciseCard(item, index) {
  const solved = state.solvedExercises[item.id] ? '<span class="badge">已做对</span>' : '';
  const wrong = state.wrongExercises[item.id] ? '<span class="badge hard">错题</span>' : '';
  return `
    <article class="card exercise-card" data-card="${item.id}">
      <div class="exercise-top">
        <div class="card-tags"><span class="badge">第${index + 1}题</span><span class="badge">${item.module}</span><span class="badge difficulty ${item.difficulty === '挑战' ? 'hard' : ''}">${item.difficulty}</span>${solved}${wrong}</div>
      </div>
      <h3>${item.title}</h3>
      <div class="question">${item.question}</div>
      <div class="answer-row">
        <input class="answer-input" data-input="${item.id}" placeholder="输入你的答案，例如 3/4、85%、120">
        <button class="btn" data-check="${item.id}">核对答案</button>
      </div>
      <div class="feedback" id="feedback-${item.id}"></div>
      <button class="btn secondary compact" data-show-answer="${item.id}">显示讲解</button>
      <div class="answer-box" id="answer-${item.id}"><p><strong>答案：</strong>${item.answer}</p><p><strong>讲解：</strong>${item.explanation}</p>${item.trap ? `<p><strong>避坑：</strong>${item.trap}</p>` : ''}</div>
      <div class="exercise-actions"><button class="btn secondary" data-right="${item.id}">我做对了</button><button class="btn warning" data-wrong="${item.id}">加入错题</button></div>
    </article>`;
}
function bindExerciseEvents() {
  $$('[data-show-answer]').forEach(btn => btn.addEventListener('click', () => $(`#answer-${btn.dataset.showAnswer}`).classList.toggle('show')));
  $$('[data-check]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.check;
    const item = DATA.exercises.find(x => x.id === id);
    const input = $(`[data-input="${id}"]`).value;
    const feedback = $(`#feedback-${id}`);
    markToday();
    if (isCorrect(input, item)) {
      state.solvedExercises[id] = true;
      delete state.wrongExercises[id];
      feedback.className = 'feedback ok';
      feedback.textContent = '回答正确！';
    } else {
      state.wrongExercises[id] = true;
      feedback.className = 'feedback bad';
      feedback.textContent = `还不对。正确答案：${item.answer}`;
      $(`#answer-${id}`).classList.add('show');
    }
    save();
    updateBatchScore();
  }));
  $$('[data-right]').forEach(btn => btn.addEventListener('click', () => {
    state.solvedExercises[btn.dataset.right] = true;
    delete state.wrongExercises[btn.dataset.right];
    markToday(); save(); renderExercises(currentExerciseList);
  }));
  $$('[data-wrong]').forEach(btn => btn.addEventListener('click', () => {
    state.wrongExercises[btn.dataset.wrong] = true;
    markToday(); save(); renderExercises(currentExerciseList);
  }));
}
function updateBatchScore() {
  const visible = currentExerciseList;
  const right = visible.filter(item => state.solvedExercises[item.id]).length;
  const wrong = visible.filter(item => state.wrongExercises[item.id] && !state.solvedExercises[item.id]).length;
  const label = document.querySelector('#batchScore');
  if (label) label.textContent = `本组：正确 ${right}/${visible.length}，错题 ${wrong}`;
}
function drawRandomExercise() {
  const list = getFilteredExercises();
  if (!list.length) return;
  renderExercises([list[Math.floor(Math.random() * list.length)]]);
}
function drawBatch(count = 10) {
  const list = getFilteredExercises();
  renderExercises(shuffle(list).slice(0, Math.min(count, list.length)));
  const practice = $('#practice');
  if (practice) practice.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function renderLifeCases() {
  $('#lifeCases').innerHTML = DATA.lifeCases.map(item => `
    <article class="card life-card"><div class="scene">${item.module} · ${item.scene}</div><h3>${item.story}</h3><p><strong>数学表达：</strong>${item.math}</p><p><strong>孩子要明白：</strong>${item.takeaway}</p></article>
  `).join('');
}
function renderPitfalls() {
  const target = document.querySelector('#pitfalls .grid') || document.querySelector('#pitfalls');
  target.innerHTML = DATA.pitfalls.map(item => `
    <article class="card pitfall-card"><span class="badge hard">${item.module}</span><h3>${item.title}</h3><p class="wrong"><strong>错误示范：</strong>${item.wrong}</p><p class="correct"><strong>正确做法：</strong>${item.correct}</p><p class="tip">${item.tip}</p></article>
  `).join('');
}
function renderProgress() {
  const knowledgeDone = state.completedKnowledge.length;
  const knowledgeTotal = DATA.knowledgeMap.length;
  const solved = Object.keys(state.solvedExercises).length;
  const wrong = Object.keys(state.wrongExercises).length;
  const days = Object.keys(state.studyDays).length;
  const percent = Math.min(100, Math.round(((knowledgeDone + solved) / (knowledgeTotal + Math.min(DATA.exercises.length, 80))) * 100));
  $('#progressText').textContent = `${percent}%`;
  $('#progressBar').style.width = `${percent}%`;
  $('#dashboard').innerHTML = `
    <article class="card stat-card"><h3>${knowledgeDone}/${knowledgeTotal}</h3><p>知识点已掌握</p></article>
    <article class="card stat-card"><h3>${solved}</h3><p>累计做对题目</p></article>
    <article class="card stat-card"><h3>${wrong}</h3><p>当前错题数</p></article>
    <article class="card stat-card"><h3>${days}</h3><p>累计学习天数</p></article>`;
}
function bindEvents() {
  $('#moduleFilter').addEventListener('change', () => renderExercises());
  $('#difficultyFilter').addEventListener('change', () => renderExercises());
  $('#randomBtn').addEventListener('click', drawRandomExercise);
  if (!document.querySelector('#batchBtn')) {
    const batchBtn = document.createElement('button');
    batchBtn.className = 'btn';
    batchBtn.id = 'batchBtn';
    batchBtn.textContent = '随机抽 10 题';
    batchBtn.addEventListener('click', () => drawBatch(10));
    $('#randomBtn').insertAdjacentElement('afterend', batchBtn);
  }
  if (!document.querySelector('#batchScore')) {
    const score = document.createElement('span');
    score.className = 'badge score-badge';
    score.id = 'batchScore';
    score.textContent = '本组：正确 0/0，错题 0';
    document.querySelector('.filters').appendChild(score);
  }
  $('#printBtn').addEventListener('click', () => window.print());
  $('#resetBtn').addEventListener('click', () => {
    if (confirm('确定清空本地学习进度吗？')) { state = window.MathBridgeStorage.reset(); location.reload(); }
  });
  $('#notes').value = state.notes || '';
  $('#notes').addEventListener('input', (event) => {
    state.notes = event.target.value;
    window.MathBridgeStorage.save(state);
  });
}
function init() {
  addExtraExercises();
  renderBridge();
  renderPlan();
  renderKnowledgeMap();
  renderFormulas();
  populateFilters();
  renderExercises(shuffle(getFilteredExercises()).slice(0, 10));
  renderLifeCases();
  renderPitfalls();
  renderProgress();
  bindEvents();
}
init();
