'use strict';

// ===== Motivational Quotes =====
const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Your limitation—it's only your imagination.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
  { text: "Little things make big days.", author: "Unknown" },
  { text: "It's going to be hard, but hard does not mean impossible.", author: "Unknown" },
  { text: "Don't wait for opportunity. Create it.", author: "Unknown" },
  { text: "Sometimes we're tested not to show our weaknesses, but to discover our strengths.", author: "Unknown" },
  { text: "The key to success is to focus on goals, not obstacles.", author: "Unknown" },
  { text: "Dream bigger. Do bigger.", author: "Unknown" },
  { text: "Your body can stand almost anything. It's your mind that you have to convince.", author: "Unknown" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "We generate fears while we sit. We overcome them by action.", author: "Dr. Henry Link" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
  { text: "You are stronger than your challenges.", author: "Unknown" },
];

// ===== Mood Emoji Map =====
const MOOD_EMOJIS = {
  1: '😔', 2: '😕', 3: '😐', 4: '🙂', 5: '😊',
  6: '😄', 7: '😁', 8: '🤩', 9: '🥳', 10: '🚀'
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ===== State =====
let state = {
  mood: null,       // { value: 1-10, timestamp }
  morning: '',      // morning check-in text
  evening: '',      // evening reflection text
  goals: [],        // [{ id, text, completed, createdAt }]
  streak: 0,
  lastLogDate: null,
  theme: 'dark',
  quoteIndex: 0,
};

// ===== DOM Refs =====
const $ = id => document.getElementById(id);

// ===== LocalStorage =====
function loadState() {
  try {
    const saved = localStorage.getItem('motivationTracker_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      state = { ...state, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load state:', e);
  }

  // Load theme
  const savedTheme = localStorage.getItem('motivationTracker_theme');
  if (savedTheme) {
    state.theme = savedTheme;
  }
}

function saveState() {
  try {
    localStorage.setItem('motivationTracker_v1', JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save state:', e);
  }
}

// ===== Date Utilities =====
function getToday() {
  return new Date().toISOString().split('T')[0];
}

function getDayName(dateStr) {
  const d = new Date(dateStr);
  return DAY_NAMES[d.getDay()];
}

function isYesterday(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0] === getToday();
}

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

// ===== Streak Logic =====
function calculateStreak() {
  if (!state.lastLogDate) {
    state.streak = 0;
    return;
  }

  const today = getToday();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // If last log was today or yesterday, continue streak
  if (state.lastLogDate === today || state.lastLogDate === yesterdayStr) {
    // Streak is already set, just ensure it's not 0 when it should be
    if (state.mood && state.streak === 0) {
      state.streak = 1;
    }
  } else {
    // Streak broken
    state.streak = 0;
  }
}

function logMood(value) {
  const today = getToday();
  const wasLogged = state.mood && state.lastLogDate === today;

  state.mood = { value, timestamp: Date.now() };
  state.lastLogDate = today;

  // Increment streak only if not already logged today
  if (!wasLogged) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (state.lastLogDate === yesterdayStr || state.streak === 0) {
      // Continued from yesterday or starting fresh
      if (state.mood && state.lastLogDate) {
        state.streak = Math.max(state.streak, 1);
      }
    }
  }

  calculateStreak();
  saveState();
  renderAll();
}

// ===== UI Rendering =====
function renderStreak() {
  $('streakCount').textContent = state.streak;
}

