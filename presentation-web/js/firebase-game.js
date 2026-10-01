/*
 * Lõi dùng chung cho trò chơi kiểu Kahoot (quản trò + người chơi).
 *
 * Toàn bộ trạng thái nằm trong Firebase Realtime Database tại hcmGame/rooms/default:
 *   state            trạng thái phòng: LOBBY | QUESTION | REVEAL | ENDED
 *   players/{id}     { name, score, last:{index,choice,correct,gain} }
 *   answers/{index}/{id}   { choice, at }
 * Trang chỉ đọc lại dữ liệu này khi tải/refresh; không có thao tác reset tự động.
 */
(function () {
  'use strict';

  const config = window.HCM_CONFIG || {};
  const firebaseConfig = config.FIREBASE_CONFIG;
  const gameConfig = config.GAME_CONFIG || {};
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const settings = {
    questionSeconds: clamp(Number(gameConfig.questionSeconds) || 20, 5, 120),
    questionCount: Math.max(1, Number(gameConfig.questionCount) || 10)
  };
  const roomRoot = 'hcmGame/rooms/default';
  const STATUSES = ['LOBBY', 'QUESTION', 'REVEAL', 'ENDED'];

  const clientId = sessionStorage.getItem('hcm_client_id') ||
    (crypto.randomUUID ? crypto.randomUUID() : `p_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  sessionStorage.setItem('hcm_client_id', clientId);

  let database = null;
  let serverOffset = 0;
  let error = '';

  if (!firebaseConfig?.apiKey || !firebaseConfig?.databaseURL || typeof firebase === 'undefined') {
    error = 'Thiếu cấu hình Firebase. Kiểm tra biến môi trường trên Vercel rồi redeploy.';
  } else {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    database.ref('.info/serverTimeOffset').on('value', snapshot => { serverOffset = Number(snapshot.val()) || 0; });
  }

  function toArray(value) {
    if (Array.isArray(value)) return value;
    return value && typeof value === 'object' ? Object.values(value) : [];
  }

  // Phòng cũ (schema đội/Leader) hoặc thiếu field vẫn đọc được: mọi giá trị đều có mặc định.
  function normalizeState(value) {
    const next = Object.assign({
      status: 'LOBBY', order: [], index: -1, total: 0, secs: settings.questionSeconds,
      question: null, startAt: 0, endsAt: 0, reveal: null, revision: 0
    }, value || {});
    next.order = toArray(next.order);
    const inRound = next.status === 'QUESTION' || next.status === 'REVEAL';
    if (!STATUSES.includes(next.status) || (next.status !== 'LOBBY' && !next.order.length) || (inRound && !next.question)) {
      next.status = 'LOBBY';
    }
    if (next.question) next.question = { text: String(next.question.text || ''), options: toArray(next.question.options) };
    if (next.reveal) next.reveal = Object.assign({ correct: -1, explanation: '', counts: [] }, next.reveal, { counts: toArray(next.reveal.counts) });
    return next;
  }

  function shuffle(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  // Giống Kahoot: đúng được 500–1000 điểm, trả lời càng nhanh càng nhiều.
  function scoreFor(elapsedMs, secs) {
    const total = secs * 1000;
    const ratio = clamp(elapsedMs / total, 0, 1);
    return Math.round(1000 * (1 - ratio / 2));
  }

  async function loadQuestions() {
    const data = await fetch('/data/questions.json').then(response => response.json());
    return [...(data.memberQuestions || []), ...(data.leaderQuestions || [])].map(item => ({
      id: String(item.id),
      text: String(item.question).replace(/^★\s*/, ''),
      options: item.options.map(option => String(option).replace(/^[A-D]\.\s+/, '')),
      answer: Number(item.answer),
      explanation: item.explanation || ''
    }));
  }

  function leaderboard(players) {
    return Object.entries(players || {})
      .filter(([, player]) => player && player.name)
      .map(([id, player]) => ({ id, name: player.name, score: Number(player.score) || 0, last: player.last || null }))
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'vi'))
      .map((player, index) => Object.assign(player, { rank: index + 1 }));
  }

  window.HcmQuiz = {
    settings, clientId, error, db: database, shuffle, scoreFor, normalizeState, loadQuestions, leaderboard,
    serverNow: () => Date.now() + serverOffset,
    ref: path => database.ref(path ? `${roomRoot}/${path}` : roomRoot),
    onConnection(callback) {
      if (!database) return;
      database.ref('.info/connected').on('value', snapshot => callback(snapshot.val() === true));
    },
    escape: text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
  };
})();
