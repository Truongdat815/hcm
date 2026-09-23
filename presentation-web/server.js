const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const os = require('os');
const QRCode = require('qrcode');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 4000;
const ADMIN_PASSWORD = process.env.ADMIN_PASS || '2026';

// Load questions bank
const questionsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'questions.json'), 'utf-8')
);

// Helper: Get local IPv4 address
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

function getTimestamp() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// Serve static directory
app.use(express.static(__dirname));

// Routes
app.get('/play', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'play.html'));
});

app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'game-host.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'game-host.html'));
});

app.get('/api/server-info', async (req, res) => {
  const ip = getLocalIp();
  const hostHeader = req.headers['x-forwarded-host'] || req.headers.host || '';
  const proto = req.headers['x-forwarded-proto'] || (req.secure ? 'https' : 'http');
  const isLocal = hostHeader.includes('localhost') || hostHeader.includes('127.0.0.1');

  let playUrl;
  if (process.env.PUBLIC_PLAY_URL) {
    playUrl = process.env.PUBLIC_PLAY_URL.endsWith('/play') ? process.env.PUBLIC_PLAY_URL : `${process.env.PUBLIC_PLAY_URL}/play`;
  } else if (req.query.customUrl) {
    playUrl = req.query.customUrl.endsWith('/play') ? req.query.customUrl : `${req.query.customUrl}/play`;
  } else if (!isLocal && hostHeader) {
    playUrl = `${proto}://${hostHeader}/play`;
  } else {
    playUrl = `http://${ip}:${PORT}/play`;
  }

  try {
    const qrDataUrl = await QRCode.toDataURL(playUrl, {
      margin: 2,
      width: 320,
      color: {
        dark: '#4E0804',
        light: '#FFFDF6'
      }
    });
    res.json({ ip, port: PORT, playUrl, qrDataUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR' });
  }
});

// ======================================================================
// GAME STATE MANAGEMENT
// ======================================================================
let gameState = {
  status: 'LOBBY', // 'LOBBY', 'PLAYING', 'ENDED'
  lobbyPlayers: [], // { id, name, teamKey, isLeader, score }
  team1: {
    key: 'team1',
    name: 'Khối Nội Lực',
    title: 'SỨC MẠNH DÂN TỘC',
    icon: '🇻🇳',
    color: '#C02018',
    score: 0,
    streak: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    totalWrong: 0,
    targetStreak: 50,
    leaderId: null,
    leaderName: '',
    members: []
  },
  team2: {
    key: 'team2',
    name: 'Khối Ngoại Lực',
    title: 'ĐOÀN KẾT QUỐC TẾ',
    icon: '🌐',
    color: '#185B33',
    score: 0,
    streak: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    totalWrong: 0,
    targetStreak: 50,
    leaderId: null,
    leaderName: '',
    members: []
  },
  logs: [], // { time, text, type: 'info' | 'success' | 'warn' | 'swap' }
  activeLeaderChallenge: null, // { teamKey, question }
  shuffledPots: []
};

function addLog(text, type = 'info') {
  const entry = { time: getTimestamp(), text, type };
  gameState.logs.unshift(entry);
  if (gameState.logs.length > 50) gameState.logs.pop();
  io.emit('new_log_entry', entry);
}

function resetGameState() {
  gameState.status = 'LOBBY';
  gameState.lobbyPlayers.forEach(p => {
    p.teamKey = null;
    p.isLeader = false;
    p.score = 0;
  });
  gameState.team1.score = 0;
  gameState.team1.streak = 0;
  gameState.team1.totalAnswered = 0;
  gameState.team1.totalCorrect = 0;
  gameState.team1.totalWrong = 0;
  gameState.team1.leaderId = null;
  gameState.team1.leaderName = '';
  gameState.team1.members = [];

  gameState.team2.score = 0;
  gameState.team2.streak = 0;
  gameState.team2.totalAnswered = 0;
  gameState.team2.totalCorrect = 0;
  gameState.team2.totalWrong = 0;
  gameState.team2.leaderId = null;
  gameState.team2.leaderName = '';
  gameState.team2.members = [];

  gameState.logs = [];
  gameState.activeLeaderChallenge = null;
  gameState.shuffledPots = [];
  addLog('Quản trò đã làm mới phòng chờ. Vui lòng sẵn sàng!', 'warn');
}

function broadcastRoomUpdate() {
  io.emit('room_state', {
    status: gameState.status,
    totalLobbyCount: gameState.lobbyPlayers.length,
    lobbyPlayers: gameState.lobbyPlayers.map(p => ({ id: p.id, name: p.name, teamKey: p.teamKey, isLeader: p.isLeader })),
    team1: {
      name: gameState.team1.name,
      title: gameState.team1.title,
      icon: gameState.team1.icon,
      color: gameState.team1.color,
      score: gameState.team1.score,
      streak: gameState.team1.streak,
      totalAnswered: gameState.team1.totalAnswered,
      totalCorrect: gameState.team1.totalCorrect,
      totalWrong: gameState.team1.totalWrong,
      targetStreak: gameState.team1.targetStreak,
      leaderId: gameState.team1.leaderId,
      leaderName: gameState.team1.leaderName,
      memberCount: gameState.team1.members.length,
      members: gameState.team1.members.map(m => ({ id: m.id, name: m.name, isLeader: m.isLeader, score: m.score }))
    },
    team2: {
      name: gameState.team2.name,
      title: gameState.team2.title,
      icon: gameState.team2.icon,
      color: gameState.team2.color,
      score: gameState.team2.score,
      streak: gameState.team2.streak,
      totalAnswered: gameState.team2.totalAnswered,
      totalCorrect: gameState.team2.totalCorrect,
      totalWrong: gameState.team2.totalWrong,
      targetStreak: gameState.team2.targetStreak,
      leaderId: gameState.team2.leaderId,
      leaderName: gameState.team2.leaderName,
      memberCount: gameState.team2.members.length,
      members: gameState.team2.members.map(m => ({ id: m.id, name: m.name, isLeader: m.isLeader, score: m.score }))
    },
    logs: gameState.logs,
    activeLeaderChallenge: gameState.activeLeaderChallenge
  });
}

function generateRandomPots() {
  const potTemplates = [
    { type: 'double', name: '🌟 Bảo Bình Đại Phát', desc: 'Nhân đôi toàn bộ điểm số của nhóm (x2)!', badge: 'X2 ĐIỂM' },
    { type: 'half', name: '⚠️ Bảo Bình Thử Thách', desc: 'Mất 50% số điểm hiện tại (-50%)!', badge: '-50% ĐIỂM' },
    { type: 'swap', name: '🔄 Bảo Bình Hoán Đổi', desc: 'Hoán đổi điểm số với nhóm đối thủ (Swap)!', badge: 'SWAP ĐIỂM' },
    { type: 'random_delta', name: '🎲 Bảo Bình May Mắn', desc: 'Biến động ngẫu nhiên từ 50 đến 80 điểm!', badge: '±50-80 ĐIỂM' }
  ];
  // Shuffle array using Fisher-Yates
  const shuffled = [...potTemplates];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate shuffled array of question IDs for random, non-repeating questions per player
function generateShuffledQueue(questions, lastId = null) {
  const ids = questions.map(q => q.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  if (lastId && ids.length > 1 && ids[0] === lastId) {
    const first = ids.shift();
    ids.push(first);
  }
  return ids;
}

// ======================================================================
// SOCKET.IO REAL-TIME EVENTS
// ======================================================================
io.on('connection', (socket) => {
  // Send immediate state
  socket.emit('initial_state', {
    status: gameState.status,
    totalQuestions: questionsData.memberQuestions.length
  });

  // Admin Login with password
  socket.on('admin_login', ({ password }) => {
    if (password === ADMIN_PASSWORD) {
      socket.isAdmin = true;
      socket.emit('admin_auth_success');
      broadcastRoomUpdate();
    } else {
      socket.emit('admin_auth_failed', { message: 'Mật khẩu quản trò không chính xác! Vui lòng thử lại.' });
    }
  });

  // Player joins lobby (before game starts)
  socket.on('player_join', ({ name }) => {
    if (!name || !name.trim()) return;
    const cleanName = name.trim().slice(0, 24);

    const playerObj = {
      id: socket.id,
      name: cleanName,
      teamKey: null,
      isLeader: false,
      score: 0,
      currentQIndex: 0,
      questionQueue: [],
      lastQuestionId: null,
      answeredCount: 0
    };

    // If game is ALREADY PLAYING, assign immediately to smaller team
    if (gameState.status === 'PLAYING') {
      const count1 = gameState.team1.members.length;
      const count2 = gameState.team2.members.length;
      const teamKey = count1 <= count2 ? 'team1' : 'team2';
      playerObj.teamKey = teamKey;
      gameState[teamKey].members.push(playerObj);

      socket.emit('assigned_team_and_role', {
        player: playerObj,
        team: {
          key: gameState[teamKey].key,
          name: gameState[teamKey].name,
          title: gameState[teamKey].title,
          icon: gameState[teamKey].icon,
          color: gameState[teamKey].color,
          leaderName: gameState[teamKey].leaderName,
          leaderId: gameState[teamKey].leaderId
        }
      });
    }

    gameState.lobbyPlayers.push(playerObj);
    socket.player = playerObj;

    // Send confirmation to player
    socket.emit('player_in_lobby', { player: playerObj, status: gameState.status });

    // Notify Host & All
    broadcastRoomUpdate();
  });

  // ADMIN CLICKS START: SPLIT INTO 2 BALANCED TEAMS & PICK 1 RANDOM LEADER FOR EACH TEAM!
  socket.on('host_start_game', () => {
    if (gameState.lobbyPlayers.length === 0) {
      socket.emit('admin_error', { message: 'Chưa có sinh viên nào trong phòng chờ để chia đội!' });
      return;
    }

    gameState.status = 'PLAYING';
    gameState.team1.members = [];
    gameState.team2.members = [];

    // Shuffle lobby players
    const shuffledPlayers = [...gameState.lobbyPlayers];
    for (let i = shuffledPlayers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
    }

    // Split evenly into 2 teams
    shuffledPlayers.forEach((player, index) => {
      if (index % 2 === 0) {
        player.teamKey = 'team1';
        player.isLeader = false;
        gameState.team1.members.push(player);
      } else {
        player.teamKey = 'team2';
        player.isLeader = false;
        gameState.team2.members.push(player);
      }
    });

    // Randomly pick 1 Leader for Team 1
    if (gameState.team1.members.length > 0) {
      const leaderIdx1 = Math.floor(Math.random() * gameState.team1.members.length);
      gameState.team1.members[leaderIdx1].isLeader = true;
      gameState.team1.leaderId = gameState.team1.members[leaderIdx1].id;
      gameState.team1.leaderName = gameState.team1.members[leaderIdx1].name;
    }

    // Randomly pick 1 Leader for Team 2
    if (gameState.team2.members.length > 0) {
      const leaderIdx2 = Math.floor(Math.random() * gameState.team2.members.length);
      gameState.team2.members[leaderIdx2].isLeader = true;
      gameState.team2.leaderId = gameState.team2.members[leaderIdx2].id;
      gameState.team2.leaderName = gameState.team2.members[leaderIdx2].name;
    }

    addLog(`Trận đấu bắt đầu! ${gameState.lobbyPlayers.length} người chơi đã được chia đều vào 2 Khối.`, 'success');
    addLog(`👑 Leader Khối Nội Lực: ${gameState.team1.leaderName} | 👑 Leader Khối Ngoại Lực: ${gameState.team2.leaderName}`, 'info');

    // Notify each player socket individually of their team & role
    gameState.team1.members.forEach(m => {
      io.to(m.id).emit('assigned_team_and_role', {
        player: m,
        team: {
          key: gameState.team1.key,
          name: gameState.team1.name,
          title: gameState.team1.title,
          icon: gameState.team1.icon,
          color: gameState.team1.color,
          leaderName: gameState.team1.leaderName,
          leaderId: gameState.team1.leaderId
        }
      });
    });

    gameState.team2.members.forEach(m => {
      io.to(m.id).emit('assigned_team_and_role', {
        player: m,
        team: {
          key: gameState.team2.key,
          name: gameState.team2.name,
          title: gameState.team2.title,
          icon: gameState.team2.icon,
          color: gameState.team2.color,
          leaderName: gameState.team2.leaderName,
          leaderId: gameState.team2.leaderId
        }
      });
    });

    io.emit('game_started');
    broadcastRoomUpdate();
  });

  // Host resets game
  socket.on('host_reset_game', () => {
    resetGameState();
    // Reset players' question queues and current serving
    io.sockets.sockets.forEach(s => {
      if (s.player) {
        s.player.questionQueue = [];
        s.player.lastQuestionId = null;
        s.player.answeredCount = 0;
        s.currentServing = null;
      }
    });
    io.emit('game_reset');
    broadcastRoomUpdate();
  });

  // Member requests a question (100% RANDOMIZED per player)
  socket.on('get_question', () => {
    if (!socket.player) return;
    const player = socket.player;
    const allQuestions = questionsData.memberQuestions;

    // Refill or initialize this player's personal randomized queue
    if (!player.questionQueue || player.questionQueue.length === 0) {
      player.questionQueue = generateShuffledQueue(allQuestions, player.lastQuestionId);
    }

    const nextQId = player.questionQueue.shift();
    player.lastQuestionId = nextQId;
    player.answeredCount = (player.answeredCount || 0) + 1;

    const q = allQuestions.find(item => item.id === nextQId);
    if (!q) return;

    // Shuffle the 4 options A, B, C, D so order is completely dynamic for this player
    const optionIndices = q.options.map((_, idx) => idx);
    for (let i = optionIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionIndices[i], optionIndices[j]] = [optionIndices[j], optionIndices[i]];
    }

    const shuffledOptions = optionIndices.map(idx => q.options[idx]);
    const newCorrectOptionIndex = optionIndices.indexOf(q.answer);

    // Cache current serving on socket for tamper-proof evaluation
    socket.currentServing = {
      questionId: q.id,
      correctOptionIndex: newCorrectOptionIndex,
      explanation: q.explanation
    };

    socket.emit('question_payload', {
      id: q.id,
      userQuestionNumber: player.answeredCount,
      total: allQuestions.length,
      question: q.question,
      options: shuffledOptions
    });
  });

  // Member submits answer
  socket.on('submit_answer', ({ questionId, chosenOption }) => {
    if (!socket.player) return;

    const player = socket.player;
    const team = player.teamKey ? gameState[player.teamKey] : null;

    let isCorrect = false;
    let explanation = '';
    let correctOptionIndex = 0;

    if (socket.currentServing && socket.currentServing.questionId === questionId) {
      isCorrect = (chosenOption === socket.currentServing.correctOptionIndex);
      correctOptionIndex = socket.currentServing.correctOptionIndex;
      explanation = socket.currentServing.explanation;
    } else {
      const q = questionsData.memberQuestions.find(item => item.id === questionId);
      if (!q) return;
      isCorrect = (chosenOption === q.answer);
      correctOptionIndex = q.answer;
      explanation = q.explanation;
    }

    if (team && gameState.status === 'PLAYING') {
      team.totalAnswered += 1;

      if (isCorrect) {
        player.score += 1;
        team.score += 1;
        team.streak += 1;
        team.totalCorrect += 1;

        // Check if streak reaches 50
        if (team.streak >= team.targetStreak && !gameState.activeLeaderChallenge) {
          team.streak = team.targetStreak;
          
          // Pick a strategic leader question
          const leaderQuestions = questionsData.leaderQuestions;
          const selectedLeaderQ = leaderQuestions[Math.floor(Math.random() * leaderQuestions.length)];

          gameState.activeLeaderChallenge = {
            teamKey: team.key,
            teamName: team.name,
            leaderId: team.leaderId,
            leaderName: team.leaderName,
            question: selectedLeaderQ
          };

          addLog(`🚨 ${team.name} đạt chuỗi 50 câu đúng! Kích hoạt câu hỏi thử thách cho Leader ${team.leaderName}!`, 'warn');

          // Notify Host
          io.emit('streak_50_reached', {
            teamKey: team.key,
            teamName: team.name,
            leaderName: team.leaderName
          });

          // Notify the specific Leader
          if (team.leaderId) {
            io.to(team.leaderId).emit('leader_challenge_start', {
              question: selectedLeaderQ.question,
              options: selectedLeaderQ.options,
              id: selectedLeaderQ.id
            });
          }
        }
      } else {
        team.totalWrong += 1;
      }
      broadcastRoomUpdate();
    } else {
      if (isCorrect) player.score += 1;
    }

    socket.emit('answer_feedback', {
      isCorrect: isCorrect,
      correctAnswer: correctOptionIndex,
      explanation: explanation,
      playerScore: player.score,
      teamScore: team ? team.score : player.score,
      teamStreak: team ? team.streak : (isCorrect ? 1 : 0)
    });

    broadcastRoomUpdate();
  });

  // Leader submits strategic answer
  socket.on('leader_submit_answer', ({ questionId, chosenOption }) => {
    if (!socket.player || !socket.player.isLeader) return;
    if (!gameState.activeLeaderChallenge) return;

    const challenge = gameState.activeLeaderChallenge;
    if (challenge.teamKey !== socket.player.teamKey) return;

    const leaderQ = questionsData.leaderQuestions.find(item => item.id === questionId);
    if (!leaderQ) return;

    const isCorrect = (leaderQ.answer === chosenOption);

    if (isCorrect) {
      // Leader answered correctly!
      addLog(`✓ Leader ${challenge.teamName} (${challenge.leaderName}) trả lời ĐÚNG câu hỏi chiến lược! Đang chọn 1 trong 4 Bảo Bình...`, 'success');

      gameState.shuffledPots = generateRandomPots();

      // Emit to Leader to pick a pot
      socket.emit('leader_unlocked_pots', {
        potsCount: 4
      });

      // Emit to Host to display the 4 golden pots on projector
      io.emit('host_show_pots', {
        teamKey: challenge.teamKey,
        teamName: challenge.teamName,
        leaderName: challenge.leaderName
      });
    } else {
      // Leader answered wrong!
      addLog(`✗ Leader ${challenge.teamName} (${challenge.leaderName}) trả lời SAI câu hỏi mốc 50! Chuỗi câu đúng lùi về 40.`, 'warn');

      const team = gameState[challenge.teamKey];
      team.streak = 40;
      gameState.activeLeaderChallenge = null;

      socket.emit('leader_challenge_result', {
        success: false,
        message: 'Chưa chính xác! Chuỗi câu đúng trở về mốc 40 để thành viên tiếp tục cày điểm!'
      });

      io.emit('host_leader_failed', {
        teamKey: team.key,
        teamName: team.name,
        explanation: leaderQ.explanation
      });

      broadcastRoomUpdate();
    }
  });

  // Leader picks 1 of the 4 pots (0..3)
  socket.on('leader_pick_pot', ({ potIndex }) => {
    if (!socket.player || !socket.player.isLeader) return;
    if (!gameState.activeLeaderChallenge) return;

    const teamKey = socket.player.teamKey;
    const team = gameState[teamKey];
    const otherTeamKey = (teamKey === 'team1') ? 'team2' : 'team1';
    const otherTeam = gameState[otherTeamKey];

    const idx = Math.max(0, Math.min(3, parseInt(potIndex, 10) || 0));
    const pot = gameState.shuffledPots[idx] || { type: 'double', name: '🌟 Bảo Bình Đại Phát', desc: 'Nhân đôi điểm!' };

    let outcomeDesc = '';
    let logMsg = '';
    let delta = 0;

    switch (pot.type) {
      case 'double':
        const prevScoreD = team.score;
        team.score = team.score * 2;
        delta = team.score - prevScoreD;
        outcomeDesc = `Nhân đôi toàn bộ điểm số! (+${delta} điểm)`;
        logMsg = `Leader ${team.name} (${team.leaderName}) trả lời ĐÚNG và đã chọn trúng [${pot.name}]: Nhân đôi (x2) điểm số (+${delta} điểm)!`;
        break;

      case 'half':
        const prevScoreH = team.score;
        team.score = Math.floor(team.score * 0.5);
        delta = team.score - prevScoreH;
        outcomeDesc = `Mất 50% số điểm do biến động bất khả kháng! (${delta} điểm)`;
        logMsg = `Leader ${team.name} (${team.leaderName}) trả lời ĐÚNG và đã chọn trúng [${pot.name}]: Mất 50% số điểm (${delta} điểm)!`;
        break;

      case 'swap':
        const myOldScore = team.score;
        const otherOldScore = otherTeam.score;
        team.score = otherOldScore;
        otherTeam.score = myOldScore;
        outcomeDesc = `Hoán đổi điểm ngoạn mục! (${team.name}: ${myOldScore} ➔ ${team.score} | ${otherTeam.name}: ${otherOldScore} ➔ ${otherTeam.score})`;
        logMsg = `Leader ${team.name} (${team.leaderName}) trả lời ĐÚNG và đã chọn trúng [${pot.name}]: Hoán đổi điểm với ${otherTeam.name} (${myOldScore} ➔ ${team.score})!`;
        break;

      case 'random_delta':
        const randomPoints = Math.floor(Math.random() * 31) + 50; // 50 to 80
        const isPositive = Math.random() < 0.65; // 65% chance positive
        delta = isPositive ? randomPoints : -randomPoints;
        team.score = Math.max(0, team.score + delta);
        outcomeDesc = isPositive
          ? `May mắn mỉm cười: Cộng thẳng +${randomPoints} điểm vào quỹ đội!`
          : `Thách thức thời cuộc: Giảm -${randomPoints} điểm!`;
        logMsg = `Leader ${team.name} (${team.leaderName}) trả lời ĐÚNG và đã chọn trúng [${pot.name}]: ${isPositive ? '+' : '-'}${randomPoints} điểm!`;
        break;
    }

    addLog(logMsg, pot.type === 'swap' ? 'swap' : (pot.type === 'half' ? 'warn' : 'success'));

    // Reset team streak to 0
    team.streak = 0;
    gameState.activeLeaderChallenge = null;

    // Broadcast the grand reveal to everyone
    io.emit('pot_revealed', {
      chosenIndex: idx,
      potName: pot.name,
      potBadge: pot.badge,
      potDesc: pot.desc,
      outcomeDesc: outcomeDesc,
      teamKey: team.key,
      teamName: team.name,
      teamIcon: team.icon,
      leaderName: team.leaderName,
      allPots: gameState.shuffledPots
    });

    broadcastRoomUpdate();
  });

  // Disconnection
  socket.on('disconnect', () => {
    if (socket.player) {
      gameState.lobbyPlayers = gameState.lobbyPlayers.filter(p => p.id !== socket.id);

      if (socket.player.teamKey) {
        const team = gameState[socket.player.teamKey];
        if (team) {
          team.members = team.members.filter(m => m.id !== socket.id);
          // If leader leaves during game, designate a new leader if members remain
          if (team.leaderId === socket.id && team.members.length > 0) {
            team.members[0].isLeader = true;
            team.leaderId = team.members[0].id;
            team.leaderName = team.members[0].name;
            addLog(`Leader ${team.name} đã ngắt kết nối. ${team.leaderName} được chỉ định làm Leader mới!`, 'warn');
            io.to(team.leaderId).emit('became_leader');
          }
        }
      }
      broadcastRoomUpdate();
    }
  });
});

// Start Server
server.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIp();
  console.log(`=======================================================`);
  console.log(`🚀 HỒ CHÍ MINH PRESENTATION & MULTIPLAYER MINIGAME SERVER`);
  console.log(`📍 Host / Presentation: http://localhost:${PORT}`);
  console.log(`🎮 Game Host (Máy Chiếu): http://localhost:${PORT}/game`);
  console.log(`📱 Player Join (Điện Thoại LAN): http://${ip}:${PORT}/play`);
  console.log(`🔐 Mật khẩu Quản trò: ${ADMIN_PASSWORD}`);
  console.log(`=======================================================`);
});
