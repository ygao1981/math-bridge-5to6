const bank = [
  {id:'q1',module:'分数基础',difficulty:'基础',title:'约分',question:'18/24化成最简分数。',answer:'3/4',explain:'同时除以6。'},
  {id:'q2',module:'分数乘法',difficulty:'基础',title:'求部分',question:'120的3/5是多少？',answer:'72',explain:'求一个数的几分之几，用乘法。'},
  {id:'q3',module:'分数除法',difficulty:'提高',title:'求整体',question:'一个数的3/5是90，这个数是多少？',answer:'150',explain:'对应量反推整体。'},
  {id:'q4',module:'长方体正方体',difficulty:'基础',title:'体积',question:'长8宽5高3的长方体，体积是多少？',answer:'120',explain:'长乘宽乘高。'},
  {id:'q5',module:'比',difficulty:'基础',title:'化简比',question:'18:24化成最简整数比。',answer:'3:4',explain:'同时除以6。'},
  {id:'q6',module:'百分数',difficulty:'基础',title:'百分数',question:'0.85写成百分数。',answer:'85%',explain:'小数点右移两位加百分号。'}
];
function shuffle(arr){ return arr.slice().sort(()=>Math.random()-0.5); }
function norm(v){ return String(v||'').replace(/\s/g,'').replace('％','%'); }
Page({
  data:{ list: [] },
  onLoad(){ this.draw(); },
  draw(){ this.setData({ list: shuffle(bank).slice(0,5).map(x=>Object.assign({},x,{input:'',feedback:'',show:false,ok:false})) }); },
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
    this.setData({ list });
  }
});
