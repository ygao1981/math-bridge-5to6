# 微信小程序版本预留目录

当前第一版先做纯静态网页版，等内容和交互验证稳定后，再迁移到微信小程序。

建议页面结构：

```text
pages/index/        首页和进度
pages/map/          知识图谱
pages/formulas/     公式速查
pages/practice/     分层练习和抽卡
pages/life/         生活化解读
pages/mistakes/     避坑指南
pages/notes/        错题备注
```

建议数据结构：

```text
data/knowledge.js
data/formulas.js
data/exercises.js
data/lifeCases.js
data/pitfalls.js
```

第一版小程序也建议不接后台，使用 `wx.setStorageSync` 保存本地进度。