function renderMood() {
  const today = getToday();
  const todayMood = state.mood && state.lastLogDate === today;

  if (todayMood) {
    $('moodPrompt').classList.add('hidden');
    $('moodLogged').classList.remove('hidden');
    $('loggedEmoji').textContent = MOOD_EMOJIS[state.mood.value];
    $('loggedMoodValue').textContent = state.mood.value;
    const date = new Date(state.mood.timestamp);
    $('loggedTime').textContent = `Logged at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    $('moodPrompt').classList.remove('hidden');
    $('moodLogged').classList.add('hidden');
    // Reset slider
    $('moodSlider').value = 5;
    $('moodValueDisplay').textContent = '5';
    updateMoodFaceHighlight(5);
  }
}

function updateMoodFaceHighlight(val) {
  document.querySelectorAll('.mood-faces span').forEach(el => {
    el.classList.toggle('active', parseInt(el.dataset.val) === val);
  });
}

function renderMorning() {
  $('morningText').value = state.morning;
  $('morningSaved').classList.toggle('hidden', !state.morning);
}

function renderEvening() {
  $('eveningText').value = state.evening;
  $('eveningSaved').classList.toggle('hidden', !state.evening);
}

function renderGoals() {
  const activeGoals = state.goals.filter(g => !g.completed);
  const $count = $('goalCount');
  $count.textContent = `(${activeGoals.length}/3)`;

  const $list = $('goalsList');
  if (state.goals.length === 0) {
    $list.innerHTML = '<p class="no-goals" style="color:var(--text-muted);font-size:0.85rem;text-align:center;padding:8px 0;">No goals yet. Add one below!</p>';
  } else {
    $list.innerHTML = state.goals.map(g => `
      <div class="goal-item" data-id="${g.id}">
        <div class="goal-checkbox ${g.completed ? 'checked' : ''}" role="checkbox" aria-checked="${g.completed}" tabindex="0">
          ${g.completed ? '✓' : ''}
        </div>
        <span class="goal-text ${g.completed ? 'completed' : ''}">${escapeHtml(g.text)}</span>
        <button class="goal-delete" title="Delete goal">✕</button>
      </div>
    `).join('');
  }

  $('addGoalBtn').classList.toggle('hidden', activeGoals.length >= 3);
}

function renderQuote() {
  const q = QUOTES[state.quoteIndex];
  $('quoteText').textContent = `"${q.text}"`;
  $('quoteAuthor').textContent = `— ${q.author}`;
}

let moodChart = null;

function renderChart() {
  const days = getLast7Days();
  const labels = days.map(d => getDayName(d));
  const data = days.map(d => {
    if (state.mood && state.lastLogDate === d) {
      return state.mood.value;
    }
    // Look for mood in a daily log structure (we'll use mood for today only for simplicity)
    return null;
  });

  // For demo, we use today's mood value repeated for visualization
  // In a real app you'd store daily mood history
  const chartData = days.map((d, i) => {
    if (d === getToday() && state.mood) return state.mood.value;
    return null;
  });

  const ctx = $('moodChart').getContext('2d');

  if (moodChart) {
    moodChart.destroy();
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, 220);
  gradient.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
  gradient.addColorStop(1, 'rgba(139, 92, 246, 0.05)');

  moodChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Mood',
        data: chartData,
        borderColor: '#8b5cf6',
        backgroundColor: gradient,
        borderWidth: 2.5,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        fill: true,
        tension: 0.4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0,
          max: 10,
          grid: {
            color: 'rgba(148, 163, 184, 0.1)',
          },
          ticks: {
            color: '#64748b',
            stepSize: 2,
          }
        },
        x: {
          grid: {
            color: 'rgba(148, 163, 184, 0.05)',
          },
          ticks: {
            color: '#64748b',
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(15, 15, 23, 0.9)',
          titleColor: '#f8fafc',
          bodyColor: '#94a3b8',
          borderColor: 'rgba(139, 92, 246, 0.3)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: ctx => `Mood: ${ctx.raw}/10`
          }
        }
      },
      animation: {
        duration: 800,
        easing: 'easeOutQuart'
      }
    }
  });

  // Update summary stats
  const loggedDays = state.mood ? 1 : 0;
  $('loggedDays').textContent = loggedDays;
  $('avgMood').textContent = state.mood ? state.mood.value : '—';
  $('bestDay').textContent = state.mood ? getDayName(getToday()) : '—';
}

function renderTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  // Toggle icon visibility based on theme
  const sun = document.querySelector('.icon-sun');
  const moon = document.querySelector('.icon-moon');
  if (sun && moon) {
    sun.style.display = state.theme === 'dark' ? 'block' : 'none';
    moon.style.display = state.theme === 'dark' ? 'none' : 'block';
  }
}

function renderAll() {
  renderStreak();
  renderMood();
  renderMorning();
  renderEvening();
  renderGoals();
  renderQuote();
  renderChart();
  renderTheme();
}

// ===== Event Handlers =====

// Theme toggle
$('themeToggle').addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('motivationTracker_theme', state.theme);
  renderTheme();
});

// Mood slider
$('moodSlider').addEventListener('input', (e) => {
  const val = parseInt(e.target.value);
  $('moodValueDisplay').textContent = val;
  updateMoodFaceHighlight(val);
});

$('moodSlider').addEventListener('change', (e) => {
  updateMoodFaceHighlight(parseInt(e.target.value));
});

// Save mood
$('saveMoodBtn').addEventListener('click', () => {
  const val = parseInt($('moodSlider').value);
  logMood(val);
});

// Update mood
$('updateMoodBtn').addEventListener('click', () => {
  $('moodLogged').classList.add('hidden');
  $('moodPrompt').classList.remove('hidden');
});

// Morning check-in
$('saveMorningBtn').addEventListener('click', () => {
  state.morning = $('morningText').value.trim();
  saveState();
  $('morningSaved').classList.remove('hidden');
  setTimeout(() => $('morningSaved').classList.add('hidden'), 2500);
});

// Evening reflection
$('saveEveningBtn').addEventListener('click', () => {
  state.evening = $('eveningText').value.trim();
  saveState();
  $('eveningSaved').classList.remove('hidden');
  setTimeout(() => $('eveningSaved').classList.add('hidden'), 2500);
});

// Goals - Add
$('addGoalBtn').addEventListener('click', () => {
  $('addGoalForm').classList.remove('hidden');
  $('goalInput').focus();
});

$('cancelGoalBtn').addEventListener('click', () => {
  $('addGoalForm').classList.add('hidden');
  $('goalInput').value = '';
});

$('confirmGoalBtn').addEventListener('click', () => {
  const text = $('goalInput').value.trim();
  if (!text) return;
  if (state.goals.filter(g => !g.completed).length >= 3) return;

  state.goals.push({
    id: Date.now(),
    text,
    completed: false,
    createdAt: Date.now()
  });
  $('goalInput').value = '';
  $('addGoalForm').classList.add('hidden');
  saveState();
  renderGoals();
});

$('goalInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') $('confirmGoalBtn').click();
  if (e.key === 'Escape') $('cancelGoalBtn').click();
});

// Goals - Check/Delete (event delegation)
$('goalsList').addEventListener('click', (e) => {
  const item = e.target.closest('.goal-item');
  if (!item) return;
  const id = parseInt(item.dataset.id);

  if (e.target.classList.contains('goal-checkbox')) {
    const goal = state.goals.find(g => g.id === id);
    if (goal) {
      goal.completed = !goal.completed;
      saveState();
      renderGoals();
    }
  }

  if (e.target.classList.contains('goal-delete')) {
    state.goals = state.goals.filter(g => g.id !== id);
    saveState();
    renderGoals();
  }
});

// Quote refresh
$('refreshQuoteBtn').addEventListener('click', () => {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * QUOTES.length);
  } while (newIndex === state.quoteIndex && QUOTES.length > 1);
  state.quoteIndex = newIndex;
  renderQuote();
});

// ===== Utilities =====
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== Chatbot (Gemini) =====
const SYSTEM_PROMPT = "You are a motivational coach. Respond with short, encouraging messages focused on productivity, mindset, and personal growth.";
const GEMINI_API_KEY = 'AIzaSyAXyM0N156ub-NqbpFEnffDRoGvSgmbTAQ';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Session-scoped conversation history (not persisted to localStorage)
let chatHistory = [
  { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
  { role: 'model', parts: [{ text: "Hey there! 👋 I'm your motivational coach. How are you feeling today? What's on your mind?" }] }
];

let isWaitingForResponse = false;

function getLastUserMessage() {
  for (let i = chatHistory.length - 1; i >= 0; i--) {
    if (chatHistory[i].role === 'user') {
      return chatHistory[i].parts[0].text;
    }
  }
  return '';
}

function addMessageToUI(text, type) {
  const messagesEl = document.getElementById('chatMessages');
  const msg = document.createElement('div');
  msg.className = `chat-message ${type}-message`;
  msg.textContent = text;
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function setInputLoading(loading) {
  isWaitingForResponse = loading;
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');
  if (loading) {
    input.disabled = true;
    sendBtn.disabled = true;
    sendBtn.textContent = '⏳';
  } else {
    input.disabled = false;
    sendBtn.disabled = false;
    sendBtn.textContent = '➤';
    input.focus();
  }
}

async function sendToGemini(userMessage) {
  const response = await fetch(GEMINI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: chatHistory.slice(2).map(msg => ({
        role: msg.role,
        parts: msg.parts
      })),
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.8
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble responding right now. Try again! 💪";
}

async function handleChatSend() {
  if (isWaitingForResponse) return;
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';

  // Add user message to UI and history
  addMessageToUI(text, 'user');
  chatHistory.push({ role: 'user', parts: [{ text }] });

  setInputLoading(true);

  try {
    const aiText = await sendToGemini(text);
    addMessageToUI(aiText, 'ai');
    chatHistory.push({ role: 'model', parts: [{ text: aiText }] });
  } catch (err) {
    console.error('Chat error:', err);
    addMessageToUI("Oops! Something went wrong. 💪 Try again in a moment!", 'ai');
  }

  setInputLoading(false);
}

function initChatbot() {
  const toggleBtn = document.getElementById('chatToggleBtn');
  const chatModal = document.getElementById('chatModal');
  const closeBtn = document.getElementById('chatCloseBtn');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');

  if (!toggleBtn || !chatModal) return;

  toggleBtn.addEventListener('click', () => {
    chatModal.classList.toggle('open');
    if (chatModal.classList.contains('open')) {
      chatInput.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    chatModal.classList.remove('open');
  });

  sendBtn.addEventListener('click', handleChatSend);

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSend();
    }
  });
}

// ===== Init =====
function init() {
  loadState();
  calculateStreak();
  renderAll();

  // Select a random quote on load
  state.quoteIndex = Math.floor(Math.random() * QUOTES.length);
  renderQuote();

  initChatbot();
}

document.addEventListener('DOMContentLoaded', init);
