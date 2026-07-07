function loadStats(){
  const stats = wx.getStorageSync('studyStats') || { done: 0, right: 0, wrong: 0, days: {} };
  const dayCount = Object.keys(stats.days || {}).length;
  return { done: stats.done || 0, right: stats.right || 0, wrong: stats.wrong || 0, dayCount };
}
Page({
  data: { stats: loadStats() },
  onShow(){ this.setData({ stats: loadStats() }); },
  goPractice(){ wx.switchTab({ url: '/pages/practice/practice' }); },
  goFormulas(){ wx.switchTab({ url: '/pages/formulas/formulas' }); },
  goLife(){ wx.switchTab({ url: '/pages/life/life' }); },
  goMistakes(){ wx.switchTab({ url: '/pages/mistakes/mistakes' }); },
  goMap(){ wx.navigateTo({ url: '/pages/map/map' }); }
});
