Page({
  goPractice(){ wx.switchTab({ url: '/pages/practice/practice' }); },
  goFormulas(){ wx.switchTab({ url: '/pages/formulas/formulas' }); },
  goMistakes(){ wx.switchTab({ url: '/pages/mistakes/mistakes' }); },
  goMap(){ wx.navigateTo({ url: '/pages/map/map' }); }
});
