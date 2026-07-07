const coreBank = [
  {id:'q1',module:'分数基础',difficulty:'基础',title:'约分',question:'18/24化成最简分数。',answer:'3/4',explain:'18和24同时除以6。'},
  {id:'q2',module:'分数乘法',difficulty:'基础',title:'求部分',question:'120的3/5是多少？',answer:'72',explain:'求一个数的几分之几，用乘法。'},
  {id:'q3',module:'分数除法',difficulty:'提高',title:'求整体',question:'一个数的3/5是90，这个数是多少？',answer:'150',explain:'对应量除以对应分率。'},
  {id:'q4',module:'长方体正方体',difficulty:'基础',title:'体积',question:'长8宽5高3的长方体，体积是多少？',answer:'120',explain:'长乘宽乘高。'},
  {id:'q5',module:'比',difficulty:'基础',title:'化简比',question:'18:24化成最简整数比。',answer:'3:4',explain:'同时除以6。'},
  {id:'q6',module:'百分数',difficulty:'基础',title:'百分数',question:'0.85写成百分数。',answer:'85%',explain:'小数点右移两位加百分号。'}
];

function gcd(a,b){ return b ? gcd(b, a % b) : Math.abs(a); }
function frac(n,d){ const g=gcd(n,d); n/=g; d/=g; return d===1 ? String(n) : `${n}/${d}`; }
function push(list,item){ if(!list.some(x=>x.id===item.id)) list.push(item); }
function buildBank(){
  const list = coreBank.slice();
  [[12,18],[16,24],[21,28],[27,36],[35,49],[42,56],[45,60],[54,72],[63,81],[72,96],[84,108],[90,120],[105,140],[126,168],[150,210],[180,240]].forEach((p,i)=>{
    push(list,{id:`simp-${i}`,module:'分数基础',difficulty:i<8?'基础':'提高',title:'约分专项',question:`把 ${p[0]}/${p[1]} 化成最简分数。`,answer:frac(p[0],p[1]),explain:`同时除以最大公因数 ${gcd(p[0],p[1])}。`});
  });
  [[2,5,80],[3,4,96],[5,6,120],[7,8,160],[4,9,135],[5,12,144],[3,7,98],[7,10,150],[9,16,128],[11,20,200]].forEach((p,i)=>{
    push(list,{id:`mul-${i}`,module:'分数乘法',difficulty:i<6?'基础':'提高',title:'求一个数的几分之几',question:`${p[2]} 的 ${p[0]}/${p[1]} 是多少？`,answer:String(p[2]*p[0]/p[1]),explain:'单位1明确，直接用乘法。'});
  });
  [[3,5,90],[4,7,56],[5,8,75],[2,3,48],[7,10,126],[5,6,95],[3,4,108],[8,9,144],[7,12,84],[9,14,117]].forEach((p,i)=>{
    push(list,{id:`div-${i}`,module:'分数除法',difficulty:i<5?'基础':'提高',title:'已知部分求整体',question:`一个数的 ${p[0]}/${p[1]} 是 ${p[2]}，这个数是多少？`,answer:String(p[2]*p[1]/p[0]),explain:'对应量 ÷ 对应分率 = 单位1。'});
  });
  [[4,3,2],[5,4,3],[6,5,2],[8,6,3],[10,7,4],[12,8,5],[7,5,4],[9,7,5],[11,8,6],[13,9,4]].forEach((p,i)=>{
    const v=p[0]*p[1]*p[2]; const s=2*(p[0]*p[1]+p[0]*p[2]+p[1]*p[2]);
    push(list,{id:`cube-v-${i}`,module:'长方体正方体',difficulty:'基础',title:'长方体体积',question:`长${p[0]}cm、宽${p[1]}cm、高${p[2]}cm的长方体，体积是多少cm³？`,answer:String(v),explain:'体积=长×宽×高。'});
    push(list,{id:`cube-s-${i}`,module:'长方体正方体',difficulty:'提高',title:'长方体表面积',question:`长${p[0]}cm、宽${p[1]}cm、高${p[2]}cm的长方体，表面积是多少cm²？`,answer:String(s),explain:'表面积=2×(长×宽+长×高+宽×高)。'});
  });
  [[18,24],[20,35],[28,42],[36,48],[45,60],[54,72],[63,81],[75,100],[84,126],[96,144]].forEach((p,i)=>{
    push(list,{id:`ratio-${i}`,module:'比',difficulty:i<5?'基础':'提高',title:'化简比',question:`把 ${p[0]}:${p[1]} 化成最简整数比。`,answer:`${p[0]/gcd(p[0],p[1])}:${p[1]/gcd(p[0],p[1])}`,explain:'前项和后项同时除以最大公因数。'});
  });
  [[34,40],[45,50],[72,80],[81,90],[57,60],[38,50],[96,120],[126,150],[18,24],[42,56]].forEach((p,i)=>{
    push(list,{id:`percent-${i}`,module:'百分数',difficulty:i<5?'基础':'提高',title:'百分率',question:`一共 ${p[1]} 题，做对 ${p[0]} 题，正确率是多少？`,answer:`${p[0]*100/p[1]}%`,explain:'正确率=做对题数÷总题数×100%。'});
  });
  [[40,50],[80,100],[60,75],[120,150],[200,240],[90,108],[150,180],[250,300]].forEach((p,i)=>{
    push(list,{id:`growth-${i}`,module:'百分数',difficulty:'提高',title:'增长率',question:`从 ${p[0]} 增加到 ${p[1]}，增长百分之几？`,answer:`${(p[1]-p[0])*100/p[0]}%`,explain:'增长率=增长量÷原来量×100%。'});
  });
  [[12,15,18],[20,24,16],[31,29,40],[45,36,39],[28,32,30],[55,48,57]].forEach((p,i)=>{
    push(list,{id:`stat-${i}`,module:'统计与概率',difficulty:'基础',title:'统计合计',question:`三组人数分别是 ${p[0]}、${p[1]}、${p[2]}，合计是多少人？`,answer:String(p[0]+p[1]+p[2]),explain:'看清项目后再相加。'});
  });
  return list;
}
const bank = buildBank();
function shuffle(arr){ return arr.slice().sort(()=>Math.random()-0.5); }
function norm(v){ return String(v||'').replace(/\s/g,'').replace('％','%'); }
Page({
  data:{ list: [], total: bank.length },
  onLoad(){ this.draw(); },
  draw(){ this.setData({ list: shuffle(bank).slice(0,10).map(x=>Object.assign({},x,{input:'',feedback:'',show:false,ok:false})) }); },
  onInput(e){ const id=e.currentTarget.dataset.id; const list=this.data.list.map(x=>x.id===id?Object.assign({},x,{input:e.detail.value}):x); this.setData({list}); },
  check(e){
    const id=e.currentTarget.dataset.id;
    const wrong = wx.getStorageSync('wrongBook') || {};
    const list=this.data.list.map(x=>{
      if(x.id!==id) return x;
      const ok = norm(x.input)===norm(x.answer);
      if(ok) delete wrong[id]; else wrong[id]=true;
      return Object.assign({},x,{ok,show:true,feedback:ok?'回答正确':'还不对，正确答案：'+x.answer});
    });
    wx.setStorageSync('wrongBook', wrong);
    this.setData({list});
  },
  wrongBook(){
    const wrong = wx.getStorageSync('wrongBook') || {};
    const list = bank.filter(x=>wrong[x.id]).map(x=>Object.assign({},x,{input:'',feedback:'',show:false,ok:false}));
    this.setData({ list: list.length ? list : shuffle(bank).slice(0,6).map(x=>Object.assign({},x,{input:'',feedback:'',show:false,ok:false})) });
    if(!list.length) wx.showToast({ title:'暂无错题，先练几题', icon:'none' });
  }
});
