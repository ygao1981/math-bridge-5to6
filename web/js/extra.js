(() => {
  const data = window.MATH_BRIDGE_DATA;
  if (!data || !Array.isArray(data.exercises)) return;
  const push = (item) => data.exercises.push({
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
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);

  [[1.5,1500],[2.4,2400],[3.2,3200],[0.8,800],[4.05,4050],[6.7,6700],[9.01,9010],[0.36,360]].forEach((p, i) => {
    push({ id: `extra-unit-l-${i+1}`, module: '长方体正方体', difficulty: '基础', title: '容积单位换算', question: `${p[0]} L 等于多少 mL？`, answer: String(p[1]), explanation: `1 L = 1000 mL，所以 ${p[0]} L = ${p[1]} mL。`, trap: 'L 到 mL 要乘 1000。' });
  });

  [[5,4,3],[8,5,4],[10,6,5],[12,8,6],[7,5,4],[9,7,5]].forEach((p, i) => {
    const ans = p[0]*p[1] + 2*p[0]*p[2] + 2*p[1]*p[2];
    push({ id: `extra-open-box-${i+1}`, module: '长方体正方体', difficulty: '提高', title: '无盖盒子表面积', question: `做一个无盖长方体盒子，长 ${p[0]} dm，宽 ${p[1]} dm，高 ${p[2]} dm，需要材料多少平方分米？`, answer: String(ans), explanation: `无盖盒子=底面+四个侧面：${p[0]}×${p[1]}+2×${p[0]}×${p[2]}+2×${p[1]}×${p[2]}=${ans}。`, trap: '无盖少算上面。' });
  });

  [[2,5,3,10],[4,9,5,12],[5,6,7,9],[3,8,4,11],[7,12,5,8],[9,14,2,3],[11,18,3,5],[13,20,5,8]].forEach((p, i) => {
    const left = p[0] / p[1];
    const right = p[2] / p[3];
    const ans = left > right ? `${p[0]}/${p[1]}` : `${p[2]}/${p[3]}`;
    push({ id: `extra-frac-compare-${i+1}`, module: '分数基础', difficulty: '提高', title: '分数大小比较', question: `比较 ${p[0]}/${p[1]} 和 ${p[2]}/${p[3]}，哪个更大？`, answer: ans, explanation: `可以通分比较，也可以化成小数比较。较大的是 ${ans}。`, trap: '不能只看分子或分母。' });
  });

  [[0.25,'25%'],[0.4,'40%'],[0.625,'62.5%'],[0.75,'75%'],[1.2,'120%'],[0.08,'8%'],[0.125,'12.5%'],[0.05,'5%']].forEach((p, i) => {
    push({ id: `extra-percent-conv-${i+1}`, module: '百分数', difficulty: '基础', title: '小数化百分数', question: `把 ${p[0]} 化成百分数。`, answer: p[1], accepted: [p[1], p[1].replace('%','')], explanation: `小数化百分数，小数点向右移动两位，加百分号：${p[0]}=${p[1]}。`, trap: '百分号不要漏。' });
  });

  [[6,8],[9,12],[15,20],[21,28],[24,30],[35,42],[48,60],[54,81]].forEach((p, i) => {
    const a = p[0] / gcd(p[0], p[1]);
    const b = p[1] / gcd(p[0], p[1]);
    push({ id: `extra-ratio-value-${i+1}`, module: '比', difficulty: '基础', title: '比值与化简比', question: `把 ${p[0]}:${p[1]} 化简成最简整数比。`, answer: `${a}:${b}`, explanation: `${p[0]} 和 ${p[1]} 同时除以最大公因数 ${gcd(p[0], p[1])}，得到 ${a}:${b}。`, trap: '比值是一个数，化简比仍是一个比。' });
  });

  [[240,3,8],[320,5,8],[180,2,5],[420,5,7],[560,3,4],[720,7,9]].forEach((p, i) => {
    const ans = p[0] * p[1] / p[2];
    push({ id: `extra-real-part-${i+1}`, module: '分数乘法', difficulty: '提高', title: '生活中的分数乘法', question: `妈妈买东西花了 ${p[0]} 元，其中 ${p[1]}/${p[2]} 用来买学习用品，学习用品花了多少元？`, answer: String(ans), explanation: `求 ${p[0]} 的 ${p[1]}/${p[2]}，用乘法：${p[0]}×${p[1]}/${p[2]}=${ans} 元。`, trap: '“其中几分之几”通常是求部分量。' });
  });
})();
