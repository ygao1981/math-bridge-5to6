window.MATH_BRIDGE_DATA = (() => {
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const reduce = (n, d) => {
    const g = gcd(n, d);
    return [n / g, d / g];
  };
  const frac = (n, d) => {
    const [a, b] = reduce(n, d);
    return b === 1 ? String(a) : `${a}/${b}`;
  };
  const push = (arr, item) => arr.push({
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
    source: item.source || '原创衔接题'
  });

  const exercises = [];

  const coreExercises = [
    { id: 'core-001', module: '分数基础', difficulty: '基础', title: '约分热身', question: '把 18/24 化成最简分数。', answer: '3/4', explanation: '18 和 24 的最大公因数是 6，同时除以 6，得到 3/4。', trap: '结果没有化成最简分数。' },
    { id: 'core-002', module: '分数基础', difficulty: '基础', title: '通分比较', question: '比较 5/8 和 2/3 的大小，哪个更大？', answer: '2/3', accepted: ['2/3', '三分之二'], explanation: '5/8=15/24，2/3=16/24，所以 2/3 更大。', trap: '不能只看分子或只看分母。' },
    { id: 'core-003', module: '分数基础', difficulty: '提高', title: '单位1判断', question: '一根绳子用去 2/5，还剩几分之几？', answer: '3/5', explanation: '整根绳子是单位1，用去 2/5，还剩 1-2/5=3/5。', trap: '单位1是整根绳子，不是用去的部分。' },
    { id: 'core-004', module: '简易方程', difficulty: '基础', title: '列方程', question: '一个数的 3 倍加 8 等于 35，这个数是多少？', answer: '9', explanation: '设这个数为 x，3x+8=35，3x=27，x=9。', trap: '别把“加8”写成乘8。' },
    { id: 'core-005', module: '长方体正方体', difficulty: '基础', title: '体积公式', question: '长方体长 8 cm，宽 5 cm，高 3 cm，体积是多少？', answer: '120', accepted: ['120', '120cm3', '120cm³', '120立方厘米'], explanation: '体积 = 长×宽×高 = 8×5×3 = 120 cm³。', trap: '体积单位是立方单位。' },
    { id: 'core-006', module: '长方体正方体', difficulty: '提高', title: '无盖鱼缸', question: '做一个无盖长方体鱼缸，长 6 dm，宽 4 dm，高 5 dm，至少需要多少平方分米玻璃？', answer: '124', accepted: ['124', '124dm2', '124dm²', '124平方分米'], explanation: '无盖，只算底面和四个侧面：6×4 + 2×6×5 + 2×4×5 = 124 dm²。', trap: '无盖少算上面，不是六个面全算。' },
    { id: 'core-007', module: '长方体正方体', difficulty: '挑战', title: '切开后的表面积', question: '棱长 6 cm 的正方体，从中间切成两个完全一样的长方体，两个长方体表面积总和比原来增加多少平方厘米？', answer: '72', explanation: '切一刀多出两个截面，每个截面 6×6=36 cm²，共增加 72 cm²。', trap: '表面积增加的是两个新截面。' },
    { id: 'core-008', module: '分数乘法', difficulty: '基础', title: '求几分之几', question: '一本书 120 页，已经看了 3/5，已经看了多少页？', answer: '72', explanation: '求 120 的 3/5，用乘法：120×3/5=72 页。', trap: '“的几分之几”一般用乘法。' },
    { id: 'core-009', module: '分数乘法', difficulty: '提高', title: '连续求几分之几', question: '一根绳子长 36 m，第一次用去 1/3，第二次用去剩下的 1/4，第二次用去多少米？', answer: '6', explanation: '第一次后剩下 36×(1-1/3)=24 m，第二次用去 24×1/4=6 m。', trap: '第二次的单位1是“剩下的”，不是原来的 36 m。' },
    { id: 'core-010', module: '分数除法', difficulty: '基础', title: '除以分数', question: '计算：3/4 ÷ 2/5。', answer: '15/8', accepted: ['15/8', '1又7/8'], explanation: '除以 2/5 等于乘 5/2，所以 3/4×5/2=15/8。', trap: '只把除数倒过来，被除数不倒。' },
    { id: 'core-011', module: '分数除法', difficulty: '提高', title: '已知部分求整体', question: '小明看了一本书的 3/5，正好是 90 页，这本书一共有多少页？', answer: '150', explanation: '已知整体的 3/5 是 90，求整体：90÷3/5=150 页。', trap: '不是 90×3/5。' },
    { id: 'core-012', module: '分数除法', difficulty: '挑战', title: '反向推理', question: '一桶油用去 2/5 后还剩 18 kg，这桶油原来有多少 kg？', answer: '30', explanation: '剩下的是 1-2/5=3/5，3/5 对应 18 kg，整体=18÷3/5=30 kg。', trap: '18 kg 对应的是剩下的 3/5。' },
    { id: 'core-013', module: '比', difficulty: '基础', title: '化简比', question: '把 18:24 化成最简整数比。', answer: '3:4', explanation: '18 和 24 同时除以 6，得到 3:4。', trap: '比可以同时除以同一个非零数。' },
    { id: 'core-014', module: '比', difficulty: '提高', title: '按比分配', question: '甲、乙两人按 3:5 分 160 元，甲、乙各分多少元？答案用“甲60乙100”格式。', answer: '甲60乙100', accepted: ['甲60乙100', '60,100', '60 100'], explanation: '总份数 3+5=8，每份 160÷8=20 元，甲 3 份=60 元，乙 5 份=100 元。', trap: '先求总份数，再求一份是多少。' },
    { id: 'core-015', module: '比', difficulty: '挑战', title: '比的变化', question: '甲乙人数比是 4:5，后来甲增加 6 人，乙不变，甲乙人数变成 5:5。原来甲多少人？', answer: '24', explanation: '原来甲比乙少 1 份，增加 6 人后相等，说明 1 份是 6 人，甲原来 4 份=24 人。', trap: '比变化题要抓住“不变的量”。' },
    { id: 'core-016', module: '百分数', difficulty: '基础', title: '小数化百分数', question: '把 0.85 写成百分数。', answer: '85%', accepted: ['85%', '百分之85', '85'], explanation: '小数化百分数，小数点向右移动两位，加百分号。', trap: '百分号不能漏。' },
    { id: 'core-017', module: '百分数', difficulty: '提高', title: '正确率', question: '一次练习共 40 题，做对 34 题，正确率是多少？', answer: '85%', accepted: ['85%', '85'], explanation: '正确率=做对题数÷总题数×100%=34÷40×100%=85%。', trap: '比较量是做对题数，标准量是总题数。' },
    { id: 'core-018', module: '百分数', difficulty: '挑战', title: '增长率', question: '一个班去年有 40 人，今年增加到 50 人。人数增加了百分之几？', answer: '25%', accepted: ['25%', '25'], explanation: '增加了 10 人，相对于去年 40 人比较：10÷40×100%=25%。', trap: '增长率看原来量，不是看今年量。' },
    { id: 'core-019', module: '统计与概率', difficulty: '基础', title: '复式统计表', question: '男生喜欢足球 12 人，女生喜欢足球 8 人，喜欢足球的一共有多少人？', answer: '20', explanation: '同一项目合计：12+8=20 人。', trap: '统计表先看清行和列。' },
    { id: 'core-020', module: '解决问题策略', difficulty: '提高', title: '线段图思维', question: '一袋大米用去 1/4 后还剩 45 kg，原来有多少 kg？', answer: '60', explanation: '剩下 3/4 对应 45 kg，整体=45÷3/4=60 kg。', trap: '先画线段图，标出剩下对应 3/4。' }
  ];
  coreExercises.forEach(item => push(exercises, item));

  const simplifyPairs = [[12,18],[16,24],[21,28],[27,36],[35,49],[42,56],[45,60],[54,72],[30,48],[63,81]];
  simplifyPairs.forEach((p, i) => {
    const ans = frac(p[0], p[1]);
    push(exercises, { id: `gen-frac-s-${i+1}`, module: '分数基础', difficulty: '基础', title: '约分专项', question: `把 ${p[0]}/${p[1]} 化成最简分数。`, answer: ans, explanation: `${p[0]} 和 ${p[1]} 同时除以最大公因数 ${gcd(p[0], p[1])}，得到 ${ans}。`, trap: '答案要化到最简。' });
  });

  [[48,3,4],[64,5,8],[72,2,3],[96,7,12],[150,3,5],[180,4,9],[240,5,6],[360,7,10]].forEach((p, i) => {
    const ans = p[0] * p[1] / p[2];
    push(exercises, { id: `gen-mul-part-${i+1}`, module: '分数乘法', difficulty: i < 3 ? '基础' : '提高', title: '求一个数的几分之几', question: `${p[0]} 的 ${p[1]}/${p[2]} 是多少？`, answer: String(ans), explanation: `求 ${p[0]} 的 ${p[1]}/${p[2]}，用乘法：${p[0]}×${p[1]}/${p[2]}=${ans}。`, trap: '“的几分之几”是乘法。' });
  });

  [[30,4,5],[42,2,7],[56,3,8],[63,5,9],[84,7,12],[99,2,11],[125,3,5],[144,5,6]].forEach((p, i) => {
    const ans = p[0] / p[1] * p[2];
    push(exercises, { id: `gen-div-whole-${i+1}`, module: '分数除法', difficulty: i < 3 ? '基础' : '提高', title: '已知分率求整体', question: `一个数的 ${p[1]}/${p[2]} 是 ${p[0]}，这个数是多少？`, answer: String(ans), explanation: `已知整体的 ${p[1]}/${p[2]} 是 ${p[0]}，求整体：${p[0]}÷${p[1]}/${p[2]}=${ans}。`, trap: '已知部分求整体，用除法。' });
  });

  [[4,3,2],[5,4,3],[6,5,2],[8,6,3],[10,7,4],[12,8,5]].forEach((p, i) => {
    const v = p[0] * p[1] * p[2];
    const s = 2 * (p[0]*p[1] + p[0]*p[2] + p[1]*p[2]);
    push(exercises, { id: `gen-cuboid-v-${i+1}`, module: '长方体正方体', difficulty: '基础', title: '长方体体积', question: `长方体长 ${p[0]} cm，宽 ${p[1]} cm，高 ${p[2]} cm，体积是多少立方厘米？`, answer: String(v), explanation: `体积=长×宽×高=${p[0]}×${p[1]}×${p[2]}=${v} cm³。`, trap: '体积单位是 cm³。' });
    push(exercises, { id: `gen-cuboid-s-${i+1}`, module: '长方体正方体', difficulty: '提高', title: '长方体表面积', question: `长方体长 ${p[0]} cm，宽 ${p[1]} cm，高 ${p[2]} cm，表面积是多少平方厘米？`, answer: String(s), explanation: `表面积=2×(长×宽+长×高+宽×高)=${s} cm²。`, trap: '表面积是六个面的总面积。' });
  });

  [[12,18],[20,30],[24,36],[28,42],[32,48],[45,60],[54,72],[63,84]].forEach((p, i) => {
    const ans = `${p[0]/gcd(p[0],p[1])}:${p[1]/gcd(p[0],p[1])}`;
    push(exercises, { id: `gen-ratio-simple-${i+1}`, module: '比', difficulty: '基础', title: '化简比', question: `把 ${p[0]}:${p[1]} 化成最简整数比。`, answer: ans, explanation: `${p[0]} 和 ${p[1]} 同时除以最大公因数 ${gcd(p[0], p[1])}，得到 ${ans}。`, trap: '化简比不是求比值，答案仍可保留冒号。' });
  });

  [[2,3,100],[3,5,160],[4,7,220],[5,6,330],[7,8,450]].forEach((p, i) => {
    const each = p[2] / (p[0] + p[1]);
    const a = p[0] * each;
    const b = p[1] * each;
    push(exercises, { id: `gen-ratio-share-${i+1}`, module: '比', difficulty: '提高', title: '按比分配', question: `甲、乙按 ${p[0]}:${p[1]} 分 ${p[2]} 元，甲分多少元？`, answer: String(a), explanation: `总份数 ${p[0]}+${p[1]}=${p[0]+p[1]}，每份 ${p[2]}÷${p[0]+p[1]}=${each}，甲 ${p[0]} 份=${a} 元。`, trap: '先求一份，再求指定份数。' });
  });

  [[25,40],[36,45],[42,60],[51,75],[68,80],[72,90]].forEach((p, i) => {
    const rate = p[0] / p[1] * 100;
    push(exercises, { id: `gen-percent-rate-${i+1}`, module: '百分数', difficulty: i < 3 ? '基础' : '提高', title: '百分率', question: `一共 ${p[1]} 题，做对 ${p[0]} 题，正确率是多少？`, answer: `${rate}%`, accepted: [`${rate}%`, String(rate)], explanation: `正确率=做对题数÷总题数×100%=${p[0]}÷${p[1]}×100%=${rate}%。`, trap: '分母是总题数。' });
  });

  [[80,100],[120,150],[160,200],[90,120],[75,100],[180,240]].forEach((p, i) => {
    const inc = p[1] - p[0];
    const rate = inc / p[0] * 100;
    push(exercises, { id: `gen-percent-grow-${i+1}`, module: '百分数', difficulty: '挑战', title: '增长率', question: `从 ${p[0]} 增加到 ${p[1]}，增长了百分之几？`, answer: `${rate}%`, accepted: [`${rate}%`, String(rate)], explanation: `增加量是 ${inc}，增长率=增加量÷原来量×100%=${inc}÷${p[0]}×100%=${rate}%。`, trap: '增长率的标准量是原来量。' });
  });

  const data = {
    meta: {
      title: '五升六数学桥',
      subtitle: '江苏小学数学暑期衔接 · 旧五下到新六上',
      version: '0.2.0'
    },
    bridgeAnalysis: [
      { title: '不是提前学完，而是补桥', body: '五升六真正要解决的是知识链断层：分数意义不稳，会影响分数乘除；立体图形没补，会影响六上长方体正方体；比和百分数没有建立联系，应用题就会乱套。' },
      { title: '四大板块', body: '按“数与代数、图形与几何、统计与概率、综合与实践”组织，不按章节死背。孩子先知道知识在地图上的位置，再去练题。' },
      { title: '三层练习', body: '基础题负责概念过关，提高题负责高频易错，挑战题负责综合建模。每次抽 10 题，做完马上核对，适合手机碎片化练习。' }
    ],
    learningBlocks: [
      { name: '数与代数', icon: '🔢', color: 'green', summary: '分数、方程、分数乘除、比、百分数都在这里，是六上最核心的主线。', units: ['分数基础', '简易方程', '分数乘法', '分数除法', '比', '百分数'] },
      { name: '图形与几何', icon: '📐', color: 'blue', summary: '从面积走向表面积、体积、容积，训练空间想象。', units: ['长方体正方体', '表面积', '体积与容积', '单位换算'] },
      { name: '统计与概率', icon: '📊', color: 'yellow', summary: '会读表、会合计、会比较，用数据解释生活现象。', units: ['复式统计表', '折线统计图', '平均数', '百分率'] },
      { name: '综合与实践', icon: '🧩', color: 'red', summary: '把线段图、方程、列表、画图结合起来，解决真实问题。', units: ['单位1', '对应量', '线段图', '逆向思考', '生活建模'] }
    ],
    weeklyPlan: [
      { week: 1, title: '五下温故：把旧知识盘稳', focus: '分数意义、约分通分、分数加减、因数倍数、简易方程', outcome: '能解释分数意义，能熟练约分通分，能用方程表达简单数量关系。' },
      { week: 2, title: '补断层一：长方体和正方体', focus: '面、棱、顶点、棱长和、表面积、体积、容积、单位换算', outcome: '能区分表面积和体积，能解决包装、鱼缸、水箱、收纳类问题。' },
      { week: 3, title: '补断层二：分数乘法', focus: '分数乘整数、整数乘分数、分数乘分数、求一个数的几分之几', outcome: '能把“几分之几”理解成乘法，并能找准单位1。' },
      { week: 4, title: '预习六上一：分数除法', focus: '倒数、分数除法计算、已知几分之几求整体', outcome: '能判断乘法题和除法题，不靠关键词硬套。' },
      { week: 5, title: '预习六上二：比与百分数', focus: '比的意义、比值、化简比、按比分配、百分数意义、百分率', outcome: '能把比、分数、除法、百分数互相联系起来。' },
      { week: 6, title: '综合复盘：应用题和错题整理', focus: '线段图、方程、单位1、对应量、生活建模', outcome: '形成孩子自己的错题清单和开学前速查卡。' }
    ],
    knowledgeMap: [
      { id: 'fraction-base', name: '分数意义与性质', module: '数与代数', difficulty: 2, level: '必须熟练', prerequisites: ['整数除法', '因数与倍数'], next: ['分数乘法', '分数除法', '百分数'], keywords: ['分数意义', '约分', '通分', '最简分数', '分数加减'], connection: '分数是六上最重要的底层语言。分数意义不稳，分数乘除、比、百分数都会受影响。', checkpoints: ['能解释 3/4 表示什么', '能约分到最简', '异分母加减会先通分'] },
      { id: 'equation', name: '简易方程', module: '数与代数', difficulty: 2, level: '会用即可', prerequisites: ['四则运算', '数量关系'], next: ['分数应用题', '百分数应用题'], keywords: ['未知数', '等量关系', '解方程'], connection: '方程是复杂应用题的备用武器，尤其适合反向求整体。', checkpoints: ['能找等量关系', '能列方程', '会检验答案'] },
      { id: 'cuboid-cube', name: '长方体和正方体', module: '图形与几何', difficulty: 3, level: '断层必补', prerequisites: ['长方形面积', '单位换算'], next: ['表面积', '体积容积'], keywords: ['面', '棱', '顶点', '棱长和'], connection: '从平面图形升级到立体图形，是六上空间观念的入口。', checkpoints: ['能数面棱顶点', '能算棱长和', '能画展开图雏形'] },
      { id: 'surface-area', name: '表面积', module: '图形与几何', difficulty: 3, level: '重点突破', prerequisites: ['长方形面积', '长方体结构'], next: ['包装问题', '刷漆问题'], keywords: ['六个面', '无盖', '通风管', '包装'], connection: '表面积对应“外面一层皮”。生活中贴纸、刷漆、包装都常用。', checkpoints: ['能判断少算哪个面', '会算无盖盒子', '知道单位是平方单位'] },
      { id: 'volume', name: '体积与容积', module: '图形与几何', difficulty: 3, level: '重点突破', prerequisites: ['乘法', '长方体结构'], next: ['水箱鱼缸', '单位换算'], keywords: ['体积', '容积', 'L', 'mL', '立方单位'], connection: '体积对应“占多大空间”，容积对应“能装多少东西”。', checkpoints: ['会算长×宽×高', '知道 1L=1dm³', '知道 1mL=1cm³'] },
      { id: 'fraction-multiply', name: '分数乘法', module: '数与代数', difficulty: 3, level: '必须补齐', prerequisites: ['分数意义', '约分'], next: ['分数除法', '百分数应用'], keywords: ['求几分之几', '单位1', '先约分'], connection: '“求一个数的几分之几”就是分数乘法，是六上应用题最常见的模型。', checkpoints: ['能找单位1', '会先约分再乘', '能解释连续求几分之几'] },
      { id: 'fraction-divide', name: '分数除法', module: '数与代数', difficulty: 4, level: '重点突破', prerequisites: ['分数乘法', '倒数'], next: ['分数乘除应用题', '比'], keywords: ['倒数', '已知部分求整体', '除以分数'], connection: '分数除法难在反向思考：已知几分之几是多少，求整体。', checkpoints: ['只把除数变倒数', '会画线段图', '能判断整体是谁'] },
      { id: 'ratio', name: '比', module: '数与代数', difficulty: 3, level: '核心衔接', prerequisites: ['分数', '除法', '倍数关系'], next: ['按比分配', '百分数'], keywords: ['前项', '后项', '比值', '化简比'], connection: '比、分数、除法本质相通：a:b = a÷b = a/b。', checkpoints: ['能区分比和比值', '能化简比', '会按比分配'] },
      { id: 'percent', name: '百分数', module: '数与代数', difficulty: 3, level: '生活高频', prerequisites: ['小数', '分数', '比'], next: ['正确率', '增长率', '折扣'], keywords: ['百分数', '百分率', '标准量', '比较量'], connection: '百分数是把关系统一成“以100为标准”的表达，生活中最常见。', checkpoints: ['会互化', '会求百分率', '能找标准量'] },
      { id: 'statistics', name: '统计与数据', module: '统计与概率', difficulty: 2, level: '会读会说', prerequisites: ['加减法', '表格'], next: ['百分率', '数据分析'], keywords: ['统计表', '折线统计图', '合计', '比较'], connection: '统计不是只算数，而是用数据讲清楚现象。', checkpoints: ['会看行列', '会合计', '能说出变化趋势'] },
      { id: 'problem-solving', name: '解决问题策略', module: '综合与实践', difficulty: 4, level: '拉开差距', prerequisites: ['画图', '列表', '方程'], next: ['综合应用题', '初中代数思维'], keywords: ['单位1', '对应量', '线段图', '逆向思考'], connection: '真正拉分的是读题、建模、找关系。线段图和方程是两件核心工具。', checkpoints: ['能标出单位1', '能写数量关系式', '能复盘错因'] }
    ],
    formulas: [
      { module: '分数基础', concept: '分数与除法', formula: 'a÷b=a/b（b≠0）', must: '必会', note: '分数线可以看成除号。', example: '3÷4=3/4' },
      { module: '分数基础', concept: '分数基本性质', formula: '分子分母同时乘或除以同一个非零数，分数大小不变', must: '必会', note: '约分、通分都靠它。', example: '6/8=3/4' },
      { module: '分数基础', concept: '异分母加减', formula: '先通分，再按同分母分数加减', must: '必会', note: '分母不同不能直接加减。', example: '1/2+1/3=3/6+2/6=5/6' },
      { module: '简易方程', concept: '等量关系', formula: '未知数参与的等式', must: '会用', note: '先找关系，再列方程。', example: '3x+8=35' },
      { module: '长方体正方体', concept: '长方体棱长和', formula: '4×(长+宽+高)', must: '必会', note: '铁丝框架题常用。', example: '长8宽5高3，棱长和64' },
      { module: '长方体正方体', concept: '正方体棱长和', formula: '棱长×12', must: '必会', note: '正方体 12 条棱一样长。', example: '棱长6，棱长和72' },
      { module: '长方体正方体', concept: '长方体表面积', formula: '2×(长×宽+长×高+宽×高)', must: '必会', note: '包装、刷漆、贴纸。', example: '无盖要少算上面' },
      { module: '长方体正方体', concept: '正方体表面积', formula: '棱长×棱长×6', must: '必会', note: '六个面完全一样。', example: '棱长5，表面积150' },
      { module: '长方体正方体', concept: '长方体体积', formula: '长×宽×高', must: '必会', note: '单位是立方单位。', example: '8×5×3=120cm³' },
      { module: '长方体正方体', concept: '正方体体积', formula: '棱长×棱长×棱长', must: '必会', note: '也可写成棱长³。', example: '6×6×6=216cm³' },
      { module: '单位换算', concept: '体积容积换算', formula: '1m³=1000dm³；1dm³=1000cm³；1L=1dm³；1mL=1cm³', must: '必会', note: '长度十，面积百，体积千。', example: '2.5L=2500mL' },
      { module: '分数乘法', concept: '求一个数的几分之几', formula: '这个数×几分之几', must: '必会', note: '“的几分之几”多半用乘法。', example: '120的3/5是72' },
      { module: '分数乘法', concept: '连续求几分之几', formula: '先算新的单位1，再继续乘', must: '重点', note: '看到“剩下的”单位1常变化。', example: '先剩下，再乘剩下的1/4' },
      { module: '分数除法', concept: '倒数', formula: '乘积是1的两个数互为倒数', must: '必会', note: '0没有倒数。', example: '2/5的倒数是5/2' },
      { module: '分数除法', concept: '除以分数', formula: '除以一个不为0的数，等于乘这个数的倒数', must: '必会', note: '只把除数倒过来。', example: '3/4÷2/5=3/4×5/2' },
      { module: '分数除法', concept: '已知几分之几求整体', formula: '对应量÷对应分率=整体', must: '重点', note: '分数应用题核心模型。', example: '90是3/5，整体150' },
      { module: '比', concept: '比、除法、分数', formula: 'a:b=a÷b=a/b', must: '必会', note: '三种表达互通。', example: '3:4=3/4=0.75' },
      { module: '比', concept: '化简比', formula: '前项和后项同时除以最大公因数', must: '必会', note: '结果仍是比。', example: '18:24=3:4' },
      { module: '比', concept: '按比分配', formula: '总量÷总份数=每份量', must: '重点', note: '先求总份数。', example: '3:5分160，每份20' },
      { module: '百分数', concept: '百分数意义', formula: '表示一个数是另一个数的百分之几', must: '必会', note: '百分数不能带单位。', example: '85%=85/100' },
      { module: '百分数', concept: '百分率', formula: '比较量÷标准量×100%', must: '必会', note: '正确率、出勤率、合格率同理。', example: '34÷40=85%' },
      { module: '百分数', concept: '增长率', formula: '增加量÷原来量×100%', must: '易错', note: '看原来，不看现在。', example: '40到50，增长25%' },
      { module: '统计', concept: '复式统计表', formula: '按行、列分别比较和合计', must: '会用', note: '先看表头。', example: '男生12人女生8人，共20人' }
    ],
    lifeCases: [
      { module: '分数乘法', scene: '看书计划', story: '一本书 180 页，每天读 1/6，就是每天读 180 的 1/6。', math: '180×1/6=30 页', takeaway: '“某个数量的几分之几”就是分数乘法。' },
      { module: '分数除法', scene: '反推总量', story: '已经完成作业的 3/4，用了 45 分钟，想知道全部作业大约需要多久。', math: '45÷3/4=60 分钟', takeaway: '已知部分和对应分率，求整体，用除法。' },
      { module: '长方体正方体', scene: '鱼缸买玻璃', story: '做鱼缸，需要算玻璃面积；鱼缸能装多少水，需要算容积。', math: '玻璃是表面积，装水是体积/容积。', takeaway: '看到“贴、刷、包装、玻璃”想表面积；看到“装、占、容纳”想体积。' },
      { module: '比', scene: '调饮料', story: '果汁和水按 2:3 调配，意思是每 2 份果汁配 3 份水。', math: '总份数 2+3=5，果汁占2/5，水占3/5。', takeaway: '比可以转成份数，也可以转成分数。' },
      { module: '百分数', scene: '考试正确率', story: '40 题做对 34 题，正确率就是做对的题占总题数的百分之几。', math: '34÷40×100%=85%', takeaway: '百分数就是统一用 100 作标准来比较。' },
      { module: '统计与概率', scene: '班级借书统计', story: '统计男生和女生喜欢的书，能看出哪类书更受欢迎。', math: '按类别合计，再比较数量。', takeaway: '统计是用数据支持判断。' }
    ],
    pitfalls: [
      { module: '分数乘法', title: '看到“的几分之几”却用除法', wrong: '120 页的 3/5，写成 120÷3/5。', correct: '120×3/5=72 页。', tip: '口诀：求谁的几分之几，就用谁乘几分之几。' },
      { module: '分数除法', title: '除以分数时把被除数也倒过来', wrong: '3/4÷2/5 写成 4/3×5/2。', correct: '3/4×5/2，只把除数 2/5 变倒数。', tip: '口诀：除号变乘号，后面倒一倒；前面别乱倒。' },
      { module: '单位1', title: '连续分数题里单位1变了没发现', wrong: '第二次用去剩下的 1/4，却仍拿原来的总量乘 1/4。', correct: '先算剩下多少，再用剩下的量乘 1/4。', tip: '口诀：每见“剩下的”，单位1换新的。' },
      { module: '长方体正方体', title: '表面积和体积混淆', wrong: '求刷油漆面积，却用长×宽×高。', correct: '刷、贴、包装求表面积；装、占、容纳求体积。', tip: '口诀：外面一层皮，表面积；里面占空间，体积。' },
      { module: '单位换算', title: '立方单位按 10 或 100 换算', wrong: '1dm³=10cm³ 或 100cm³。', correct: '1dm³=1000cm³。', tip: '口诀：长度十，面积百，体积千。' },
      { module: '比', title: '比和比值分不清', wrong: '把 3:4 的比值写成 3:4。', correct: '比是 3:4，比值是 3÷4=3/4。', tip: '口诀：带冒号是比，算出来是比值。' },
      { module: '百分数', title: '增长率的比较对象找错', wrong: '从 40 增加到 50，增长率写成 10÷50。', correct: '增长率是增加量÷原来量，10÷40=25%。', tip: '口诀：增减率，看原来。' },
      { module: '统计', title: '统计表不看表头', wrong: '看到数字就直接加，不看是男生、女生还是合计。', correct: '先看表头，再看行列，最后计算。', tip: '口诀：统计先看头，行列别看丢。' }
    ],
    exercises
  };

  return data;
})();
