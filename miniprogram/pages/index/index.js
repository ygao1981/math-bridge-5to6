Page({
  goPractice(){ wx.switchTab({ url: '/pages/practice/practice' }); },
  goFormulas(){ wx.switchTab({ url: '/pages/formulas/formulas' }); },
  goMap(){ wx.navigateTo({ url: '/pages/map/map' }); }
});
