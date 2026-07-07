window.MathBridgeStorage = (() => {
  const KEY = 'math-bridge-5to6-progress-v1';
  const defaultState = {
    completedKnowledge: [],
    solvedExercises: {},
    wrongExercises: {},
    lastModule: '全部',
    lastDifficulty: '全部',
    studyDays: {},
    notes: ''
  };
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? { ...defaultState, ...JSON.parse(raw) } : { ...defaultState };
    } catch (error) {
      console.warn('读取进度失败，已使用默认进度。', error);
      return { ...defaultState };
    }
  }
  function save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }
  function reset() {
    localStorage.removeItem(KEY);
    return { ...defaultState };
  }
  return { load, save, reset };
})();
