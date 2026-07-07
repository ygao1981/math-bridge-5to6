const DATA = window.MATH_BRIDGE_DATA;
let state = window.MathBridgeStorage.load();
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
let currentExerciseList = [];

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
  const batchBtn = document.createElement('button');
  batchBtn.className = 'btn';
  batchBtn.textContent = '随机抽 10 题';
  batchBtn.addEventListener('click', () => drawBatch(10));
  $('#randomBtn').insertAdjacentElement('afterend', batchBtn);
  const score = document.createElement('span');
  score.className = 'badge score-badge';
  score.id = 'batchScore';
  score.textContent = '本组：正确 0/0，错题 0';
  document.querySelector('.filters').appendChild(score);
  $('#printBtn').addEventListener('click', () => window.print());
  $('#resetBtn').addEventListener('click', () => {
    if (confirm('确定清空本地学习进度吗？')) { state = window.MathBridgeStorage.reset(); init(); }
  });
  $('#notes').value = state.notes || '';
  $('#notes').addEventListener('input', (event) => {
    state.notes = event.target.value;
    window.MathBridgeStorage.save(state);
  });
}
function init() {
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
