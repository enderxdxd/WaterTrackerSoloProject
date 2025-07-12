const SettingsController = {
    init() {
      this.setupEventListeners();
      this.loadCurrentSettings();
    },
  
    setupEventListeners() {
      const dailyGoalInput = document.getElementById('daily-goal');
      const saveGoalBtn = document.getElementById('save-goal');
      const remindersChk = document.getElementById('enable-reminders');
      const presetBtns = document.querySelectorAll('.preset-btn');
      const resetDayBtn = document.getElementById('reset-day');
      const clearHistoryBtn = document.getElementById('clear-history');
  
      if (saveGoalBtn) {
        saveGoalBtn.addEventListener('click', () => {
          this.saveGoal();
        });
      }
  
      if (remindersChk) {
        remindersChk.addEventListener('change', () => {
          this.toggleReminders();
        });
      }
  
      presetBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const goal = parseInt(e.target.getAttribute('data-goal'));
          this.setPresetGoal(goal);
        });
      });
  
      if (resetDayBtn) {
        resetDayBtn.addEventListener('click', () => {
          WaterTracker.resetDay();
        });
      }
  
      if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
          WaterTracker.clearHistory();
        });
      }
  
      if (dailyGoalInput) {
        dailyGoalInput.addEventListener('input', () => {
          this.updatePresetSelection();
        });
      }
    },
  
    loadCurrentSettings() {
      const dailyGoalInput = document.getElementById('daily-goal');
      const remindersChk = document.getElementById('enable-reminders');
  
      if (dailyGoalInput) {
        dailyGoalInput.value = WaterTracker.settings.goal;
      }
  
      if (remindersChk) {
        remindersChk.checked = WaterTracker.settings.reminders;
      }
  
      this.updatePresetSelection();
    },
  
    saveGoal() {
      const dailyGoalInput = document.getElementById('daily-goal');
      if (dailyGoalInput) {
        const newGoal = Number(dailyGoalInput.value) || 2000;
        WaterTracker.updateGoal(newGoal);
        WaterTracker.showSuccessMessage('✅ Goal saved successfully!');
        this.updatePresetSelection();
      }
    },
  
    setPresetGoal(goal) {
      const dailyGoalInput = document.getElementById('daily-goal');
      if (dailyGoalInput) {
        dailyGoalInput.value = goal;
        WaterTracker.updateGoal(goal);
        this.updatePresetSelection();
        WaterTracker.showSuccessMessage(`🎯 Goal set to ${goal}mL!`);
      }
    },
  
    updatePresetSelection() {
      const dailyGoalInput = document.getElementById('daily-goal');
      const presetBtns = document.querySelectorAll('.preset-btn');
      
      if (!dailyGoalInput) return;
      
      const currentGoal = parseInt(dailyGoalInput.value);
      
      presetBtns.forEach(btn => {
        const btnGoal = parseInt(btn.getAttribute('data-goal'));
        if (btnGoal === currentGoal) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    },
  
    toggleReminders() {
      const remindersChk = document.getElementById('enable-reminders');
      if (remindersChk) {
        WaterTracker.settings.reminders = remindersChk.checked;
        WaterTracker.saveSettings();
        
        const message = remindersChk.checked 
          ? '🔔 Reminders enabled!' 
          : '🔕 Reminders disabled!';
        
        WaterTracker.showSuccessMessage(message);
        
        if (remindersChk.checked) {
          this.requestNotificationPermission();
        }
      }
    },
  
    requestNotificationPermission() {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            WaterTracker.showSuccessMessage('📱 Notification permission granted!');
          } else {
            WaterTracker.showSuccessMessage('⚠️ Notification permission denied');
          }
        });
      }
    },
  
    validateInput() {
      const dailyGoalInput = document.getElementById('daily-goal');
      if (dailyGoalInput) {
        let value = parseInt(dailyGoalInput.value);
        
        if (isNaN(value) || value < 500) {
          dailyGoalInput.value = 500;
        } else if (value > 5000) {
          dailyGoalInput.value = 5000;
        }
      }
    },
  
    onShow() {
      this.loadCurrentSettings();
    }
  };
  
  window.addEventListener('load', () => {
    SettingsController.init();
  });
  
  window.SettingsController = SettingsController;