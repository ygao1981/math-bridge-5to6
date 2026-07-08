const VIDEO_BASE = 'http://aihearth.life/math/web/assets/videos/';

window.MATH_BRIDGE_VIDEOS = [
  {
    id: 'fraction-base',
    knowledgeId: 'fraction-base',
    module: '分数基础',
    title: '3分钟看懂分数意义与约分通分',
    file: '00-fraction-meaning-3min.mp4',
    duration: '03:00',
    url: VIDEO_BASE + '00-fraction-meaning-3min.mp4',
    objective: '理解分数线就是除号，掌握约分、通分和比较大小的底层逻辑。',
    script: ['分数是在说把一个整体平均分。', '分数线也可以看成除号。', '约分要约到最简，异分母加减要先通分。']
  },
  {
    id: 'equation',
    knowledgeId: 'equation',
    module: '简易方程',
    title: '用天平思维学会简易方程',
    file: '01-equation-balance.mp4',
    duration: '02:30',
    url: VIDEO_BASE + '01-equation-balance.mp4',
    objective: '用天平平衡帮助孩子理解等式性质和逆向求未知数。',
    script: ['方程像天平，两边要公平。', '3x+5=35，先两边减5，再两边除以3。', '解方程本质是把未知数单独留下来。']
  },
  {
    id: 'cuboid-cube',
    knowledgeId: 'cuboid-cube',
    module: '长方体正方体',
    title: '长方体和正方体到底有什么关系',
    file: '02-cuboid-cube-relation.mp4',
    duration: '03:00',
    url: VIDEO_BASE + '02-cuboid-cube-relation.mp4',
    objective: '建立面、棱、顶点、长宽高和正方体特殊性的空间概念。',
    script: ['长方体有6个面、12条棱、8个顶点。', '正方体是特殊的长方体。', '理解结构后，表面积和体积更容易。']
  },
  {
    id: 'surface-area',
    knowledgeId: 'surface-area',
    module: '表面积',
    title: '刷油漆、贴包装，为什么算表面积',
    file: '03-surface-area.mp4',
    duration: '03:00',
    url: VIDEO_BASE + '03-surface-area.mp4',
    objective: '区分表面积与体积，掌握六个面和少算面的判断。',
    script: ['表面积是外面一层皮。', '无盖盒子少算上面，通风管少算两个底面。', '看到包装、刷漆、贴纸，优先想表面积。']
  },
  {
    id: 'volume',
    knowledgeId: 'volume',
    module: '体积容积',
    title: '体积和容积：一个盒子到底能装多少',
    file: '04-volume-capacity.mp4',
    duration: '03:00',
    url: VIDEO_BASE + '04-volume-capacity.mp4',
    objective: '理解体积、容积和单位换算，知道1L=1dm³。',
    script: ['体积表示占空间的大小，容积表示能装多少。', '长方体体积=长×宽×高。', '体积单位相邻进率是1000。']
  },
  {
    id: 'fraction-multiply',
    knowledgeId: 'fraction-multiply',
    module: '分数乘法',
    title: '看到“的几分之几”，为什么用乘法',
    file: '05-fraction-multiplication-of.mp4',
    duration: '03:00',
    url: VIDEO_BASE + '05-fraction-multiplication-of.mp4',
    objective: '掌握求一个数的几分之几，以及连续求几分之几时单位1变化。',
    script: ['求一个数的几分之几，用乘法。', '看到剩下的，单位1可能变了。', '先理解单位1，再列式。']
  },
  {
    id: 'fraction-divide',
    knowledgeId: 'fraction-divide',
    module: '分数除法',
    title: '分数除法：只把除数倒过来',
    file: '06-fraction-division-reciprocal.mp4',
    duration: '03:00',
    url: VIDEO_BASE + '06-fraction-division-reciprocal.mp4',
    objective: '掌握除以分数等于乘倒数，以及已知部分求整体。',
    script: ['除号变乘号，后面倒一倒。', '只把除数变倒数，被除数不变。', '对应量÷对应分率=单位1。']
  },
  {
    id: 'ratio',
    knowledgeId: 'ratio',
    module: '比',
    title: '比、比值和按比分配一次讲清',
    file: '07-ratio-value-allocation.mp4',
    duration: '03:00',
    url: VIDEO_BASE + '07-ratio-value-allocation.mp4',
    objective: '区分比和比值，掌握化简比和按比分配。',
    script: ['带冒号是比，算出来是比值。', '化简比仍然保留冒号。', '按比分配先求总份数。']
  },
  {
    id: 'percent',
    knowledgeId: 'percent',
    module: '百分数',
    title: '正确率、增长率和百分数避坑',
    file: '08-percent-rate-pitfalls.mp4',
    duration: '03:00',
    url: VIDEO_BASE + '08-percent-rate-pitfalls.mp4',
    objective: '理解百分数意义，掌握正确率、增长率的标准量。',
    script: ['百分数表示一个数是另一个数的百分之几。', '正确率的分母是总题数。', '增长率看原来量。']
  },
  {
    id: 'statistics',
    knowledgeId: 'statistics',
    module: '统计',
    title: '统计表不能看到数字就相加',
    file: '09-statistics-table.mp4',
    duration: '02:30',
    url: VIDEO_BASE + '09-statistics-table.mp4',
    objective: '掌握读统计表的顺序，能根据数据进行比较、合计和表达结论。',
    script: ['统计先看标题、表头和单位。', '横看竖看含义不同。', '数据说明结论，不能凭感觉。']
  },
  {
    id: 'problem-solving',
    knowledgeId: 'problem-solving',
    module: '解决问题',
    title: '分数应用题先找单位1',
    file: '10-fraction-word-problem-unit-one.mp4',
    duration: '03:00',
    url: VIDEO_BASE + '10-fraction-word-problem-unit-one.mp4',
    objective: '用线段图和关键词帮助孩子处理分数应用题。',
    script: ['分数应用题先找单位1。', '看到剩下的，单位1可能变了。', '对应量和对应分率要对齐。']
  }
];
