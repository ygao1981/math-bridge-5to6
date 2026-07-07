const DATA = window.MATH_BRIDGE_DATA;
let state = window.MathBridgeStorage.load();
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function save() {
  window.MathBridgeStorage.save(state);
  renderProgress();
}
function difficultyStars(n) { return '★'.repeat(n) + '☆'.repeat(Math.max(0, 5 - n)); }
function unique(list) { return [...new Set(list)]; }

function renderBridge() {
  $('#bridgeCards').innerHTML = DATA.bridgeAnalysis.map(item => `
    <article class="card"><h3>${item.title}</h3><p>${item.body}</p></article>
  `).join('');
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
  $('#knowledgeMap').innerHTML = DATA.knowledgeMap.map(item => {
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
        <label class="small"><input type="checkbox" data-knowledge="${item.id}" ${checked}> 我已掌握这一块</label>
      </article>`;
  }).join('');
  $$('[data-knowledge]').forEach(input => {
    input.addEventListener('change', (event) => {
      const id = event.target.dataset.knowledge;
      state.completedKnowledge = event.target.checked ? unique([...state.completedKnowledge, id]) : state.completedKnowledge.filter(x => x !== id);
      save();
    });
  });
}
function renderFormulas() {
  $('#formulaBody').innerHTML = DATA.formulas.map(row => `
    <tr><td>${row.module}</td><td><strong>${row.concept}</strong></td><td>${row.formula}</td><td><span class="badge">${row.must}</span></td><td>${row.note}</td></tr>
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
  $('#exerciseCount').textContent = `${list.length} 道题`;
  $('#exerciseList').innerHTML = list.map(item => {
    const solved = state.solvedExercises[item.id] ? '<span class="badge">已做对</span>' : '';
    const wrong = state.wrongExercises[item.id] ? '<span class="badge hard">错题</span>' : '';
    return `
      <article class="card exercise-card">
        <div class="card-tags"><span class="badge">${item.module}</span><span class="badge difficulty ${item.difficulty === '挑战' ? 'hard' : ''}">${item.difficulty}</span>${solved}${wrong}</div>
        <h3>${item.title}</h3>
        <div class="question">${item.question}</div>
        <button class="btn secondary" data-show-answer="${item.id}">显示答案与讲解</button>
        <div class="answer-box" id="answer-${item.id}"><p><strong>答案：</strong>${item.answer}</p><p><strong>讲解：</strong>${item.explanation}</p></div>
        <div class="exercise-actions"><button class="btn" data-right="${item.id}">我做对了</button><button class="btn warning" data-wrong="${item.id}">加入错题</button></div>
      </article>`;
  }).join('');
  $$('[data-show-answer]').forEach(btn => btn.addEventListener('click', () => $(`#answer-${btn.dataset.showAnswer}`).classList.toggle('show')));
  $$('[data-right]').forEach(btn => btn.addEventListener('click', () => {
    state.solvedExercises[btn.dataset.right] = true;
    delete state.wrongExercises[btn.dataset.right];
    markToday(); save(); renderExercises();
  }));
  $$('[data-wrong]').forEach(btn => btn.addEventListener('click', () => {
    state.wrongExercises[btn.dataset.wrong] = true;
    markToday(); save(); renderExercises();
  }));
}
function drawRandomExercise() {
  const list = getFilteredExercises();
  if (!list.length) return;
  renderExercises([list[Math.floor(Math.random() * list.length)]]);
}
function renderLifeCases() {
  $('#lifeCases').innerHTML = DATA.lifeCases.map(item => `
    <article class="card life-card"><div class="scene">${item.module} · ${item.scene}</div><h3>${item.story}</h3><p><strong>数学表达：</strong>${item.math}</p><p><strong>孩子要明白：</strong>${item.takeaway}</p></article>
  `).join('');
}
function renderPitfalls() {
  $('#pitfalls').innerHTML = DATA.pitfalls.map(item => `
    <article class="card pitfall-card"><span class="badge hard">${item.module}</span><h3>${item.title}</h3><p class="wrong"><strong>错误示范：</strong>${item.wrong}</p><p class="correct"><strong>正确做法：</strong>${item.correct}</p><p class="tip">${item.tip}</p></article>
  `).join('');
}
function markToday() {
  const today = new Date().toISOString().slice(0, 10);
  state.studyDays[today] = true;
}
function renderProgress() {
  const knowledgeDone = state.completedKnowledge.length;
  const knowledgeTotal = DATA.knowledgeMap.length;
  const solved = Object.keys(state.solvedExercises).length;
  const wrong = Object.keys(state.wrongExercises).length;
  const days = Object.keys(state.studyDays).length;
  const percent = Math.round(((knowledgeDone + solved) / (knowledgeTotal + DATA.exercises.length)) * 100);
  $('#progressText').textContent = `${percent}%`;
  $('#progressBar').style.width = `${percent}%`;
  $('#dashboard').innerHTML = `
    <article class="card"><h3>${knowledgeDone}/${knowledgeTotal}</h3><p>知识点已掌握</p></article>
    <article class="card"><h3>${solved}</h3><p>已做对题目</p></article>
    <article class="card"><h3>${wrong}</h3><p>当前错题数</p></article>
    <article class="card"><h3>${days}</h3><p>累计学习天数</p></article>`;
}
function bindEvents() {
  $('#moduleFilter').addEventListener('change', () => renderExercises());
  $('#difficultyFilter').addEventListener('change', () => renderExercises());
  $('#randomBtn').addEventListener('click', drawRandomExercise);
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
  renderBridge(); renderPlan(); renderKnowledgeMap(); renderFormulas(); populateFilters(); renderExercises(); renderLifeCases(); renderPitfalls(); renderProgress(); bindEvents();
}
init();
