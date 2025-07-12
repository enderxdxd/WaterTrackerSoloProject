const SETTINGS_KEY = 'wt_settings';
const HISTORY_KEY = 'wt_history';

const WaterTracker = {
  settings: { goal: 2000, reminders: false },
  historyData: [],
  consumed: 0,
  historyChart: null,

  init() {
    this.loadSettings();
    this.loadHistory();
    this.updateUI();
    console.log('WaterTracker initialized');
  },

  loadSettings() {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      this.settings = JSON.parse(saved);
    }
    this.consumed = this.settings.consumedToday || 0;
  },

  saveSettings() {
    this.settings.consumedToday = this.consumed;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
  },

  loadHistory() {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      this.historyData = JSON.parse(saved);
      while (this.historyData.length < 7) {
        this.historyData.unshift(0);
      }
    } else {
      this.historyData = Array(7).fill(0);
    }
  },

  saveHistory() {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(this.historyData));
  },

  addWater(amount) {
    if (this.consumed + amount <= this.settings.goal * 1.5) {
      this.consumed += amount;
      this.historyData[this.historyData.length - 1] = this.consumed;
      this.saveSettings();
      this.saveHistory();
      this.updateUI();
      
      if (this.consumed >= this.settings.goal) {
        this.showSuccessMessage('🎉 Congrats! Daily goal reached!');
      }
      
      if (typeof updateChart === 'function') {
        updateChart();
      }
    }
  },

  updateGoal(newGoal) {
    this.settings.goal = newGoal;
    this.saveSettings();
    this.updateUI();
  },

  updateUI() {
    const pct = Math.min((this.consumed / this.settings.goal) * 100, 100);
    const remaining = Math.max(this.settings.goal - this.consumed, 0);
    
    const progressBar = document.getElementById('progress-bar');
    const counterText = document.getElementById('counter-text');
    const percentage = document.getElementById('percentage');
    const remainingEl = document.getElementById('remaining');
    
    if (progressBar) progressBar.style.width = pct + '%';
    if (counterText) counterText.textContent = `${this.consumed} mL / ${this.settings.goal} mL`;
    if (percentage) percentage.textContent = Math.round(pct) + '%';
    if (remainingEl) remainingEl.textContent = remaining + 'mL';
  },

  showSuccessMessage(message) {
    const existing = document.querySelector('.success-alert');
    if (existing) existing.remove();
    
    const alert = document.createElement('div');
    alert.className = 'success-alert';
    alert.textContent = message;
    
    const currentPage = document.querySelector('.page.active');
    if (currentPage) {
      currentPage.insertBefore(alert, currentPage.children[1]);
      setTimeout(() => alert.remove(), 3000);
    }
  },

  resetDay() {
    this.consumed = 0;
    this.historyData[this.historyData.length - 1] = 0;
    this.saveSettings();
    this.saveHistory();
    this.updateUI();
    this.showSuccessMessage('📅 Current day reset!');
  },

  clearHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
      this.historyData = Array(7).fill(0);
      this.consumed = 0;
      this.saveSettings();
      this.saveHistory();
      this.updateUI();
      if (typeof updateChart === 'function') {
        updateChart();
      }
      this.showSuccessMessage('🗑️ History cleared!');
    }
  },

  getWeekStats() {
    const total = this.historyData.reduce((sum, day) => sum + day, 0);
    const average = Math.round(total / 7);
    const best = Math.max(...this.historyData);
    
    return {
      total: (total / 1000).toFixed(1),
      average,
      best
    };
  }
};

window.addEventListener('load', () => {
  WaterTracker.init();
});

window.WaterTracker = WaterTracker;